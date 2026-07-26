"use client"

import { use, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Search, SlidersHorizontal, AlertTriangle,
  Plus, Users, FolderKanban, Shield,
} from "lucide-react"
import TaskTable from "@/components/task-table"
import TaskActionModal from "@/components/task-action-modal"
import AddDivisionModal from "@/components/add-division-modal"
import AddTaskModal from "@/components/add-task-modal"
import { teamProjects } from "@/lib/team-sample-data"
import type { TaskItem } from "@/lib/team-sample-data"

const statusTabs = [
  { key: "all", label: "All Tasks" },
  { key: "progress", label: "Progress" },
  { key: "done", label: "Done" },
  { key: "pending", label: "Pending" },
] as const

type StatusKey = (typeof statusTabs)[number]["key"]

const priorities = ["All", "Critical", "High", "Medium", "Low"] as const

export default function TeamProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()

  const project = teamProjects.find((p) => p.slug === slug)

  const [divisions, setDivisions] = useState(project?.divisions ?? [])
  const [activeDiv, setActiveDiv] = useState<string>(
    divisions[0]?.id ?? ""
  )
  const [activeStatus, setActiveStatus] = useState<StatusKey>("all")
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("All")
  const [showFilter, setShowFilter] = useState(false)
  const [showAddDiv, setShowAddDiv] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle size={48} className="text-zinc-600" />
        <p className="text-zinc-400">Project tim tidak ditemukan</p>
        <button
          onClick={() => router.push("/home")}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          Kembali ke Home
        </button>
      </div>
    )
  }

  const activeDivision = divisions.find((d) => d.id === activeDiv)

  const filteredTasks = useMemo(() => {
    if (!activeDivision) return []
    return activeDivision.tasks.filter((t) => {
      const matchStatus = activeStatus === "all" || t.status === activeStatus
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const matchPriority = priorityFilter === "All" || t.priority === priorityFilter
      return matchStatus && matchSearch && matchPriority
    })
  }, [activeDivision, activeStatus, search, priorityFilter])

  const handleMove = (taskId: number, newStatus: TaskItem["status"]) => {
    setDivisions((prev) =>
      prev.map((div) =>
        div.id === activeDiv
          ? {
              ...div,
              tasks: div.tasks.map((t) =>
                t.id === taskId ? { ...t, status: newStatus } : t
              ),
            }
          : div
      )
    )
    setSelectedTask(null)
  }

  const handleAddDivision = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-")
    setDivisions((prev) => [...prev, { id, name, tasks: [] }])
    setActiveDiv(id)
    setShowAddDiv(false)
  }

  const handleAddTask = (title: string, priority: string) => {
    const active = divisions.find((d) => d.id === activeDiv)
    const nextId = active ? active.tasks.length + 1 : 1
    setDivisions((prev) =>
      prev.map((d) =>
        d.id === activeDiv
          ? {
              ...d,
              tasks: [
                ...d.tasks,
                { id: nextId, title, priority: priority as TaskItem["priority"], status: "all" },
              ],
            }
          : d
      )
    )
    setShowAddTask(false)
  }

  const totalTasks = divisions.reduce((sum, d) => sum + d.tasks.length, 0)
  const statusCount = (status: string) => {
    if (status === "all") return totalTasks
    return divisions.reduce(
      (sum, d) => sum + d.tasks.filter((t) => t.status === status).length,
      0
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <button
        onClick={() => router.push("/home")}
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 text-sm mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white">{project.title}</h1>
          <span className="bg-blue-900/50 text-blue-400 text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Users size={12} /> Team
          </span>
          <span
            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              project.role === "pm"
                ? "bg-purple-900/50 text-purple-400"
                : "bg-emerald-900/50 text-emerald-400"
            }`}
          >
            <Shield size={12} />
            {project.role === "pm" ? "PM" : "Dev"}
          </span>
        </div>
        <p className="text-zinc-500 text-sm mt-1">
          {divisions.length} divisi &mdash; {totalTasks} total tugas
        </p>
      </div>

      {/* Division Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-zinc-800">
        {divisions.map((div) => {
          const isActive = activeDiv === div.id
          return (
            <button
              key={div.id}
              onClick={() => {
                setActiveDiv(div.id)
                setActiveStatus("all")
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer border-b-2 -mb-[1px] ${
                isActive
                  ? "text-blue-400 border-blue-500"
                  : "text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              <FolderKanban size={16} />
              {div.name}
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-blue-500/15 text-blue-400"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {div.tasks.length}
              </span>
            </button>
          )
        })}
        {project.role === "pm" && (
          <button
            onClick={() => setShowAddDiv(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-blue-400 transition-colors cursor-pointer border-b-2 border-transparent"
          >
            <Plus size={16} />
            Divisi Baru
          </button>
        )}
      </div>

      {/* Search & Filter */}
      {activeDivision && (
        <>
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
              {project.role === "pm" && (
                <button
                  onClick={() => setShowAddTask(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              )}
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-1 mb-6 border-b border-zinc-800">
            {statusTabs.map((tab) => {
              const count = activeDivision.tasks.filter(
                (t) => tab.key === "all" || t.status === tab.key
              ).length
              const isActive = activeStatus === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveStatus(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer border-b-2 -mb-[1px] ${
                    isActive
                      ? "text-blue-400 border-blue-500"
                      : "text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-blue-500/15 text-blue-400"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Task Table */}
          <TaskTable
            data={filteredTasks}
            onTaskClick={setSelectedTask}
            emptyMessage={
              search || priorityFilter !== "All"
                ? "Tidak ada tugas yang cocok dengan pencarian."
                : "Belum ada tugas di divisi ini."
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
        </>
      )}

      {showAddDiv && (
        <AddDivisionModal
          onClose={() => setShowAddDiv(false)}
          onAdd={handleAddDivision}
        />
      )}
    </div>
  )
}
