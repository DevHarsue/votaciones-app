import { NormalButton } from "./ui/components/buttons";

export default function CNUApp(){
    return (
        <main className="my-4 mx-4 lg:mx-auto lg:max-w-4xl">
            <section className="container mx-auto px-4 py-0">
                <div className="flex justify-center">
                    <img
                    src="/animals-description.png"
                    alt="Descripción de CNU"
                    className="w-full max-w-md h-auto rounded-lg shadow-lg"
                    />
                </div>
                
                <div className="mt-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
                        CNU: Donde la fauna se convierte en estrella.
                    </h2>
                    <p className="text-lg text-gray-700 text-center md:text-left leading-relaxed">
                    Bienvenido al Consejo Nacional Único, el escenario digital donde los animales toman el micrófono, afinan sus instrumentos y compiten por el título de <span className="font-semibold">Mejor Artista Musical del Reino Animal</span>. Desde el rugido gutural de <span className="italic">Axl León Roses</span> hasta el trino melódico de <span className="italic">Canario Bieber</span>, en CNU descubrirás talentos salvajes que rompen las barreras de lo convencional.
                    </p>
                    <p className="text-lg text-gray-700 text-center md:text-left leading-relaxed mt-4">
                    ¿Quién se llevará el premio al mejor artista? ¿Será el lobo <span className="italic">Casablancas</span> con su estilo indie, la rana <span className="italic">Aurelio Wonder</span> con su ritmo jazzero, o el elefante <span className="italic">Minaj</span> que arrasa en las listas de éxitos? ¡Tú decides! Vota, comparte y celebra la diversión más animal del mundo digital.
                    </p>
                </div>
            </section>
            
            <section className="bg-gray-200 p-6 rounded-lg border-2 border-gray-300 shadow-md my-20 mx-auto max-w-md md:max-w-lg lg:max-w-xl relative">
            <p className="text-start mb-8">
                ¿Quieres registrar a tu artista favorito para las elecciones? Presiona el siguiente botón.
            </p>
            <NormalButton text="Registrar" color="bg-custom-turquoise-400" colorHover="bg-custom-turquoise-600" extraClass="absolute right-4 bottom-4"/>
        </section>
            {/* Buttons Vote, Results */}
            <div className="flex flex-col items-center space-y-4 mt-20 mb-40">
                <NormalButton text="Votaciones" color="bg-green-500" colorHover="bg-green-600" extraClass="" />
                <NormalButton text="Ver Resultados" color="bg-yellow-500" colorHover="bg-yellow-600" extraClass=""/> 
            </div>
        </main>
    );
};