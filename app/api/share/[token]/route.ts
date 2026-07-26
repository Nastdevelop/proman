import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const room = await prisma.room.findUnique({
    where: { shareToken: token },
    include: { tasks: { orderBy: { createdAt: "asc" } } },
  })

  if (!room) return NextResponse.json({ message: "Not found" }, { status: 404 })

  return NextResponse.json({
    title: room.judul,
    tasks: room.tasks,
  })
}
