import { motion } from 'framer-motion';

interface WeightLossGraphProps {
  companyName?: string;
  className?: string;
}

export default function WeightLossGraph({ companyName = 'Zappy', className = '' }: WeightLossGraphProps) {
  // Data points (percentage of starting weight) - more pronounced initial drop
  const withTreatment = [
    { month: 1, weight: 100 },
    { month: 2, weight: 96 },   // Steeper initial drop
    { month: 3, weight: 92.5 }, // Adjusted for smoother curve
    { month: 4, weight: 90 },   // Added point for smooth transition
    { month: 6, weight: 86 },
    { month: 9, weight: 82 },
    { month: 12, weight: 80 },
  ];

  const withoutTreatment = [
    { month: 1, weight: 100 },
    { month: 2, weight: 99.5 },  // Very gradual
    { month: 3, weight: 99 },
    { month: 4, weight: 98.5 },  // Added point for consistency
    { month: 6, weight: 97.5 },
    { month: 9, weight: 96.5 },
    { month: 12, weight: 96 },
  ];

  // Chart dimensions - responsive
  const width = 800;
  const height = 500;
  const padding = { top: 50, right: 60, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const xScale = (month: number) => {
    // Linear scale from month 1 to 12
    return padding.left + ((month - 1) / 11) * chartWidth;
  };

  const yScale = (weight: number) => {
    // 75% to 100% range
    const normalizedWeight = (weight - 75) / 25; // 0 to 1
    return padding.top + chartHeight - normalizedWeight * chartHeight;
  };

  // Generate perfectly smooth curve path using Cardinal splines with interpolation
  const generateSmoothPath = (points: typeof withTreatment) => {
    if (points.length === 0) return '';
    
    // Convert points to x,y coordinates
    const coords = points.map(p => ({
      x: xScale(p.month),
      y: yScale(p.weight)
    }));
    
    if (coords.length < 2) return '';
    
    let path = `M ${coords[0].x} ${coords[0].y}`;
    
    // Use Cardinal spline interpolation for perfectly smooth curves
    const tension = 0.05; // Extremely low for absolute maximum smoothness
    
    for (let i = 0; i < coords.length - 1; i++) {
      // Get surrounding points for better curve calculation
      const p0 = i > 0 ? coords[i - 1] : coords[i];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = i < coords.length - 2 ? coords[i + 2] : coords[i + 1];
      
      // Calculate control points using Cardinal spline formula
      // This creates smooth, continuous curves through all points
      const cp1x = p1.x + (p2.x - p0.x) / 6 * (1 - tension);
      const cp1y = p1.y + (p2.y - p0.y) / 6 * (1 - tension);
      
      const cp2x = p2.x - (p3.x - p1.x) / 6 * (1 - tension);
      const cp2y = p2.y - (p3.y - p1.y) / 6 * (1 - tension);
      
      // Create cubic bezier curve segment
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    
    return path;
  };

  // Generate area path (for gradient fill under primary curve)
  const generateAreaPath = (points: typeof withTreatment) => {
    const linePath = generateSmoothPath(points);
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    
    // Close the path at the bottom
    return `${linePath} L ${xScale(lastPoint.month)} ${padding.top + chartHeight} L ${xScale(firstPoint.month)} ${padding.top + chartHeight} Z`;
  };

  const withTreatmentPath = generateSmoothPath(withTreatment);
  const withTreatmentAreaPath = generateAreaPath(withTreatment);
  const withoutTreatmentPath = generateSmoothPath(withoutTreatment);

  // Y-axis gridlines
  const gridlines = [75, 80, 85, 90, 95, 100];
  const xAxisMonths = [
    { month: 1, label: 'Month 1' },
    { month: 12, label: 'Month 12' },
  ];

  return (
    <div className={`w-full overflow-visible ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro", sans-serif' }}
      >
        {/* Gradient definitions */}
        <defs>
          {/* Background gradient */}
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef8f2" />
            <stop offset="100%" stopColor="#f8f0e8" />
          </linearGradient>
          
          {/* Area fill gradient */}
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width={width} height={height} fill="url(#bgGradient)" rx="24" />

        {/* Y-Axis Label */}
        <text
          x={padding.left + 15}
          y={padding.top - 15}
          fill="#666666"
          fontSize="12"
          fontWeight="500"
          letterSpacing="0.5"
        >
          CURRENT WEIGHT
        </text>

        {/* Gridlines - subtle and minimal */}
        {gridlines.map((value) => (
          <g key={value}>
            <line
              x1={padding.left}
              y1={yScale(value)}
              x2={width - padding.right}
              y2={yScale(value)}
              stroke="rgba(0, 0, 0, 0.05)"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* X-Axis Labels */}
        {xAxisMonths.map(({ month, label }) => (
          <text
            key={month}
            x={xScale(month)}
            y={height - padding.bottom + 30}
            fill="#666666"
            fontSize="13"
            textAnchor="middle"
          >
            {label}
          </text>
        ))}

        {/* Area under WITH treatment curve */}
        <motion.path
          d={withTreatmentAreaPath}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />

        {/* WITHOUT treatment line (dashed gray) */}
        <motion.path
          d={withoutTreatmentPath}
          stroke="#666666"
          strokeWidth="2"
          strokeDasharray="6,6"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeInOut" }}
        />

        {/* WITHOUT treatment endpoint */}
        <motion.circle
          cx={xScale(12)}
          cy={yScale(96)}
          r="5"
          fill="#666666"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.4, type: "spring", stiffness: 200 }}
        />

        {/* WITH treatment line (bold coral) */}
        <motion.path
          d={withTreatmentPath}
          stroke="#FF6B6B"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 1.2, ease: "easeInOut" }}
        />

        {/* WITH treatment data points - only start and end */}
        {withTreatment.filter(p => p.month === 1 || p.month === 12).map((point, idx) => (
          <motion.circle
            key={point.month}
            cx={xScale(point.month)}
            cy={yScale(point.weight)}
            r={point.month === 1 ? 6 : 8}
            fill="#FF6B6B"
            stroke="white"
            strokeWidth="0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: point.month === 1 ? 0.5 : 1.9,
              duration: 0.4,
              type: "spring",
              stiffness: 200
            }}
          />
        ))}

        {/* WITH treatment label - MUCH bigger and higher */}
        <motion.g
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.9, duration: 0.5 }}
        >
          <rect
            x={xScale(12) - 170}
            y={yScale(80) - 70}
            width="160"
            height="38"
            rx="19"
            fill="#FF6B6B"
          />
          <text
            x={xScale(12) - 90}
            y={yScale(80) - 51}
            fill="white"
            fontSize="16"
            fontWeight="700"
            textAnchor="middle"
            dominantBaseline="middle"
            letterSpacing="0.4"
          >
            With {companyName}
          </text>
        </motion.g>

        {/* WITHOUT treatment label - bigger and away from line */}
        <motion.text
          x={xScale(12) - 170}
          y={yScale(96) + 28}
          fill="#666666"
          fontSize="15"
          fontWeight="600"
          letterSpacing="0.4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.7, duration: 0.5 }}
        >
          Diet and exercise
        </motion.text>

      </svg>
    </div>
  );
}
