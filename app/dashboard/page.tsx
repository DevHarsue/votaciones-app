'use client';

import { useUser } from "@/context/user-context";
import Image from "next/image";
import { NormalButton } from "../ui/components/buttons";
import Link from "next/link";
import Spin from "../ui/components/spin";

export default function Dashboard() {
    const { user } = useUser()
    if (user == null) return <Spin />

    return (
        <main className='bg-gradient-to-b from-green-50 to-gray-100 min-h-screen p-6 md:p-10 flex flex-col items-center'>
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
                {/* Encabezado */}
                <div className="bg-green-600 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white text-center">
                        INFORMACIÓN PERSONAL
                    </h1>
                </div>
                
                {/* Contenido */}
                <div className="p-6 md:p-8">
                    {/* Avatar y Datos */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                        <div className="relative w-32 h-32 rounded-full border-4 border-green-100 overflow-hidden">
                            <Image
                                src={process.env.NEXT_PUBLIC_API_URL + user.image_url}
                                alt="Imagen Usuario"
                                className="object-cover"
                                fill
                            />
                        </div>
                        
                        <div className="w-full">
                            <table className="w-full border-collapse">
                                <tbody>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-semibold text-gray-600">Nacionalidad</td>
                                        <td className="py-3 px-4">{user.nationality == "V" ? "Venezolano" : "Extranjero"}</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-semibold text-gray-600">Cédula</td>
                                        <td className="py-3 px-4">{user.ci}</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-semibold text-gray-600">Nombre Completo</td>
                                        <td className="py-3 px-4">{user.name} {user.lastname}</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-semibold text-gray-600">Género</td>
                                        <td className="py-3 px-4">
                                            {user.gender == "M" ? "Masculino" : user.gender == "F" ? "Femenino" : "Otro"}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-semibold text-gray-600">Email</td>
                                        <td className="py-3 px-4">{user.email}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Botones de Acción */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <Link href="/dashboard/updateSelf" className="flex-1">
                            <NormalButton
                                type='button'
                                text="EDITAR DATOS"
                                color="bg-blue-600"
                                hoverClass="hover:bg-blue-500"
                                extraClass="text-white w-full py-3 px-4 rounded-md transition-colors"
                            />
                        </Link>
                        <Link href="/dashboard/changePassword" className="flex-1">
                            <NormalButton
                                type='button'
                                text="CAMBIAR CONTRASEÑA"
                                color="bg-blue-600"
                                hoverClass="hover:bg-blue-500"
                                extraClass="text-white w-full py-3 px-4 rounded-md transition-colors"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}