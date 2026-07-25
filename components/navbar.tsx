"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
    const pathname = usePathname()

    return (
        <div className="flex justify-between right-0 left-0 fixed bg-black  px-10 border border-b-zinc-800">
            <div className="flex items-center ">
                <img src="logodr.png" alt="" className="w-15 h-15 rounded-full" />
            </div>

                {pathname === '/' ?
                <div className="text-zinc-300 flex items-center font-medium gap-5">
                <Link href={"/home"} className="hover:border-white border-zinc-300 border flex rounded-full px-3 py-1.5 text-sm"><span className="mb-0.5">Sign In</span></Link>
                <Link href={"/home"} className="text-sm px-3 py-1.5 bg-white items-center rounded-full flex text-black hover:bg-zinc-200"><span className="mb-0.5">Sign up</span></Link>
                </div> :
                <div className="text-zinc-300 flex items-center font-semibold gap-5">
                <Link href={"/home"} className="hover:text-white text-md">Home</Link>
                <Link href={"/home"} className="hover:text-white text-md">About</Link>
                <Link href={"/home"} className="hover:text-white text-md">Project</Link>
            </div>
                 }

        </div>
    )
}