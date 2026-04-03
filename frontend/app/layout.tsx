import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinanceOS — Dashboard",
  description: "Modern financial tracking and analytics dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1d27",
                color: "#e2e8f0",
                border: "1px solid #2a2d3e",
                borderRadius: "10px",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#1a1d27" } },
              error: { iconTheme: { primary: "#f43f5e", secondary: "#1a1d27" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
