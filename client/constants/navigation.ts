import {
  LayoutDashboard,
  BrainCircuit,
  Sparkles,
  FileText,
  Settings,
} from "lucide-react";

export const navigationLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analysis",
    href: "/analysis",
    icon: BrainCircuit,
  },
  {
    title: "Simulation",
    href: "/simulation",
    icon: Sparkles,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];