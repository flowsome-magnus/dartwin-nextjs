"use client";
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import NavbarAvatar from './NavbarAvatar'
import type { User, Session } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [avatarKey, setAvatarKey] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }: { data: { user: User | null } }) => {
      setUser(data.user)
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', data.user.id)
          .single()
        setAvatarKey(profile?.avatar_url ?? null)
      } else {
        setAvatarKey(null)
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .single()
        setAvatarKey(profile?.avatar_url ?? null)
      } else {
        setAvatarKey(null)
      }
      router.refresh()
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAvatarKey(null)
    router.refresh()
  }

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 z-50 backdrop-blur">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
          <svg
            className="w-6 h-6 text-black dark:text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 3l-6 6" />
            <path fill="currentColor" d="M16.5 7.5L15 9l-1.5-1.5L15 6z" />
          </svg>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            Dartwin
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <NavbarAvatar url={avatarKey} size={32} />
              <button onClick={handleSignOut} className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-300 transition">
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-300 transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
} 