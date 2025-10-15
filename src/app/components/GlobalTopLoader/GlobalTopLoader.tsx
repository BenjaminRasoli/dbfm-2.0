"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import TopBarProgress from "react-topbar-progress-indicator";

TopBarProgress.config({
  barColors: {
    "0": "#29e",
    "1.0": "#0cf",
  },
  shadowBlur: 5,
});

export default function GlobalTopLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevPath = useRef<string>(pathname);

  useEffect(() => {
    setLoading(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
    }, 600);

    prevPath.current = pathname;
  }, [pathname]);

  return loading ? <TopBarProgress /> : null;
}
