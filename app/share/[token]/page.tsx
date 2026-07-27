"use client"

import { use, useState, useEffect, useMemo } from "react"
import {
  ListTodo, PlayCircle, CheckCircle2, Clock,
  Search, SlidersHorizontal, AlertTriangle, Eye, ExternalLink,
} from "lucide-react"
import TaskTable from "@/components/task-table"
import TaskDetailModal from "@/components/task-detail-modal"

const tabs = [
  { key: "all", label: "All Tasks", icon: ListTodo },
  { key: "progress", label: "Progress", icon: PlayCircle },
  { key: "done", label: "Done", icon: CheckCircle2 },
  { key: "pending", label: "Pending", icon: Clock },
] as const

type TabKey = (typeof tabs)[number]["key"]
const priorities = ["All", "Critical", "High", "Medium", "Low"] as const

const priorityMap: Record<number, string> = {
  1: "Critical", 2: "High", 3: "Medium", 4: "Low",
}

type PublicTask = {
  id: number
  title: string
  content: string
  prioritas: number
  status: string
}

function getStatusCount(tasks: PublicTask[], status: string) {
  if (status === "all") return tasks.length
  return tasks.filter((t) => t.status.toLowerCase() === status).length
}

export default function SharePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params)
  const [projectTitle, setProjectTitle] = useState("")
  const [tasks, setTasks] = useState<PublicTask[]>([])
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("All")
  const [showFilter, setShowFilter] = useState(false)
  const [detailTask, setDetailTask] = useState<{
    id: number; title: string; content: string; priority: "Critical" | "High" | "Medium" | "Low"; status: "all" | "progress" | "done" | "pending"
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/share/${token}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then((data) => {
        if (data) {
          setProjectTitle(data.title)
          setTasks(data.tasks)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [token])

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Eye size={48} className="text-zinc-600" />
        <p className="text-zinc-400">Tautan tidak valid atau proyek tidak ditemukan</p>
      </div>
    )
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchTab = activeTab === "all" || t.status.toLowerCase() === activeTab
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const pLabel = priorityMap[t.prioritas] || "Medium"
      const matchPriority = priorityFilter === "All" || pLabel === priorityFilter
      return matchTab && matchSearch && matchPriority
    })
  }, [tasks, activeTab, search, priorityFilter])

  const mappedTasks = filteredTasks.map((t) => ({
    id: t.id,
    title: t.title,
    content: t.content || "",
    priority: (priorityMap[t.prioritas] || "Medium") as "Critical" | "High" | "Medium" | "Low",
    status: t.status.toLowerCase() as "all" | "progress" | "done" | "pending",
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-zinc-500">Memuat...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{projectTitle}</h1>
            <span className="bg-purple-900/50 text-purple-400 text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ExternalLink size={12} /> Public View
            </span>
          </div>
          <p className="text-zinc-500 text-sm mt-1">
            {tasks.length} tugas &mdash;{" "}
            {getStatusCount(tasks, "progress")} in progress,{" "}
            {getStatusCount(tasks, "done")} selesai,{" "}
            {getStatusCount(tasks, "pending")} pending
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
          <Eye size={14} /> Mode baca saja
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tugas..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="relative">
          <button onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer ${priorityFilter !== "All" ? "border-blue-500/40 bg-blue-500/10 text-blue-400" : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-300 hover:border-zinc-700"}`}>
            <SlidersHorizontal size={16} />{priorityFilter !== "All" ? priorityFilter : "Filter"}
          </button>
          {showFilter && (
            <div className="absolute right-0 top-full mt-2 z-20 bg-zinc-900 border border-zinc-800 rounded-xl p-2 min-w-40 shadow-xl">
              {priorities.map((p) => (
                <button key={p} onClick={() => { setPriorityFilter(p); setShowFilter(false) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${priorityFilter === p ? "bg-blue-500/15 text-blue-400" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const count = getStatusCount(tasks, tab.key)
          const isActive = activeTab === tab.key
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer border-b-2 -mb-[1px] ${isActive ? "text-blue-400 border-blue-500" : "text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-700"}`}>
              <Icon size={16} />{tab.label}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-500/15 text-blue-400" : "bg-zinc-800 text-zinc-500"}`}>{count}</span>
            </button>
          )
        })}
      </div>

      <TaskTable data={mappedTasks}
        onViewDetail={setDetailTask}
        emptyMessage={search || priorityFilter !== "All" ? "Tidak ada tugas yang cocok dengan pencarian." : `Belum ada tugas dengan status "${tabs.find((t) => t.key === activeTab)?.label}".`} />

      {detailTask && <TaskDetailModal task={detailTask} onClose={() => setDetailTask(null)} />}
    </div>
  )
}
