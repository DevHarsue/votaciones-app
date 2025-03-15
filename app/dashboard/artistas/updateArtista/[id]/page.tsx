'use client';
import { useState, useEffect } from "react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter, useParams } from "next/navigation";
import { useToken } from "@/components/token-provider";

export default function UpdateArtista() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [starname, setStarname] = useState("");
  const [gender, setGender] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useToken();
  const params = useParams();
  const id = parseInt(params.id as string, 10);;
  const {showNotification} = useNotification()
          const router = useRouter()

  const handleSubmit = async () => {
    console.log(name)

  };
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL+"candidates/get_candidates",{
      method:"GET",
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    })
    .then((res) => res.json())
    .then((data) => {
        for (let x of data){
          if (x.id==id){
            setData(x)
          }
        }
        setLoading(false);
    });
}, []); 

if (loading) return <div>Cargando...</div>;


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 "> 
    <div className="">
      <h1 className="text-3xl font-bold text-center mb-10">
        Modificar Artista
        </h1>
      <form  className="space-y-4">
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            value={data.lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Nombre Artístico:</label>
          <input
            type="text"
            value={data.starname}
            onChange={(e) => setStarname(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Género:</label>
          <input
            type="text"
            value={data.gender}
            onChange={(e) => setGender(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <button onClick={handleSubmit}type="button" className="bg-blue-500 text-white p-2 rounded flex flex-column justify-center">
          Guardar Cambios
        </button>
      </form>
      </div>
  </div>  
  );
}