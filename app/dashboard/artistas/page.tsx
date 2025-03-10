'use client';
import Link from "next/link"
import DataRow from "../../ui/components/dataRow";
import { NormalButton } from "../../ui/components/buttons";

const artistas = [
  { id: 1, name: "Artista 1" },
  { id: 2, name: "Artista 2" },
  { id: 3, name: "Artista 3" },
];

export default function ArtistasPage() {
  const handleEdit = (id: number) => {
    console.log(`Modificar artista con ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Eliminar artista con ID: ${id}`);
  };

  return (
    <main>
    <div className="p-4 flex flex-col px-40">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Gestión de Artistas
      </h2>
      {artistas.map((artista) => (
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