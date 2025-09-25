import React, { createContext, ReactNode, useContext, useState } from 'react';

interface User {
  name: string;
  email: string;
  bio: string;
  skillsOffered: string[];
  skillsWanted: string[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const dummyUser: User = {
  name: 'Alice Example',
  email: 'test@student.com',
  bio: 'CS student who loves art and music. Here to exchange coding lessons for art tips!',
  skillsOffered: ['Java Programming', 'Guitar Basics'],
  skillsWanted: ['Digital Painting', 'French Language']
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Dummy authentication - accept assignment creds: test@student.com / 12345
    if (email === 'test@student.com' && password === '12345') {
      setIsLoggedIn(true);
      setUser(dummyUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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
