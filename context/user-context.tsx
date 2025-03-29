'use client';

import { createContext, useContext, useState } from 'react';

export type User = {
    id: number;
    nationality: string;
    ci: number;
    name: string;
    lastname: string;
    gender: string;
    email: string;
    rol: string;
    image_url: string;
};

type UserContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
        {children}
        </UserContext.Provider>
    );
}