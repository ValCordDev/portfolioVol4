export default function NyligArbeid() {
    return (
        <div className="w-full min-h-screen p-8 md:p-20 gap-5 md:gap-20 flex justify-center items-center flex-col">
            <a 
            className="text-2xl flex flex-row gap-2 items-center duration-200 hover:font-medium w-fit"
            href="#"
            >
                Nylig arbeid
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </a>

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
                <a className="relative hover:scale-100 scale-95 duration-200" href="#">
                    <img src="https://i.imgur.com/eC2VtMb.jpeg" alt="" className=" aspect-square object-cover grayscale w-lg bg-black opacity-40 rounded-md"/>
                    <p className="text-xl text-white absolute left-5 bottom-5 font-semibold shadow-2xl">Bilpleievelgernes Cars & Coffee</p>
                    <p className="text-sm text-stone-400 absolute left-5 bottom-12 font-semibold shadow-2xl">03.05.2025</p>
                </a>
                <a className="relative hover:scale-100 scale-95 duration-200" href="#">
                    <img src="https://i.imgur.com/8VGLxri.jpeg" alt="" className=" aspect-square object-cover grayscale w-lg bg-black opacity-40 rounded-md"/>
                    <p className="text-xl text-white absolute left-5 bottom-5 font-semibold shadow-2xl">Alfa Romeo Quadifoglio Photoshoot</p>
                    <p className="text-sm text-stone-400 absolute left-5 bottom-12 font-semibold shadow-2xl">14.04.2025</p>
                </a>
            </div>
        </div>
    )
}