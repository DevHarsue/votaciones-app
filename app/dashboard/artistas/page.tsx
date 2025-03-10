'use client';
import Link from "next/link"
import DataRow from "../../ui/components/dataRow";
import { NormalButton} from "../../ui/components/buttons";
import { useRouter } from "next/navigation";

export default function ArtistaPage() {
  const router = useRouter();

  const handleEditArtista = () => {
    router.push("artistas/updateArtista");
  };

  return (
   <main>
    <div className="p-4 flex flex-col px-40"> 
    <h2 className="text-2xl font-bold mb-4 text-center">
        Gestión de Artistas
      </h2>
        <DataRow
        name="Usuario Ejemplo"
        onEdit={handleEditArtista}
        onDelete={() => console.log("Eliminar usuario")}
        />
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