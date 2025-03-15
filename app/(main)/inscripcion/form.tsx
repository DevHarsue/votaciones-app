"use client"; // Necesario para manejar estados y eventos en Next.js
import { NormalButton } from '../../ui/components/buttons';
import Link from 'next/link';
import { useState } from 'react';
import { validateName,validateGender } from '@/app/utils/validations';
import { useNotification } from '@/context/NotificationContext';
import { useRouter } from 'next/navigation';

export default function Formulario({ token }: { token: any }) {
    const [image, setImage] = useState<File | null>(null);
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        starname: '',
        gender: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(e.target)
        console.log(name,value)
        setFormData(prevState => ({
            ...prevState,  // Mantenemos todo el estado anterior
            [name]: value  // Actualizamos solo el campo modificado
        }));
    };
    
    const router = useRouter()

    // Función para manejar el envío del formulario
    const handleSubmit = async () => {
        if (!validateName(formData.name)){
            showNotification({message:"Nombre Invalido",type:"error"})
            return
        }
        if (!validateName(formData.lastname)){
            showNotification({message:"Apellido Invalido",type:"error"})
            return
        }
        if (!validateName(formData.starname)){
            showNotification({message:"Nombre de Estrella Invalido",type:"error"})
            return
        }
        if (!validateGender(formData.gender)){
            showNotification({message:"Seleccione un Genero",type:"error"})
            return
        }

        if(!image){
            showNotification({message:"Seleccione una imagen",type:"error"})
            return
        }
        try{
            const form = new FormData();
            form.append('name', formData.name);
            form.append('lastname', formData.lastname);
            form.append('starname', formData.starname);
            form.append('gender', formData.gender[0]);
            form.append('image', image);
            
            console.log(form)
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'candidates/create_candidate', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                    body: form
                });
            
            if (!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear candidato');
            }
            const data = await response.json();
            console.log(data)
            alert('Candidato creado exitosamente!');
            router.push("votaciones")
        }catch (err) {
            showNotification({message:err instanceof Error ? err.message : 'Error desconocido',type:"error"})
        } 
    };


    // Función para manejar la selección de la imagen
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const MAX_SIZE_MB = 4;
        const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024; // 4MB en bytes
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecciona un archivo de imagen válido');
                e.target.value = ''; // Limpiar input
                setImage(null);
                return;
            }
            // Validar tamaño máximo
            if (file.size > MAX_BYTES) {
                alert(`El archivo es demasiado grande. Máximo permitido: ${MAX_SIZE_MB}MB`);
                e.target.value = '';
                setImage(null);
                return;
            }
        
            // Si pasa las validaciones
            setImage(file);
            }
        };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 py-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-10">
                    INSCRIBE A TU ARTISTA
                </h1>
                <form className="space-y-4">
                    {/* Campo: Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                            <input
                            name='name'
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            />
                    </div>

                    {/* Campo: Apellido */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input
                            name='lastname'
                            type="text"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            />
                    </div>

                    {/* Campo: Nombre Artístico */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Artístico</label>
                            <input
                            type="text"
                            name='starname'
                            value={formData.starname}
                            onChange={handleInputChange}
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
                            value={formData.gender}
                            onChange={handleInputChange}
                            name='gender'
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            >
                                <option value="" disabled>Selecciona un género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
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
                        type='button'
                        onClick={handleSubmit}
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