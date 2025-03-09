"use client"; // Necesario para manejar estados y eventos en Next.js
import { NormalButton } from '../../ui/components/buttons';
import Link from 'next/link';
import { useState } from 'react';

export default function confirmarVotoPage() {
    // Estados para manejar los datos del formulario
const [nationality, setNationality] = useState('');
const [ci, setCi] = useState('');
const [name, setName] = useState('');
const [lastname, setLastname] = useState('');
const [gender, setGender] = useState('');
const [email, setEmail] = useState('');
const [confirmationCode, setConfirmationCode] = useState('');
const [showConfirmationCode, setShowConfirmationCode] = useState(false);

const handleConfirmVote = () => {
    if (showConfirmationCode) {
        alert(`¡Gracias por confirmar tu voto!`);
    }
};

    // Función para manejar el envío del formulario
const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
console.log({
    nationality,
    ci,
    name,
    lastname,
    gender,
    email,
    confirmationCode,
});
};

return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Ingrese Sus Datos Para Confirmar Voto
            </h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Campo: Nacionalidad */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Nacionalidad
                </label>
                <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                <option value="" disabled>Selecciona una nacionalidad</option>
                <option value="Extranjero">Extranjero</option>
                <option value="Venezolano">Venezolano</option>
                </select>
            </div>
                
          {/* Campo: Cédula */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Cédula
                </label>
                <input
                type="text"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>

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
                <label className="block text-sm font-medium text-gray-700">
                    Apellido
                </label>
                <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
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
                    <option value="" disabled> Selecciona un Género </option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                </select>
          </div>
  
          {/* Campo: Correo */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Correo
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
  
          {/* Botón: Confirmar Datos */}
            <div className="flex justify-center">
                <NormalButton
                    text="Confirmar Datos"
                    color="bg-green-600"
                    hoverClass="hover:bg-green-500"
                    extraClass="w-full md:w-auto text-white py-2 px-4 rounded-md transition-colors"
                    type="submit"
                    onClick={() => setShowConfirmationCode(true)}
                />
            </div> 
  
          {/* Campo: Código de Confirmación */}
          {showConfirmationCode && (    
            <div>
                <label className="block text-sm font-medium text-gray-700 text-center">
                    INGRESA EL CÓDIGO DE CONFIRMACIÓN
                </label>
                <input
                    type="text"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
)}
            {showConfirmationCode && (  
            <div className="flex justify-center">
                <NormalButton
                    text="Validar voto"
                    color="bg-blue-600"
                    hoverClass="hover:bg-blue-400"
                    extraClass="text-white w-full py-2 px-4 rounded-md md:w-full transition-colors"
                    onClick={handleConfirmVote} // Función para confirmar el voto
                />
            </div>
)}
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
        </form>
      </div>
    </main>
  );








}