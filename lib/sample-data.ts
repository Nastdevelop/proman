export type TaskItem = {
  id: number
  title: string
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
      { id: 1, title: "Wireframe halaman utama", priority: "Critical", status: "progress" },
      { id: 2, title: "Setup repository GitHub", priority: "High", status: "done" },
      { id: 3, title: "Desain database", priority: "Critical", status: "progress" },
      { id: 4, title: "Integrasi API payment", priority: "Medium", status: "pending" },
      { id: 5, title: "Testing fitur login", priority: "High", status: "done" },
      { id: 6, title: "Dokumentasi proyek", priority: "Low", status: "pending" },
      { id: 7, title: "Deploy staging", priority: "Critical", status: "progress" },
      { id: 8, title: "Optimasi performa", priority: "Medium", status: "done" },
    ],
  },
  {
    id: 2,
    slug: "e-commers",
    title: "E Commers",
    jenis: "Team",
    tasks: [
      { id: 1, title: "UI product listing", priority: "Critical", status: "progress" },
      { id: 2, title: "Setup payment gateway", priority: "Critical", status: "pending" },
      { id: 3, title: "Halaman detail produk", priority: "High", status: "done" },
      { id: 4, title: "Shopping cart logic", priority: "High", status: "progress" },
      { id: 5, title: "Integrasi shipping API", priority: "Medium", status: "pending" },
      { id: 6, title: "Admin dashboard", priority: "Medium", status: "done" },
      { id: 7, title: "Review sistem checkout", priority: "Critical", status: "pending" },
    ],
  },
  {
    id: 3,
    slug: "cashier",
    title: "Cashier",
    jenis: "Team",
    tasks: [
      { id: 1, title: "UI kasir", priority: "Critical", status: "progress" },
      { id: 2, title: "Manajemen stok", priority: "High", status: "done" },
      { id: 3, title: "Generate laporan", priority: "Medium", status: "pending" },
      { id: 4, title: "Multi-user support", priority: "Low", status: "pending" },
      { id: 5, title: "Print struk", priority: "High", status: "progress" },
      { id: 6, title: "Backup data otomatis", priority: "Medium", status: "done" },
    ],
  },
  {
    id: 4,
    slug: "porto",
    title: "Porto",
    jenis: "Freelance",
    tasks: [
      { id: 1, title: "Desain hero section", priority: "Critical", status: "done" },
      { id: 2, title: "Animasi scroll", priority: "Medium", status: "progress" },
      { id: 3, title: "Halaman tentang saya", priority: "High", status: "done" },
      { id: 4, title: "Form kontak", priority: "High", status: "pending" },
      { id: 5, title: "Integrasi CMS", priority: "Low", status: "pending" },
      { id: 6, title: "Mode gelap", priority: "Medium", status: "progress" },
      { id: 7, title: "Optimasi SEO", priority: "High", status: "pending" },
    ],
  },
  {
    id: 5,
    slug: "company",
    title: "Company",
    jenis: "Personal",
    tasks: [
      { id: 1, title: "Profil perusahaan", priority: "Critical", status: "done" },
      { id: 2, title: "Struktur organisasi", priority: "Medium", status: "progress" },
      { id: 3, title: "Halaman layanan", priority: "High", status: "done" },
      { id: 4, title: "Testimonial slider", priority: "Low", status: "pending" },
      { id: 5, title: "Form pendaftaran klien", priority: "High", status: "pending" },
      { id: 6, title: "Google Maps integrasi", priority: "Medium", status: "done" },
      { id: 7, title: "Multi language", priority: "Low", status: "progress" },
    ],
  },
]
