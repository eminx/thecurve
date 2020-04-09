import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

function MainChart({ data, width, colors }) {
  return (
    <AreaChart
      width={width > 980 ? 960 : width - 48}
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
