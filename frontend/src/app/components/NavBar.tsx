"use client"
import { useEffect } from "react";
import Link from "next/link";

const NavBar: React.FC = () => {
  useEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      // Simple check: token exists and is not empty
      if (!token) {
        window.location.href = "/login";
        return;
      }
      // Optionally, check if token is a valid JWT (not expired)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          // Token expired
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (e) {
        // Invalid token format
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  }, []);
  return (
    <header className="w-full bg-white shadow mb-6">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="BookNook Logo" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold text-black">BookNook</span>
        </div>
        <div className="flex gap-6">
          <Link href="/books" className="text-gray-700 hover:text-black font-medium">
            Books
          </Link>
          <Link href="/authors" className="text-gray-700 hover:text-black font-medium">
            Authors
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
