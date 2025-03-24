"use client"; // Necesario para manejar estados y eventos en Next.js
import { NormalButton } from '../../ui/components/buttons';
import Link from 'next/link';
import { useState } from 'react';
import { validateEmail, validateNationality, validateName, validateCI } from '@/app/utils/validations';
import { useNotification } from '@/context/NotificationContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Spin from '@/app/ui/components/spin';

export default function RegistroPage() {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        nationality: '',
        ci: '',
        name: '',
        lastname: '',
        gender: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const token = Cookies.get('auth_token');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,  // Mantenemos todo el estado anterior
            [name]: value  // Actualizamos solo el campo modificado
        }));
    };

    const router = useRouter();

    // Función para manejar el envío del formulario
    const handleSubmit = async () => {
        setLoading(true);

        // Validaciones
        if (!validateNationality(formData.nationality)) {
            showNotification({ message: "Seleccione su nacionalidad", type: "error" });
            setLoading(false);
            return;
        }
        if (!validateName(formData.name)) {
            showNotification({ message: "Nombre Invalido", type: "error" });
            setLoading(false);
            return;
        }
        if (!validateName(formData.lastname)) {
            showNotification({ message: "Apellido Invalido", type: "error" });
            setLoading(false);
            return;
        }
        if (!validateEmail(formData.email)) {
            showNotification({ message: "Correo Invalido", type: "error" });
            setLoading(false);
            return;
        }

        if (!image) {
            showNotification({ message: "Seleccione una imagen", type: "error" });
            setLoading(false);
            return;
        }

        try {
            const form = new FormData();
            form.append('nationality', formData.nationality);
            form.append('ci', formData.ci);
            form.append('name', formData.name);
            form.append('lastname', formData.lastname);
            form.append('gender', formData.gender[0]);
            form.append('email', formData.email);
            form.append('password', formData.password);
            form.append('image', image);

            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'candidates/create_candidate', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });

            if (response.status == 409) {
                const errorData = await response.json();
                console.log(errorData);
                showNotification({ message: "El Nombre de Usuario ya está siendo Usado", type: "error" });
                return;
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar usuario');
            }

            showNotification({ message: 'Registro de Usuario Exitoso!', type: "success" });
            router.push("/");
        } catch (err) {
            if (err instanceof Error) {
                showNotification({ message: err.message, type: "error" });
            } else if (err instanceof TypeError) {
                showNotification({ message: "Error de red. Inténtalo de nuevo.", type: "error" });
            } else {
                showNotification({ message: "Error desconocido. Inténtalo de nuevo.", type: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar la selección de la imagen
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const MAX_SIZE_MB = 4;
        const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024; // 4MB en bytes

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                showNotification({ message: 'Por favor, selecciona un archivo de imagen válido', type: "error" });
                e.target.value = ''; // Limpiar input
                setImage(null);
                return;
            }
            // Validar tamaño máximo
            if (file.size > MAX_BYTES) {
                showNotification({ message: `El archivo es demasiado grande. Máximo permitido: ${MAX_SIZE_MB}MB`, type: "error" });
                e.target.value = '';
                setImage(null);
                return;
            }

            // Si pasa las validaciones
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Vista previa de la imagen
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            {loading && (<Spin />)}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-4 mb-4">
                <h1 className="text-3xl font-bold text-center mb-10">
                    REGISTRO DE USUARIO
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
                        <label className="block text-sm font-medium text-gray-700">
                            Apellido
                        </label>
                        <input
                            name='lastname'
                            type="text"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Campo: Nacionalidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nacionalidad
                        </label>
                        <select
                            value={formData.nationality}
                            onChange={handleInputChange}
                            name='nationality'
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="" disabled>Selecciona tu nacionalidad</option>
                            <option value="V">Venezolano</option>
                            <option value="E">Extranjero</option>
                        </select>
                    </div>

                    {/* Campo: Cédula */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Cédula
                        </label>
                        <input
                            name='ci'
                            type="number"
                            value={formData.ci}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            minLength={7}
                            maxLength={8}
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
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="O">Otro</option>
                        </select>
                    </div>

                    {/* Campo: Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            name='email'
                            type="text"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Campo: Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            name='password'
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Campo: Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imagen de Usuario</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:cursor-pointer file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            accept="image/*"
                            required
                        />
                    </div>

                    {/* Vista previa de la imagen */}
                    {imagePreview && (
                        <div className="mt-4 flex items-center justify-center">
                            <img src={imagePreview} alt="Vista previa de la imagen" className="w-32 h-32 rounded-full object-cover" />
                        </div>
                    )}

                    <NormalButton
                        text='Registrar Usuario'
                        color='bg-custom-green-400'
                        hoverClass='hover:bg-custom-green-500'
                        extraClass='w-full text-white py-2 px-4 rounded-md md:w-full transition-colors'
                        type='button'
                        onClick={handleSubmit}
                        disabled={loading} // Deshabilitar el botón mientras carga
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