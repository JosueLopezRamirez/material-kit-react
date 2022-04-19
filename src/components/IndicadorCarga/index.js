import React from "react";
import { MoonLoader } from "react-spinners";

export default function IndicadorCarga() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 300,
      }}
    >
      <MoonLoader size={50} color={"#4A90E2"} />
    </div>
  );
}
