import Dashboard from "./../ui/components/headerdash";
import Footer from './../ui/components/footer';
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
      <main className="min-h-screen transition-all duration-300
        md:ml-64    /* Margen para el sidebar solo en desktop */
        p-4         /* Padding general */
      ">
        {children}
      </main>
    </div>
  );
}