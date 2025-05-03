"use client";

import { login, signup } from './actions'
import Button from '../components/Button'
import { useState } from 'react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    // @ts-ignore
    const result = await login(formData)
    if (result && result.error) {
      setError(result.error.message || 'Invalid email or password')
    } else {
      window.location.replace('/account')
      window.location.reload()
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to your account or create a new one
          </p>
        </div>
        {error && (
          <div className="mb-4 text-red-600 text-center" role="alert">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button type="submit">
              Sign in
            </Button>
            <Button type="button" variant="secondary">
              Create account
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}