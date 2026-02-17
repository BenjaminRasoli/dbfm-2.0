"use client";

import Script from "next/script";

export function SafeBanner() {
  return (
    <Script
      src="https://www.safebanner.com/safebanner.js"
      data-position="bottom-left"
      data-theme="light"
      data-color="#2d99ff"
      data-company="DBFM"
      data-message="We use essential cookies for login via Firebase."
      data-accept-text="Got it"
      strategy="afterInteractive"
    />
  );
}
