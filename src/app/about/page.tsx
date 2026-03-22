import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="page-shell">
      <section className="about-page">
        <h1 className="about-hero-title" style={{ marginBottom: 32 }}>
          The story behind <span style={{ whiteSpace: "nowrap" }}>Mekong Watch</span>
        </h1>
        <p className="about-lead" style={{ marginBottom: 24 }}>
          Welcome to Mekong Watch! Local officials across Vietnam&apos;s Mekong Delta often
          underestimate flood risk, leaving evacuation and mitigation plans dangerously
          underprepared - and I&apos;m trying to fix that.
        </p>
        <p className="about-lead" style={{ marginBottom: 24 }}>
          I&apos;m a senior at Washington and Lee University studying Computer Science and Natural
          Disasters Economics, with a strong interest in sustainability.
        </p>
        <p className="about-lead" style={{ marginBottom: 24 }}>
          Whether you&apos;re a local official, an urban planner, or just someone who cares about
          the delta, I hope this tool gives you the clarity to better protect your communities
          before the next flood hits. Join me in the mission to protect the people and places that
          depend on these rivers!
        </p>
        <Image
          src="/aboutme.png"
          alt="About me"
          width={200}
          height={250}
          style={{ borderRadius: 12, marginTop: 24 }}
        />
      </section>
    </main>
  );
}
