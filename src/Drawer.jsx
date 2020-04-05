import React, { PureComponent } from 'react';
import { Box, Columns, Heading, Column, Title, Subtitle } from 'bloomer';
import Select from 'react-select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const apiEndpoint = 'https://pomber.github.io/covid19/timeseries.json';

const colors = {
  diagnosed: 'hsla(27, 100%, 51%, 1)',
  recovered: 'hsla(91, 100%, 51%, 1)',
  unrecovered: 'hsla(15, 100%, 51%, 1)',
  died: 'hsla(0, 100%, 51%, 1)',
};

const dates = ['last 30 days', 'last 7 days', 'since 22nd January'];

class Drawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedCountry: 'Norway',
      loading: true,
      countries: [],
      dateIntervals: dates.map((date) => ({ label: date, value: date })),
      selectedDateInterval: dates[0],
      width:
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth,
    };
  }

  componentDidMount() {
    this.getCountryByIP();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    this.setState({ width });
  };

  getCountryByIP = () => {
    fetch('https://ipapi.co/json')
      .then((response) => response.json())
      .then((data) => {
        this.setState(
          {
            selectedCountry: data.country_name,
          },
          () => this.getData()
        );
      });
  };

  getData = () => {
    const { selectedCountry } = this.state;
    if (!selectedCountry) {
      return;
    }
    const daysCount = this.getDaysCount();

    fetch(apiEndpoint)
      .then((response) => response.json())
      .then((data) => {
        if (!data || !data[selectedCountry]) {
          return null;
        }

        const newData = data[selectedCountry]
          .filter((info, index) => {
            if (daysCount === 0) {
              return true;
            }
            return index > data[selectedCountry].length - daysCount - 1;
          })
          .map(({ date, confirmed, recovered, deaths }) => ({
            diagnosed: confirmed,
            recovered: recovered,
            unrecovered: confirmed - recovered - deaths,
            died: deaths,
            date: date.substring(5, date.length),
          }));

        const countries = Object.keys(data);

        this.setState({
          data: newData,
          countries: countries.map((country) => ({
            label: country === 'US' ? 'United States' : country,
            value: country,
          })),
          loading: false,
        });
      });
  };

  getDaysCount = () => {
    const { selectedDateInterval } = this.state;
    switch (selectedDateInterval) {
      case dates[0]:
        return 30;
      case dates[1]:
        return 7;
      case dates[2]:
        return 0;
      default:
        return 30;
    }
  };

  handleCountrySelect = (country) => {
    if (!country) {
      return;
    }

    this.setState(
      {
        selectedCountry: country.value,
      },
      () => this.getData()
    );
  };

  handleIntervalSelect = (interval) => {
    this.setState(
      {
        selectedDateInterval: interval.value,
      },
      () => this.getData()
    );
  };

  render() {
    const {
      data,
      countries,
      selectedCountry,
      dateIntervals,
      selectedDateInterval,
      width,
    } = this.state;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 12,
          paddingBottom: 24,
        }}
      >
        <div>
          <Box style={{ marginTop: 12 }}>
            <Columns>
              <Column isSize={{ mobile: 12, desktop: 4 }}>
                <Select
                  isClearable
                  placeholder={
                    <b style={{ color: '#3e3e3e' }}>{selectedCountry}</b>
                  }
                  value={selectedCountry}
                  onChange={this.handleCountrySelect}
                  options={countries}
                />
              </Column>
              <Column isSize={{ mobile: 12, desktop: 4 }}>
                <Select
                  isSearchable={false}
                  placeholder={<b>{selectedDateInterval}</b>}
                  value={selectedDateInterval}
                  onChange={this.handleIntervalSelect}
                  options={dateIntervals}
                />
              </Column>
              <Column isSize={{ mobile: 12, desktop: 4 }}>
                <Subtitle isSize={5} hasTextAlign="right">
                  <em>
                    Numbers indicate total instances <b>by date</b>, not per
                    date.
                  </em>
                </Subtitle>
              </Column>
            </Columns>
          </Box>

          <Box style={{ padding: 24 }}>
            <Title isSize={4}>
              Total Numbers for {selectedCountry} in {selectedDateInterval}
            </Title>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                flexWrap: 'wrap',
              }}
            >
              {Object.keys(colors).map((type, index) => (
                <LegendCircle key={type} type={type} color={colors[type]} />
              ))}
            </div>
            <AreaChart
              width={width > 980 ? 960 : width - 48}
              height={500}
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
          </Box>

          <Box style={{ padding: 24 }}>
            <Title isSize={4}>Numbers in detail for {selectedCountry} </Title>

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
                  width={
                    width > 980
                      ? 480
                      : width > 720
                      ? width / 2 - 40
                      : width - 40
                  }
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
                  <Area
                    type="monotone"
                    dataKey="diagnosed"
                    stroke={colors.diagnosed}
                    fill={colors.diagnosed}
                  />
                </AreaChart>
              </div>

              <SideInfo
                upText="as of today, total of"
                center={
                  data &&
                  data[data.length - 1] &&
                  data[data.length - 1].diagnosed
                }
                downText="diagnosed"
              />
            </div>

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
                  width={
                    width > 980
                      ? 480
                      : width > 720
                      ? width / 2 - 40
                      : width - 40
                  }
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
                  <Area
                    type="monotone"
                    dataKey="recovered"
                    stroke={colors.recovered}
                    fill={colors.recovered}
                  />
                </AreaChart>
              </div>

              <SideInfo
                upText="total of"
                center={
                  data &&
                  data[data.length - 1] &&
                  data[data.length - 1].recovered
                }
                downText="recovered"
              />
              <SideInfo
                upText="with"
                center={
                  data &&
                  data[data.length - 1] &&
                  Math.round(
                    (data[data.length - 1].recovered /
                      data[data.length - 1].diagnosed) *
                      100
                  ) + '%'
                }
                downText="recovery rate"
              />
            </div>

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
                  width={
                    width > 980
                      ? 480
                      : width > 720
                      ? width / 2 - 40
                      : width - 40
                  }
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
                  <Area
                    type="monotone"
                    dataKey="died"
                    stroke={colors.died}
                    fill={colors.died}
                  />
                </AreaChart>
              </div>

              <SideInfo
                upText="total of"
                center={
                  data && data[data.length - 1] && data[data.length - 1].died
                }
                downText="died"
              />

              <SideInfo
                upText="with"
                downText="death rate"
                center={
                  data &&
                  data[data.length - 1] &&
                  Math.round(
                    (data[data.length - 1].died /
                      data[data.length - 1].diagnosed) *
                      100
                  ) + '%'
                }
              />
            </div>
          </Box>
        </div>
      </div>
    );
  }
}

const legendCircleStyle = (color) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: color,
  marginRight: 4,
});

function SideInfo({ upText, center, downText }) {
  return (
    <Subtitle
      style={{
        flexBasis: 120,
        flexGrow: 2,
        marginBottom: 0,
        textAlign: 'right',
        padding: 24,
      }}
    >
      {upText}
      <Heading style={{ fontSize: '2rem' }}>
        <b>{center}</b>{' '}
      </Heading>
      {downText}
    </Subtitle>
  );
}

function LegendCircle({ type, color }) {
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
      <Heading style={{ marginBottom: 0 }}>{type}</Heading>
    </div>
  );
}

export default Drawer;
