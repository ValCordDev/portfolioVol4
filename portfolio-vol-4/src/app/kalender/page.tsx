import EventList from "./EventList";

export default function Page() {
  return (
    <main className="flex justify-center items-center w-screen pt-20">
      <EventList />
    </main>
  );
}



// // import CalendarApp from "./kalender";

// export default function KalenderPage() {
//   return (
//     <div className="w-full min-h-screen p-24 flex flex-col items-center justify-center text-white bg-primary font-sans">
//       <h1 className="text-4xl font-bold mb-8">WIP</h1>
//       <p className="italic">(Work in progess)</p>
//       {/* <CalendarApp /> */}
//     </div>
//   );
// }