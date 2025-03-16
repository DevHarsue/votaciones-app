'use client'; // Necesario para manejar estados y eventos en Next.js

import { useState , useEffect} from 'react';
import ArtistCard from '../../ui/components/artistCard';
import ArtistModal from '../../ui/components/artistModal';
import { Artist } from '../../ui/types';
import { NormalButton } from '../../ui/components/buttons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Spin from '@/app/ui/components/spin';


export default function VotacionesPage() {

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_API_URL+"candidates/get_candidates")
        .then((res) => res.json())
        .then((data) => {
            setData(data);
            setLoading(false);
        });
    }, []); 

    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    
    const [votedArtist, setVotedArtist] = useState<Artist | null>(null); // Estado para el artista votado

    const handleArtistClick = (artist: Artist) => {
        setSelectedArtist(artist);
    };

    const handleCloseModal = () => {
        setSelectedArtist(null);
    };

    const handleVote = (artist: Artist) => {
        setVotedArtist(artist); // Guarda el artista votado
        setSelectedArtist(null); // Cierra el modal
    };

    const router = useRouter()


    if (loading) return <Spin />;

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
            )}

            {/* Div para mostrar el artista votado */}
            {votedArtist && (
                <div className="mt-8 p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">Has votado por:</h2>
                    <div className="relative aspect-square w-32">
                        <Image
                            src={process.env.NEXT_PUBLIC_API_URL+votedArtist.image_url}
                            alt={votedArtist.name}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                    <h3 className="text-xl font-semibold mt-4">{votedArtist.name}</h3>
                    <Link href={"/confirmarVoto/"+votedArtist.id}>
                        <div className="mt-4">
                            <NormalButton
                                text="Confirmar voto"
                                color="bg-green-600"
                                hoverClass="hover:bg-green-500"
                                extraClass="w-full text-white"
                            />
                        </div>
                    </Link>
                </div>
            )}
            <div className='mt-3'>
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