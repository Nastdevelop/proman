import { NextRequest, NextResponse } from "next/server"
import { verifyToken, TokenPayload } from "./auth"

export async function getUser(req: NextRequest): Promise<TokenPayload | null> {
  const auth = req.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return null
  return verifyToken(auth.slice(7))
}

export function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
}
