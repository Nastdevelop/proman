"use client"

import { X, FileText } from "lucide-react"

const priorityConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  Critical: { label: "Critical", color: "text-red-400", bg: "bg-red-500/10", dot: "bg-red-500" },
  High: { label: "High", color: "text-orange-400", bg: "bg-orange-500/10", dot: "bg-orange-500" },
  Medium: { label: "Medium", color: "text-yellow-400", bg: "bg-yellow-500/10", dot: "bg-yellow-500" },
  Low: { label: "Low", color: "text-green-400", bg: "bg-green-500/10", dot: "bg-green-500" },
}

type TaskItem = {
  id: number
  title: string
  content: string
  priority: "Critical" | "High" | "Medium" | "Low"
}

export default function TaskDetailModal({
  task,
  onClose,
}: {
  task: TaskItem
  onClose: () => void
}) {
  const pc = priorityConfig[task.priority]

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
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-zinc-400" />
            <h2 className="text-lg font-semibold text-white">Detail Tugas</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-zinc-500 text-xs mb-1 block">Judul</label>
          <p className="text-white text-base font-medium">{task.title}</p>
        </div>

        <div className="mb-4">
          <label className="text-zinc-500 text-xs mb-1 block">Prioritas</label>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${pc.color} ${pc.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
            {pc.label}
          </span>
        </div>

        <div>
          <label className="text-zinc-500 text-xs mb-1 block">Keterangan</label>
          {task.content ? (
            <div className="bg-zinc-800/50 border border-zinc-800 rounded-lg p-3">
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                {task.content}
              </p>
            </div>
          ) : (
            <p className="text-zinc-600 text-sm italic">Tidak ada keterangan</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}
