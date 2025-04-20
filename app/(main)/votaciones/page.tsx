'use client';

import { useState, useEffect } from 'react';
import ArtistCard from '../../ui/components/artistCard';
import ArtistModal from '../../ui/components/artistModal';
import { Artist } from '../../ui/types';
import { NormalButton } from '../../ui/components/buttons';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Spin from '@/app/ui/components/spin';
import { useNotification } from '@/context/NotificationContext';
import { generarPDF } from '@/app/pdf/pdf';
import { useUser } from '@/context/user-context';
export default function VotacionesPage() {

    const [data, setData] = useState<[Artist]|null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const token = Cookies.get('auth_token');
    const { showNotification } = useNotification();
    const router = useRouter();
    const { user }=useUser();

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
    };

    const handleCloseModal = () => {
        setTimeout(() => {
        setSelectedArtist(null); // Cierra el modal después de la animación
        }, 200); // Duración de la animación fade-out (200ms)
    };
    const handleVote = (artist: Artist) => {
        setVotedArtist(artist); // Guarda el artista votado
        setSelectedArtist(null); // Cierra el modal
    };

    const handleSendDataVoter = async () =>{
        
        if (loading){
            return
        }

        try {
            setLoading(true);
            const response_vote = await fetch(process.env.NEXT_PUBLIC_API_URL+"vote/create_vote/"+votedArtist?.id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response_vote.ok) {
                const response_vote_update = await fetch(process.env.NEXT_PUBLIC_API_URL+"vote/update_vote/"+votedArtist?.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response_vote_update.ok){
                    const message = await response_vote.json()
                    console.log(message)
                    showNotification({message: 'Error al Votar', type:"error"});
                    return
                }
            }
            
            if (user!=null && votedArtist!=null){

                const data = {
                    "artist":votedArtist,
                    "voter":user
                }
                generarPDF(data)
            }
            setLoading(false)
            
            showNotification({message: 'Voto Ejercido Correctamente', type:"success"});
            router.push("/resultados/")
    
            } catch (err) {
                showNotification({message: err instanceof Error ? err.message : 'Error desconocido', type:"error"});
            } finally {
                setLoading(false);
            }
    }

    if (error) {
        throw error; // Esto activará el error.tsx
    }

    if (loading) return <Spin />;
    if (!data) return <div>No se encontraron Artistas</div>;

    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-gray-100 p-8 flex flex-col items-center">
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
                    <h3 className="text-xl font-semibold mt-4">{votedArtist.starname}</h3>
                        <div className="mt-4">
                            <NormalButton
                                text="Confirmar voto"
                                color="bg-green-600"
                                hoverClass="hover:bg-green-500"
                                extraClass="w-full text-white"
                                onClick={handleSendDataVoter}
                            />
                        </div>
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