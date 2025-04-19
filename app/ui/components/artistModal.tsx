import { Artist } from '../types';
import Image from 'next/image';

interface ArtistModalProps {
    artist: Artist;
    onClose: () => void;
    onVote: () => void;
}

export default function ArtistModal({ artist, onClose, onVote }: ArtistModalProps) {
    return (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl  md:w-auto animate-fade-in p-2">
                <div className="relative aspect-square">
                    <Image
                        src={process.env.NEXT_PUBLIC_API_URL+artist.image_url}
                        alt={artist.starname}
                        fill
                        className="object-cover"
                    />
                    <button
                        onClick={onClose}
                        className="bg-red-200 absolute top-2 right-2 rounded-full p-2 shadow-md hover:bg-red-300 transition-colors"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">{artist.starname}</h2>
                    <p className="text-gray-700">Nombre: {artist.name}</p>
                    <p className='text-gray-700'>Apellido: {artist.lastname}</p>
                    <p className='text-gray-700'>Género: {artist.gender}</p>
                        <div className="mt-4">
                            <button
                                onClick={onVote}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition-colors"
                            >
                                Votar por {artist.starname}
                            </button>
                        </div>
                </div>
            </div>
        </div>
    );
}