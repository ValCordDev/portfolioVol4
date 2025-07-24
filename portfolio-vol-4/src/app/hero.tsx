import Image from "next/image"

export default function Hero() {
    return (
        <main className="w-full min-h-[105vh] flex justify-center items-center lg:p-10 pt-40 px-10 lg:flex-row flex-col gap-10 text-center">
            <div className="flex-col flex gap-10">
                <h1 className="text-5xl font-bold">Halla, hei, hva skjer?</h1>
                <p className="text-wrap max-w-2xl font-medium text-lg text-gray-400">Hei! Jeg er Dev — en visuell kreatør med fokus på fotografi, grafisk design og unike digitale uttrykk. Jeg fanger øyeblikk og skaper sterke visuelle konsepter for både web og print.</p>
            </div>
            <div>
                <Image src="/pfp.webp" alt="pfp" className="grayscale rounded-2xl w-lg h-auto" width={640} height={640} />
            </div>
        </main>
    )
}