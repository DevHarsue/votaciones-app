
import Formulario from "./form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function InscripcionPage() {
    const session = await auth();

    // Redirigir si no está autenticado
    if (!session?.user) {
        redirect("/login?callbackUrl=/inscripcion");
    }
    return (
        <Formulario token={session?.user} />
    );
}