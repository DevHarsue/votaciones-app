import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'votaciones-app.onrender.com',
                port: '',
                pathname: '/uploads/**',
                search: '',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5000',
                pathname: '/uploads/**',
                search: '',
            },
            {
                protocol: 'http',
                hostname: '192.168.1.35',
                port: '5000',
                pathname: '/uploads/**',
                search: '',
            },
        ],
    },
};

export default nextConfig;
