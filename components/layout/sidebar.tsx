"use client";

import * as React from "react";

import { NavMain } from "@/components/layout/nav-menu";
import { NavSecondary } from "./nav-footer";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  Settings2Icon,
  CircleHelpIcon,
  LandmarkIcon,
  ReceiptIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";

const data = {
  user: {
    name: "Prasad Kumar",
    email: "prasadkumar@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: <ReceiptIcon />,
    },
    {
      title: "Insights",
      url: "/#",
      icon: <SparklesIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <div className="p-2 border"><LandmarkIcon className="size-5!" /></div>
                <div className="flex-col">
                  <h2 className="text-base font-extrabold">FinTrack </h2>
                  <p className="text-xs">Wealth Management</p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
