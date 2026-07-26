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

  const { name } = await req.json()
  if (!name) return NextResponse.json({ message: "Name required" }, { status: 400 })

  const division = await prisma.division.create({
    data: { roomId: id, name },
    include: { tasks: true },
  })
  return NextResponse.json(division, { status: 201 })
}
