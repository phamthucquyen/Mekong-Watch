"use client";

import { useEffect, useRef } from "react";

function drawSatellite(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "#1a3a2a";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#1a4060";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.3);
  ctx.bezierCurveTo(width * 0.3, height * 0.25, width * 0.6, height * 0.38, width, height * 0.3);
  ctx.lineTo(width, height * 0.22);
  ctx.bezierCurveTo(width * 0.6, height * 0.28, width * 0.3, height * 0.18, 0, height * 0.22);
  ctx.fill();

  ctx.strokeStyle = "#1a4060";
  ctx.lineWidth = 3;
  for (let index = 0; index < 5; index += 1) {
    ctx.beginPath();
    ctx.moveTo(width * (0.1 + index * 0.18), 0);
    ctx.lineTo(width * (0.05 + index * 0.18), height);
    ctx.stroke();
  }

  [
    [0.12, 0.45, 0.22, 0.22],
    [0.42, 0.42, 0.28, 0.32],
    [0.08, 0.72, 0.18, 0.2],
    [0.52, 0.65, 0.34, 0.27]
  ].forEach(([x, y, w, h]) => {
    ctx.fillStyle = "#303030";
    ctx.fillRect(width * x, height * y, width * w, height * h);
    ctx.strokeStyle = "#252525";
    ctx.lineWidth = 0.8;

    for (let gx = width * x; gx < width * (x + w); gx += 10) {
      ctx.beginPath();
      ctx.moveTo(gx, height * y);
      ctx.lineTo(gx, height * (y + h));
      ctx.stroke();
    }

    for (let gy = height * y; gy < height * (y + h); gy += 10) {
      ctx.beginPath();
      ctx.moveTo(width * x, gy);
      ctx.lineTo(width * (x + w), gy);
      ctx.stroke();
    }
  });

  [
    [0.02, 0.55, 0.08, 0.13],
    [0.76, 0.5, 0.2, 0.18],
    [0.32, 0.74, 0.14, 0.18]
  ].forEach(([x, y, w, h]) => {
    ctx.fillStyle = "#2a5530";
    ctx.fillRect(width * x, height * y, width * w, height * h);
  });

  ctx.strokeStyle = "#484840";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.61);
  ctx.lineTo(width, height * 0.63);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width * 0.4, 0);
  ctx.lineTo(width * 0.38, height);
  ctx.stroke();
}

function drawOverlay(
  ctx: CanvasRenderingContext2D,
  xOffset: number,
  width: number,
  height: number,
  now: number
) {
  ctx.fillStyle = "#08121a";
  ctx.fillRect(xOffset, 0, width, height);

  ctx.fillStyle = "rgba(45,143,221,0.55)";
  ctx.beginPath();
  ctx.moveTo(xOffset, height * 0.3);
  ctx.bezierCurveTo(
    xOffset + width * 0.3,
    height * 0.25,
    xOffset + width * 0.6,
    height * 0.38,
    xOffset + width,
    height * 0.3
  );
  ctx.lineTo(xOffset + width, height * 0.22);
  ctx.bezierCurveTo(
    xOffset + width * 0.6,
    height * 0.28,
    xOffset + width * 0.3,
    height * 0.18,
    xOffset,
    height * 0.22
  );
  ctx.fill();

  ctx.strokeStyle = "rgba(45,143,221,0.7)";
  ctx.lineWidth = 3;
  for (let index = 0; index < 5; index += 1) {
    ctx.beginPath();
    ctx.moveTo(xOffset + width * (0.1 + index * 0.18), 0);
    ctx.lineTo(xOffset + width * (0.05 + index * 0.18), height);
    ctx.stroke();
  }

  [
    [0.02, 0.55, 0.08, 0.13],
    [0.76, 0.5, 0.2, 0.18],
    [0.32, 0.74, 0.14, 0.18]
  ].forEach(([x, y, w, h]) => {
    ctx.fillStyle = "rgba(59,186,106,0.5)";
    ctx.fillRect(xOffset + width * x, height * y, width * w, height * h);
    ctx.strokeStyle = "rgba(59,186,106,0.7)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(xOffset + width * x, height * y, width * w, height * h);
  });

  [
    [0.12, 0.45, 0.22, 0.22],
    [0.42, 0.42, 0.28, 0.32],
    [0.08, 0.72, 0.18, 0.2],
    [0.52, 0.65, 0.34, 0.27]
  ].forEach(([x, y, w, h]) => {
    ctx.fillStyle = "rgba(122,138,154,0.38)";
    ctx.fillRect(xOffset + width * x, height * y, width * w, height * h);
    ctx.strokeStyle = "rgba(160,175,190,0.55)";
    ctx.lineWidth = 1;
    ctx.strokeRect(xOffset + width * x, height * y, width * w, height * h);
  });

  const pulse = 0.35 + 0.1 * Math.sin(now / 700);
  [
    [0.12, 0.38, 0.22, 0.1],
    [0.42, 0.35, 0.26, 0.12]
  ].forEach(([x, y, w, h], index) => {
    ctx.fillStyle = `rgba(232,160,32,${index === 1 ? pulse : 0.38})`;
    ctx.strokeStyle = "rgba(232,160,32,0.85)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(xOffset + width * x, height * y, width * w, height * h, 4);
    ctx.fill();
    ctx.stroke();
  });

  ctx.font = "bold 8px monospace";
  ctx.fillStyle = "rgba(96,180,248,0.85)";
  ctx.fillText("WATER", xOffset + 4, height * 0.28);
  ctx.fillStyle = "rgba(59,186,106,0.85)";
  ctx.fillText("VEGETATION", xOffset + width * 0.77, height * 0.56);
  ctx.fillStyle = "rgba(180,190,200,0.85)";
  ctx.fillText("BUILT-UP", xOffset + width * 0.46, height * 0.52);
  ctx.fillStyle = "rgba(232,160,32,0.95)";
  ctx.fillText("RISK ZONE", xOffset + width * 0.44, height * 0.34);
}

export function MapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let animationFrame = 0;

    const render = (now: number) => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const midpoint = width / 2;
      context.clearRect(0, 0, width, height);

      drawSatellite(context, midpoint, height);
      drawOverlay(context, midpoint, midpoint, height, now);

      context.strokeStyle = "rgba(45,143,221,0.6)";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(midpoint, 0);
      context.lineTo(midpoint, height);
      context.stroke();

      context.fillStyle = "#0d1e30";
      context.strokeStyle = "rgba(45,143,221,0.7)";
      context.lineWidth = 1;
      context.beginPath();
      context.arc(midpoint, height / 2, 14, 0, Math.PI * 2);
      context.fill();
      context.stroke();

      context.fillStyle = "rgba(45,143,221,0.8)";
      context.font = "13px sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("⇔", midpoint, height / 2);

      animationFrame = window.requestAnimationFrame(render);
    };

    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="map-canvas" />;
}
