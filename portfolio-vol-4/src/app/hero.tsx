'use client'
import Image from "next/image"
import { motion } from "motion/react"

export default function Hero() {
    return (
        <main className="w-full min-h-[105vh] flex justify-center items-center lg:p-10 pt-40 px-10 lg:flex-row flex-col gap-10 text-center">
            <div className="flex-col flex gap-10">
                <motion.h1 
                    className="text-5xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                >
                    Halla, hei, hva skjer?
                </motion.h1>
                <motion.p 
                    className="text-wrap max-w-2xl font-medium text-lg text-gray-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                >
                    Hei! Jeg er Dev — en visuell kreatør med fokus på fotografi, grafisk design og unike digitale uttrykk. Jeg fanger øyeblikk og skaper sterke visuelle konsepter for både web og print.
                </motion.p>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
            >
                <Image src="/mainPagepic.jpg" alt="pfp" className="rounded-2xl w-lg h-auto" width={640} height={640} />
            </motion.div>
        </main>
    )
}