import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from '@/lib/api';


type UserData = {
    email: string | null;
    name: string | null;
};

type UserContextType = {
    user: UserData | null;
    name: string | null;
    isAuthenticated: boolean;
    setIsAuthenticated: (auth: boolean) => void;
    setName: (name: string) => void;
    logout: () => void;
    selectedBanks: string[];
    hasCompletedOnboarding: boolean;
    updateSelectedBanks: (banks: string[]) => void;
    completeOnboarding: () => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
};


const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    // Initialize from localStorage or default
    const [user, setUser] = useState<UserData | null>(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    // New state for onboarding
    const [selectedBanks, setSelectedBanks] = useState<string[]>(() => {
        const saved = localStorage.getItem('selectedBanks');
        return saved ? JSON.parse(saved) : [];
    });

    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
        return localStorage.getItem('hasCompletedOnboarding') === 'true';
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('isAuthenticated', String(isAuthenticated));
        if (isAuthenticated && !user) {
            const newUser = { email: "user@example.com", name: null };
            setUser(newUser);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        localStorage.setItem('selectedBanks', JSON.stringify(selectedBanks));
    }, [selectedBanks]);

    useEffect(() => {
        localStorage.setItem('hasCompletedOnboarding', String(hasCompletedOnboarding));
    }, [hasCompletedOnboarding]);

    const setName = (name: string) => {
        setUser(prev => prev ? ({ ...prev, name }) : { email: "user@example.com", name });
    };

    const updateSelectedBanks = (banks: string[]) => {
        setSelectedBanks(banks);
    };

    const completeOnboarding = () => {
        setHasCompletedOnboarding(true);
    };

    const login = async (email: string, password: string) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const data = res.data;
            if (data.token) {
                // Save token/user info
                const userData = { email, name: data.name, user_id: data.user_id };
                setUser(userData);
                setIsAuthenticated(true);
                // Also save to localStorage specifically if api.ts uses it (I set api.ts to read 'user' or 'user_id_token')
                localStorage.setItem('user_id_token', data.token);
            }
        } catch (e) {
            console.error("Login failed", e);
            throw e;
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const res = await api.post('/auth/register', { email, password });
            const data = res.data;
            if (data.user_id) {
                // Auto login after register? Or just return
                // Let's auto login logic
                const userData = { email, name: null, user_id: data.user_id };
                setUser(userData);
                setIsAuthenticated(true); // Maybe not yet? User flow expects 'name-input' next
                // Actually, original flow was: Signup -> name-input -> buffering -> authenticated
                // So here we should probably NOT setAuthenticated(true) immediately if we want to follow the flow.
                // But we need the user_id for the next steps.
                // Let's just set User but maybe not Authenticated?
                // The original code uses `isLogin` state to decide flow.
                // If I setAuthenticated(true) here, it might jump.
                // Let's just save the user data and let the component handle the flow transition.
                // But wait, `setUser` updates `user`.
            }
        } catch (e) {
            console.error("Register failed", e);
            throw e;
        }
    };


    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
    };

    return (
        <UserContext.Provider value={{
            user,
            name: user?.name || null,
            isAuthenticated,
            setIsAuthenticated,
            setName,
            logout,
            selectedBanks,
            hasCompletedOnboarding,
            updateSelectedBanks,
            completeOnboarding,
            login,
            register
        }}>

            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
