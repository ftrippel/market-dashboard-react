import React, { useEffect, useRef } from 'react';
import { colors } from '../../utils/formatting';

interface SparklineProps {
  data: number[];
  positive?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, positive }) => {
  const isPositive = positive ?? (data.length > 0 ? data[data.length - 1] >= 0 : true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((v, i) => ({
      x: (i / (data.length - 1)) * (w - 2) + 1,
      y: h - ((v - min) / range) * (h - 4) - 2,
    }));

    // Draw gradient fill
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, h);
    ctx.lineTo(points[0].x, h);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    const color = isPositive ? colors.green : colors.red;
    gradient.addColorStop(0, color.replace(')', ', 0.25)').replace('rgb', 'rgba'));
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [data, isPositive]);

  return (
    <canvas
      ref={canvasRef}
      width={64}
      height={26}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  );
};
