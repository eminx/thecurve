import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const getHslColor = (ratio) => {
  const hue = ratio * 360;
  return `hsl(${hue}, 100%, 33%)`;
};

function MainChart({ data, width, colors, isCompare, selectedCountries }) {
  const chartWidth = width > 980 ? 960 : width - 48;

  if (isCompare) {
    return (
      <div style={{ paddingTop: 12 }}>
        <LineChart width={chartWidth} height={400} data={data}>
          <CartesianGrid strokeDasharray="1 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip contentStyle={{ textAlign: 'left' }} />
          <Legend verticalAlign="top" align="right" iconType="circle" />
          {selectedCountries.map((country, index) => (
            <Line
              key={country.label}
              type="monotone"
              dataKey={country.label}
              stroke={getHslColor(index / selectedCountries.length)}
            />
          ))}
        </LineChart>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 12 }}>
      <AreaChart width={chartWidth} height={400} data={data} syncId="date">
        <CartesianGrid strokeDasharray="1 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip contentStyle={{ textAlign: 'left' }} />
        <Legend verticalAlign="top" align="right" iconType="circle" />
        <Area
          type="monotone"
          dataKey="diagnosed"
          stroke={colors.diagnosed}
          fill={colors.diagnosed}
        />
        <Area
          type="monotone"
          dataKey="unrecovered"
          stroke={colors.unrecovered}
          fill={colors.unrecovered}
        />
        <Area
          type="monotone"
          dataKey="recovered"
          stroke={colors.recovered}
          fill={colors.recovered}
        />
        <Area
          type="monotone"
          dataKey="died"
          stroke={colors.died}
          fill={colors.died}
        />
      </AreaChart>
    </div>
  );
}

export default MainChart;
