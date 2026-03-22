import { analyzeLocation } from "@/lib/analysis";
import { AnalyzeDashboard } from "@/components/analyze-dashboard";
import { LocationAutocompleteForm } from "@/components/location-autocomplete-form";

type AnalyzePageProps = {
  searchParams: Promise<{
    location?: string | string[];
  }>;
};

function EmptyAnalyzeState() {
  return (
    <main className="page-shell">
      <section className="min-h-[calc(100vh-58px)] bg-[var(--navy)]">
        <div className="border-b border-[var(--border)] bg-[var(--navy2)] px-5 py-4">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-4 xl:flex-row xl:items-center">
            <div className="mono-text text-[10px] tracking-[2px] text-[var(--text3)]">
              ANALYZE LOCATION
            </div>

            <LocationAutocompleteForm
              action="/analyze"
              placeholder="Enter a city, district, or address in Vietnam..."
              wrapperClassName="flex-1"
              formClassName="flex flex-1 flex-col gap-3 xl:flex-row xl:items-center"
              inputClassName="h-12 flex-1 rounded-xl border border-[var(--border)] bg-[var(--navy)] px-4 text-base text-[var(--text)] outline-none"
              buttonClassName="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--blue)] px-8 text-sm font-semibold text-white"
            />

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text3)]">
              <span>○ Geocoding</span>
              <span>━━</span>
              <span>○ Satellite</span>
              <span>━━</span>
              <span>○ AI Segmentation</span>
              <span>━━</span>
              <span>○ Done</span>
            </div>
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-134px)] items-center justify-center px-6 py-16 text-center">
          <div className="max-w-xl">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--navy2)] text-3xl">
              🛰
            </div>
            <h1 className="display-text text-5xl font-bold text-[var(--text)]">
              Enter a location to begin
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-[var(--text2)]">
              Type a city or district in Vietnam above and click Analyze to generate a real-time
              shoreline exposure view.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["Cần Thơ", "Hội An", "Long Xuyên", "Đà Lạt"].map((city) => (
                <form key={city} action="/analyze">
                  <input type="hidden" name="location" value={city} />
                  <button
                    type="submit"
                    className="rounded-full border border-[var(--border)] bg-[var(--navy2)] px-5 py-2 text-sm text-[var(--text2)]"
                  >
                    {city}
                  </button>
                </form>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function AnalyzePage({ searchParams }: AnalyzePageProps) {
  const params = await searchParams;
  const location = Array.isArray(params.location) ? params.location[0] : params.location;
  const submittedLocation = location?.trim();

  if (!submittedLocation) {
    return <EmptyAnalyzeState />;
  }

  const analysis = await analyzeLocation(submittedLocation);

  return (
    <main className="page-shell">
      <AnalyzeDashboard submittedLocation={submittedLocation} analysis={analysis} />
    </main>
  );
}
