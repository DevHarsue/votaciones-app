'use client';
import { NormalButton } from "./buttons";

interface DataRowProps {
    name: string;        
    onEdit: () => void;
    onDelete: () => void;
  }

export default function DataRow({ name, onEdit, onDelete }: DataRowProps) {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <p className="font-bold">{name}</p>
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