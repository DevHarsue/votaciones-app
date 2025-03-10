'use client';
import Link from "next/link"
import DataRow from "../../ui/components/dataRow";
import { NormalButton} from "../../ui/components/buttons";

const votantes = [
    { id: 1, name: "Votante 1" },
    { id: 2, name: "Votante 2" },
    { id: 3, name: "Votante 3" },
  ];
  
  export default function VotantesPage() {
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
        {votantes.map((votante) => (
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