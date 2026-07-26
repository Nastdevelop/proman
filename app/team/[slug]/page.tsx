"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { FolderKanban, Plus } from "lucide-react"
import AddDivisionModal from "@/components/add-division-modal"
import type { Room, Division } from "@/lib/types"

export default function TeamOverview({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const { token, isLoading: authLoading } = useAuth()
  const [room, setRoom] = useState<Room | null>(null)
  const [showAddDiv, setShowAddDiv] = useState(false)

  const fetchRoom = () => {
    fetch(`/api/rooms/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setRoom)
  }

  useEffect(() => {
    if (authLoading) return
    if (!token) { router.push("/login"); return }
    fetchRoom()
  }, [slug, token, authLoading, router])

  const handleAddDivision = async (name: string) => {
    const res = await fetch(`/api/rooms/${slug}/divisions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
    if (res.ok) fetchRoom()
    setShowAddDiv(false)
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-zinc-500">Memuat...</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-200">Divisi</h2>
        <button
          onClick={() => setShowAddDiv(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
        >
          <Plus size={16} /> Divisi Baru
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {room.divisions.map((div: Division) => {
          const progress = div.tasks.filter((t) => t.status === "PROGRESS").length
          const done = div.tasks.filter((t) => t.status === "DONE").length
          const pending = div.tasks.filter((t) => t.status === "PENDING").length

          return (
            <Link
              key={div.id}
              href={`/team/${slug}/${div.id}`}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-blue-500/50 transition-all group block"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <FolderKanban size={20} />
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {div.name}
                </h3>
              </div>
              <p className="text-zinc-500 text-sm mb-3">{div.tasks.length} tugas</p>
              <div className="flex gap-3 text-xs">
                <span className="text-blue-400">{progress} progress</span>
                <span className="text-green-400">{done} selesai</span>
                <span className="text-yellow-400">{pending} pending</span>
              </div>
            </Link>
          )
        })}
      </div>

      {showAddDiv && (
        <AddDivisionModal onClose={() => setShowAddDiv(false)} onAdd={handleAddDivision} />
      )}
    </>
  )
}
