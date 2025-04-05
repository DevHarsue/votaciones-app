'use client';
import { useState, useEffect } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Spin from "@/app/ui/components/spin";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/app/ui/types";
import { NormalButton } from "@/app/ui/components/buttons";
import { validateGender, validateCI, validateNationality, validateName, validateEmail, validateCode } from "@/app/utils/validations";
import { useUser } from "@/context/user-context";


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
    const [error, setError] = useState("")
    const token = Cookies.get('auth_token');
    const {showNotification} = useNotification()
    const router = useRouter()

    const { user, setUser } = useUser()

    const [showConfirmationCode, setShowConfirmationCode] = useState(false);
    const [codeSend,setCodeSend] = useState(false)
    const [emailFinal, setEmailFinal] = useState("");
    const [confirmationCode, setConfirmationCode] = useState('');


    useEffect(()=>{

        setLoading(true)
        if (user!=null){
            setData(user)
            setName(user.name)
            setLastname(user.lastname)
            setGender(user.gender=="M" ? "Masculino" : user.gender=="F" ? "Femenino": "Otro")
            setCi(user.ci.toString())
            setNationality(user.nationality=="V"? "Venezolano":"Extranjero")
            setEmail(user.email)
            setImageUrl(user.image_url)
        }
        setLoading(false)
    },[user])
    
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
            if (!showConfirmationCode){
                showNotification( { message: 'Envia el codigo de Confirmación', type: 'error' } )
                setLoading(false);
                return
            }
            
            const code = parseInt(confirmationCode)
            if (!validateCode(code)){
                showNotification( { message: 'Codigo Invalido', type: 'error' } )
                setLoading(false);
                return
            }
            try {
                const form = new FormData();
                form.append('nationality', nationality[0]);
                form.append('ci', ci);
                form.append('name', name);
                form.append('lastname', lastname);
                form.append('gender', gender[0]);
                form.append('email', emailFinal);
                form.append('code', code.toString());
                if(image){
                    form.append('image', image);
                }
                console.log(form.entries().forEach(e=>console.log(e)))
                setLoading(true);
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"update_self_user/", {
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
                        showNotification({message: "Correo enlazado a otra cuenta.", type:"error"});
                    }
    
                    if (message.includes("CI")){
                        showNotification({message: "Cedula enlazada a otra cuenta", type:"error"});
                    }
    
                    return
                }
                if (!response.ok) throw new Error('Error en la solicitud');
                
                const data = await response.json()
                setUser(data)
                showNotification({message: 'Datos Actualizados Correctamente', type:"success"});

                router.push("/dashboard")
            } catch (err) {
                showNotification({message: err instanceof Error ? err.message : 'Error desconocido', type:"error"});
                setError(`${err}`)
            } finally {
                setLoading(false);
            }
    }

    const handleSendCode = async ()=>{
        if (loading) return
        setLoading(true)
        
        if (!validateEmail(email)){
            showNotification( { message: 'Email Invalido', type: 'error' } )
            setLoading(false)
            return
        }
        setEmailFinal(email)
        
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"code/generate_code",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email
                })
            });

            if (!response.ok) throw new Error('Error en la solicitud');

            setShowConfirmationCode(true)
            setCodeSend(true)
            showNotification({message: "Codigo Enviado", type:"success"});
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

    if (loading || data==null) return <Spin />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 "> 
            <div className="">
                <h1 className="text-3xl font-bold text-center mb-10">
                    Actualizar Datos
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
                    {/* Botón: Enviar Codigo */}
                    <div className="flex justify-center py-2">
                        <NormalButton
                            text={!codeSend ? (loading ? 'Enviando...' : "Enviar Codigo") : "Reenviar Codigo"  }
                            color="bg-green-600"
                            hoverClass="hover:bg-green-500"
                            extraClass="w-full md:w-auto text-white py-2 px-4 rounded-md transition-colors"
                            type="button"
                            onClick= {handleSendCode}
                        />
                    </div> 
                    {showConfirmationCode &&(
                    <>
                        {/* Campo: Código de Confirmación */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 text-center">
                                INGRESA EL CÓDIGO DE CONFIRMACIÓN
                            </label>
                            <input
                                type="number"
                                value={confirmationCode}
                                onChange={(e) => setConfirmationCode(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </>)}
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
                            <Image src={imagePreview} alt="Vista previa de la imagen" className="w-32 h-32 rounded-full object-cover" width={300} height={300} />
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
                        <Link href="/dashboard">
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