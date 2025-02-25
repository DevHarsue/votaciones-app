import Image from "next/image";

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
            <button className='custom-turquoise text-white text-2xl rounded py-2 px-4 mt-2 mb-2 md:mb-0 hover:text-custom-turquoise-400 transition-colors'>
                Iniciar sesión
            </button>
        </header>
    );
}