import Link from "next/link";

const highlights = [
  {
    title: "Built for Creators",
    description:
      "Artists, developers, teachers, streamers, and indie makers can all receive direct support.",
  },
  {
    title: "Simple Contributions",
    description:
      "Supporters can send quick one-time payments with a name and message in just a few clicks.",
  },
  {
    title: "Community First",
    description:
      "The goal is not only funding, but helping creators build a loyal audience around their work.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute top-32 -right-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-cyan-200/30 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              About The Platform
            </p>

            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
              Get Me A Chai helps creators turn support into momentum.
            </h1>

            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Get Me A Chai is a creator support platform inspired by the idea of
              small contributions with a big impact. Whether you are an
              entrepreneur, designer, developer, educator, or storyteller, your
              audience can support your work and help you keep building.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Start As Creator
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-slate-500 bg-slate-900/50 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-slate-300"
              >
                Back To Home
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-linear-to-br from-slate-900/95 to-slate-800/85 p-6 shadow-2xl shadow-cyan-900/20">
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              We believe every creator deserves a sustainable way to keep doing
              what they love. This platform makes support personal, simple, and
              transparent so creators can focus on creating, not chasing complex
              funding systems.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3">
                <p className="text-xs uppercase tracking-wider text-cyan-100">Fast</p>
                <p className="mt-1 text-lg font-bold text-white">1-Tap Flow</p>
              </div>
              <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3">
                <p className="text-xs uppercase tracking-wider text-emerald-100">Fair</p>
                <p className="mt-1 text-lg font-bold text-white">Direct Support</p>
              </div>
              <div className="rounded-xl border border-sky-300/20 bg-sky-300/10 p-3">
                <p className="text-xs uppercase tracking-wider text-sky-100">Human</p>
                <p className="mt-1 text-lg font-bold text-white">Real Messages</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 md:pb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Why People Use It</h2>
          <p className="text-sm text-slate-400">Simple ideas. Practical impact.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-white/10 bg-slate-900/70 p-5 transition hover:-translate-y-0.5 hover:border-cyan-200/40"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata() {

  return {
    title: `About - Get Me A Chai`,
    description: "Learn more about the Get Me A Chai platform and its mission.",
  };
}