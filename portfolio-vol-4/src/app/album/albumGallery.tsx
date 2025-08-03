import Link from "next/link";
import Image from "next/image";
import { albums } from "@/data/albums";

export default function HomePage() {
  return (
    <section className="text-white py-12 px-6 md:px-20 min-h-screen">
      <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
        Mine album
      </h2>
      <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/album/${album.id}`}
            className="relative flex flex-col text-white bg-neutral-900 shadow-md bg-clip-border rounded-xl w-96 hover:shadow-lg transition-shadow duration-300 group"
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
              <div className="flex items-center justify-between mb-2">
                <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-grayy-900">{album.title}</p>
                <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-grayy-900">{album.date}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
