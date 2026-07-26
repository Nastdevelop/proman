"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Modal from "@/components/modal"
import type { RoomListItem } from "@/lib/types"

const jenisList = ["Personal", "Team", "Freelance"] as const

function toSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-")
}

export default function Homee() {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<RoomListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [judul, setJudul] = useState("")
  const [jenis, setJenis] = useState("Personal")

  useEffect(() => {
    if (isLoading) return
    if (!token) {
      router.push("/login")
      return
    }
    fetch("/api/rooms", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setProjects(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [token, isLoading, router])

  const handleSubmit = async () => {
    if (!judul.trim()) return
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: judul, jenis: jenis.toUpperCase() }),
    })
    if (res.ok) {
      const newRoom = await res.json()
      setProjects((prev) => [
        {
          id: newRoom.id,
          title: newRoom.judul,
          jenis: newRoom.jenis,
          taskCount: 0,
          divisionCount: 0,
        },
        ...prev,
      ])
    }
    setJudul("")
    setJenis("Personal")
    setOpen(false)
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-zinc-500">Memuat...</p>
      </div>
    )
  }

  const getLink = (p: RoomListItem) => {
    if (p.jenis === "TEAM") return `/team/${p.id}`
    if (p.jenis === "FREELANCE") return `/freelance/${p.id}`
    return `/${p.id}`
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">
        Selamat Datang, {user?.name ?? "User"}
      </h1>
      <p className="text-zinc-400 mb-8">
        Kelola dan pantau semua proyek Anda di satu tempat.
      </p>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari project..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-5 rounded-lg transition-colors cursor-pointer">
          Create New
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-500">Belum ada project. Buat project baru!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={getLink(p)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-blue-500/50 transition-colors cursor-pointer group block"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {p.title}
                </h2>
                <span
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                    p.jenis === "PERSONAL"
                      ? "bg-green-900/50 text-green-400"
                      : p.jenis === "TEAM"
                        ? "bg-blue-900/50 text-blue-400"
                        : "bg-purple-900/50 text-purple-400"
                  }`}
                >
                  {p.jenis === "PERSONAL"
                    ? "Personal"
                    : p.jenis === "TEAM"
                      ? "Team"
                      : "Freelance"}
                </span>
              </div>
              <p className="text-zinc-400 text-sm">
                {p.jenis === "TEAM"
                  ? `${p.divisionCount} divisi`
                  : `${p.taskCount} tugas`}
              </p>
            </Link>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-lg font-semibold text-white mb-5">Buat Project Baru</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-zinc-400 text-sm mb-1 block">Judul</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Masukkan judul..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-zinc-400 text-sm mb-1 block">Jenis</label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {jenisList.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-2">
            <button onClick={() => setOpen(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm py-2 rounded-lg transition-colors cursor-pointer">
              Batal
            </button>
            <button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded-lg transition-colors cursor-pointer">
              Simpan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
