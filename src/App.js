import React from 'react';
import { Container, Heading, Title, Subtitle } from 'bloomer';
import './App.css';
import 'bulma/css/bulma.css';

import Drawer from './Drawer';

const dataProvider = 'https://github.com/CSSEGISandData/COVID-19';
const dataParser = 'https://github.com/pomber/covid19';

function App() {
  return (
    <div className="App">
      <Container style={{ paddingTop: 12 }} hasTextAlign="centered">
        <Heading style={{ fontSize: 24, letterSpacing: -1 }}>
          <b>the Curve</b>
        </Heading>
        <Subtitle isSize={6} style={{ marginBottom: 0 }}>
          live data per country: related to Covid-19 diagnosis, recovery and
          death <br />
        </Subtitle>
        <Drawer />
        <Container style={{ padding: 48 }}>
          <Subtitle isSize={6}>
            data retrieved from <a href={dataProvider}>Johns Hopkins</a> via{' '}
            <a href={dataParser}>@pomber</a> <br />
            built with <a href="http://recharts.org/">Recharts</a>,{' '}
            <a href="https://bloomer.js.org/">Bloomer</a>,{' '}
            <a href="https://bulma.io">Bulma</a>,{' '}
            <a href="https://react-select.com">React Select</a> and{' '}
            <a href="https://reactjs.org">React</a> by{' '}
            <a href="https://github.com/eminx">Emin Durak</a>
          </Subtitle>
        </Container>
      </Container>
    </div>
  );
}

export default App;
