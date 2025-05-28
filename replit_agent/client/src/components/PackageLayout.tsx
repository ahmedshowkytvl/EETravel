import React from "react";

interface PackageLayoutProps {
  children: React.ReactNode;
}

const PackageLayout: React.FC<PackageLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <main className="flex-grow">{children}</main>
      {/* Footer is included in the main Layout */}
    </div>
  );
};

export default PackageLayout;