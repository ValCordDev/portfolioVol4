import Footer from "../footer";
import Navbar from "../navbar";
import Jobbverdi from "./jobbverdi";
import OmHero from "./omHero";
import Timeline from "./vertical-timeline";

export default function Om() {
    return (
        <div className="font-sans">
            <Navbar />
            <OmHero />
            <Jobbverdi />
            <Timeline />
            <Footer />
        </div>
    )
}