export type TaskItem = {
  id: number
  title: string
  priority: "Critical" | "High" | "Medium" | "Low"
  status: "all" | "progress" | "done" | "pending"
}

export type Division = {
  id: string
  name: string
  tasks: TaskItem[]
}

export type TeamProject = {
  slug: string
  title: string
  role: "pm" | "dev"
  divisions: Division[]
}

export const teamProjects: TeamProject[] = [
  {
    slug: "e-commers",
    title: "E Commers",
    role: "pm",
    divisions: [
      {
        id: "fe",
        name: "Frontend",
        tasks: [
          { id: 1, title: "Buat halaman login", priority: "Critical", status: "done" },
          { id: 2, title: "Product listing page", priority: "High", status: "progress" },
          { id: 3, title: "Shopping cart UI", priority: "Critical", status: "progress" },
          { id: 4, title: "Checkout form", priority: "High", status: "pending" },
          { id: 5, title: "Responsive mobile", priority: "Medium", status: "pending" },
        ],
      },
      {
        id: "be",
        name: "Backend",
        tasks: [
          { id: 1, title: "Setup database schema", priority: "Critical", status: "done" },
          { id: 2, title: "Auth API JWT", priority: "Critical", status: "progress" },
          { id: 3, title: "Payment gateway integration", priority: "High", status: "pending" },
          { id: 4, title: "Product CRUD API", priority: "High", status: "done" },
          { id: 5, title: "Order management API", priority: "Medium", status: "pending" },
          { id: 6, title: "Unit testing", priority: "Low", status: "pending" },
        ],
      },
      {
        id: "uiux",
        name: "UI/UX",
        tasks: [
          { id: 1, title: "Wireframe user flow", priority: "Critical", status: "done" },
          { id: 2, title: "High-fidelity prototype", priority: "High", status: "done" },
          { id: 3, title: "Design system komponen", priority: "Medium", status: "progress" },
          { id: 4, title: "User testing", priority: "Low", status: "pending" },
        ],
      },
    ],
  },
  {
    slug: "cashier",
    title: "Cashier",
    role: "dev",
    divisions: [
      {
        id: "fe",
        name: "Frontend",
        tasks: [
          { id: 1, title: "UI kasir utama", priority: "Critical", status: "progress" },
          { id: 2, title: "Halaman laporan", priority: "Medium", status: "done" },
          { id: 3, title: "Notifikasi realtime", priority: "High", status: "pending" },
        ],
      },
      {
        id: "be",
        name: "Backend",
        tasks: [
          { id: 1, title: "REST API transaksi", priority: "Critical", status: "progress" },
          { id: 2, title: "Manajemen stok API", priority: "High", status: "done" },
          { id: 3, title: "Generate laporan PDF", priority: "Medium", status: "pending" },
          { id: 4, title: "Multi-user auth", priority: "High", status: "progress" },
        ],
      },
    ],
  },
]
