import { NormalButton } from "../ui/components/buttons";
import { lusitana } from '../ui/fonts';
import Link from 'next/link';
import Image from "next/image";

export default function CNUApp(){
    return (
        <main className="my-10 mx-4 lg:mx-auto lg:min-w-4xl">
            <section className="flex flex-col md:flex-row mx-auto px-8 py-10 w-4xl pb-40">
                <div className="h-full md:w-min-1/4">
                    <Image
                    src="/animals-description.png"
                    alt="Descripción de CNU"
                    width="600"
                    height="400"
                    className="w-full h-full rounded-lg shadow-lg items-center"
                    />
                </div>
                
                <div className={`${lusitana.className} pt-5 px-10 md:w-1/2 md:pt-20 text-center bg-gray-500 bg-opacity-20 p-6 rounded-lg border-2 border-gray-300 border-opacity-30 shadow-lg`}>
                    <h2 className='text-3xl md:text-5xl font-bold text-gray-800 mb-2  md:text-left shadow-sm'>
                        CNU: Donde la Fauna se Convierte en Estrella
                    </h2>
                    <p className="text-gray-700 text-lg text-center md:text-left leading-relaxed mt-8 mb-2 ">
                    Bienvenido al Consejo Nacional Único, el escenario digital donde los animales toman el micrófono, afinan sus instrumentos y compiten por el título de <span className="font-semibold">Mejor Artista Musical del Reino Animal</span>. Desde el rugido gutural de <span className="italic">Axl León Roses</span> hasta el trino melódico de <span className="italic">Canario Bieber</span>, en CNU descubrirás talentos salvajes que rompen las barreras de lo convencional.
                    </p>
                    <p className="text-lg  text-gray-700 text-center md:text-left leading-relaxed mt-4 ">
                    ¿Quién se llevará el premio al mejor artista? ¿Será el lobo <span className="italic">Casablancas</span> con su estilo indie, la rana <span className="italic">Aurelio Wonder</span> con su ritmo jazzero, o el elefante <span className="italic">Minaj</span> que arrasa en las listas de éxitos? ¡Tú decides! Vota, comparte y celebra la diversión más animal del mundo digital.
                    </p>
                </div>
            </section>
            
            <section className="bg-gray-200 p-6 rounded-lg border-2 border-gray-300 shadow-md my-20 mx-auto max-w-md md:max-w-lg lg:max-w-xl relative">
            <p className="text-start mb-8">
                ¿Quieres registrar a tu artista favorito para las elecciones? Presiona el siguiente botón.
            </p>
            <div>
            <Link href="/inscripcion">
                <NormalButton
                    text="Registrar"
                    color="bg-blue-600"
                    hoverClass="hover:bg-blue-500"
                    extraClass="text-white rounded-lg absolute right-4 bottom-4"
                    type="button"
                />
            </Link>
            </div>               
        </section>
            {/* Buttons Vote, Results */}
        <div className="flex flex-col items-center space-y-6 mt-20 mb-20">
            <Link href="/votaciones">
                <NormalButton
                    text="Votar"
                    color="bg-custom-green-400"
                    hoverClass="hover:bg-custom-green-500"
                    extraClass="text-white py-2 px-4 rounded-lg transition-colors"
                    type="button"
                />
            </Link>    
            <Link href="/resultados">    
                <NormalButton
                    text="Ver Resultados"
                    color="bg-red-700"
                    hoverClass="hover:bg-red-500"
                    extraClass="text-white py-2 px-4 rounded-lg transition-colors"
                    type="button"
                />
            </Link>
        </div>
        </main>
    );
};