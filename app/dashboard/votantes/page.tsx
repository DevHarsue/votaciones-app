'use client';
import Link from "next/link";
import DataRow from "../../ui/components/dataRow";
import { NormalButton } from "../../ui/components/buttons";
import { useToken } from "@/components/token-provider";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

export default function VotantesPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const token = useToken();
    const { showNotification } = useNotification();
    const router = useRouter();

    useEffect(() => {
        // Obtener datos de la API
        fetch(process.env.NEXT_PUBLIC_API_URL + "voters/get_voters", {
            method: "GET",
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [token]);

    const handleEdit = (id: number) => {
        console.log(`Modificar votante con ID: ${id}`);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "voters/delete_voter?id=" + id, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al borrar votante');
            }

            router.push("/dashboard");
        } catch (err) {
            showNotification({ message: err instanceof Error ? err.message : 'Error desconocido', type: "error" });
        }
    };

    // Filtrar votantes por nombre
    const filteredData = data.filter((votante) =>
        votante.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Cargando...</div>; // Muestra un loader mientras se cargan los datos
    }

    return (
        <main>
            <div className="p-4 flex flex-col px-40">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Gestión de Votantes
                </h2>
                {/* Input de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar votante por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded-md"
                />
                {filteredData.map((votante) => (
                    <DataRow
                        key={votante.id}
                        name={votante.name}
                        onEdit={() => handleEdit(votante.id)}
                        onDelete={() => handleDelete(votante.id)}
                    />
                ))}
            </div>
            <Link href="/">
                <NormalButton
                    text='Volver a Inicio'
                    color='text-blue-600'
                    hoverClass='hover:text-blue-400'
                    extraClass='w-full py-2 px-4 rounded-md md:w-full transition-colors'
                    type='button'
                />
            </Link>
        </main>
    );
}