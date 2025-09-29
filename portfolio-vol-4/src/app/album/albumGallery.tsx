'use client'
import { albums } from "@/data/albums";
import { getAllAlbums } from "@/lib/albums";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import SafeImage from "@/components/SafeImage";
import { parseNorwegianDate } from "@/lib/dateUtils";

type AlbumType = {
  id: string;
  idx: number;
  title: string;
  date: string;
  cover: string;
  images: string[];
};

export default function HomePage() {
  const [allAlbums, setAllAlbums] = useState<AlbumType[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate URL-friendly slug from album title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const loadAllAlbums = async () => {
      try {
        // Start with local albums
        let combinedAlbums: AlbumType[] = [...albums];

        // Try to fetch Firebase albums and merge them
        try {
          const firebaseAlbums = await getAllAlbums();
          const firebaseConverted = firebaseAlbums.map(album => ({
            id: generateSlug(album.title),
            idx: album.idx,
            title: album.title,
            date: album.date,
            cover: album.cover,
            images: album.images
          }));

          // Merge albums, giving priority to Firebase albums if they have the same title
          const firebaseTitles = new Set(firebaseConverted.map(album => album.title));
          const localFiltered = combinedAlbums.filter(album => !firebaseTitles.has(album.title));
          combinedAlbums = [...firebaseConverted, ...localFiltered];
        } catch {
          console.log('Firebase albums not available, using local albums only');
        }

        // Sort by date (newest first)
        combinedAlbums.sort((a, b) => {
          const dateA = parseNorwegianDate(a.date);
          const dateB = parseNorwegianDate(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        setAllAlbums(combinedAlbums);
      } catch (error) {
        console.error('Error loading albums:', error);
        setAllAlbums(albums);
      } finally {
        setLoading(false);
      }
    };

    loadAllAlbums();
  }, []);
  if (loading) {
    return (
      <section className="text-white py-12 px-6 md:px-20 min-h-screen">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
          Mine album
        </h2>
        <div className="flex justify-center items-center">
          <div className="text-gray-400">Loading albums...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="text-white py-12 px-6 md:px-20 min-h-screen">
      <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
        Mine album
      </h2>
      <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2">
        {allAlbums.map((album, index) => (
          <motion.a
            key={`${album.id}-${index}`}
            href={`/album/${album.id}`}
            className="relative flex flex-col text-white bg-neutral-900 shadow-md bg-clip-border rounded-xl w-96 hover:shadow-lg transition-shadow duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.02 }}
            viewport={{ once: true, amount: 0.43 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="relative mx-4 mt-4 overflow-hidden text-white bg-none bg-clip-border flex justify-center items-center rounded-xl h-96">
              <SafeImage
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
