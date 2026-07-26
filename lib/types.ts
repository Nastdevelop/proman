export type User = {
  id: number
  name: string
}

export type Room = {
  id: string
  judul: string
  jenis: "PERSONAL" | "TEAM" | "FREELANCE"
  pmId: number
  shareToken: string | null
  tasks: Task[]
  divisions: Division[]
}

export type RoomListItem = {
  id: string
  title: string
  jenis: "PERSONAL" | "TEAM" | "FREELANCE"
  taskCount: number
  divisionCount: number
}

export type Task = {
  id: number
  roomId: string | null
  divisionId: string | null
  title: string
  content: string
  status: "DEFAULT" | "PROGRESS" | "PENDING" | "DONE"
  prioritas: number
  createdAt: string
}

export type Division = {
  id: string
  roomId: string
  name: string
  tasks: Task[]
}
