'use client' // Obligatorio: los componentes de error deben ser client components
import { NormalButton } from "@/app/ui/components/buttons";

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function ErrorComponent({ error, reset }: ErrorProps) {
    return (
        <div className="bg-gradient-to-b from-green-50 to-gray-100 p-48 flex flex-col items-center justify-between ">
            <h1 className="font-bold">Algo salió mal!</h1>
            <p>{error.message}</p>
            <NormalButton 
                text = "Intentar Nuevamente"
                onClick={reset} 
                color="bg-blue-600"
                hoverClass="hover:bg-blue-500"
                extraClass="w-full md:w-auto text-white py-2 px-4 rounded-md transition-colors"
                type="button"
                
            />
        </div>
    );
}