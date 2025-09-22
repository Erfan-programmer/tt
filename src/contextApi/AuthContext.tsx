"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface User {
  id: number;
  tid: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  mobile?: string;
  phone_number?: string;
  gender?: string;
  user_type?: string;
  type?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  country?: {
    id: number;
    name: string;
    code: string;
    dial_code: string;
  };
  plan?: {
    id: number;
    name: string;
    type: string;
    duration_months: number;
    user_percentage: string;
    company_percentage: string;
  };
  wallet?: {
    balance: string;
    commission: string;
    referral: string;
  };
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  setAuthInfo: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  fetchUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    if (savedUser && savedUser !== "undefined") setUser(JSON.parse(savedUser));
    if (token) setAccessToken(token);
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await apiRequest<{ data: User }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/me`,
        "GET",
        undefined,
        { Authorization: `Bearer ${loadUserData()?.access_token}` }
      );

      if (res.success && res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data.data));
      } else {
        setUser(null);
        logout();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const setAuthInfo = (user: User, token: string) => {
    setUser(user);
    setAccessToken(token);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("access_token", token);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [accessToken, fetchUserData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        setAuthInfo,
        logout,
        isAuthenticated: !!user && !!accessToken,
        fetchUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
