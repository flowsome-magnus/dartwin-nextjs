import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <svg
                className="w-6 h-6 text-black dark:text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {/* Dartboard */}
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="3" />
                {/* Dart */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 3l-6 6"
                />
                <path
                  fill="currentColor"
                  d="M16.5 7.5L15 9l-1.5-1.5L15 6z"
                />
              </svg>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                DartWin
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-300 transition">
              Login
            </Link>
            <Link href="/account" className="text-sm font-medium bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition">
              Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 