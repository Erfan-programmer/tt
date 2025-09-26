"use client";
import "@/styles/UserPnale/DashboardLayout.css";
import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store";
import { AuthProvider } from "@/contextApi/AuthContext";
import { HeaderProvider } from "@/contextApi/HeaderContext";
import { VerifyProvider } from "@/contextApi/TitanContext";
import DashboardClientWrapper from "@/components/Layouts/DashboardClientWrapper";
import { PaymentProvider } from "@/contextApi/PaymentProvider";
import { ThemeProvider } from "next-themes";

interface DashboardLayoutProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export default function DashboardLayout({ children }: DashboardLayoutProps) {

  return (
    <ReduxProvider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        storageKey="theme"
        enableSystem={true}
      >
     <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <PaymentProvider>
              <HeaderProvider>
                <VerifyProvider>
                  <DashboardClientWrapper>{children}</DashboardClientWrapper>
                </VerifyProvider>
              </HeaderProvider>
            </PaymentProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
