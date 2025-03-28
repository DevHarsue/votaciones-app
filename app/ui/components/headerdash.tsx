"use client"; // Necesario para manejar estados y eventos en Next.js
import Image from "next/image";
import { NormalButton } from "./buttons";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import Spin from "./spin";

export default function Dashboard() {
  const { user } = useUser()
  if (user==null) return <Spin />
  return (
    <header className="flex flex-col items-center bg-blue-800">
      {/* Logo de CNU */}
      <Link href="/">
        <div className="mb-4 mt-1">
          <Image
            width={100}
            height={100}
            src="/animals-logo1.png" // Asegúrate de que la ruta del logo sea correcta
            alt="CNU Logo"
            className="w-20 h-20 rounded-full overflow-hidden cursor-pointer"
          />
        </div>
      </Link>

      {/* Título */}
      <h1 className="text-4xl font-bold text-custom-beige mb-6">CNU</h1>

      {/* Botones en fila */}
      <div className="w-full flex flex-col md:flex-row gap-0">
        {/* Botón de Inicio */}
        <Link href="/dashboard" className="flex-grow">
          <NormalButton
            text="Inicio"
            color="bg-blue-900"
            hoverClass="hover:bg-blue-800"
            extraClass="w-full md:w-full text-white py-3 px-4 rounded-none transition-colors text-center border-l-2 border-blue-800"
            type="button"
          />
        </Link>
        
        {/* Botón de Usuarios */}
        {user.rol=="ADMIN" && (
            <Link href="/dashboard/usuarios" className="flex-grow">
                <NormalButton
                    text="Usuarios"
                    color="bg-blue-900"
                    hoverClass="hover:bg-blue-800"
                    extraClass="w-full md:w-full text-white py-3 px-4 rounded-none transition-colors text-center border-l-2 border-blue-800"
                    type="button"
                />
            </Link>
        )}

        {/* Botón de Votantes */}
        <Link href="/dashboard/artistas" className="flex-grow">
            <NormalButton
                text="Artistas"
                color="bg-blue-900"
                hoverClass="hover:bg-blue-800"
                extraClass="w-full md:w-full text-white py-3 px-4 rounded-none transition-colors text-center border-l-2 border-blue-800"
                type="button"
            />
        </Link>

      </div>
    </header>
  );
}