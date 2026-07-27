"use client"

import { use, useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  Search, SlidersHorizontal, AlertTriangle,
  Plus, FolderKanban, UserPlus,
} from "lucide-react"
import TaskTable from "@/components/task-table"
import TaskActionModal from "@/components/task-action-modal"
import AddTaskModal from "@/components/add-task-modal"
import TaskDetailModal from "@/components/task-detail-modal"
import TaskEditModal from "@/components/task-edit-modal"
import InviteModal from "@/components/invite-modal"
import type { Task, Room } from "@/lib/types"

const statusTabs = [
  { key: "all", label: "All Tasks" },
  { key: "progress", label: "Progress" },
  { key: "done", label: "Done" },
  { key: "pending", label: "Pending" },
] as const

type StatusKey = (typeof statusTabs)[number]["key"]
const priorities = ["All", "Critical", "High", "Medium", "Low"] as const

const priorityMap: Record<number, string> = {
  1: "Critical", 2: "High", 3: "Medium", 4: "Low",
}
const priorityReverse: Record<string, number> = {
  Critical: 1, High: 2, Medium: 3, Low: 4,
}

type TaskItem = {
  id: number; title: string; content: string; priority: "Critical" | "High" | "Medium" | "Low"; status: "all" | "progress" | "done" | "pending"
}

export default function DivisionPage({
  params,
}: {
  params: Promise<{ slug: string; division: string }>
}) {
  const { slug, division } = use(params)
  const router = useRouter()
  const { token, isLoading: authLoading } = useAuth()

  const [room, setRoom] = useState<Room | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeStatus, setActiveStatus] = useState<StatusKey>("all")
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("All")
  const [showFilter, setShowFilter] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [detailTask, setDetailTask] = useState<TaskItem | null>(null)
  const [editTask, setEditTask] = useState<TaskItem | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTasks = () => {
    fetch(`/api/rooms/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data: Room) => {
        setRoom(data)
        const div = data.divisions.find((d) => d.id === division)
        setTasks(div ? div.tasks : [])
        setLoading(false)
      })
  }

  useEffect(() => {
    if (authLoading) return
    if (!token) { router.push("/login"); return }
    fetchTasks()
  }, [slug, division, token, authLoading, router])

  const divInfo = room?.divisions.find((d) => d.id === division)

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchStatus = activeStatus === "all" || t.status.toLowerCase() === activeStatus
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const pLabel = priorityMap[t.prioritas] || "Medium"
      const matchPriority = priorityFilter === "All" || pLabel === priorityFilter
      return matchStatus && matchSearch && matchPriority
    })
  }, [tasks, activeStatus, search, priorityFilter])

  const handleMove = async (taskId: number, newStatus: string) => {
    const dbStatus = newStatus.toUpperCase()
    const res = await fetch(`/api/rooms/${slug}/divisions/${division}/tasks/${taskId}`, {
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
    const res = await fetch(`/api/rooms/${slug}/divisions/${division}/tasks`, {
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
    const res = await fetch(`/api/rooms/${slug}/divisions/${division}/tasks/${id}`, {
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
    const res = await fetch(`/api/rooms/${slug}/divisions/${division}/tasks/${task.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setTasks((prev) => prev.filter((t) => t.id !== task.id))
  }

  const toItem = (t: Task): TaskItem => ({
    id: t.id,
    title: t.title,
    content: t.content,
    priority: (priorityMap[t.prioritas] || "Medium") as TaskItem["priority"],
    status: t.status.toLowerCase() as "all" | "progress" | "done" | "pending",
  })

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-zinc-500">Memuat...</p>
      </div>
    )
  }

  if (!room || !divInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <AlertTriangle size={48} className="text-zinc-600" />
        <p className="text-zinc-400">Divisi tidak ditemukan</p>
        <button onClick={() => router.push(`/team/${slug}`)} className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
          Kembali ke divisi
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <FolderKanban size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">{divInfo.name}</h2>
          <p className="text-zinc-500 text-sm">{tasks.length} tugas</p>
        </div>
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
          <button onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer">
            <UserPlus size={16} />Invite User
          </button>
          <button onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer">
            <Plus size={16} />Add Task
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {statusTabs.map((tab) => {
          const count = tasks.filter((t) => tab.key === "all" || t.status.toLowerCase() === tab.key).length
          const isActive = activeStatus === tab.key
          return (
            <button key={tab.key} onClick={() => setActiveStatus(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer border-b-2 -mb-[1px] ${isActive ? "text-blue-400 border-blue-500" : "text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-700"}`}>
              {tab.label}
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
        emptyMessage={search || priorityFilter !== "All" ? "Tidak ada tugas yang cocok dengan pencarian." : "Belum ada tugas di divisi ini."}
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

      {showInvite && <InviteModal divisionName={divInfo.name} onClose={() => setShowInvite(false)} />}
    </div>
  )
}
