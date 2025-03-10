'use client';
import Link from "next/link"
import DataRow from "../../ui/components/dataRow";
import { NormalButton} from "../../ui/components/buttons";
import { useToken } from "@/components/token-provider";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

  
  export default function VotantesPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const {showNotification} = useNotification()
        const router = useRouter()
    
        useEffect(() => {
            fetch(process.env.NEXT_PUBLIC_API_URL+"candidates/get_candidates")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            });
        }, []); 
    const handleEdit = (id: number) => {
      console.log(`Modificar votante con ID: ${id}`);
    };
  
    const handleDelete = (id: number) => {
      console.log(`Eliminar votante con ID: ${id}`);
    };
  
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