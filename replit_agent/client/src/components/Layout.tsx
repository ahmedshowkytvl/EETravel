import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { usePreviewDimensions } from "@/hooks/use-dimensions";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dimensions = usePreviewDimensions();
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <div className="fixed bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-50">
        {dimensions.width} x {dimensions.height}
      </div>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;