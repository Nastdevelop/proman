"use client"

export default function Modal({
    open,
    onClose,
    children,
}: {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div
                className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}
