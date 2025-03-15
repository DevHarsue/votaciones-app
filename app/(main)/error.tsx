'use client';
import { useEffect } from 'react'; 
import { NormalButton } from '../ui/components/buttons';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <h2 className="text-center mt-3">Ha ocurrido un error</h2>
            <button
                className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-500 mb-7"
                onClick={
                    // Attempt to recover by trying to re-render the invoices route
                    () => reset()
                }
            >
                Volver a Intentar
            </button>

        </main>
    );
}