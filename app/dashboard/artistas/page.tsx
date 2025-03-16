'use client';
import Link from "next/link"
import DataRow from "../../ui/components/dataRow";
import { Artist } from "@/app/ui/types";
import { NormalButton } from "../../ui/components/buttons";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ArtistasPage() {
    const [data, setData] = useState<[Artist]|null>(null);
    const [loading, setLoading] = useState(true);
    const {showNotification} = useNotification()
    const router = useRouter()
    const token = Cookies.get('auth_token');    
    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_API_URL+"candidates/get_candidates")
        .then((res) => res.json())
        .then((data) => {
            setData(data);
            setLoading(false);
        });
    }, []); 

    const handleEdit = (id: number) => {
        router.push("/dashboard/artistas/updateArtista/"+id)
    };

    const handleDelete = async (id: number) => {
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"candidates/delete_candidate?id="+id,
                {
                    method:"DELETE",
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })

            if (!response.ok){
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al borrar candidato');
                }
            
            router.push("/dashboard")
        }catch (err) {
            showNotification({message:err instanceof Error ? err.message : 'Error desconocido',type:"error"})
        } 
    };

    if (loading) return <div>Cargando...</div>;
    if (!data) return <div>Sin Artistas</div>;

    
    return (
        <main>
        <div className="p-4 flex flex-col px-40">
        <h2 className="text-2xl font-bold mb-4 text-center">
            Gestión de Artistas
        </h2>
        {data.map((artista) => (
            <DataRow
            key={artista.id}
            name={artista.name}
            onEdit={() => handleEdit(artista.id)}
            onDelete={() => handleDelete(artista.id)}
            />
        ))}
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