import Link from "next/link";
import { LocationAutocompleteForm } from "@/components/location-autocomplete-form";
import { homeFeatures } from "@/lib/site-content";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero pt-6 pb-10">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div className="hero-content">
          <h1 className="hero-title">
            Floods are
            <br />
            expected.
            <br />
            The damage <span>doesn&apos;t have to be.</span>
          </h1>
          <p className="hero-sub">
            Every year, communities across the Mekong Delta lose homes, livelihoods, and lives to
            floods. Authorities know it&apos;s coming, but year after year, the impact is
            underestimated, resources fall short, and people are left unprepared. Mekong Watch
            exists to change that.
          </p>

          <LocationAutocompleteForm
            action="/analyze"
            placeholder="Enter a city, district, or address in Vietnam..."
            wrapperClassName="relative z-30 mx-auto mb-8 w-full max-w-[540px]"
            formClassName="search-hero !m-0"
            inputClassName="flex-1 border-none bg-transparent px-[18px] py-[14px] text-[var(--text)] outline-none"
            buttonClassName="primary-link"
          />

          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">$760M</div>
              <div className="hero-stat-label">avg. annual flood damage in Vietnam</div>
            </div>
            <div>
              <div className="hero-stat-num">1.5M</div>
              <div className="hero-stat-label">people displaced yearly</div>
            </div>
            <div>
              <div className="hero-stat-num">300+</div>
              <div className="hero-stat-label">deaths per flood season</div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-y border-[var(--border)] bg-[var(--panel)] px-8 py-8"
      >
        <div className="mx-auto grid max-w-[900px] grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mono-text text-[10px] tracking-[2px] text-[var(--red)]">
              THE REALITY ON THE GROUND
            </div>
            <h2 className="display-text mt-4 text-[26px] font-bold leading-[1.3] text-[var(--text)]">
              Floods aren&apos;t a surprise.
              <br />
              Being unprepared is the problem.
            </h2>
            <div className="mt-4 space-y-4 text-[14px] leading-8 text-[var(--text2)]">
              <p className="m-0">
                For communities along Vietnam&apos;s rivers and coasts, flooding is a known annual
                event. Authorities mark it on the calendar, allocate a budget, and brace for it.
                But the same patterns repeat: underestimated water levels, insufficient evacuation
                routes, unprepared hospitals, and flooded roads that cut off entire villages.
              </p>
              <p className="m-0">
                The problem is not a lack of warning. It is the lack of a{" "}
                <span className="font-semibold text-[var(--text)]">
                  clear, tangible picture
                </span>{" "}
                of how vulnerable a community really is, and the evidence needed to act before the
                water rises.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[14px]">
            <div className="rounded-r-[10px] rounded-l-none border border-[rgba(217,64,64,0.25)] border-l-[3px] border-l-[var(--red)] bg-[var(--navy3)] px-[18px] py-4">
              <div className="flex gap-4">
                <div>
                  <div className="mono-text text-[10px] tracking-[1px] text-[var(--red)]">
                    THE PATTERN
                  </div>
                  <p className="mt-[6px] text-[13px] leading-[1.6] text-[var(--text2)]">
                    The same budget. The same assumptions. A worse flood. The outcome becomes harder to control.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-r-[10px] rounded-l-none border border-[rgba(232,160,32,0.25)] border-l-[3px] border-l-[var(--amber)] bg-[var(--navy3)] px-[18px] py-4">
              <div className="flex gap-4">
                <div>
                  <div className="mono-text text-[10px] tracking-[1px] text-[var(--amber)]">
                    THE CONSEQUENCE
                  </div>
                  <p className="mt-[6px] text-[13px] leading-[1.6] text-[var(--text2)]">
                    Evacuation routes blocked. Hospitals unreachable. Emergency funds exhausted
                    before the peak. Families stranded for days.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-r-[10px] rounded-l-none border border-[rgba(31,184,154,0.25)] border-l-[3px] border-l-[var(--teal)] bg-[var(--navy3)] px-[18px] py-4">
              <div className="flex gap-4">
                <div>
                  <div className="mono-text text-[10px] tracking-[1px] text-[var(--teal)]">
                    WHAT MEKONG WATCH DOES
                  </div>
                  <p className="mt-[6px] text-[13px] leading-[1.6] text-[var(--text2)]">
                    Shows authorities exactly which zones are most exposed, which assets are at
                    risk, and what specific actions would reduce impact before the next season.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <div className="section-eyebrow">THE PROBLEM</div>
          <h2 className="section-title">Knowing it will flood is not the same as being ready</h2>
          <p className="mx-auto mt-[14px] max-w-[620px] text-[15px] leading-[1.7] text-[var(--text2)]">
            Local authorities in flood-prone regions often treat seasonal floods as routine,
            allocating the same inadequate resources year after year. What&apos;s missing is not
            awareness that floods will happen. It&apos;s a clear picture of <em>how bad</em>,{" "}
            <em>where exactly</em>, and <em>what to do about it</em>.
          </p>
        </div>

      </section>
    </main>
  );
}
