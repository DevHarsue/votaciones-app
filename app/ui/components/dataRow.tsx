'use client';
import Image from "next/image";
import { NormalButton } from "./buttons";

interface DataRowProps {
    name: string;
    image: string;
    onEdit: () => void;
    onDelete: () => void;
}

export default function DataRow({ name, image, onEdit, onDelete }: DataRowProps) {
    const url = process.env.NEXT_PUBLIC_API_URL;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 p-3 border-b gap-2 sm:gap-0">
            <div className="flex items-center w-full sm:w-auto justify-center md:justify-start flex-col md:flex-row">
                <div className="relative w-12 h-12 sm:w-10 sm:h-10">
                    <Image
                        src={url + image}
                        fill
                        alt="Artista"
                        className="rounded-full object-cover bg-gray-200"
                        sizes="(max-width: 640px) 48px, 40px"
                    />
                </div>
                <p className="font-bold ml-3 sm:ml-6 text-sm sm:text-base truncate max-w-[150px] sm:max-w-none text-wrap">
                    {name}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-auto justify-end">
                <NormalButton
                    text="Modificar"
                    color="bg-blue-500"
                    hoverClass="hover:bg-blue-700"
                    extraClass="text-white px-3 py-1 sm:px-2 sm:py-1 rounded text-sm sm:text-base"
                    type="button"
                    onClick={onEdit}
                />
                <NormalButton
                    text="Eliminar"
                    color="bg-red-500"
                    hoverClass="hover:bg-red-700"
                    extraClass="text-white px-3 py-1 sm:px-2 sm:py-1 rounded text-sm sm:text-base"
                    type="button"
                    onClick={onDelete}
                />
            </div>
        </div>
    );
}