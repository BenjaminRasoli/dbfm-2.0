"use client";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => mounted && setTheme(isDark ? "light" : "dark")}
      className="relative w-16 h-8 rounded-full bg-gray-300 dark:bg-gray-800 flex items-center justify-between p-1 cursor-pointer transition-colors duration-300"
      aria-label="Toggle theme between light and dark"
    >
      {!mounted && <div className="w-6 h-6 rounded-full bg-white shadow-md" />}

      {mounted && (
        <motion.div
          className="w-6 h-6 bg-white dark:bg-yellow-400 rounded-full shadow-md flex items-center justify-center"
          initial={false}
          animate={{ x: isDark ? 32 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {isDark ? (
            <FiSun className="text-yellow-600" size={14} />
          ) : (
            <FiMoon className="text-black" size={14} />
          )}
        </motion.div>
      )}
    </button>
  );
}
