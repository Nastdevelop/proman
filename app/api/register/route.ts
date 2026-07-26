import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"


export async function POST(req: NextRequest) {
    try {
        const { name, password } = await req.json()
        if (!name || !password) {
            return NextResponse.json({ message: "input tidak lengkap" }, { status: 500 })
        }

        const carmail = await prisma.user.findUnique({
            where: {
                name
            }
        })

        if (carmail) {
            return NextResponse.json({ message: "nama telah digunakan" }, { status: 403 })
        }

        const hashed = await bcrypt.hash(password, 10)
        await prisma.user.create({
            data: {
                name,
                password: hashed
            }
        })

        return NextResponse.json({ message: "berhasil registrasi" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }

}