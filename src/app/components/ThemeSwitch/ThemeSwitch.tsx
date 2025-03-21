"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (mounted)
    return (
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="relative w-16 h-8 rounded-full bg-gray-300 dark:bg-gray-800 flex items-center justify-between p-1 cursor-pointer transition-colors duration-300"
      >
        <motion.div
          className="w-6 h-6 bg-white dark:bg-yellow-400 rounded-full shadow-md flex items-center justify-center"
          initial={{ x: resolvedTheme === "dark" ? 32 : 0 }}
          animate={{ x: resolvedTheme === "dark" ? 32 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {resolvedTheme === "dark" ? (
            <FiSun className="text-yellow-600" size={14} />
          ) : (
            <FiMoon className="text-black" size={14} />
          )}
        </motion.div>
      </button>
    );
}
