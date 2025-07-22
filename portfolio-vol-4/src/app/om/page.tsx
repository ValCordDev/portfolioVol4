import Jobbverdi from "./jobbverdi";
import OmHero from "./omHero";
import Timeline from "./vertical-timeline";

export default function Om() {
    return (
        <div className="font-sans">
            <OmHero />
            <Jobbverdi />
            <Timeline />
        </div>
    )
}