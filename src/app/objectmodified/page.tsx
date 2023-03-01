"use client";

import React, { useRef, useEffect, useState } from "react";
import * as fabric from "fabric";

const ObjectModifiedDemo = () => {
  const canvasElmRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const redBoxRef = useRef<fabric.Rect | null>(null);
  const greenBoxRef = useRef<fabric.Rect | null>(null);

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
    const redBox = new fabric.Rect({
      left: 50,
      top: 50,
      width: 200,
      height: 200,
      stroke: "red",
      strokeWidth: 2,
      fill: "rgba(255, 0, 0, 0)",
      perPixelTargetFind: true,
    });

    const greenBox = new fabric.Rect({
      left: 300,
      top: 200,
      width: 150,
      height: 200,
      stroke: "green",
      strokeWidth: 2,
      fill: "rgba(255, 0, 0, 0)",
      perPixelTargetFind: true,
    });

    canvas.add(redBox, greenBox);

    canvas.on("object:modified", (e) => {
      alert("object:modified called");

      if (e.target === greenBox) {
        const objects = canvas.getObjects();
        canvas.remove(...objects);
      }
      canvas.requestRenderAll();
    });

    initialized.current = true;
    canvasRef.current = canvas;
    redBoxRef.current = redBox;
    greenBoxRef.current = greenBox;
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

        <button
          style={{
            background: "cyan",
            border: 0,
            padding: 10,
            width: 100,
            marginLeft: 20,
          }}
          onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas || canvas.getObjects().length) return;

            canvas.add(redBoxRef.current!, greenBoxRef.current!);
            canvas.requestRenderAll();
          }}
        >
          reset
        </button>
      </div>
      <div> delete all objects does not trigger object:modified</div>
      <div> move red box triggers object:modified once</div>
      <div>
        {" "}
        move green box triggers object:modified twice because delete all objects
        inside its callback
      </div>
    </div>
  );
};

export default ObjectModifiedDemo;
