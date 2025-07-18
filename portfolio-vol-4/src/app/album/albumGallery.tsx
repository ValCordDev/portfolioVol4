import React from "react";

const albums = [
  {
    title: "Bilpleievelgernes Cars & Coffee",
    artist: "03. Mai, 2025",
    cover: "/album/BPV-C&C.jpg",
    href: "bpv",
  },
  {
    title: "Alfa Romeo Quadifoglio",
    artist: "14. April, 2025",
    cover: "/album/AlfaQuadifoglio.png",
    href: "alfa",
  },
  {
    title: "Ford Mustang Mach-E GT",
    artist: "13. Mars, 2025",
    cover: "/album/FordMachEGT_Poster.png",
    href: "mache",
  },
  {
    title: "byMEDHUS",
    artist: "11. Januar, 2025",
    cover: "/album/byMEDHUS.png",
    href: "byMEDHUS",
  },
];

export default function AlbumGallery() {
  return (
    <section className="text-white py-12 px-6 md:px-20 min-h-screen">
      <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
        Album Collection
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {albums.map((album, idx) => (
          <a
            key={idx}
            className="bg-neutral-900 rounded-sm shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
            href={album.href}
          >
            <img
              src={album.cover}
              alt={album.title}
              className="w-full h-70 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{album.title}</h3>
              <p className="text-sm text-gray-400">{album.artist}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
