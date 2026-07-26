"use client"

import { use, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, ListTodo, PlayCircle, CheckCircle2, Clock,
  Search, SlidersHorizontal, AlertTriangle, Plus,
} from "lucide-react"
import TaskTable from "@/components/task-table"
import TaskActionModal from "@/components/task-action-modal"
import AddTaskModal from "@/components/add-task-modal"
import { projectsData } from "@/lib/sample-data"
import type { TaskItem } from "@/lib/sample-data"

const tabs = [
  { key: "all", label: "All Tasks", icon: ListTodo },
  { key: "progress", label: "Progress", icon: PlayCircle },
  { key: "done", label: "Done", icon: CheckCircle2 },
  { key: "pending", label: "Pending", icon: Clock },
] as const

type TabKey = (typeof tabs)[number]["key"]

const priorities = ["All", "Critical", "High", "Medium", "Low"] as const

function getStatusCount(tasks: { status: string }[], status: string) {
  if (status === "all") return tasks.length
  return tasks.filter((t) => t.status === status).length
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("All")
  const [showFilter, setShowFilter] = useState(false)

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const project = projectsData.find((p) => p.slug === slug)
    return project ? [...project.tasks] : []
  })

  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  let nextId = tasks.length + 1

  const project = projectsData.find((p) => p.slug === slug)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle size={48} className="text-zinc-600" />
        <p className="text-zinc-400">Proyek tidak ditemukan</p>
        <button
          onClick={() => router.push("/home")}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          Kembali ke Home
        </button>
      </div>
    )
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchTab = activeTab === "all" || t.status === activeTab
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const matchPriority = priorityFilter === "All" || t.priority === priorityFilter
      return matchTab && matchSearch && matchPriority
    })
  }, [tasks, activeTab, search, priorityFilter])

  const handleMove = (taskId: number, newStatus: TaskItem["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    )
    setSelectedTask(null)
  }

  const handleAddTask = (title: string, priority: string) => {
    setTasks((prev) => [
      ...prev,
      { id: nextId++, title, priority: priority as TaskItem["priority"], status: "all" },
    ])
    setShowAddTask(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <button
        onClick={() => router.push("/home")}
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 text-sm mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white">{project.title}</h1>
          <span
            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
              project.jenis === "Personal"
                ? "bg-green-900/50 text-green-400"
                : project.jenis === "Team"
                  ? "bg-blue-900/50 text-blue-400"
                  : "bg-purple-900/50 text-purple-400"
            }`}
          >
            {project.jenis}
          </span>
        </div>
        <p className="text-zinc-500 text-sm mt-1">
          {tasks.length} tugas &mdash; {getStatusCount(tasks, "progress")} in progress,{" "}
          {getStatusCount(tasks, "done")} selesai, {getStatusCount(tasks, "pending")} pending
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tugas..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer ${
                priorityFilter !== "All"
                  ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              <SlidersHorizontal size={16} />
              {priorityFilter !== "All" ? priorityFilter : "Filter"}
            </button>
            {showFilter && (
              <div className="absolute right-0 top-full mt-2 z-20 bg-zinc-900 border border-zinc-800 rounded-xl p-2 min-w-40 shadow-xl">
                {priorities.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPriorityFilter(p)
                      setShowFilter(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      priorityFilter === p
                        ? "bg-blue-500/15 text-blue-400"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const count = getStatusCount(tasks, tab.key)
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer border-b-2 -mb-[1px] ${
                isActive
                  ? "text-blue-400 border-blue-500"
                  : "text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              <Icon size={16} />
              {tab.label}
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-blue-500/15 text-blue-400" : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <TaskTable
        data={filteredTasks}
        onTaskClick={setSelectedTask}
        emptyMessage={
          search || priorityFilter !== "All"
            ? "Tidak ada tugas yang cocok dengan pencarian."
            : `Belum ada tugas dengan status "${tabs.find((t) => t.key === activeTab)?.label}".`
        }
      />

      {selectedTask && (
        <TaskActionModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onMove={handleMove}
        />
      )}

      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onAdd={handleAddTask}
        />
      )}
    </div>
  )
}
