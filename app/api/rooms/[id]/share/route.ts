import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getUser, unauthorized } from "@/lib/api-helper"
import { randomBytes } from "crypto"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(req)
  if (!user) return unauthorized()
  const { id } = await params

  const room = await prisma.room.findFirst({ where: { id, pmId: user.userId } })
  if (!room) return NextResponse.json({ message: "Not found" }, { status: 404 })

  if (room.shareToken) {
    return NextResponse.json({ shareToken: room.shareToken })
  }

  const shareToken = randomBytes(16).toString("hex")
  await prisma.room.update({ where: { id }, data: { shareToken } })
  return NextResponse.json({ shareToken })
}
