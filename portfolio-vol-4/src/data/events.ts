// src/data/events.ts
export type Event = {
  date: string;   // ISO string: "2025-10-03T10:00:00"
  title: string;
  company?: string;
  logo?: string;  // optional logo path in /public/logos
};

export const events: Event[] = [
  { date: "2024-09-14T09:00:00", title: "Art, Cars & Coffee", company: "Dogyard" },
  { date: "2024-09-20T13:00:00", title: "BMW 320CI" },
  { date: "2024-11-23T11:00:00", title: "BMW 316D Low-light shots", company: "@saase10" },
  { date: "2024-11-23T15:00:00", title: "Dogyard Biltreff", company: "Dogyard" },
  { date: "2024-12-03T15:00:00", title: "Porsche Center, Oslo", company: "Porsche" },
  { date: "2025-01-11T15:00:00", title: "Porsche Center, Billingstad roadtrip shoot", company: "Porsche" },
  { date: "2025-01-11T15:00:00", title: "XPND Automotive roadtrip shoot", company: "XPND" },
  { date: "2025-01-11T15:00:00", title: "byMEDHUS roadtrip shoot", company: "byMEDHUS" },
  { date: "2025-01-12T15:00:00", title: "Ford Mustang Mach-E GT - LS shoot" },
  { date: "2025-03-13T15:00:00", title: "Ford Mustang Mach-E GT" },
  { date: "2025-04-14T15:00:00", title: "Alfa Romeo Quadrifoglio", company: "@bjorninsen" },
  { date: "2025-05-03T15:00:00", title: "Bilpleievelgernes Cars & Coffee", company: "Bilpleievelgeren" },
  { date: "2025-08-01T15:00:00", title: "BMW 316D - Revamped shoot", company: "@saase10" },

  { date: "2025-10-08T15:00:00", title: "BMW 116I shoot", company: "@talexandro__" },
];
