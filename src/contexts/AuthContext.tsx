import { createContext, useState, type ReactNode, useCallback } from 'react';
import type { User } from '../types';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';

export interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}


export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function getInitialState() {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
        try {
            return { token: savedToken, user: JSON.parse(savedUser) as User };
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
    return { token: null, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState(() => getInitialState());
    const [loading, setLoading] = useState(() => !state.token);

    // Se tem token mas não tem user salvo (ou user inválido), busca da API
    const initialize = useCallback(async () => {
        const savedToken = localStorage.getItem('token');
        if (savedToken && !state.user) {
            try {
                const user = await userService.getMe();
                localStorage.setItem('user', JSON.stringify(user));
                setState({ token: savedToken, user });
            } catch {
                localStorage.removeItem('token');
                setState({ token: null, user: null });
            } finally {
                setLoading(false);
            }
        } else if (!savedToken) {
            setLoading(false);
        }
    }, [state.user]);

    if (state.token && !state.user && loading) {
        initialize();
    }

    async function login(email: string, password: string) {
        try {
            const response = await authService.login(email, password);
            setState({ token: response.token, user: response.user });
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        } finally {
            setLoading(false);
        }
    }

    async function register(name: string, email: string, password: string) {
        const response = await authService.register(name, email, password);
        setState({ token: response.token, user: response.user });
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setLoading(false);
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState({ token: null, user: null });
    }

    return (
        <AuthContext.Provider value={{ user: state.user, token: state.token, loading, login, register, logout }}>
        {children}
        </AuthContext.Provider>
    );
}