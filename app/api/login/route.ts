import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"token", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) throw new Error('Error en BackEnd');
        
        const { token } = await response.json();
        
        const cookie = serialize('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return new NextResponse(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Set-Cookie': cookie },
        });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: 'Credenciales inválidas' },
            { status: 401 }
        );
    }
}