'use client';
import { NormalButton } from "@/app/ui/components/buttons";
import { useState } from "react";

export default function UpdateUsuario() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({ email, username, password, rol });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 "> 
    <div className="">
      <h1 className="text-3xl font-bold text-center mb-10">
        Modificar Usuario
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Rol:</label>
          <input
            type="text"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <NormalButton
          text='Guardar Cambios'
          color='bg-blue-500'
          hoverClass='hover:bg-blue-400'
          extraClass='w-full text-white py-2 px-4 rounded-md md:w-full transition-colors'
          type='submit'
        />
      </form>
    </div>
  </div>  
  );
}