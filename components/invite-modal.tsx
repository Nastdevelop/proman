"use client"

import { useState } from "react"
import { X, Send, Mail, Check } from "lucide-react"

export default function InviteModal({
  divisionName,
  onClose,
}: {
  divisionName: string
  onClose: () => void
}) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Undang Anggota</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-zinc-400 text-sm mb-4">
          Undang developer untuk bergabung ke divisi <span className="text-zinc-200 font-medium">{divisionName}</span>
        </p>

        {sent ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center">
              <Check size={24} className="text-green-400" />
            </div>
            <p className="text-green-400 text-sm font-medium">Undangan terkirim!</p>
            <p className="text-zinc-500 text-xs text-center">
              Email undangan telah dikirim ke <span className="text-zinc-300">{email}</span>
            </p>
          </div>
        ) : (
          <div className="mb-5">
            <label className="text-zinc-400 text-sm mb-1.5 block">Email Developer</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@email.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            {sent ? "Tutup" : "Batal"}
          </button>
          {!sent && (
            <button
              onClick={() => email.trim() && setSent(true)}
              disabled={!email.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send size={16} />
              Kirim
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
