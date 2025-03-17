'use client';

import { useState, useEffect } from 'react';
import ArtistCard from '../../ui/components/artistCard';
import ArtistModal from '../../ui/components/artistModal';
import { Artist } from '../../ui/types';
import { NormalButton } from '../../ui/components/buttons';
import Image from 'next/image';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import Spin from '@/app/ui/components/spin';

export default function VotacionesPage() {

    const [data, setData] = useState<[Artist]|null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
            fetch(process.env.NEXT_PUBLIC_API_URL+"candidates/get_candidates")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            }).catch(error=>{
                console.error(error);
                setError(error); // Guarda el error en el estado
                throw "Error de Peticion"
            });
    }, []); 

    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [votedArtist, setVotedArtist] = useState<Artist | null>(null);
    const [isModalClosing, setIsModalClosing] = useState(false); // Estado para controlar el cierre del modal

useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + 'candidates/get_candidates')
    .then((res) => res.json())
    .then((data) => {
        setData(data);
        setLoading(false);
});
}, []);

const handleArtistClick = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsModalClosing(false); // Reinicia el estado de cierre
};

const handleCloseModal = () => {
    setIsModalClosing(true); // Activa la animación de cierre
    setTimeout(() => {
      setSelectedArtist(null); // Cierra el modal después de la animación
    }, 200); // Duración de la animación fade-out (200ms)
};


    // const router = useRouter()

    if (error) {
        throw error; // Esto activará el error.tsx
    }

    if (loading) return <Spin />;
    if (!data) return <div>No se encontraron Artistas</div>;

    return (
        <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-center mb-8">Vota Por Tu Artista Favorito</h1>
            {data.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 max-w-3xl w-full">
                {data.map((artist) => (
                <ArtistCard
                    key={artist.id}
                    artist={artist}
                    onClick={() => handleArtistClick(artist)}
                />
                ))}
            </div>) :
            (<div>
                <h4>No Hay Artistas Registrados</h4>
            </div>)}
            {selectedArtist && (
                <ArtistModal
                artist={selectedArtist}
                onClose={handleCloseModal}
                onVote={() => handleVote(selectedArtist)}
                />
                </div>
            </Link>
            </div>
        )}
        <div className="mt-3">
            <Link href="/">
            <NormalButton
                text="Volver a Inicio"
                color="text-blue-600"
                hoverClass="hover:text-blue-400"
                extraClass="w-full py-2 px-4 rounded-md md:w-full transition-colors"
                type="button"
            />
            </Link>
        </div>
    </main>
  );
}