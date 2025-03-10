"use client"; // Necesario para manejar estados y eventos en Next.js
import { NormalButton } from '../../../ui/components/buttons';
import Link from 'next/link';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { validateEmail, validateNationality, validateName, validateCI, validateCode} from '../../../utils/validations';
import { useNotification } from '@/context/NotificationContext';
import { useRouter } from 'next/navigation';

export default function confirmarVotoPage() {
    // Estados para manejar los datos del formulario
    const [nationality, setNationality] = useState('');
    const [ci, setCi] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [showConfirmationCode, setShowConfirmationCode] = useState(false);

    const params = useParams();
    const id = parseInt(params.id as string, 10);;
    
    const [voterId, setVoterId] = useState(0);

    const { showNotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter()
    
    const handleSendCode = async () =>{

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

        if (!validateName(gender)){
            showNotification( { message: 'Seleccione un Genero', type: 'error' } )
            return
        }

        if (!validateEmail(email)){
            showNotification( { message: 'Email Invalido', type: 'error' } )
            return
        }



        try {
            setLoading(true);
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"voters/create_voter", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nationality: nationality[0],
                    ci: ci_int,
                    name: name,
                    lastname: lastname,
                    gender: gender[0],
                    email: email
                }),
            });

            if (!response.ok) throw new Error('Error en la solicitud');
            
            const data = await response.json();
            setVoterId(data.id)
            showNotification({message: "Codigo Enviado", type:"success"});
            setShowConfirmationCode(true)

        } catch (err) {
            showNotification({message: err instanceof Error ? err.message : 'Error desconocido', type:"error"});
        } finally {
            setLoading(false);
        }

    }
    const handleSendVote = async ()=>{
        if (loading){
            return
        }
        const code = parseInt(confirmationCode)
        if (!validateCode(code)){
            showNotification( { message: 'Codigo Invalido', type: 'error' } )
            return
        }

        try{
            setLoading(true)
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"voters/validate_voter/"+code.toString(),{method: 'GET'})

            if (response.status == 400) throw new Error('Codigo Incorrecto');
            if (!response.ok) throw new Error('Error en la solicitud');
            
            console.log(JSON.stringify({
                voter_id: voterId,
                candidate_id: id
            }))
            const response_vote = await fetch(process.env.NEXT_PUBLIC_API_URL+"vote/create_vote", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    voter_id: voterId,
                    candidate_id: id
                }),
            });

            if (!response_vote.ok) throw new Error('Error en la solicitud voto');

            alert("Voto Realizado!")
            router.push("/resultados/")


        } catch (err) {
            showNotification({message: err instanceof Error ? err.message : 'Error desconocido', type:"error"});
        } finally {
            setLoading(false);
        }
        

    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
                    Ingrese Sus Datos Para Confirmar Voto
                </h1>
                <form className="space-y-4">
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
                            text={loading ? 'Enviando...' : "Confirmar Datos"}
                            color="bg-green-600"
                            hoverClass="hover:bg-green-500"
                            extraClass="w-full md:w-auto text-white py-2 px-4 rounded-md transition-colors"
                            type="button"
                            onClick= {handleSendCode}
                        />
                    </div> 
        
                    {/* Campo: Código de Confirmación */}
                    {showConfirmationCode && (    
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
                    )}
                    {showConfirmationCode && (  
                        <div className="flex justify-center">
                            <NormalButton
                                type='button'
                                text={loading ? 'Enviando...' : "Validar voto"}
                                color="bg-blue-600"
                                hoverClass="hover:bg-blue-400"
                                extraClass="text-white w-full py-2 px-4 rounded-md md:w-full transition-colors"
                                onClick={handleSendVote} // Función para confirmar el voto
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