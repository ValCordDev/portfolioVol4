import Navbar from "@/app/navbar";
import Hero from "./hero";
import NyligArbeid from "./nyligArbeid";
import Footer from "./footer";

export default function Home() {
  return (
    <div className="font-sans">
      <Hero />
      <NyligArbeid />
    </div>
  );
}
