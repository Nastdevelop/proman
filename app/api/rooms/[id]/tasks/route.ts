import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getUser, unauthorized } from "@/lib/api-helper"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req)
  if (!user) return unauthorized()
  const { id } = await params

  const room = await prisma.room.findFirst({ where: { id, pmId: user.userId } })
  if (!room) return NextResponse.json({ message: "Not found" }, { status: 404 })

  const { title, prioritas } = await req.json()
  if (!title) return NextResponse.json({ message: "Title required" }, { status: 400 })

  const task = await prisma.task.create({
    data: { roomId: id, title, prioritas: prioritas ?? 2, content: "" },
  })
  return NextResponse.json(task, { status: 201 })
}
