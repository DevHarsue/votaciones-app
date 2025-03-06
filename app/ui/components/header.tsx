import Image from "next/image";
import { NormalButton } from "./buttons";

export default function Header(){
    return(
        <header className="flex flex-col items-center h-30 bg-blue-800 p-2">
            <Image
                width={300}
                height={300}
                src="/animals-logo1.png" 
                alt="CNU Logo" 
                className="w-20 h-20 rounded-full overflow-hidden mb-1"
            />
            <h1 className="text-4xl font-bold text-custom-beige">
                CNU
            </h1>
            <NormalButton
                text="Iniciar Sesión"
                color=""
                hoverClass="hover:text-black"
                extraClass="text-white text-2xl py-2 px-4 mb-2 md:mb-0 transition-colors"
                type="button"
            />
        </header>
    );
}