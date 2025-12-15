import React, { useEffect, useState } from 'react';

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
        setCurrentScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  // SVG parameters
  const radius = 30;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  let color = 'text-red-500';
  if (currentScore > 70) color = 'text-yellow-500';
  if (currentScore > 85) color = 'text-emerald-500';

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="currentColor"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-slate-800"
          />
          <circle
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s ease-out' }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={color}
          />
        </svg>
        <span className={`absolute text-xl font-bold ${color}`}>
            {currentScore}
        </span>
      </div>
      <span className="text-xs text-slate-400 mt-1">Optimized</span>
    </div>
  );
};

export default ScoreGauge;