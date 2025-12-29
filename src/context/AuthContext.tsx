import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'localfix_users';
const CURRENT_USER_KEY = 'localfix_current_user';

// Admin email - only this user can update report status
const ADMIN_EMAIL = 'admin@localfix.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): Record<string, { user: User; password: string }> => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers();
    const userRecord = users[email.toLowerCase()];

    if (!userRecord) {
      return { success: false, error: 'No account found with this email' };
    }

    if (userRecord.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    // Check if admin
    const userWithAdmin = {
      ...userRecord.user,
      isAdmin: email.toLowerCase() === ADMIN_EMAIL,
    };

    setUser(userWithAdmin);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithAdmin));
    return { success: true };
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers();
    
    if (users[data.email.toLowerCase()]) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      phone: data.phone,
      isAdmin: data.email.toLowerCase() === ADMIN_EMAIL,
    };

    users[data.email.toLowerCase()] = {
      user: newUser,
      password: data.password,
    };

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
