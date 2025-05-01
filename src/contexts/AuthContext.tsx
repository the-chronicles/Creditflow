import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import api from '@/api';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved session on mount
    const savedUser = localStorage.getItem('loanUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id && parsedUser.name && parsedUser.email) {
          setUser(parsedUser);
        } else {
          throw new Error('Invalid user data');
        }
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('loanUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
  
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Log the response to check the structure
      console.log('Login response:', response);
  
      const { token, user: userData } = response.data;
      
      // Log the extracted user data
      console.log('Extracted user data:', userData);
  
      if (!userData) {
        throw new Error('User data is not available');
      }
  
      // Store token and user details
      localStorage.setItem('userToken', token);
      localStorage.setItem('loanUser', JSON.stringify(userData));
  
      setUser(userData);
  
      toast({
        title: 'Welcome back!',
        description: "You've successfully logged in.",
      });
  
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Authentication failed',
        description: 'Invalid email or password.',
      });
      setIsLoading(false);
    }
  };
  

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token, user: userData } = response.data;

      // Store token and user details
      localStorage.setItem('userToken', token);
      localStorage.setItem('loanUser', JSON.stringify(userData));

      setUser(userData);

      toast({
        title: 'Account created',
        description: 'Your account has been successfully created.',
      });

      setIsLoading(false);
      navigate('/dashboard'); // Navigate to dashboard after successful signup
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Signup failed',
        description: 'This email is already registered or there was an issue.',
      });
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loanUser');
    localStorage.removeItem('userToken');
    toast({
      title: 'Logged out',
      description: "You've been successfully logged out.",
    });
    navigate('/login'); // Navigate to login page after logout
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
