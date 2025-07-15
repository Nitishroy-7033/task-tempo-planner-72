import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

// Demo credentials
const DEMO_CREDENTIALS = {
  email: "demo@studyplanner.com",
  password: "demo123"
};

const DEMO_USER = {
  id: "1",
  name: "Demo User",
  email: "demo@studyplanner.com"
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setUser(DEMO_USER);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoggedIn: !!user
  };

  return (
    <AuthContext.Provider value={value}>
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

export { DEMO_CREDENTIALS };