// components/token-provider.tsx
"use client";

import { createContext, useContext } from "react";

const TokenContext = createContext<any>(null);

export function TokenProvider({
    children,
    token,
    }: {
    children: React.ReactNode;
    token: any;
    }) {
    return (
        <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
    );
}

export function useToken() {
    return useContext(TokenContext);
}