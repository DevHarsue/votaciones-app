'use client';
import { useState, useEffect } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter, useParams } from "next/navigation";
import { useToken } from "@/components/auth-provider";



export default function UpdateVotante() {
    const [nationality, setNationality] = useState("");
    const [ci, setCi] = useState("");
    const [lastname, setLastname] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const token = useToken();
    const params = useParams();
    const id = parseInt(params.id as string, 10);;
    const {showNotification} = useNotification()
    const router = useRouter()


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica para actualizar el votante
        console.log({ nationality, ci, lastname, gender, email });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 "> 
            <div className="">
                <h1 className="text-3xl font-bold text-center mb-10">
                    Modificar Votante
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Nacionalidad:</label>
                        <input
                            type="text"
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div>
                        <label>CI:</label>
                        <input
                            type="number"
                            value={ci}
                            onChange={(e) => setCi(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div>
                        <label>Apellido:</label>
                        <input
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div>
                        <label>Género:</label>
                        <input
                            type="text"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Guardar Cambios
                    </button>
                </form>
        </div>
        </div>
    );
}