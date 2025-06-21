"use client";
import AppSidebar from "@/components/AppSidebar";
import Loading from "@/components/Loading";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [courseId, setCourseId] = useState<string | null>(null);
  const { user, isLoaded } = useUser();
  const isCoursePage = /^\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
    pathname
  );

  if (!isLoaded) return <Loading />;
  if (!user) return <div>Please sign in to access this page.</div>;

  return (
    <SidebarProvider>
      <div className="dashboard flex h-screen">
        <AppSidebar />
        <div className="dashboard__content flex-1 overlfow-auto">
          <div className={cn("dashboard__main")} style={{ height: "100vh" }}>
            <Navbar isCoursePage={isCoursePage} />
            <main className="dashboard__body h-full">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
