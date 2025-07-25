'use client';

import { getAlbumById } from "@/data/albums";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AlbumPage() {
  const params = useParams();
  const album = getAlbumById(params.albumId as string);
  if (!params.albumId || !album) {
    notFound();
  }
  if (!album.images || album.images.length === 0) {
    return <p className="text-gray-400">Ingen bilder tilgjengelig for dette albumet.</p>;
  }
  return (
    <main className="text-white py-24 px-6 md:px-20 min-h-screen w-full flex justify-center items-center flex-col">
      <Link
        className="text-lg flex flex-row gap-2 items-center duration-200 hover:scale-105"
        href="/album"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 rotate-180"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
        Tilbake til album
      </Link>
      <h1 className="text-3xl md:text-5xl font-bold my-3">{album.title}</h1>
      <p className="text-gray-400 mb-8">{album.date}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {album.images.map((src, idx) => (
          <Image
            key={idx}
            src={src}
            alt={`${album.title} image ${idx + 1}`}
            width={800}
            height={600}
            className="w-full h-auto rounded-lg shadow"
          />
        ))}
      </div>
    </main>
  );
}