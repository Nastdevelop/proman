import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getUser, unauthorized } from "@/lib/api-helper"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const user = await getUser(req)
  if (!user) return unauthorized()
  const { id, taskId } = await params

  const room = await prisma.room.findFirst({ where: { id, pmId: user.userId } })
  if (!room) return NextResponse.json({ message: "Not found" }, { status: 404 })

  const body = await req.json()
  const task = await prisma.task.update({
    where: { id: Number(taskId) },
    data: body,
  })
  return NextResponse.json(task)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const user = await getUser(req)
  if (!user) return unauthorized()
  const { id, taskId } = await params

  const room = await prisma.room.findFirst({ where: { id, pmId: user.userId } })
  if (!room) return NextResponse.json({ message: "Not found" }, { status: 404 })

  await prisma.task.delete({ where: { id: Number(taskId) } })
  return NextResponse.json({ message: "Deleted" })
}
