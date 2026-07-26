import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getUser, unauthorized } from "@/lib/api-helper"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; divId: string }> }
) {
  const user = await getUser(req)
  if (!user) return unauthorized()
  const { id, divId } = await params

  const room = await prisma.room.findFirst({ where: { id, pmId: user.userId } })
  if (!room) return NextResponse.json({ message: "Not found" }, { status: 404 })

  await prisma.task.deleteMany({ where: { divisionId: divId } })
  await prisma.division.delete({ where: { id: divId } })
  return NextResponse.json({ message: "Deleted" })
}
