'use client';

import { useState,useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NormalButton } from '../../ui/components/buttons';



export default function ResultadosPage() {
    const [artistsData, setArtistsData] = useState<any[]>([]);
    const [totalVotes, setTotalVotes] = useState(0)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            fetch(process.env.NEXT_PUBLIC_API_URL+"vote/get_votes")
            .then((res) => res.json())
            .then((data) => {
                setArtistsData(data.candidates);
                setTotalVotes(data.total_votes)
                setLoading(false);
            });
    }, []); 


    if (loading) return <div>Cargando...</div>;

    return (
        <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center ">
        <h1 className="text-3xl font-bold text-center mb-8">
            Resultados de las Votaciones
        </h1>
        <div className="w-full max-w-4xl">
            {artistsData.map((artist) => {
                console.log(artist)
            const percentage = ((artist.total_votes / totalVotes) * 100).toFixed(2); // Calcular el porcentaje

            return (
                <div
                key={artist.data_candidate.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4"
                >
                {/* Lado izquierdo: Imagen, nombre y votos */}
                <div className="flex items-center">
                    <div className="relative w-16 h-16 mr-4">
                    <Image
                        src={process.env.NEXT_PUBLIC_API_URL+artist.data_candidate.image_url}
                        alt={artist.data_candidate.name}
                        fill
                        className="object-cover rounded-lg"
                    />
                    </div>
                    <div>
                    <h2 className="text-xl font-bold">{artist.data_candidate.name}</h2>
                    <p className="text-gray-600">{artist.total_votes} votos</p>
                    </div>
                </div>

                {/* Lado derecho: Barra de progreso y porcentaje */}
                <div className="flex items-center w-1/2">
                    <div className="w-full bg-gray-200 rounded-full h-4 mr-4">
                    <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${percentage}%` }} // Ancho dinámico basado en el porcentaje
                    ></div>
                    </div>
                    <p className="text-gray-600">{percentage}%</p>
                </div>
                </div>
            );
            })}
        </div>
        {/* Botón: Volver a Inicio */}
        <div className='mt-5'>
                <Link href="/">
                    <NormalButton
                        text='Volver a Inicio'
                        color='text-blue-600'
                        hoverClass='hover:text-blue-400'
                        extraClass='w-full py-2 px-4 rounded-md md:w-full transition-colors'
                        type='button'
                    />
                </Link>
            </div>  
        </main>
    );
}