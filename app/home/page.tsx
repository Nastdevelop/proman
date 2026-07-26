"use client"

import { useState } from "react"
import Link from "next/link"
import Modal from "@/components/modal"

function toSlug(title: string) {
    return title.toLowerCase().replace(/\s+/g, "-")
}

type Project = {
    id: number
    title: string
    slug: string
    content: string
    jenis: string
}

const jenisList = ["Personal", "Team", "Freelance"]

const initialProjects: Project[] = [
    { id: 1, title: "Judol", slug: "judol", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", jenis: "Personal" },
    { id: 2, title: "E Commers", slug: "e-commers", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", jenis: "Team" },
    { id: 3, title: "Cashier", slug: "cashier", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", jenis: "Team" },
    { id: 4, title: "Porto", slug: "porto", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", jenis: "Freelance" },
    { id: 5, title: "Company", slug: "company", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", jenis: "Personal" },
]

export default function Homee() {
    const [projects, setProjects] = useState<Project[]>(initialProjects)

    const [open, setOpen] = useState(false)
    const [judul, setJudul] = useState("")
    const [content, setContent] = useState("")
    const [jenis, setJenis] = useState("Personal")

    const handleSubmit = () => {
        if (!judul.trim()) return
        setProjects((prev) => [
            ...prev,
            { id: Date.now(), title: judul, slug: toSlug(judul), content, jenis },
        ])
        setJudul("")
        setContent("")
        setJenis("Personal")
        setOpen(false)
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-2">Selamat Datang, Nast</h1>
            <p className="text-zinc-400 mb-8">Kelola dan pantau semua proyek Anda di satu tempat.</p>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((p) => (
                    <Link key={p.id} href={p.jenis === "Team" ? `/team/${p.slug}` : `/${p.slug}`} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-blue-500/50 transition-colors cursor-pointer group block">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{p.title}</h2>
                            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${p.jenis === "Personal" ? "bg-green-900/50 text-green-400" : p.jenis === "Team" ? "bg-blue-900/50 text-blue-400" : "bg-purple-900/50 text-purple-400"}`}>
                                {p.jenis}
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">{p.content}</p>
                    </Link>
                ))}
            </div>

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
                        <label className="text-zinc-400 text-sm mb-1 block">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Masukkan content..."
                            rows={4}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
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
