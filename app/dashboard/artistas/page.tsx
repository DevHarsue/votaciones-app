'use client';
import Link from "next/link";
import DataRow from "../../ui/components/dataRow";
import { Artist } from "@/app/ui/types";
import { NormalButton } from "../../ui/components/buttons";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Spin from "@/app/ui/components/spin";
import { useUser } from "@/context/user-context";

export default function ArtistasPage() {
    const [data, setData] = useState<[Artist]|null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
    const { showNotification } = useNotification();
    const router = useRouter();
    const token = Cookies.get('auth_token');    
    const {user} = useUser()

    useEffect(() => {
        setLoading(true)
        if (user!=null){
            fetch(
                process.env.NEXT_PUBLIC_API_URL + (user?.rol=="ADMIN" ? "candidates/get_candidates" : "candidates/get_candidates_self"),
                {
                    method:"GET",
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then((res) => res.json())
                .then((data) => {
                    setData(data);
                    setLoading(false);
            });
        }
    }, [user,token]);

    const handleEdit = (id: number) => {
        router.push("/dashboard/artistas/updateArtista/"+id)
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Desea Eliminar el Artista?")){
            return
        }
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"candidates/delete_candidate/"+id,
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
            
            showNotification({message:'Candidato Eliminado Correctamente',type:"success"})
            window.location.reload()
        }catch (err) {
            showNotification({message:err instanceof Error ? err.message : 'Error desconocido',type:"error"})
        } finally{
            setLoading(false)
        }
    };

    if (loading) return <Spin />;
    if (!data) return <div>Sin Artistas</div>;
    
    // Filtrar artistas por nombre
    const filteredData = data.filter((artista) =>
        artista.starname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <main className="bg-gradient-to-b from-green-50 to-gray-100">
            <div className="p-4 flex flex-col px-40">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Gestión de Artistas
                </h2>
                {/* Input de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar artista por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded-md"
                />
                {filteredData.map((artista) => (
                    <DataRow
                        key={artista.id}
                        name={artista.starname}
                        image={artista.image_url}
                        onEdit={() => handleEdit(artista.id)}
                        onDelete={() => handleDelete(artista.id)}
                    />
                ))}
            </div>
            {/* Botón: Volver a Inicio */}
            <div className="mt-5 text-center">
                <Link href="/dashboard">
                    <NormalButton
                        text='Volver a Inicio'
                        color='bg-blue-100 text-blue-600'
                        hoverClass='hover:bg-blue-200'
                        extraClass='w-full sm:w-auto py-2 px-4 rounded-md transition-colors'
                        type='button'
                    />
                </Link>
            </div>
        </main>
    );
}
