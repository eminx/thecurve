import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Subtitle, Heading } from 'bloomer';

function WidgetGraph({ data, dataKey, width, color }) {
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
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} />
        </AreaChart>
      </div>
    </div>
  );
}

function WidgetAside({ upText, center, downText }) {
  return (
    <Subtitle
      style={{
        flexBasis: 120,
        flexGrow: 2,
        marginBottom: 0,
        textAlign: 'right',
        paddingRight: 24,
        paddingTop: 12,
        paddingBottom: 12,
      }}
    >
      {upText}
      <Heading style={{ fontSize: '1.8rem' }}>
        <b>{center}</b>{' '}
      </Heading>
      {downText}
    </Subtitle>
  );
}

export { WidgetGraph, WidgetAside };
