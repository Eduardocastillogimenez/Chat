import { createContext, useContext, useState, useEffect } from "react";

const authContext = createContext();

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) throw new Error("No hay proveedor de autenticación");
    return context;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const loadingData = () => {
        setLoading(true);
    };

    const loadingFinish = () => {
      setLoading(false);
    };
  
    const login = (data) => {
        setUser({
          name: data.name,
          token: data.token,
          email: data.email
        });
    };
  
    const logout = () => {
        setUser(null);
    };

    // useEffect(() => {
    // }, []);
  
    return (
      <authContext.Provider
        value={{
          loadingData,
          loadingFinish,
          login,
          user,
          logout,
          loading,
        }}
      >
        {children}
      </authContext.Provider>
    );
  }