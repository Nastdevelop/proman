import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getUser, unauthorized } from "@/lib/api-helper"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req)
  if (!user) return unauthorized()
  const { id } = await params

  const room = await prisma.room.findFirst({
    where: { id, pmId: user.userId },
    include: {
      tasks: { orderBy: { createdAt: "asc" } },
      divisions: {
        include: { tasks: { orderBy: { createdAt: "asc" } } },
        orderBy: { id: "asc" },
      },
    },
  })

  if (!room) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json(room)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req)
  if (!user) return unauthorized()
  const { id } = await params

  const room = await prisma.room.findFirst({ where: { id, pmId: user.userId } })
  if (!room) return NextResponse.json({ message: "Not found" }, { status: 404 })

  await prisma.task.deleteMany({ where: { roomId: id } })
  await prisma.division.deleteMany({ where: { roomId: id } })
  await prisma.member.deleteMany({ where: { roomId: id } })
  await prisma.room.delete({ where: { id } })
  return NextResponse.json({ message: "Deleted" })
}
