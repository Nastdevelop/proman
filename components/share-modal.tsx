"use client"

import { useState } from "react"
import { X, Link, Check, Copy } from "lucide-react"

export default function ShareModal({
  projectTitle,
  shareUrl,
  onClose,
}: {
  projectTitle: string
  shareUrl: string
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

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
          <h2 className="text-lg font-semibold text-white">Bagikan Proyek</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-zinc-400 text-sm mb-4">
          Bagikan tautan ini ke klien untuk melihat progres <span className="text-zinc-200 font-medium">{projectTitle}</span> secara real-time.
        </p>

        <div className="mb-5">
          <label className="text-zinc-400 text-sm mb-1.5 block">Tautan Publik</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-3 text-sm text-zinc-300 truncate">
              {shareUrl}
            </div>
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {copied ? (
                <Check size={18} className="text-green-400" />
              ) : (
                <Copy size={18} className="text-zinc-400" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-zinc-800/50 rounded-lg p-3 flex items-start gap-3">
          <Link size={16} className="text-zinc-500 mt-0.5 shrink-0" />
          <p className="text-xs text-zinc-500 leading-relaxed">
            Klien dapat melihat progres tugas tanpa perlu login. Mereka tidak dapat menambah, mengubah, atau memindahkan tugas.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}
