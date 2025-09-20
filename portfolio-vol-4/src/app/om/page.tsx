import Jobbverdi from "./jobbverdi";
import OmHero from "./omHero";
import Timeline from "./vertical-timeline";

export default function Om() {
    return (
        <div className="font-sans text-white bg-primary">
            <OmHero />
            <Jobbverdi />
            <Timeline />
        </div>
    )
}