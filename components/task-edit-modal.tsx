"use client"

import { useState } from "react"
import { X, Save } from "lucide-react"

const priorities = [
  { value: "Critical", color: "text-red-400", dot: "bg-red-500" },
  { value: "High", color: "text-orange-400", dot: "bg-orange-500" },
  { value: "Medium", color: "text-yellow-400", dot: "bg-yellow-500" },
  { value: "Low", color: "text-green-400", dot: "bg-green-500" },
] as const

type TaskItem = {
  id: number
  title: string
  content: string
  priority: "Critical" | "High" | "Medium" | "Low"
}

export default function TaskEditModal({
  task,
  onClose,
  onSave,
}: {
  task: TaskItem
  onClose: () => void
  onSave: (id: number, title: string, content: string, priority: string) => void
}) {
  const [title, setTitle] = useState(task.title)
  const [content, setContent] = useState(task.content)
  const [priority, setPriority] = useState(task.priority)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md mx-4 p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Edit Tugas</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-zinc-400 text-sm mb-1.5 block">Judul Tugas</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul tugas..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            autoFocus
          />
        </div>

        <div className="mb-4">
          <label className="text-zinc-400 text-sm mb-1.5 block">Prioritas</label>
          <div className="flex gap-2">
            {priorities.map((p) => {
              const isActive = priority === p.value
              return (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    isActive
                      ? `${p.color} ${p.color.replace("text", "bg")}/10 border-current`
                      : "text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${p.dot} mr-1.5 align-middle`} />
                  {p.value}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mb-5">
          <label className="text-zinc-400 text-sm mb-1.5 block">Keterangan</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Deskripsi tugas..."
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
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
              if (title.trim()) onSave(task.id, title.trim(), content.trim(), priority)
            }}
            disabled={!title.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save size={16} />
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}
