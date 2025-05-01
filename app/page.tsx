import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="py-20 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome to DartWin
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A modern Next.js application with Supabase integration. Built with performance, security, and developer experience in mind.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/login"
              className="rounded-lg bg-black dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
            >
              Get started
            </a>
            <a
              href="https://github.com/flowsome-magnus/dartwin-nextjs"
              className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
            >
              View on GitHub <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800"
            >
              <dt className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {feature.name}
              </dt>
              <dd className="mt-2 text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: 'Next.js 14',
    description: 'Built on the latest version of Next.js with App Router and React Server Components.',
  },
  {
    name: 'Supabase Integration',
    description: 'Powerful backend with PostgreSQL database, authentication, and real-time subscriptions.',
  },
  {
    name: 'Modern Styling',
    description: 'Beautiful, responsive design using Tailwind CSS with dark mode support.',
  },
];
