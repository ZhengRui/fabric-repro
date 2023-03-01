"use client";

import React, { useRef, useEffect, useState } from "react";
import * as fabric from "fabric";

const AnimationDemo = () => {
  const RADIUS = 10;

  const canvasElmRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const circleRef = useRef<fabric.Circle | null>(null);

  const animationRef = useRef<NodeJS.Timer | null>(null);
  const [animate, setAnimate] = useState(false);
  const [radius, setRadius] = useState(RADIUS);
  const [hack, setHack] = useState(false);

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

    // add a circle
    const circle = new fabric.Circle();
    circle.set({
      radius: RADIUS,
      fill: "red",
      top: 245,
      left: 245,
    });
    canvas.add(circle);

    initialized.current = true;
    canvasRef.current = canvas;
    circleRef.current = circle;
  };

  const startAnimate = (hack: boolean = false) => {
    if (!circleRef.current) return;

    animationRef.current = setInterval(
      () =>
        circleRef.current?._animate(
          "radius",
          circleRef.current.radius === RADIUS ? 2.0 * RADIUS : RADIUS,
          {
            duration: 200,
            onChange: () => {
              hack && circleRef.current?.setRadius(circleRef.current.radius);
              canvasRef.current?.requestRenderAll();
              setRadius(circleRef.current?.radius!);
            },
            easing: fabric.util.ease.easeInOutCubic,
          }
        ),
      400
    );
  };

  const endAnimate = () => {
    if (!animationRef.current) return;

    clearInterval(animationRef.current);
    animationRef.current = null;
  };

  useEffect(initCanvas, [canvasElmRef]);

  useEffect(() => {
    endAnimate();
    animate && startAnimate(hack);
  }, [animate, hack]);

  return (
    <div>
      <div style={{ width: 500, height: 500 }}>
        <canvas ref={canvasElmRef} />
      </div>
      <div>
        <button
          style={{ background: "cyan", border: 0, padding: 10, width: 120 }}
          onClick={() => setAnimate(!animate)}
        >
          {animate ? "End" : "Start"} Animate
        </button>
        <button
          style={{
            background: "cyan",
            border: 0,
            padding: 10,
            width: 150,
            marginLeft: 10,
          }}
          onClick={() => setHack(!hack)}
        >
          Turn {hack ? "Off" : "On"} setRadius
        </button>
        <span style={{ marginLeft: 10 }}>circle radius: {radius}</span>
      </div>
    </div>
  );
};

export default AnimationDemo;
