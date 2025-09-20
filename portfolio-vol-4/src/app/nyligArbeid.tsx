'use client'
import Image from "next/image";
import { motion } from "motion/react";


const nylig_arbeid = [
    {
        id: 1,
        title: "Bilpleievelgernes Cars & Coffee",
        date: "03.05.2025",
        imageUrl: "https://i.imgur.com/eC2VtMb.jpeg",
        link: "bpv"
    },
    {
        id: 2,
        title: "Alfa Romeo Quadifoglio Photoshoot",
        date: "14.04.2025",
        imageUrl: "https://i.imgur.com/8VGLxri.jpeg",
        link: "alfa"
    }
]

export default function NyligArbeid() {
    return (
        <div className="w-full min-h-screen p-8 md:p-20 gap-5 md:gap-20 flex justify-center items-center flex-col">
            <motion.a
                className="text-2xl flex flex-row gap-2 items-center duration-200 hover:font-medium w-fit"
                href="album"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true, amount: 0.5 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
            >
                Nylig arbeid
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </motion.a>

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
                {nylig_arbeid.map((arbeid) => (
                    <motion.a 
                        className="relative scale-95 hover:scale-100 duration-200" 
                        href={arbeid.link}
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: arbeid.id * 0.1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        key={arbeid.id}
                    >
                        <Image src={arbeid.imageUrl} alt="" className="aspect-square object-cover grayscale w-lg bg-black opacity-40 rounded-md" width={640} height={640}/>
                        <p className="text-xl text-white absolute left-5 bottom-5 font-semibold shadow-2xl truncate max-w-[90%] overflow-hidden whitespace-nowrap">{arbeid.title}</p>
                        <p className="text-sm text-stone-400 absolute left-5 bottom-12 font-semibold shadow-2xl">{arbeid.date}</p>
                    </motion.a>
                ))}
            </div>
        </div>
    )
}