export default function OmHero() {
    return (
        <main>
            <div className="w-full min-h-[105vh] flex justify-center items-center lg:p-10 pt-40 px-10 lg:flex-row flex-col gap-10 text-center">
                <div className="flex-col flex gap-10">
                    <h1 className="text-5xl font-bold">Hvem er dette mon tro?</h1>
                    <p className="text-wrap max-w-2xl font-medium text-lg text-gray-400">Jeg er Dev — en visuell kreatør som jobber med fotografi, grafisk design og digital historiefortelling. Jeg spesialiserer meg på å fange øyeblikk gjennom linsen og omforme ideer til sterke visuelle identiteter. Fra å skape inspirerende, uttrykksfull grafikk til å utvikle rene, designdrevne nettsider, kombinerer arbeidet mitt estetikk med hensikt. Jeg brenner for å utforske unike stiler og utfordre kreative grenser i alt jeg gjør.</p>
                </div>
                <div>
                    <img src="https://i.imgur.com/NMWKltm.jpeg" alt="" className="grayscale rounded-2xl w-lg h-auto" />
                </div>
            </div>
            
            <div className="w-full min-h-[80vh] flex justify-center items-center lg:p-10 pt-40 px-10 lg:flex-row flex-col gap-10 text-center">
                <div>
                    <img src="https://devm.vercel.app/_next/image?url=%2Fpfp.png&w=640&q=75" alt="" className="grayscale rounded-2xl w-lg h-auto" />
                </div>
                <div className="flex-col flex gap-10">
                    <h1 className="text-5xl font-bold">Hvordan starta interessen?</h1>
                    <p className="text-wrap max-w-2xl font-medium text-lg text-gray-400">Interessen startet i 9. klasse, der jeg ble tilbudt en jobb hos GROW Medielab som en innholdsprodusent, siden jeg presterte bra gjennom valgfag samme året. Der fikk jeg lært meg mye om kamerateknikk og utforming av bilder, samt fremmet medie som en mulighet for jobb.</p>
                    <p className="text-wrap max-w-2xl font-medium text-lg text-gray-400 pb-20">Videre i VGS fikk jeg utviklet egen kompetanse innenfor medieproduksjon, der jeg jobbet med streaming, utsnitt, høykvalitetsproduksjon, grafisk design o.l. som bygget opp interessen i fotografi, grafikk og video. En ny jobb hjalp også veldig, der jeg fikk utdypet meg i ulike måter å redigere på og har samtidig lært mye nytt.</p>
                </div>
            </div>
        </main>
    )
}