import Link from "next/link";
import Image from "next/image";
import { albums } from "@/data/albums";

export default function HomePage() {
  return (
    <section className="text-white py-12 px-6 md:px-20 min-h-screen">
      <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
        Mine album
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/album/${album.id}`}
            className="bg-neutral-900 rounded shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <Image
              src={album.cover}
              alt={album.title}
              width={400}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{album.title}</h3>
              <p className="text-sm text-gray-400">{album.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
