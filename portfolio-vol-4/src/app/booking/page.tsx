import Link from 'next/link'
import Image from 'next/image'


export default function Booking() {
    return (
        <div className="w-screen min-h-screen p-6 flex justify-center items-center">
            <div className="grid lg:grid-cols-5 grid-cols-1 justify-center items-center">
                <div className="flex flex-col justify-center lg:col-span-2 items-center p-24 font-sans text-center gap-10">
                    <Image
                        src="/mainlogo.png"
                        alt="Booking Image"
                        width={200}
                        height={200}
                        className="rounded-lg shadow-lg object-cover"
                    />
                    <h1 className="text-3xl font-bold">Booking</h1>
                    <p className="text-md text-gray-400">For booking, foretrekkes det å kontakte meg gjennom Instagram, men er åpen til å bruke mail. Responstid gjennom mail er litt over 48 timer.</p>
                    <Link href="https://www.instagram.com/devm.media/" className="border-1 px-20 py-3 rounded-md hover:scale-105 duration-300 shadow-stone-800 shadow-none hover:shadow-2xl font-medium flex justify-center items-center gap-2 flex-row">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path fill="currentColor" fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd"/>
                        </svg>
                        Instagram
                    </Link>
                </div>
                <div className="lg:ml-8 lg:col-span-3 flex justify-center items-center">
                    <Image
                        src="https://i.imgur.com/NMWKltm.jpeg"
                        alt="Booking Image"
                        width={800}
                        height={800}
                        className="rounded-lg shadow-lg object-cover"
                        />
                </div>
            </div>
        </div>
    )
}