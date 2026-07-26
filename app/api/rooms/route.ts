import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getUser, unauthorized } from "@/lib/api-helper"

export async function GET(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return unauthorized()

  const rooms = await prisma.room.findMany({
    where: { pmId: user.userId },
    select: {
      id: true,
      judul: true,
      jenis: true,
      _count: { select: { tasks: true, divisions: true } },
    },
    orderBy: { id: "desc" },
  })

  return NextResponse.json(
    rooms.map((r) => ({
      id: r.id,
      title: r.judul,
      jenis: r.jenis,
      taskCount: r._count.tasks,
      divisionCount: r._count.divisions,
    }))
  )
}

export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return unauthorized()

  const { title, jenis } = await req.json()
  if (!title || !jenis) {
    return NextResponse.json({ message: "Input tidak lengkap" }, { status: 400 })
  }

  const room = await prisma.room.create({
    data: { judul: title, jenis, pmId: user.userId },
  })

  return NextResponse.json(room, { status: 201 })
}
