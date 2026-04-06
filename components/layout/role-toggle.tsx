"use client";

import { useFinanceStore } from "@/store/use-finance-store";

const RoleToggle = () => {
  const { role, setRole } = useFinanceStore();

  return (
    <div className="flex items-center bg-muted-foreground/15 p-1 rounded-full">
      <button
        onClick={() => setRole("admin")}
        className={`px-2 py-1 text-xs rounded-full cursor-pointer transition duration-300 ease-in-out ${role === "admin" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}
      >
        Admin
      </button>
      <button
        onClick={() => setRole("viewer")}
        className={`px-2 py-1 text-xs rounded-full cursor-pointer transition-all duration-300 ease-in-out ${role === "viewer" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}
      >
        Viewer
      </button>
    </div>
  );
};
export default RoleToggle;
