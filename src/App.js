import React from 'react';
import { Container, Heading, Subtitle } from 'bloomer';
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
          Covid-19 data per country visualised: diagnosis, recovery and death
          <br />
          updated thrice a day
        </Subtitle>
        <Drawer />
        <Container style={{ padding: 48, lineHeight: 2, maxWidth: 720 }}>
          <p style={{ fontSize: 14, lineHeight: 1.2, marginBottom: 24 }}>
            I built this mostly because I needed to see the curve myself and
            make sense of it. What I'd really like this to turn into is a set of
            opinionated & sophisticated content with meaningful graphs. For
            example, I'd love to receive data about the carbon emissions and add
            it into this, or any such climate change related data in relation to
            Covid-19 and the consequences of the pandemic it caused.
          </p>
          <p>
            Data retrieved from <a href={dataProvider}>Johns Hopkins</a> via{' '}
            <a href={dataParser}>@pomber</a> <br />
          </p>
          <p>
            Built with <a href="http://recharts.org/">Recharts</a>,{' '}
            <a href="https://bloomer.js.org/">Bloomer</a>,{' '}
            <a href="https://bulma.io">Bulma</a>,{' '}
            <a href="https://react-select.com">React Select</a> and{' '}
            <a href="https://reactjs.org">React</a> by{' '}
            <a href="https://github.com/eminx">Emin Durak</a>
          </p>
          <p>
            Wanna contribute? Please do so!{' '}
            <a href="https://github.com/eminx/thecurve">Create an issue</a> or{' '}
            <a href="mailto:emin@infinitesimals.space">send me an email</a>
          </p>
        </Container>
      </Container>
    </div>
  );
}

export default App;
