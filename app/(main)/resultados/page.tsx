'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NormalButton } from '../../ui/components/buttons';

const artists = [
  {
    id: 1,
    name: 'Axl Aguila Roses',
    image: '/artistas/aguila.jpg',
    description: 'El rey del rock animal con una visión perfecta.',
    votes: 120,
  },
  {
    id: 2,
    name: 'Lobo Dylan',
    image: '/artistas/lobo.jpg',
    description: 'El artista más melódico del reino animal.',
    votes: 80,
  },
  {
    id: 3,
    name: 'Coco Perry',
    image: '/artistas/cocodrilo.jpg',
    description: 'Nuestra Popera animal favorita con un flow impresionante.',
    votes: 200,
  },
  {
    id: 4,
    name: 'Faro Swift',
    image: '/artistas/faro.jpg',
    description: 'La lider del movimiento Swiftie princesa del pop.',
    votes: 150,
  },
  {
    id: 5,
    name: 'Oso Jackson',
    image: '/artistas/oso.jpg',
    description: 'El rey del pop y de la hibernación.',
    votes: 90,
  },
  {
    id: 6,
    name: 'XxPanteraxX',
    image: '/artistas/pantera.jpg',
    description: 'El rapero más melancólico y oscuro, cazador de tristezas.',
    votes: 60,
  },
];

export default function ResultadosPage() {
  const [artistsData, setArtistsData] = useState(artists);

  // Calcular el total de votos
  const totalVotes = artistsData.reduce((sum, artist) => sum + artist.votes, 0);

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center ">
      <h1 className="text-3xl font-bold text-center mb-8">
        Resultados de las Votaciones
      </h1>
      <div className="w-full max-w-4xl">
        {artistsData.map((artist) => {
          const percentage = ((artist.votes / totalVotes) * 100).toFixed(2); // Calcular el porcentaje

          return (
            <div
              key={artist.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4"
            >
              {/* Lado izquierdo: Imagen, nombre y votos */}
              <div className="flex items-center">
                <div className="relative w-16 h-16 mr-4">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{artist.name}</h2>
                  <p className="text-gray-600">{artist.votes} votos</p>
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