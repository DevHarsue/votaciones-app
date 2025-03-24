'use client';
import Image from "next/image";
import { NormalButton } from "./buttons";

interface DataRowProps {
    name: string;
    image: string  
    onEdit: () => void;
    onDelete: () => void;
}
export default function DataRow({ name,image, onEdit, onDelete }: DataRowProps) {
	const url =process.env.NEXT_PUBLIC_API_URL
	return (
	<div className="flex justify-between items-center p-2 border-b">
		<div className="flex items-center justify-between">
			<Image
				src={url+image}
				width={40}
				height={40}
				alt="Image"
				className="w-10 h-10 rounded-full bg-red-200"
			/>
			<p className="font-bold ml-6">{name}</p>
		</div>
		<div>
			{/* Botón de Modificar */} 
			<NormalButton
				text="Modificar"
				color="bg-blue-500"
				hoverClass="hover:bg-blue-700"
				extraClass="text-white px-2 py-1 rounded mr-2"
				type="button"
				onClick={onEdit}
			/>
			{/* Botón de Eliminar */}
			<NormalButton
				text="Eliminar"
				color="bg-red-500"
				hoverClass="hover:bg-red-700"
				extraClass="text-white px-2 py-1 rounded"
				type="button"
				onClick={onDelete}
			/>
		</div>
	</div>
	);
}