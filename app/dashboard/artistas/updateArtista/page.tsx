'use client';
import { useState } from "react";

export default function UpdateArtista() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [starname, setStarname] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para actualizar el artista
    console.log({ name, lastname, starname, gender });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 "> 
    <div className="">
      <h1 className="text-3xl font-bold text-center mb-10">
        Modificar Artista
        </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label>Nombre Artístico:</label>
          <input
            type="text"
            value={starname}
            onChange={(e) => setStarname(e.target.value)}
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
        <button type="submit" className="bg-blue-500 text-white p-2 rounded flex flex-column justify-center">
          Guardar Cambios
        </button>
      </form>
      </div>
  </div>  
  );
}