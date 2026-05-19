"use client";

import {

    createContext,

    useContext,

    useEffect,

    useState,

} from "react";

import apiClient
    from "@/lib/api/client";

/*
 =====================================
 USER TYPE
 =====================================
*/

interface User {

    id: string;

    name: string;

    email: string;

    role: string;
}

/*
 =====================================
 CONTEXT TYPE
 =====================================
*/

interface AuthContextType {

    user: User | null;

    loading: boolean;

    login: (
        token: string
    ) => Promise<void>;

    logout: () => void;
}

/*
 =====================================
 CONTEXT
 =====================================
*/

const AuthContext =
    createContext<AuthContextType>(
        {} as AuthContextType
    );

/*
 =====================================
 PROVIDER
 =====================================
*/

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const [user, setUser] =
        useState<User | null>(
            null
        );

    const [loading, setLoading] =
        useState(true);

    /*
     =====================================
     RESTORE LOGIN SESSION
     =====================================
    */

    useEffect(() => {

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {

            setLoading(false);

            return;
        }

        apiClient

            .get("/auth/me")

            .then((res) => {

                setUser(
                    res.data.user
                );
            })

            .catch(() => {

                localStorage.removeItem(
                    "token"
                );
            })

            .finally(() => {

                setLoading(false);
            });

    }, []);

    /*
     =====================================
     LOGIN
     =====================================
    */

    const login =
        async (
            token: string
        ) => {

            localStorage.setItem(
                "token",
                token
            );

            document.cookie =
                `token=${token}; path=/`;

            const res =
                await apiClient.get(
                    "/auth/me"
                );

            setUser(
                res.data.user
            );
        };

    /*
     =====================================
     LOGOUT
     =====================================
    */

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        setUser(null);
    };

    return (

        <AuthContext.Provider
            value={{

                user,

                loading,

                login,

                logout,
            }}
        >

            {children}

        </AuthContext.Provider>
    );
};

/*
 =====================================
 HOOK
 =====================================
*/

export const useAuth =
    () => useContext(AuthContext);