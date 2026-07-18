"use client";

import { createContext, useContext } from "react";
import { signIn, signUp, signOut, useSession } from "../lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const session = useSession();
  const router = useRouter();
  
  const login = async (email, password) => {
    return await signIn.email({ 
      email, 
      password,
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to login");
        }
      }
    });
  };

  const register = async (name, email, password) => {
    return await signUp.email({ 
      name, 
      email, 
      password,
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to register");
        }
      }
    });
  };

  const logout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        }
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: session.data?.user || null,
        isAuthenticated: !!session.data?.user,
        isLoading: session.isPending,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
