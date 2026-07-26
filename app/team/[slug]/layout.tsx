"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Users, Shield } from "lucide-react"
import type { Room } from "@/lib/types"

export default function TeamLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const pathname = usePathname()
  const router = useRouter()
  const { token, isLoading: authLoading } = useAuth()
  const [room, setRoom] = useState<Room | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!token) { router.push("/login"); return }
    fetch(`/api/rooms/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setRoom)
  }, [slug, token, authLoading, router])

  if (!room) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-zinc-500">Memuat...</p>
        </div>
      </div>
    )
  }

  const inDivision = pathname.includes(`/team/${slug}/`)

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Link
        href={inDivision ? `/team/${slug}` : "/home"}
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        {inDivision ? "Kembali ke divisi" : "Kembali"}
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white">{room.judul}</h1>
          <span className="bg-blue-900/50 text-blue-400 text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Users size={12} /> Team
          </span>
          <span className="bg-purple-900/50 text-purple-400 text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Shield size={12} /> PM
          </span>
        </div>
        <p className="text-zinc-500 text-sm mt-1">
          {room.divisions.length} divisi
        </p>
      </div>

      {children}
    </div>
  )
}
