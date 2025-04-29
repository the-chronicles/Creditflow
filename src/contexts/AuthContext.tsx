
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'demo@example.com',
    password: 'password123'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved session on mount
    const savedUser = localStorage.getItem('loanUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('loanUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Invalid email or password."
      });
      setIsLoading(false);
      return;
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('loanUser', JSON.stringify(userWithoutPassword));
    toast({
      title: "Welcome back!",
      description: "You've successfully logged in."
    });
    setIsLoading(false);
    navigate('/dashboard');
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    const userExists = MOCK_USERS.some(u => u.email === email);
    
    if (userExists) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "This email is already registered."
      });
      setIsLoading(false);
      return;
    }
    
    // In a real app, we would save this to a database
    const newUser = {
      id: Math.random().toString(36).substring(7),
      name,
      email
    };
    
    setUser(newUser);
    localStorage.setItem('loanUser', JSON.stringify(newUser));
    toast({
      title: "Account created",
      description: "Your account has been successfully created."
    });
    setIsLoading(false);
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loanUser');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out."
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
