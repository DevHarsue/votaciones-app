'use client';
import Link from "next/link";
import DataRow from "../../ui/components/dataRow";
import { NormalButton } from "../../ui/components/buttons";
import { useEffect, useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Spin from "@/app/ui/components/spin";
import { User } from "@/app/ui/types";

export default function UsuariosPage() {
    const [data, setData] = useState<[User] | null>(null);
    const [loading, setLoading] = useState(true);

    const {showNotification} = useNotification()
    const router = useRouter()
    const token = Cookies.get('auth_token');
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda


    
    useEffect(() => {
        if (!token) return;
        fetch(process.env.NEXT_PUBLIC_API_URL+"get_users",{
            method:"GET",
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then((res) => res.status==401 ? window.location.assign("/login"): res.json() )
        .then((data) => {
            setData(data);
            setLoading(false);
        });
    }, [token]); 
    
    const handleEdit = (id: number) => {
        router.push("usuarios/updateUsuario/"+id.toString())
    };

    const handleDelete = async (email: string) => {
        if (!confirm("¿Desea Eliminar el Usuario?")){
            return
        }
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"delete_user/"+email,
                {
                    method:"DELETE",
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })

            if (!response.ok){
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al borrar usuario');
                }
            
            showNotification({message:'Usuario Eliminado Correctamente',type:"success"})
            window.location.reload()
        }catch (err) {
            showNotification({message:err instanceof Error ? err.message : 'Error desconocido',type:"error"})
        } finally{
            setLoading(false)
        }
    };

    if (loading) return <Spin />;
    if (!data) return <div>No se encontraron Usuarios</div>
    const filteredData = data.filter((usuario) =>
        (usuario.name+" "+usuario.lastname).toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <main className="bg-gradient-to-b from-green-50 to-gray-100">
            <div className="p-4 flex flex-col px-40">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Gestión de Usuarios
                </h2>
                {/* Input de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar Usuarios por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded-md"
                />
                {filteredData.map((usuario) => (
                    <DataRow
                        key={usuario.id}
                        name={usuario.name + " " + usuario.lastname}
                        image={usuario.image_url}
                        onEdit={() => handleEdit(usuario.id)}
                        onDelete={() => handleDelete(usuario.email)}
                    />
                ))}
            </div>
            <Link href="/dashboard">
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