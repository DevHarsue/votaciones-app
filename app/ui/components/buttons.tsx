'use client';

import { ReactNode } from "react";
export function NormalButton(
    { text, color, hoverClass, extraClass = "", type = "button", disabled = false, onClick }:
    { 
        text: string | ReactNode,
        color: string, 
        hoverClass: string, 
        extraClass?: string, 
        type?: "button" | "submit" | "reset",
        disabled?: boolean
        onClick?: () => void; // Prop onClick opcional
    }
) {
    return (
        <button
            type={type}
            className={`${color} py-2 px-4 rounded md:w-auto ${hoverClass} transition-colors ${extraClass}`}
            onClick={onClick} // onClick se pasa al botón
            disabled={disabled}
        >
            {text}
        </button>
    );
}