'use client';
import Link from "next/link"
import DataRow from "../../ui/components/dataRow";
import { NormalButton} from "../../ui/components/buttons";

const usuarios = [
  { id: 1, name: "Juan Pérez" },
  { id: 2, name: "María Gómez" },
  { id: 3, name: "Carlos López" },
];

export default function UsuariosPage() {
  const handleEdit = (id: number) => {
    console.log(`Modificar usuario con ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Eliminar usuario con ID: ${id}`);
  };

  return (
   <main>
    <div className="p-4 flex flex-col px-40">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Gestión de Usuarios
      </h2>
      {usuarios.map((usuario) => (
        <DataRow
          key={usuario.id}
          name={usuario.name}
          onEdit={() => handleEdit(usuario.id)}
          onDelete={() => handleDelete(usuario.id)}
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