import React from 'react';
import { Container, Button, Notification } from 'bloomer';

function DataError({ onButtonClick }) {
  return (
    <div style={{ padding: 24, maxWidth: 480, margin: '0 auto' }}>
      <Notification isColor="warning">
        We can not fetch data. Seems like either there's an internet connection
        problem, or you may have a blocker that prevents fetching data from
        external resources. Please check your browser settings and see if you
        have installed an extension that prevents data fetching.
      </Notification>
      <Container>
        <Button onClick={onButtonClick}>Try again</Button>
      </Container>
    </div>
  );
}

export default DataError;
