'use client'
import Image from "next/image";
import { albums } from "@/data/albums";
import { motion } from "motion/react";

export default function HomePage() {
  return (
    <section className="text-white py-12 px-6 md:px-20 min-h-screen">
      <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
        Mine album
      </h2>
      <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2">
        {albums.map((album) => (
          <motion.a
            key={album.id}
            href={`/album/${album.id}`}
            className="relative flex flex-col text-white bg-neutral-900 shadow-md bg-clip-border rounded-xl w-96 hover:shadow-lg transition-shadow duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: album.idx * 0.2 }}
            viewport={{ once: true, amount: 0.43 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="relative mx-4 mt-4 overflow-hidden text-white bg-none bg-clip-border flex justify-center items-center rounded-xl h-96">
              <Image
                src={album.cover}
                alt={album.title}
                width={400}
                height={300}
                className="object-cover w-full h-full group-hover:scale-105 duration-300"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between flex-col mb-2">
                <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900 truncate">{album.title}</p>
                <p className="block font-sans text-sm antialiased font-medium leading-relaxed text-blue-gray-900 truncate italic text-gray-400">{album.date}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
