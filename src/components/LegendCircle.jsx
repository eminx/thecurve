import React from 'react';
import { Heading } from 'bloomer';

const legendCircleStyle = (color) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: color,
  marginRight: 4,
});

function LegendCircle({ type, color, number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 24,
      }}
    >
      <div style={legendCircleStyle(color)} />
      <Heading style={{ marginBottom: 0 }}>
        <b style={{ fontSize: '150%' }}>{number}</b> {type}
      </Heading>
    </div>
  );
}

export default LegendCircle;
