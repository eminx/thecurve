import React, { Children } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

function WidgetGraph({ colors, data, width, fill }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'stretch',
        alignItems: 'center',
        marginBottom: 48,
        borderBottom: '1px solid #f6f6f6',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flexBasis: 300 }}>
        <AreaChart
          width={width > 980 ? 480 : width > 720 ? width / 2 - 40 : width - 40}
          height={200}
          data={data}
          syncId="date"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="recovered" stroke={fill} fill={fill} />
        </AreaChart>
      </div>
      {children}
    </div>
  );
}
