"use client";

import { useEffect, useState } from "react";

type Suggestion = {
  description: string;
  placeId: string;
  mainText?: string;
  secondaryText?: string;
};

type LocationAutocompleteFormProps = {
  action: string;
  placeholder: string;
  submitLabel?: string;
  name?: string;
  defaultValue?: string;
  wrapperClassName?: string;
  formClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function LocationAutocompleteForm({
  action,
  placeholder,
  submitLabel = "Analyze →",
  name = "location",
  defaultValue = "",
  wrapperClassName = "",
  formClassName = "",
  inputClassName = "",
  buttonClassName = ""
}: LocationAutocompleteFormProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skipNextFetch, setSkipNextFetch] = useState(false);
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const trimmed = query.trim();

    if (suppressSuggestions) {
      setSuggestions([]);
      setOpen(false);
      setIsLoading(false);
      return;
    }

    if (skipNextFetch) {
      setSkipNextFetch(false);
      setIsLoading(false);
      return;
    }

    if (trimmed.length < 2) {
      setSuggestions([]);
      setOpen(false);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/places?input=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          setSuggestions([]);
          setOpen(false);
          return;
        }

        const payload = (await response.json()) as { suggestions?: Suggestion[] };
        const nextSuggestions = (payload.suggestions ?? []).filter(
          (suggestion) => normalizeText(suggestion.description) !== normalizeText(trimmed)
        );
        setSuggestions(nextSuggestions);
        setOpen(nextSuggestions.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [query, skipNextFetch, suppressSuggestions]);

  return (
    <div className={`relative ${wrapperClassName}`}>
      <form action={action} className={formClassName}>
        <input
          type="text"
          name={name}
          value={query}
          autoComplete="off"
          placeholder={placeholder}
          onFocus={() => {
            if (suggestions.length > 0 && !suppressSuggestions) {
              setOpen(true);
            }
          }}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120);
          }}
          onChange={(event) => {
            setSuppressSuggestions(false);
            setQuery(event.target.value);
          }}
          className={inputClassName}
        />
        <button type="submit" className={buttonClassName}>
          {submitLabel}
        </button>
      </form>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--navy2)] shadow-2xl shadow-black/30">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.placeId}
              type="button"
              onMouseDown={() => {
                setSkipNextFetch(true);
                setSuppressSuggestions(true);
                setSuggestions([]);
                setQuery(suggestion.description);
                setOpen(false);
              }}
              className="flex w-full flex-col items-start border-b border-[var(--border)] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--navy3)]"
            >
              <span className="text-sm font-medium text-[var(--text)]">
                {suggestion.mainText ?? suggestion.description}
              </span>
              {suggestion.secondaryText ? (
                <span className="mt-1 text-xs text-[var(--text3)]">{suggestion.secondaryText}</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {isLoading ? (
        <div className="pointer-events-none absolute right-36 top-1/2 -translate-y-1/2 text-xs text-[var(--text3)]">
          Searching...
        </div>
      ) : null}
    </div>
  );
}
