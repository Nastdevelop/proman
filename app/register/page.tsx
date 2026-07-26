"use client"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Register() {
    const router = useRouter()
    const [pw, setPw] = useState(false)
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    const handleRegister = async () => {
        const res = await fetch('/api/register', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password })
        })

        if (!res.ok) {
            alert("gagal registrasi")
            return
        }
        alert("Berhasil")
        router.push('/')
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="bg-zinc-900 w-full max-w-sm border border-zinc-800 rounded-2xl p-7">
                <h1 className="text-center text-2xl font-bold text-white mb-6">Register</h1>

                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-zinc-400 text-sm mb-1.5">Username</p>
                        <input
                            type="text"
                            placeholder="Masukkan username"
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div>
                        <p className="text-zinc-400 text-sm mb-1.5">Password</p>
                        <div className="relative">
                            <input
                                type={pw ? "text" : "password"}
                                placeholder="Masukkan password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 pl-3 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button
                                onClick={() => setPw((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                            >
                                {pw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleRegister}
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full mt-2 text-sm font-semibold py-2.5 rounded-lg transition-colors text-white"
                    >
                        Register
                    </button>
                </div>

                <hr className="my-5 border-zinc-800" />

                <p className="text-sm text-zinc-500 text-center">
                    Sudah memiliki akun?{" "}
                    <Link href="/login" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
