'use client';
import Link from "next/link"
import DataRow from "../../ui/components/dataRow";
import { NormalButton} from "../../ui/components/buttons";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Votantes {
    id: number
    name: string
    lastname: string
    starname: string
    gender: string
    image_url: string
}



export default function VotantesPage() {
    const [data, setData] = useState<[Votantes] | null>(null);
    const [loading, setLoading] = useState(true);

    const {showNotification} = useNotification()
    const router = useRouter()
    const token = Cookies.get('auth_token');

    
    useEffect(() => {
        if (!token) return;
        fetch(process.env.NEXT_PUBLIC_API_URL+"voters/get_voters",{
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
    }, [token]); 
    
    const handleEdit = (id: number) => {
        console.log(`Modificar votante con ID: ${id}`);
    };

    const handleDelete = async (id: number) => {
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"voters/delete_voter?id="+id,
                {
                    method:"DELETE",
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })

            if (!response.ok){
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al borrar votante');
                }
            
            router.push("/dashboard")
        }catch (err) {
            showNotification({message:err instanceof Error ? err.message : 'Error desconocido',type:"error"})
        } 
    };

    if (loading) return <div>Cargando...</div>;
    if (!data) return <div>No se encontraron Votantes</div>

    return (
    <main>
      <div className="p-4 flex flex-col px-40">
        <h2 className="text-2xl font-bold mb-4 text-center">
            Gestión de Votantes
        </h2>
        {data.map((votante) => (
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