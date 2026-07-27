export type TaskItem = {
  id: number
  title: string
  content: string
  priority: "Critical" | "High" | "Medium" | "Low"
  status: "all" | "progress" | "done" | "pending"
}

export type ProjectData = {
  id: number
  slug: string
  title: string
  jenis: string
  tasks: TaskItem[]
}

export const projectsData: ProjectData[] = [
  {
    id: 1,
    slug: "judol",
    title: "Judol",
    jenis: "Personal",
    tasks: [
      { id: 1, title: "Wireframe halaman utama", content: "", priority: "Critical", status: "progress" },
      { id: 2, title: "Setup repository GitHub", content: "", priority: "High", status: "done" },
      { id: 3, title: "Desain database", content: "", priority: "Critical", status: "progress" },
      { id: 4, title: "Integrasi API payment", content: "", priority: "Medium", status: "pending" },
      { id: 5, title: "Testing fitur login", content: "", priority: "High", status: "done" },
      { id: 6, title: "Dokumentasi proyek", content: "", priority: "Low", status: "pending" },
      { id: 7, title: "Deploy staging", content: "", priority: "Critical", status: "progress" },
      { id: 8, title: "Optimasi performa", content: "", priority: "Medium", status: "done" },
    ],
  },
  {
    id: 2,
    slug: "e-commers",
    title: "E Commers",
    jenis: "Team",
    tasks: [
      { id: 1, title: "UI product listing", content: "", priority: "Critical", status: "progress" },
      { id: 2, title: "Setup payment gateway", content: "", priority: "Critical", status: "pending" },
      { id: 3, title: "Halaman detail produk", content: "", priority: "High", status: "done" },
      { id: 4, title: "Shopping cart logic", content: "", priority: "High", status: "progress" },
      { id: 5, title: "Integrasi shipping API", content: "", priority: "Medium", status: "pending" },
      { id: 6, title: "Admin dashboard", content: "", priority: "Medium", status: "done" },
      { id: 7, title: "Review sistem checkout", content: "", priority: "Critical", status: "pending" },
    ],
  },
  {
    id: 3,
    slug: "cashier",
    title: "Cashier",
    jenis: "Team",
    tasks: [
      { id: 1, title: "UI kasir", content: "", priority: "Critical", status: "progress" },
      { id: 2, title: "Manajemen stok", content: "", priority: "High", status: "done" },
      { id: 3, title: "Generate laporan", content: "", priority: "Medium", status: "pending" },
      { id: 4, title: "Multi-user support", content: "", priority: "Low", status: "pending" },
      { id: 5, title: "Print struk", content: "", priority: "High", status: "progress" },
      { id: 6, title: "Backup data otomatis", content: "", priority: "Medium", status: "done" },
    ],
  },
  {
    id: 4,
    slug: "porto",
    title: "Porto",
    jenis: "Freelance",
    tasks: [
      { id: 1, title: "Desain hero section", content: "", priority: "Critical", status: "done" },
      { id: 2, title: "Animasi scroll", content: "", priority: "Medium", status: "progress" },
      { id: 3, title: "Halaman tentang saya", content: "", priority: "High", status: "done" },
      { id: 4, title: "Form kontak", content: "", priority: "High", status: "pending" },
      { id: 5, title: "Integrasi CMS", content: "", priority: "Low", status: "pending" },
      { id: 6, title: "Mode gelap", content: "", priority: "Medium", status: "progress" },
      { id: 7, title: "Optimasi SEO", content: "", priority: "High", status: "pending" },
    ],
  },
  {
    id: 5,
    slug: "company",
    title: "Company",
    jenis: "Personal",
    tasks: [
      { id: 1, title: "Profil perusahaan", content: "", priority: "Critical", status: "done" },
      { id: 2, title: "Struktur organisasi", content: "", priority: "Medium", status: "progress" },
      { id: 3, title: "Halaman layanan", content: "", priority: "High", status: "done" },
      { id: 4, title: "Testimonial slider", content: "", priority: "Low", status: "pending" },
      { id: 5, title: "Form pendaftaran klien", content: "", priority: "High", status: "pending" },
      { id: 6, title: "Google Maps integrasi", content: "", priority: "Medium", status: "done" },
      { id: 7, title: "Multi language", content: "", priority: "Low", status: "progress" },
    ],
  },
]
