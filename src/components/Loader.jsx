import React from 'react';
import { Notification } from 'bloomer';

function Loader(props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <Notification>Loading data...</Notification>
    </div>
  );
}

export default Loader;
