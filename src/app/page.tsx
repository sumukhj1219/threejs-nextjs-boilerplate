"use client";
import React, { useEffect, useRef } from "react";

const Page = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    import("@/pkg/experience/Experience").then(({ default: Experience }) => {
      // @ts-ignore
      new Experience(canvasRef.current);
    });
  }, []);

  return <canvas ref={canvasRef} className="webgl"></canvas>;
};

export default Page;
