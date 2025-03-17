'use client';
import Link from "next/link";
import DataRow from "../../ui/components/dataRow";
import { NormalButton } from "../../ui/components/buttons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UsuariosPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

    const handleEditUsuario = () => {
        router.push("usuarios/updateUsuario");
    };

    // Datos de ejemplo (reemplaza con tu lógica de fetch)
    const usuarios = [
        { id: 1, name: "Usuario Ejemplo 1" },
        { id: 2, name: "Usuario Ejemplo 2" },
    ];

    // Filtrar usuarios por nombre
    const filteredUsuarios = usuarios.filter((usuario) =>
        usuario.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main>
            <div className="p-4 flex flex-col px-40">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Gestión de Usuarios
                </h2>
                {/* Input de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar usuario por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded-md"
                />
                {filteredUsuarios.map((usuario) => (
                    <DataRow
                        key={usuario.id}
                        name={usuario.name}
                        onEdit={handleEditUsuario}
                        onDelete={() => console.log("Eliminar usuario")}
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