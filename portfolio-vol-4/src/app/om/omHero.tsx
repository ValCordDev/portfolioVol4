'use client'
import Image from "next/image";
import { motion } from "motion/react";

export default function OmHero() {
    return (
        <main>
            <div className="w-full min-h-[105vh] flex justify-center items-center lg:p-10 pt-40 px-10 lg:flex-row flex-col gap-10 text-center">
                <div className="flex-col flex gap-10">
                    <motion.h1 
                        className="text-5xl font-bold"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        Hvem er dette mon tro?
                    </motion.h1>
                    <motion.p 
                        className="text-wrap max-w-2xl font-medium text-lg text-gray-400"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        Jeg er Dev — en visuell kreatør som jobber med fotografi, grafisk design og digital historiefortelling. Jeg spesialiserer meg på å fange øyeblikk gjennom linsen og omforme ideer til sterke visuelle identiteter. Fra å skape inspirerende, uttrykksfull grafikk til å utvikle rene, designdrevne nettsider, kombinerer arbeidet mitt estetikk med hensikt. Jeg brenner for å utforske unike stiler og utfordre kreative grenser i alt jeg gjør.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    <Image src="https://i.imgur.com/NMWKltm.jpeg" alt="" className="grayscale rounded-2xl w-lg h-auto" width={640} height={640} />
                </motion.div>
            </div>
            
            <div className="w-full min-h-[80vh] flex justify-center items-center lg:p-10 pt-40 px-10 lg:flex-row flex-col gap-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    <Image src="/pfp.webp" alt="" className="grayscale rounded-2xl w-lg h-auto" width={640} height={640} />
                </motion.div>
                <div className="flex-col flex gap-10">
                    <motion.h1 
                        className="text-5xl font-bold"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true, amount: 0.5 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                            Hvordan starta interessen?
                        </motion.h1>
                    <motion.p 
                        className="text-wrap max-w-2xl font-medium text-lg text-gray-400"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true, amount: 0.5 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        Interessen startet i 9. klasse, der jeg ble tilbudt en jobb hos GROW Medielab som en innholdsprodusent, siden jeg presterte bra gjennom valgfag samme året. Der fikk jeg lært meg mye om kamerateknikk og utforming av bilder, samt fremmet medie som en mulighet for jobb.
                    </motion.p>
                    <motion.p 
                        className="text-wrap max-w-2xl font-medium text-lg text-gray-400 pb-20"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true, amount: 0.5 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        Videre i VGS fikk jeg utviklet egen kompetanse innenfor medieproduksjon, der jeg jobbet med streaming, utsnitt, høykvalitetsproduksjon, grafisk design o.l. som bygget opp interessen i fotografi, grafikk og video. En ny jobb hjalp også veldig, der jeg fikk utdypet meg i ulike måter å redigere på og har samtidig lært mye nytt.
                    </motion.p>
                </div>
            </div>
        </main>
    )
}