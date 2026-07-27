"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
    const pathname = usePathname()

    return (
        <div className="flex justify-between right-0 left-0 fixed bg-black px-4 md:px-10 border-b border-zinc-800">
            <div className="flex items-center ">
                <img src="/logodr.png" alt="Proman" className="w-12 h-12 md:w-15 md:h-15 rounded-full" />
            </div>

                {pathname === '/' ?
                <div className="text-zinc-300 flex items-center font-medium gap-2 md:gap-5">
                <Link href={"/home"} className="hover:border-white border-zinc-300 border flex rounded-full px-2.5 md:px-3 py-1.5 text-xs md:text-sm whitespace-nowrap"><span className="mb-0.5">Sign In</span></Link>
                <Link href={"/home"} className="text-xs md:text-sm px-2.5 md:px-3 py-1.5 bg-white items-center rounded-full flex text-black hover:bg-zinc-200 whitespace-nowrap"><span className="mb-0.5">Sign up</span></Link>
                </div> :
                <div className="text-zinc-300 flex items-center font-semibold gap-2 md:gap-5">
                {/* <Link href={"/home"} className="hover:text-white text-sm md:text-base whitespace-nowrap">Home</Link>
                <Link href={"/home"} className="hover:text-white text-sm md:text-base whitespace-nowrap">About</Link>
                <Link href={"/home"} className="hover:text-white text-sm md:text-base whitespace-nowrap">Project</Link> */}
            </div>
                 }

        </div>
    )
}