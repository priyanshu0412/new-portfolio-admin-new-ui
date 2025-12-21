import { Poppins } from "next/font/google";
import "./globals.css";
import { ClientProvider, SidebarWrapper } from "@/components";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Priyanshu Agrawal | Admin",
  description: "Priyanshu Agrawal — Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <ClientProvider>
          <SidebarWrapper>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { zIndex: 9999 },
              }}
            />
          </SidebarWrapper>
        </ClientProvider>
      </body>
    </html>
  );
}
