export type TaskItem = {
  id: number
  title: string
  priority: "Critical" | "High" | "Medium" | "Low"
  status: "all" | "progress" | "done" | "pending"
}

export type FreelanceProject = {
  slug: string
  title: string
  shareToken: string
  tasks: TaskItem[]
}

export const freelanceProjects: FreelanceProject[] = [
  {
    slug: "porto",
    title: "Porto",
    shareToken: "porto-share-abc",
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
    slug: "company-profile",
    title: "Company Profile",
    shareToken: "company-share-xyz",
    tasks: [
      { id: 1, title: "Header & navigasi", priority: "Critical", status: "done" },
      { id: 2, title: "Halaman layanan", priority: "High", status: "progress" },
      { id: 3, title: "Testimonial section", priority: "Medium", status: "done" },
      { id: 4, title: "Footer & kontak", priority: "Low", status: "pending" },
      { id: 5, title: "Google Maps integrasi", priority: "Medium", status: "pending" },
      { id: 6, title: "Form pendaftaran klien", priority: "High", status: "progress" },
    ],
  },
]
