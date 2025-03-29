'use client';
import { useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Spin from "@/app/ui/components/spin";
import Link from "next/link";
import { NormalButton } from "@/app/ui/components/buttons";
import { validatePassword } from "@/app/utils/validations";


export default function UpdateVotante() {
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [passwordValidated, setPasswordValidated] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const token = Cookies.get('auth_token');
    const {showNotification} = useNotification()
    const router = useRouter()
    
    const handleSendUpdatePassword = async () =>{
            if (loading){
                return
            }
            if (!validatePassword(password)){
                showNotification( { message: 'Contraseña Invalida', type: 'error' } )
                setLoading(false);
                return
            }
            if (password!=passwordValidated){
                showNotification( { message: 'Las Contraseñas no son iguales', type: 'error' } )
                setLoading(false);
                return
            }
            try {
                setLoading(true);
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"update_self_password/", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "new_password": password,
                        "old_password": oldPassword
                    })
                });
                if (response.status==401){
                    showNotification({message: 'Contraseña Actual Incorrecta', type:"error"});
                    return

                }
                if (!response.ok) throw new Error('Error en la solicitud');
                
                showNotification({message: 'Contraseña Actualizada Correctamente', type:"success"});

                router.push("/dashboard")
            } catch (err) {
                showNotification({message: err instanceof Error ? err.message : 'Error desconocido', type:"error"});
            } finally {
                setLoading(false);
            }
    }

    if (error) {
        throw error; // Esto activará el error.tsx
    }

    if (loading) return <Spin />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 "> 
            <div className="">
                <h1 className="text-3xl font-bold text-center mb-10">
                    Actualizar Datos
                </h1>
                <form className="">
                    {/* Campo: OldPassword */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contraseña Actual
                        </label>
                        <input
                            name='password'
                            type="password"
                            value={oldPassword}
                            onChange={e=>setOldPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Campo: Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contraseña Nueva
                        </label>
                        <input
                            name='password'
                            type="password"
                            value={password}
                            onChange={e=>setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Campo: PasswordValidated */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Confirmar Contraseña
                        </label>
                        <input
                            name='password'
                            type="password"
                            value={passwordValidated}
                            onChange={e=>setPasswordValidated(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div className="flex justify-center">
                        <NormalButton
                            type='button'
                            text={loading ? 'Enviando...' : "Actualizar Contraseña"}
                            color="bg-blue-600"
                            hoverClass="hover:bg-blue-400"
                            extraClass="text-white w-full py-2 px-4 rounded-md md:w-full transition-colors mt-4"
                            onClick={handleSendUpdatePassword} // Función para confirmar el voto
                        />
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
                </form>
        </div>
        </div>
    );
}