import { NormalButton } from "../ui/components/buttons";
import { lusitana } from '../ui/fonts';
import Link from 'next/link';
import Image from "next/image";

export default function CNUApp() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
                <div className="order-2 lg:order-1">
                    <Image
                        src="/animals-description.png"
                        alt="Descripción de CNU"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-xl shadow-2xl object-cover transition-all duration-300 hover:scale-[1.02]"
                        priority
                    />
                </div>
                
                <div className={`${lusitana.className} order-1 lg:order-2 p-8 bg-white bg-opacity-80 rounded-xl border border-gray-200 shadow-lg backdrop-blur-sm`}>
                    <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 text-center lg:text-left'>
                        CNU: Donde la Fauna se Convierte en <span className="text-blue-600">Estrella</span>
                    </h2>
                    <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                        <p>
                            Bienvenido al Consejo Nacional Único, el escenario digital donde los animales toman el micrófono, afinan sus instrumentos y compiten por el título de <span className="font-semibold text-blue-600">Mejor Artista Musical del Reino Animal</span>.
                        </p>
                        <p>
                            Desde el rugido gutural de <span className="italic text-gray-800">Axl León Roses</span> hasta el trino melódico de <span className="italic text-gray-800">Canario Bieber</span>, en CNU descubrirás talentos salvajes que rompen las barreras de lo convencional.
                        </p>
                        <p>
                            ¿Quién se llevará el premio al mejor artista? ¿Será el lobo <span className="italic text-gray-800">Casablancas</span> con su estilo indie, la rana <span className="italic text-gray-800">Aurelio Wonder</span> con su ritmo jazzero, o el elefante <span className="italic text-gray-800">Minaj</span> que arrasa en las listas de éxitos?
                        </p>
                        <p className="font-bold text-blue-700">
                            ¡Tú decides! Vota, comparte y celebra la diversión más animal del mundo digital.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto mb-20 mt-20">
                <h2 className={`${lusitana.className} text-4xl font-bold text-center mb-20 text-gray-800`}>

                    El Evento Más Salvaje del Año
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Tarjeta 1 */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-300">
                        <div className="relative h-52">
                            <Image
                                src="/evento-concierto.png"
                                alt="Concierto de animales"
                                fill
                                className="object-cover object-[center_10%]"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Gran Concierto Inaugural</h3>
                            <p className="text-gray-600">
                                Disfruta del espectáculo donde los artistas muestran sus talentos en vivo ante el jurado.
                            </p>
                        </div>
                    </div>

                    {/* Tarjeta 2 */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-300">
                        <div className="relative h-52">
                            <Image
                                src="/votacion-publico.png"
                                alt="Público votando"
                                fill
                                className="object-cover object-[center_30%]"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Tu Voto Decide</h3>
                            <p className="text-gray-600">
                                Cada voto cuenta para coronar al mejor artista. ¡Participa y gana premios!
                            </p>
                        </div>
                    </div>

                    {/* Tarjeta 3 */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-300">
                        <div className="relative h-52">
                            <Image
                                src="/ganador-pasado.png"
                                alt="Ganador del año pasado"
                                fill
                                className="object-cover object-[center_10%]"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Inspírate</h3>
                            <p className="text-gray-600">
                                El año pasado, <span className="font-medium">Lionel Feroci</span> ganó con su potente voz. ¿Quién será el próximo?
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-lg mb-16 relative overflow-hidden flex flex-col">

                <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-300 rounded-full opacity-30"></div>
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-700 rounded-full opacity-30"></div>

                
                <p className="text-lg text-gray-700 mb-6 relative z-10">
                    ¿Quieres registrar a tu artista favorito para las elecciones?
                </p>
                
                <div className="flex justify-end mt-auto">
                    <Link href="/inscripcion" className="relative z-10">
                        <NormalButton
                            text="Registrar Artista"
                            color="bg-blue-600"
                            hoverClass="hover:bg-blue-700"
                            extraClass="text-white py-3 px-6 rounded-lg shadow-md transition-transform hover:shadow-lg hover:scale-105 duration-300 font-bold"

                            type="button"
                        />
                    </Link>
                </div>
            </section>
            
            {/* Buttons */}
            <section className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-lg mb-16 relative overflow-hidden flex flex-col">
                <div className="absolute -right-5 -top-5 w-40 h-40 bg-green-600 rounded-full opacity-30"></div>
                <div className="absolute -left-5 -bottom-5 w-32 h-32 bg-green-800 rounded-full opacity-30"></div>

                <p className="text-center text-lg font-medium mb-2 text-gray-800">
                    ¡Tu voto hace la diferencia! 
                </p>
                <p className="text-center text-gray-600">
                    Elige a tu artista favorito y ayúdalo a llegar a la cima. ¡Cada voto cuenta!
                </p>

                <div className="flex justify-center mt-6">
                    <Link href="/votaciones">
                        <NormalButton
                            text="Votar Ahora"
                            color="bg-green-600"
                            hoverClass="hover:bg-green-700"
                            extraClass="text-white py-3 px-6 rounded-lg shadow-md transition-transform hover:shadow-lg hover:scale-105 duration-300 font-bold"
                            type="button"
                        />
                    </Link>
                </div>
            </section>

            <section className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-lg mb-16 relative overflow-hidden flex flex-col">
                <div className="absolute -right-2 -bottom-20 w-40 h-40 bg-red-300 rounded-full opacity-30"></div>
                <div className="absolute -left-2 -top-20 w-32 h-32 bg-orange-300 rounded-full opacity-30"></div>

                <p className="text-center text-lg font-medium mb-2 text-gray-800">
                    ¿Quién va ganando la competencia?
                </p>
                <p className="text-center text-gray-600">
                    Descubre en tiempo real qué artistas están liderando esta batalla musical. ¡No te quedes fuera!
                </p>

                <div className="flex justify-center mt-6">
                    <Link href="/resultados">    
                        <NormalButton
                            text="Ver Resultados en Vivo"
                            color="bg-red-600"
                            hoverClass="hover:bg-red-700"
                            extraClass="text-white py-3 px-6 rounded-lg shadow-md transition-transform hover:shadow-lg hover:scale-105 duration-300 font-bold"
                            type="button"
                        />
                    </Link>
                </div>
            </section>
        </main>
    );
}