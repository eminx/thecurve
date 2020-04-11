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

function MainChart({ data, width, colors, isCompare, selectedCountries }) {
  const chartWidth = width > 980 ? 960 : width - 48;

  if (isCompare) {
    return (
      <LineChart
        width={chartWidth}
        height={400}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="1 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {selectedCountries.map((country) => (
          <Line
            key={data.date}
            type="monotone"
            dataKey={country.label}
            stroke="#8884d8"
          />
        ))}
      </LineChart>
    );
  }

  return (
    <AreaChart
      width={chartWidth}
      height={400}
      data={data}
      syncId="date"
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="1 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
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
  );
}

export default MainChart;
