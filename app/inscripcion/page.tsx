"use client"; // Necesario para manejar estados y eventos en Next.js
import { NormalButton } from '../ui/components/buttons';
import Link from 'next/link';
import { useState } from 'react';

export default function InscripcionPage() {
  // Estados para manejar los datos del formulario
const [name, setName] = useState('');
const [lastname, setLastname] = useState('');
const [starname, setStarname] = useState('');
const [gender, setGender] = useState('');
const [image, setImage] = useState<File | null>(null);

  // Función para manejar el envío del formulario
const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
console.log({
    name,
    lastname,
    starname,
    gender,
    image,
});
    alert('Solicitud enviada correctamente');
};

  // Función para manejar la selección de la imagen
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) 
    {setImage(e.target.files[0]);}
};

    return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 py-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-10">
                INSCRIBE A TU ARTISTA
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">

           {/* Campo: Nombre */}
        <div>
            <label className="block text-sm font-medium text-gray-700">
                Nombre
            </label>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
        </div>

          {/* Campo: Apellido */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
        </div>

          {/* Campo: Nombre Artístico */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Artístico</label>
                <input
                type="text"
                value={starname}
                onChange={(e) => setStarname(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
        </div>

          {/* Campo: Género */}
        <div>
            <label className="block text-sm font-medium text-gray-700">
                Género
            </label>
                <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                >
                    <option value="" disabled>Selecciona un género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                </select>
        </div>

          {/* Campo: Imagen */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Imagen del Artista</label>
                <input
                type="file"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:cursor-pointer file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
                required
                />
        </div>

        <NormalButton
            text='Enviar Solicitud'
            color='bg-custom-green-400'
            hoverClass='hover:bg-custom-green-500'
            extraClass='w-full text-white py-2 px-4 rounded-md md:w-full transition-colors'
            type='submit'
        />
    </form>
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
);
}