"use client";
import React from "react";
import Snowfall from "react-snowfall";

function SnowfallTop() {
  const month = new Date().getMonth();

  if (month !== 11 && month !== 0) return null;

  return (
    <>
      <Snowfall
        style={{
          position: "fixed",

          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
        }}
        snowflakeCount={100}
        radius={[1, 4]}
        speed={[0.5, 2]}
      />
    </>
  );
}

export default SnowfallTop;
