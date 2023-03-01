"use client";

import React, { useRef, useEffect, useState } from "react";
import * as fabric from "fabric";

const ObjectModifiedDemo = () => {
  const canvasElmRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<fabric.Canvas | null>(null);

  const initialized = useRef(false);

  const initCanvas = () => {
    if (initialized.current || !canvasElmRef.current) return;

    const canvas = new fabric.Canvas(canvasElmRef.current);
    canvas.setDimensions({ width: 500, height: 500 });

    // set canvas element and its extend element styles
    const lowerCanvasElm = canvas.getElement();
    const extendElm = lowerCanvasElm.parentElement as HTMLElement;
    extendElm.style.position = "absolute";
    extendElm.style.top = "0";
    extendElm.style.backgroundColor = "rgba(0, 0, 0, 0.7)";

    // add some boxes
    canvas.add(
      new fabric.Rect({
        left: 50,
        top: 50,
        width: 200,
        height: 200,
        stroke: "red",
        strokeWidth: 2,
        fill: "rgba(255, 0, 0, 0)",
        perPixelTargetFind: true,
      }),

      new fabric.Rect({
        left: 300,
        top: 200,
        width: 150,
        height: 200,
        stroke: "green",
        strokeWidth: 2,
        fill: "rgba(255, 0, 0, 0)",
        perPixelTargetFind: true,
      })
    );

    canvas.on("object:modified", (e) => {
      console.log("object:modified called");

      //   const objects = canvas.getObjects();
      //   canvas.remove(...objects);
      //   canvas.requestRenderAll();
    });

    initialized.current = true;
    canvasRef.current = canvas;
  };

  useEffect(initCanvas, [canvasElmRef]);

  return (
    <div>
      <div style={{ width: 500, height: 500 }}>
        <canvas ref={canvasElmRef} />
      </div>
      <div>
        <button
          style={{ background: "cyan", border: 0, padding: 10, width: 180 }}
          onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const objects = canvas.getObjects();
            canvas.remove(...objects);
            canvas.requestRenderAll();
          }}
        >
          delete all objects
        </button>
      </div>
    </div>
  );
};

export default ObjectModifiedDemo;
