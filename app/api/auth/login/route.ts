import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { createToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { name, password } = await req.json()
    if (!name || !password) {
      return NextResponse.json({ message: "Input tidak lengkap" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { name } })
    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 401 })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 })
    }

    const token = await createToken({ userId: user.id, name: user.name })
    return NextResponse.json({ token, user: { id: user.id, name: user.name } })
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 })
  }
}
