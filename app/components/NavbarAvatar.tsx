"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

export default function NavbarAvatar({ url, size = 32 }: { url: string | null, size?: number }) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path);
        if (error) throw error;
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch {
        setAvatarUrl(null);
      }
    }
    if (url) downloadImage(url);
  }, [url, supabase]);

  return avatarUrl ? (
    <Image
      src={avatarUrl}
      alt="Avatar"
      width={size}
      height={size}
      className="rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
    />
  ) : (
    <div
      className="rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-800"
      style={{ width: size, height: size }}
    >
      <svg className="w-1/2 h-1/2 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );
} 