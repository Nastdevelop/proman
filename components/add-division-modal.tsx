"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"

export default function AddDivisionModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (name: string) => void
}) {
  const [name, setName] = useState("")

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Buat Divisi Baru</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-5">
          <label className="text-zinc-400 text-sm mb-1.5 block">Nama Divisi</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Frontend, Backend, UI/UX..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => {
              if (name.trim()) onAdd(name.trim())
            }}
            disabled={!name.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            Buat
          </button>
        </div>
      </div>
    </div>
  )
}
