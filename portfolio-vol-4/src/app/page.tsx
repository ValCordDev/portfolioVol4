import Hero from "./hero";
import NyligArbeid from "./nyligArbeid";
import Stats from "./stats";

export default function Home() {
  return (
    <div className="font-sans text-white bg-primary">
      <Hero />
      <Stats />
      <NyligArbeid />
    </div>
  );
}
