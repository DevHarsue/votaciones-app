'use client';
import { useState, useEffect } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useParams,useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Spin from "@/app/ui/components/spin";
import { NormalButton } from "@/app/ui/components/buttons";
import { validateName,validateGender,validateStarName } from "@/app/utils/validations";
import Image from "next/image";
import { useUser } from "@/context/user-context";

export default function UpdateArtista() {
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [starname, setStarname] = useState("");
    const [gender, setGender] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setimageUrl] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const id = parseInt(params.id as string, 10);
    const token = Cookies.get('auth_token');
    const {showNotification} = useNotification()
    const router = useRouter()
    const {user} = useUser()
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name } = e.target;
        if (name=="starname") setStarname(e.target.value)
        if (name=="name") setName(e.target.value)
        if (name=="lastname") setLastname(e.target.value)
        if (name=="gender") setGender(e.target.value)
    };

    const handleSubmit = async () => {
        setLoading(true)
        if (!validateName(name)){
            showNotification({message:"Nombre Invalido",type:"error"})
            setLoading(false)
            return
        }
        if (!validateName(lastname)){
            showNotification({message:"Apellido Invalido",type:"error"})
            setLoading(false)
            return
        }
        if (!validateStarName(starname)){
            showNotification({message:"Nombre de Estrella Invalido",type:"error"})
            setLoading(false)
            return
        }
        if (!validateGender(gender)){
            showNotification({message:"Seleccione un Genero",type:"error"})
            setLoading(false)
            return
        }
        
        try{
            const form = new FormData();
            form.append('name', name);
            form.append('id', id.toString());
            form.append('lastname', lastname);
            form.append('starname', starname);
            form.append('gender', gender[0]);
            if(image){
                form.append('image', image);
            }
            
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL+(user?.rol=="ADMIN" ? "candidates/update_candidate" : "candidates/update_self_candidate"), {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                    body: form
                });
            
            if (response.status==409){
                showNotification({message:"El Nombre Artístico ya esta siendo usado",type:"error"})
                return
            }
            if (!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar candidato');
            }
            // const data = await response.json();
            showNotification({message: 'Candidato actualizado exitosamente!', type:"success"});

            router.push("/dashboard/artistas")
        }catch (err) {
            showNotification({message:err instanceof Error ? err.message : 'Error desconocido',type:"error"})
        } finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        if (!token || isNaN(id)) return;
        fetch(process.env.NEXT_PUBLIC_API_URL+"candidates/get_candidate_by_id/"+id,{
        method:"GET",
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        })
        .then((res) => {
            if (!res.ok){
            showNotification( {message: "Artista no Encontrado", type: "error"} )
            router.push("/dashboard/artistas")
        }
        return res.json()
        }).then((data) => {
            setName(data.name);
            setLastname(data.lastname);
            setStarname(data.starname);
            setGender(data.gender == "M" ? "Masculino" : data.gender== "F" ? "Femenino": "Otro");
            setimageUrl(data.image_url)
            setLoading(false);
        });
    }, [id,token,router,showNotification]); 

    // Función para manejar la selección de la imagen
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

    if (loading) return <Spin />;


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 "> 
            <div className="">
                <h1 className="text-3xl font-bold text-center mb-10">
                    Modificar Artista
                </h1>
                <form className="space-y-4 mb-5 mt-5">
                    <div className="relative aspect-square">
                        <Image
                        src={process.env.NEXT_PUBLIC_API_URL+imageUrl}
                        alt={"Imagen Actual"}
                        className="w-10 h-10 rounded-full bg-red-200 object-cover"
                        fill
                        />
                    </div>
                    {/* Campo: Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            name='name'
                            type="text"
                            value={name}
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
                            value={lastname}
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
                            value={starname}
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
                            value={gender}
                            onChange={handleInputChange}
                            name='gender'
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
                        <label className="block text-sm font-medium text-gray-700">
                            Imagen del   Artista
                        </label>
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
                    <NormalButton
                        text='Enviar Solicitud'
                        color='bg-custom-green-400'
                        hoverClass='hover:bg-custom-green-500'
                        extraClass='w-full text-white py-2 px-4 rounded-md md:w-full transition-colors'
                        type='button'
                        onClick={handleSubmit}
                    />
                </form>
            </div>
        </div>  
    );
}