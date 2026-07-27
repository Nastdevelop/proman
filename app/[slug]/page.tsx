"use client"

import { use, useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  ArrowLeft, ListTodo, PlayCircle, CheckCircle2, Clock,
  Search, SlidersHorizontal, AlertTriangle, Plus,
} from "lucide-react"
import TaskTable from "@/components/task-table"
import TaskActionModal from "@/components/task-action-modal"
import AddTaskModal from "@/components/add-task-modal"
import TaskDetailModal from "@/components/task-detail-modal"
import TaskEditModal from "@/components/task-edit-modal"
import type { Task } from "@/lib/types"

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
const priorityReverse: Record<string, number> = {
  Critical: 1, High: 2, Medium: 3, Low: 4,
}

function getStatusCount(tasks: Task[], status: string) {
  if (status === "all") return tasks.length
  return tasks.filter((t) => t.status.toLowerCase() === status).length
}

type TaskItem = {
  id: number; title: string; content: string; priority: "Critical" | "High" | "Medium" | "Low"; status: "all" | "progress" | "done" | "pending"
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const { token, isLoading: authLoading } = useAuth()

  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("All")
  const [showFilter, setShowFilter] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [detailTask, setDetailTask] = useState<TaskItem | null>(null)
  const [editTask, setEditTask] = useState<TaskItem | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!token) { router.push("/login"); return }
    fetch(`/api/rooms/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then((data) => {
        if (data) setTasks(data.tasks)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug, token, authLoading, router])

  const handleMove = async (taskId: number, newStatus: string) => {
    const dbStatus = newStatus.toUpperCase()
    const res = await fetch(`/api/rooms/${slug}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: dbStatus }),
    })
    if (res.ok) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: dbStatus as Task["status"] } : t))
      )
    }
    setSelectedTask(null)
  }

  const handleAddTask = async (title: string, content: string, priority: string) => {
    const res = await fetch(`/api/rooms/${slug}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content, prioritas: priorityReverse[priority] }),
    })
    if (res.ok) {
      const task = await res.json()
      setTasks((prev) => [...prev, task])
    }
    setShowAddTask(false)
  }

  const handleEditTask = async (id: number, title: string, content: string, priority: string) => {
    const res = await fetch(`/api/rooms/${slug}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content, prioritas: priorityReverse[priority] }),
    })
    if (res.ok) {
      const updated = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    }
    setEditTask(null)
  }

  const handleDeleteTask = async (task: TaskItem) => {
    if (!confirm(`Hapus tugas "${task.title}"?`)) return
    const res = await fetch(`/api/rooms/${slug}/tasks/${task.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setTasks((prev) => prev.filter((t) => t.id !== task.id))
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

  const toItem = (t: Task): TaskItem => ({
    id: t.id,
    title: t.title,
    content: t.content,
    priority: (priorityMap[t.prioritas] || "Medium") as TaskItem["priority"],
    status: t.status.toLowerCase() as "all" | "progress" | "done" | "pending",
  })

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-zinc-500">Memuat...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle size={48} className="text-zinc-600" />
        <p className="text-zinc-400">Proyek tidak ditemukan</p>
        <button onClick={() => router.push("/home")} className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
          Kembali ke Home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <button onClick={() => router.push("/home")} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 text-sm mb-6 transition-colors cursor-pointer">
        <ArrowLeft size={16} />Kembali
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="text-xl md:text-2xl font-bold text-white">Project</h1>
          <span className="bg-green-900/50 text-green-400 text-[11px] font-medium px-2.5 py-0.5 rounded-full">Personal</span>
        </div>
        <p className="text-zinc-500 text-sm mt-1">
          {tasks.length} tugas &mdash; {getStatusCount(tasks, "progress")} in progress,{" "}
          {getStatusCount(tasks, "done")} selesai, {getStatusCount(tasks, "pending")} pending
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tugas..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="flex items-center gap-2">
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
          <button onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer">
            <Plus size={16} />Add Task
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-zinc-800 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const count = getStatusCount(tasks, tab.key)
          const isActive = activeTab === tab.key
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2.5 text-xs md:text-sm font-medium transition-all cursor-pointer border-b-2 -mb-[1px] whitespace-nowrap ${isActive ? "text-blue-400 border-blue-500" : "text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-700"}`}>
              <Icon size={16} />{tab.label}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-500/15 text-blue-400" : "bg-zinc-800 text-zinc-500"}`}>{count}</span>
            </button>
          )
        })}
      </div>

      <TaskTable
        data={filteredTasks.map(toItem)}
        onTaskClick={(task) => {
          const original = tasks.find((t) => t.id === task.id)
          if (original) setSelectedTask(original)
        }}
        onViewDetail={setDetailTask}
        onEditTask={setEditTask}
        onDeleteTask={handleDeleteTask}
        emptyMessage={search || priorityFilter !== "All" ? "Tidak ada tugas yang cocok dengan pencarian." : `Belum ada tugas dengan status "${tabs.find((t) => t.key === activeTab)?.label}".`}
      />

      {selectedTask && (
        <TaskActionModal
          task={toItem(selectedTask)}
          onClose={() => setSelectedTask(null)}
          onMove={(id, status) => handleMove(id, status)}
        />
      )}

      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} onAdd={handleAddTask} />}

      {detailTask && <TaskDetailModal task={detailTask} onClose={() => setDetailTask(null)} />}

      {editTask && (
        <TaskEditModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={handleEditTask}
        />
      )}
    </div>
  )
}
