"use client"

import { animate, motion, useMotionValue, useTransform, useInView } from "motion/react"
import { useEffect, useRef } from "react"


function Counter({ to, duration }: { to: number; duration: number }) {
    const count = useMotionValue(0)
    const rounded = useTransform(count, latest => Math.round(latest))

    const ref = useRef<HTMLPreElement>(null)
    const isInView = useInView(ref, { once: true, amount: 0.5 })

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, to, { duration })
            return () => controls.stop()
        }
    }, [isInView, count, to, duration])

    return (
        <motion.pre ref={ref} className="text-5xl font-bold">
            {rounded}
        </motion.pre>
    )
}

export function Erfaring() {
    return <Counter to={4} duration={1} />
}

export function Oppdrag() {
    return <Counter to={20} duration={1.5} />
}

export default function Stats() {
    return (
        <section className="w-full py-12 flex sm:flex-row justify-center items-center sm:gap-80 gap-10 flex-col">
            <motion.div 
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.5 }}
            >
                <Erfaring />
                <p className="text-lg font-medium">Års erfaring</p>
            </motion.div>
            <motion.div 
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.5 }}
            >
                <Oppdrag />
                <p className="text-lg font-medium">Fullførte oppdrag</p>
            </motion.div>
        </section>
    )
}