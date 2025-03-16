"use client"; // Necesario para manejar estados y eventos en Next.js
import { useState } from "react";
import Image from "next/image";
import { NormalButton } from "./buttons";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex flex-col items-center h-30 bg-blue-800 p-2 relative">
      <Link href="/">
        <Image
          width={300}
          height={300}
          src="/animals-logo1.png"
          alt="CNU Logo"
          className="w-20 h-20 rounded-full overflow-hidden mb-1 cursor-pointer"
        />
      </Link>
      <h1 className="text-4xl font-bold text-custom-beige">CNU</h1>

      {/* Botón con flecha hacia abajo */}

        <div className="relative">
        <NormalButton
          text={
            <div className="flex items-center">
              <span className="text-white text-2xl">&#9660;</span> {/* Flecha hacia abajo */}
            </div>
          }
          color="bg-transparent"
          hoverClass="hover:bg-blue-700"
          extraClass="text-white py-2 px-4 mb-2 md:mb-0 transition-colors rounded-full"
          type="button"
          onClick={toggleMenu}
        />

        {/* Menú desplegable */}
        <div
          className={`absolute mt-2 left-1/2 transform -translate-x-1/2 w-48 bg-blue-800 rounded-md p-2 border-black shadow-lg z-10 transition-opacity duration-500 ease-in-out ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col p-2 space-y-2">
            <Link href={!true?"/login":"/dashboard"} className="w-full">
              <NormalButton
                text={!true?"INICIAR SESION":"DASHBOARD"}
                color="bg-transparent"
                hoverClass="hover:bg-blue-500"
                extraClass="w-full text-white py-2 px-4 rounded-md md:w-full transition-colors border-3 border-y border-white rounded-sm"
                type="button"
              />
            </Link>
            {/* <Link href="/register" className="w-full">
              <NormalButton
                text="REGISTRO"
                color="bg-transparent"
                hoverClass="hover:bg-blue-500"
                extraClass="w-full text-white py-2 px-4 rounded-md md:w-full transition-colors border-3 border-y border-white rounded-sm"
                type="button"
              />
            </Link> */}
          </div>
        </div>
      </div>
    </header>
  );
}