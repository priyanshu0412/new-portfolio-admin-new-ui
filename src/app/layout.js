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
      <body className={`${poppins.className} antialiased bg-gray-50`}>
        <ClientProvider>
<<<<<<< HEAD
          <SidebarWrapper>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { zIndex: 9999 },
              }}
            />
          </SidebarWrapper>
=======
          <Navbar />
          {/* Offset for desktop sidebar (w-60) and mobile top bar (h-14) */}
          <main className="xl:ml-60 pt-14 xl:pt-0 min-h-screen transition-all duration-300">
            <div className="p-6">
              {children}
            </div>
          </main>
>>>>>>> 57fbcc8 (feat: replace top navbar with clean collapsible sidebar UI)
        </ClientProvider>
      </body>
    </html>
  );
}
