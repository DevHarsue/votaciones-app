'use client';

import { useUser } from "@/context/user-context";
import Image from "next/image";
import { NormalButton } from "../ui/components/buttons";
import Link from "next/link";
import Spin from "../ui/components/spin";

export default function Dashboard(){
    const {user} = useUser()
    if (user==null) return <Spin />
    console.log(process.env.NEXT_PUBLIC_API_URL+user.image_url)
    return(
    <main className='pl-10 flex flex-col items-center'>
        <h1 className=''>
            INFORMACION PERSONAL
        </h1>
        <div className="">
            <div className="relative aspect-square">
                <Image
                src={process.env.NEXT_PUBLIC_API_URL+user.image_url}
                alt={"Imagen Usuario"}
                className="w-10 h-10 rounded-full bg-red-200 object-cover"
                fill
                />
            </div>
            {/* Campo: Nacionalidad */}
            <div>
                <p>{user.nationality=="V" ? "Venezolano" : "Extranjero"}</p>
            </div>
            {/* Campo: Cédula */}
            <div>
                <p>{user.ci}</p>
            </div>
            {/* Campo: Nombre */}
            <div>
                <p>{user.name}</p>
            </div>
            {/* Campo: Apellido */}
            <div>
                <p>{user.lastname}</p>
            </div>
            {/* Campo: Genero */}
            <div>
                <p>{user.gender == "M" ? "Masculino": user.gender=="F"? "Femenino" : "Otro"}</p>
            </div>
            {/* Campo: Email */}
            <div>
                <p>{user.email}</p>
            </div>
            
            <div className="flex justify-center">
                <Link href="/dashboard/updateSelf">
                    <NormalButton
                        type='button'
                        text={"EDITAR DATOS"}
                        color="bg-blue-600"
                        hoverClass="hover:bg-blue-400"
                        extraClass="text-white w-full py-2 px-4 rounded-md md:w-full transition-colors mt-4"
                    />
                </Link>
            </div>
            <div className="flex justify-center">
                <Link href="/dashboard/changePassword">
                    <NormalButton
                        type='button'
                        text={"CAMBIAR CONTRASEÑA"}
                        color="bg-blue-600"
                        hoverClass="hover:bg-blue-400"
                        extraClass="text-white w-full py-2 px-4 rounded-md md:w-full transition-colors mt-4"
                    />
                </Link>
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
        </div>
    </main>
    )

}