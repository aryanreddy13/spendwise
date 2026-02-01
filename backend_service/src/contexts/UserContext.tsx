import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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
            completeOnboarding
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
