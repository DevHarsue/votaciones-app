import { Artist } from '../types';
import Image from 'next/image';

interface ArtistCardProps {
    artist: Artist;
    onClick: () => void;
}

export default function ArtistCard({ artist, onClick }: ArtistCardProps) {
    return (
        <div className="md:m-5 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
        onClick={onClick}>
            <div className="relative aspect-square">
                <Image
                    src={process.env.NEXT_PUBLIC_API_URL+artist.image_url}
                    alt={artist.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold text-center">{artist.starname}</h3>
            </div>
        </div>
    );
}