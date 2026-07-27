"use client"

import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import type { TaskItem } from "@/lib/sample-data"

const priorityConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  Critical: { label: "Critical", color: "text-red-400", bg: "bg-red-500/10", dot: "bg-red-500" },
  High: { label: "High", color: "text-orange-400", bg: "bg-orange-500/10", dot: "bg-orange-500" },
  Medium: { label: "Medium", color: "text-yellow-400", bg: "bg-yellow-500/10", dot: "bg-yellow-500" },
  Low: { label: "Low", color: "text-green-400", bg: "bg-green-500/10", dot: "bg-green-500" },
}

const sortOrders = ["Critical", "High", "Medium", "Low"]

export default function TaskTable({
  data,
  emptyMessage = "Belum ada tugas",
  onTaskClick,
  onViewDetail,
  onEditTask,
  onDeleteTask,
}: {
  data: TaskItem[]
  emptyMessage?: string
  onTaskClick?: (task: TaskItem) => void
  onViewDetail?: (task: TaskItem) => void
  onEditTask?: (task: TaskItem) => void
  onDeleteTask?: (task: TaskItem) => void
}) {
  const [sortAsc, setSortAsc] = useState(true)

  const sorted = [...data].sort((a, b) => {
    const diff = sortOrders.indexOf(a.priority) - sortOrders.indexOf(b.priority)
    return sortAsc ? diff : -diff
  })

  const hasActions = !!(onViewDetail || onEditTask || onDeleteTask)

  return (
    <div className="rounded-xl border border-zinc-800 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/50">
            <th className="text-left py-3.5 px-5 text-zinc-400 font-medium tracking-wide">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">
                  #
                </span>
                Tugas
              </div>
            </th>
            <th className="text-left py-3.5 px-5 text-zinc-400 font-medium tracking-wide w-36">
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Prioritas
                <ArrowUpDown size={14} className="text-zinc-600" />
              </button>
            </th>
            {hasActions && (
              <th className="text-center py-3.5 px-4 text-zinc-400 font-medium tracking-wide w-28">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={hasActions ? 3 : 2} className="text-center py-12 text-zinc-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((task, index) => {
              const pc = priorityConfig[task.priority]
              return (
                <tr
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className={`border-b border-zinc-800/50 last:border-0 transition-colors ${
                    onTaskClick ? "hover:bg-zinc-900/80 cursor-pointer" : "hover:bg-zinc-900/80"
                  }`}
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-600 text-xs w-5 text-right tabular-nums">
                        {index + 1}
                      </span>
                      <span className="text-zinc-100 truncate max-w-xs">{task.title}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${pc.color} ${pc.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
                      {pc.label}
                    </span>
                  </td>
                  {hasActions && (
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {onViewDetail && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onViewDetail(task) }}
                            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Lihat detail"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        {onEditTask && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onEditTask(task) }}
                            className="p-1.5 rounded-md text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
                            title="Edit tugas"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDeleteTask && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteTask(task) }}
                            className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Hapus tugas"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
