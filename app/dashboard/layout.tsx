import Header from "./../ui/components/headerdash";
import Footer from './../ui/components/footer';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TokenProvider } from "@/components/token-provider";
import React from "react";


export default async function RootDashboard({
  children,
}: {
  children: React.ReactNode;
}){
    const session = await auth();

    // Redirigir si no está autenticado
    if (!session?.user) {
        redirect("/login");
    }
    return (
        <div className="flex min-h-screen flex-col p-0">
            <Header / >
            <main>
              <TokenProvider token={session.user}>
                {children}
              </TokenProvider>
            </main>
            <Footer />
        </div>
    );
}