'use client';
import Link from "next/link";
import DataRow from "../../ui/components/dataRow";
import { NormalButton } from "../../ui/components/buttons";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

export default function ArtistasPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
    const { showNotification } = useNotification();
    const router = useRouter();

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_API_URL + "candidates/get_candidates")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            });
    }, []);

    const handleEdit = (id: number) => {
        console.log(`Modificar Candidato con ID: ${id}`);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "candidates/delete_candidate?id=" + id, {
                method: "DELETE",
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al borrar candidato');
            }

            router.push("/dashboard");
        } catch (err) {
            showNotification({ message: err instanceof Error ? err.message : 'Error desconocido', type: "error" });
        }
    };

    // Filtrar artistas por nombre
    const filteredData = data.filter((artista) =>
        artista.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Cargando...</div>;

    return (
        <main>
            <div className="p-4 flex flex-col px-40">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Gestión de Candidatos
                </h2>
                {/* Input de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar Candidato por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded-md"
                />
                {filteredData.map((artista) => (
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
