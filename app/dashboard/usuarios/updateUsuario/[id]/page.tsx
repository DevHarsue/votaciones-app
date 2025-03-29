'use client';
import { useState, useEffect } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import Spin from "@/app/ui/components/spin";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/app/ui/types";
import { NormalButton } from "@/app/ui/components/buttons";
import { validateGender, validateCI,validateNationality,validateName,validateEmail } from "@/app/utils/validations";


export default function UpdateVotante() {
    const [nationality, setNationality] = useState("");
    const [ci, setCi] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [data, setData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const token = Cookies.get('auth_token');
    const params = useParams();
    const id = parseInt(params.id as string, 10);;
    const {showNotification} = useNotification()
    const router = useRouter()

    useEffect(()=>{
        fetch(process.env.NEXT_PUBLIC_API_URL+"get_user_by_id/"+id,
            {
                method:"GET",
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }
        ).then(response=>{
            if (!response.ok){
                showNotification( {message: "Usuario no Encontrado", type: "error"} )
                router.push("/dashboard/usuarios")
            }
            return response.json()
        }).then(data=>{
            setData(data)
            setName(data.name)
            setLastname(data.lastname)
            setGender(data.gender=="M" ? "Masculino" : data.gender =="F" ? "Femenino" : "Otro")
            setCi(data.ci)
            setNationality(data.nationality=="V"? "Venezolano":"Extranjero")
            setEmail(data.email)
            setImageUrl(data.image_url)
            setLoading(false)
        })
    },[id,token])
    
    const handleSendDataVoter = async () =>{
            if (!data) return
            if (loading){
                return
            }
            if (!validateNationality(nationality)){
                showNotification( {message: "Seleccione una Nacionalidad", type: "error"} )
                return
            }
    
            const ci_int = parseInt(ci)
            if (!validateCI(ci_int)){
                showNotification( { message: 'Cedula Invalida', type: 'error' } )
                return
            }
    
            if (!validateName(name)){
                showNotification( { message: 'Nombre Invalido', type: 'error' } )
                return
            }
            
            if (!validateName(lastname)){
                showNotification( { message: 'Apellido Invalido', type: 'error' } )
                return
            }
            if (!validateGender(gender)){
                showNotification( { message: 'Seleccione un Genero', type: 'error' } )
                return
            }
            if (!validateEmail(email)){
                showNotification( { message: 'Email Invalido', type: 'error' } )
                return
            }
            
            
            try {
                const form = new FormData();
                form.append('nationality', nationality[0]);
                form.append('ci', ci);
                form.append('name', name);
                form.append('lastname', lastname);
                form.append('gender', gender[0]);
                form.append('email', email);
                form.append("password","")
                if(image){
                    form.append('image', image);
                }
                console.log(form.entries().forEach(e=>console.log(e)))
                setLoading(true);
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"update_user/"+id, {
                    method: 'PUT',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: form
                });
                if (response.status==409){
                    const error_message = await response.json()
                    const message = error_message.detail
    
                    if (message.includes("Email")){
                        showNotification({message: "Ya existe un registro con ese correo electronico.", type:"error"});
                    }
    
                    if (message.includes("CI")){
                        showNotification({message: "Ya existe un registro con esa Cedula", type:"error"});
                    }
    
                    return
                }
                if (!response.ok) throw new Error('Error en la solicitud');
                
                
                showNotification({message: 'Usuario Actualizado Correctamente', type:"success"});
                router.push("/dashboard/usuarios")
            } catch (err) {
                showNotification({message: err instanceof Error ? err.message : 'Error desconocido', type:"error"});
            } finally {
                setLoading(false);
            }
        }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const MAX_SIZE_MB = 4;
        const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024; // 4MB en bytes
        
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                showNotification({message: 'Por favor, selecciona un archivo de imagen válido', type:"error"});
    
                e.target.value = ''; // Limpiar input
                setImage(null);
                return;
            }
            // Validar tamaño máximo
            if (file.size > MAX_BYTES) {
                showNotification({message: `El archivo es demasiado grande. Máximo permitido: ${MAX_SIZE_MB}MB`, type:"error"});
    
                e.target.value = '';
                setImage(null);
                return;
            }
        
            // Si pasa las validaciones
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Vista previa de la imagen
        }
    };
    
    if (error) {
        throw error; // Esto activará el error.tsx
    }

    if (loading) return <Spin />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 "> 
            <div className="">
                <h1 className="text-3xl font-bold text-center mb-10">
                    Modificar Usuario
                </h1>
                <form className="">
                    <div className="relative aspect-square">
                                <Image
                                src={process.env.NEXT_PUBLIC_API_URL+imageUrl}
                                alt={"Imagen Actual"}
                                className="w-10 h-10 rounded-full bg-red-200 object-cover"
                                fill
                                />
                    </div>
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
                            type="number"
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
                    
                    <div className="flex justify-center">
                        <NormalButton
                            type='button'
                            text={loading ? 'Enviando...' : "Actualizar Usuario"}
                            color="bg-blue-600"
                            hoverClass="hover:bg-blue-400"
                            extraClass="text-white w-full py-2 px-4 rounded-md md:w-full transition-colors mt-4"
                            onClick={handleSendDataVoter} // Función para confirmar el voto
                        />
                    </div>
                    
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
        </div>
    );
}