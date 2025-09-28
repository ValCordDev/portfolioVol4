'use client';

import { getAlbumById, albums as localAlbums } from "@/data/albums";
import { getAllAlbums } from "@/lib/albums";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import SafeImage from "@/components/SafeImage";

type Album = {
  id?: string;
  idx: number;
  title: string;
  date: string;
  cover: string;
  images: string[];
  description?: string;
  client?: string;
  location?: string;
  category?: string;
  featured?: boolean;
};

export default function AlbumPage() {
  const params = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate slug from title for comparison
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const loadAlbum = async () => {
      if (!params.albumId) {
        setLoading(false);
        return;
      }

      const albumId = params.albumId as string;

      // First try to find in local albums by direct ID match
      let foundAlbum: Album | null = getAlbumById(albumId);
      
      if (!foundAlbum) {
        // Try to find by slug matching in local albums
        const localMatch = localAlbums.find(album => generateSlug(album.title) === albumId);
        if (localMatch) {
          foundAlbum = localMatch;
        }
      }

      if (!foundAlbum) {
        // If not found locally, try Firebase albums
        try {
          const firebaseAlbums = await getAllAlbums();
          const firebaseMatch = firebaseAlbums.find(album => 
            generateSlug(album.title) === albumId || 
            album.id === albumId
          );
          if (firebaseMatch) {
            // Convert Firebase album to local album format
            foundAlbum = {
              id: firebaseMatch.id || generateSlug(firebaseMatch.title),
              idx: firebaseMatch.idx,
              title: firebaseMatch.title,
              date: firebaseMatch.date,
              cover: firebaseMatch.cover,
              images: firebaseMatch.images,
              description: firebaseMatch.description
            };
          }
        } catch (error) {
          console.error('Failed to load Firebase albums:', error);
        }
      }

      setAlbum(foundAlbum);
      setLoading(false);
    };

    loadAlbum();
  }, [params.albumId]);

  if (loading) {
    return (
      <main className="text-white py-24 px-6 md:px-20 min-h-screen w-full flex items-center justify-center">
        <div className="text-gray-400">Loading album...</div>
      </main>
    );
  }

  if (!params.albumId || !album) {
    notFound();
  }
  if (!album.images || album.images.length === 0) {
    return <p className="text-gray-400">Ingen bilder tilgjengelig for dette albumet.</p>;
  }
  return (
    <main className="text-white py-24 px-6 md:px-20 min-h-screen w-full flex items-center flex-col">
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
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <SafeImage
              src={src}
              alt={`Bilde ${idx + 1} fra ${album.title}`}
              width={800}
              height={600}
              className="rounded-lg shadow-lg"
            />
          </motion.div>
        ))}
      </div>
    </main>
  );
}