"use client"

import { X, ArrowRight, PlayCircle, CheckCircle2, Clock } from "lucide-react"
import type { TaskItem } from "@/lib/sample-data"

const statusActions = [
  {
    key: "progress",
    label: "Progress",
    icon: PlayCircle,
    desc: "Tandai sedang dikerjakan",
    color: "text-blue-400 hover:bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40",
  },
  {
    key: "done",
    label: "Selesai",
    icon: CheckCircle2,
    desc: "Tandai sudah selesai",
    color: "text-green-400 hover:bg-green-500/10 border-green-500/20 hover:border-green-500/40",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    desc: "Tandai ditunda",
    color: "text-yellow-400 hover:bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40",
  },
]

export default function TaskActionModal({
  task,
  onClose,
  onMove,
}: {
  task: TaskItem
  onClose: () => void
  onMove: (taskId: number, newStatus: TaskItem["status"]) => void
}) {
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
          <h2 className="text-lg font-semibold text-white">Pindahkan Tugas</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-zinc-300 text-sm mb-1 line-clamp-2">
          &ldquo;{task.title}&rdquo;
        </p>
        <p className="text-zinc-500 text-xs mb-5">
          Status saat ini: <span className="text-zinc-400 capitalize">{task.status}</span>
        </p>

        <div className="flex flex-col gap-2.5">
          {statusActions
            .filter((a) => a.key !== task.status)
            .map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.key}
                  onClick={() => onMove(task.id, action.key as TaskItem["status"])}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border cursor-pointer transition-all ${action.color}`}
                >
                  <Icon size={20} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-zinc-500">{action.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-zinc-600" />
                </button>
              )
            })}
        </div>
      </div>
    </div>
  )
}
