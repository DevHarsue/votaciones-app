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
        <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-screen-md">
            <div className="relative aspect-square">
                <Image
                    src={process.env.NEXT_PUBLIC_API_URL+artist.image_url}
                    alt={artist.name}
                    fill
                    className="object-cover"
                />
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-300 transition-colors"
                >
                    ✕
                </button>
            </div>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{artist.name}</h2>
                <p className="text-gray-700">{artist.starname}</p>
                    <div className="mt-4">
                        <button
                        onClick={onVote}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition-colors"
                        >
                        Votar por {artist.name}
                        </button>
                    </div>
            </div>
        </div>
    </div>
);
}