"use client"; // Necesario para manejar estados y eventos en Next.js
import Image from "next/image";
import { NormalButton } from "./buttons";
import Link from "next/link";

export default function Dashboard() {
  
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
        {/* Botón de Usuarios */}
        <Link href="/dashboard/artistas" className="flex-grow">
          <NormalButton
            text="Artistas"
            color="bg-blue-900"
            hoverClass="hover:bg-blue-800"
            extraClass="w-full md:w-full text-white py-3 px-4 rounded-none transition-colors text-center border-l-2 border-blue-800"
            type="button"
            onClick={() => console.log("Usuarios clickeado")}
          />
        </Link>

        {/* Botón de Artistas */}
        {/* <Link href="/dashboard/usuarios" className="flex-grow">
          <NormalButton
            text="Usuarios"
            color="bg-blue-900"
            hoverClass="hover:bg-blue-800"
            extraClass="w-full md:w-full text-white py-3 px-4 rounded-none transition-colors text-center border-l-2 border-blue-800"
            type="button"
            onClick={() => console.log("Artistas clickeado")}
          />
        </Link> */}

        {/* Botón de Votantes */}
        <Link href="/dashboard/votantes" className="flex-grow">
          <NormalButton
            text="Votantes"
            color="bg-blue-900"
            hoverClass="hover:bg-blue-800"
            extraClass="w-full md:w-full text-white py-3 px-4 rounded-none transition-colors text-center border-l-2 border-blue-800"
            type="button"
            onClick={() => console.log("Votantes clickeado")}
          />
        </Link>

        {/* Botón de Candidatos */}
        {/* <Link href="/dashboard/candidatos" className="flex-grow">
          <NormalButton
            text="Candidatos"
            color="bg-blue-900"
            hoverClass="hover:bg-blue-800"
            extraClass="w-full md:w-full text-white py-3 px-4 rounded-none transition-colors text-center border-l-2 border-blue-800"
            type="button"
            onClick={() => console.log("Candidatos clickeado")}
          />
        </Link> */}
      </div>
    </header>
  );
}