import { createContext, useContext, useState, useEffect } from "react";

const authContext = createContext();

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) throw new Error("No hay proveedor de autenticación");
    return context;
};

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(() => {
      const cred = localStorage.getItem('credentials')
      if(cred) {
        setLoading(false);
        return JSON.parse(cred)
      } else {
        return null
      }
    });
  
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
          email: data.email,
          id: data.id
        });
        localStorage.setItem('credentials', JSON.stringify({
          name: data.name,
          token: data.token,
          email: data.email,
          id: data.id
        }))
    };
  
    const logout = () => {
        setUser(null);
        localStorage.removeItem('credentials');
    };
  
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