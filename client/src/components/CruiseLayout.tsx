import React from "react";
import Footer from "./Footer";

interface CruiseLayoutProps {
  children: React.ReactNode;
}

const CruiseLayout: React.FC<CruiseLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <main className="flex-grow">{children}</main>
      {/* Footer is included in the main Layout */}
    </div>
  );
};

export default CruiseLayout;