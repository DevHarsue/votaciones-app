import Dashboard from "./../ui/components/headerdash";
import React from "react";

export default function RootDashboard({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            <Dashboard />
            {/* Contenido principal */}
            <main className="min-h-screen transition-all duration-300 md:ml-64 p-4">
                {children}
            </main>
        </div>
    );
}