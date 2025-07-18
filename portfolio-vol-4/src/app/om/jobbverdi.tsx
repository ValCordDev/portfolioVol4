export default function Jobbverdi() {

    const posts = [
        {
            id: 1,
            title: 'Kvalitet',
            description:
            'Min arbeidsflyt har alltid startet med å prioritere kvalitet over kvantitet; litt derfor jeg ikke legger ut altfor mye om gangen. ',
        },
        {
            id: 2,
            title: 'Minimalistisk',
            description: 'Jeg har alltid likt en mer minimalistisk form for stil, og har dermed filmet mye mer rolige men fremdeles engasjerende videoer',
        },
        {
            id: 3,
            title: 'Informativt',
            description:
            'Mine verk må alltid ha en mening; enten det handler om informasjon om bilen jeg har tatt bilde av, videoen jeg har redigert, eller liknende, så har alt hatt noe form for informasjon for å beskrive verket.',
        },
    ]

    return (
        <div className="w-full min-h-screen flex justify-center items-center lg:p-20 pt-40 px-10 flex-col gap-10 text-center">
            <a className="text-3xl flex flex-row gap-2 items-center duration-200 hover:font-medium w-fit hover:cursor-pointer">
                Mine jobbverdier driver alt jeg gjør
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </a>
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
                <article key={post.id} className="flex max-w-xl flex-col items-start justify-between bg-stone-900 shadow-2xl p-10 rounded-lg">
                    <div className="flex items-center gap-x-4 text-xs">
                        <p className="text-gray-400 text-xl font-bold">0{post.id}</p>
                    </div>
                    <div className="relative grow">
                        <h3 className="mt-3 text-2xl font-semibold text-white">
                            {post.title}
                        </h3>
                        <p className="mt-5 line-clamp-3 text-md text-gray-400">{post.description}</p>
                    </div>
                </article>
            ))}
            </div>
        </div>
    )
}