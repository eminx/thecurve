import React, { PureComponent } from 'react';
import { Box, Heading, Title, Subtitle } from 'bloomer';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

import {
  MainChart,
  Loader,
  DataError,
  Selectors,
  WidgetGraph,
  WidgetAside,
  LegendCircle,
} from './components/';

import allCountries from './allCountries';

const apiEndpoint = 'https://pomber.github.io/covid19/timeseries.json';
const ipApi = 'https://ipapi.co/json';

const colors = {
  died: 'hsla(0, 100%, 51%, 1)',
  recovered: 'hsla(91, 100%, 51%, 1)',
  unrecovered: 'hsla(15, 100%, 51%, 1)',
  diagnosed: 'hsla(27, 100%, 51%, 1)',
};

const dates = ['last 30 days', 'last 7 days', 'since 22nd January'];

const populations = require('country-json/src/country-by-population.json');
console.log(populations.find((item) => item.country === 'Sri Lanka'));

class Drawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      allData: null,
      data: [],
      selectedCountry: null,
      currentCountry: null,
      selectedCountries: [],
      loading: true,
      countries: allCountries,
      dateIntervals: dates.map((date) => ({ label: date, value: date })),
      selectedDateInterval: dates[0],
      width:
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth,
      isBlocked: false,
      error: null,
      isCompare: false,
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
    this.setState({
      loading: true,
    });

    fetch(ipApi)
      .then((response) => response.json())
      .then((data) => {
        this.setState(
          {
            selectedCountry: data.country_name,
            currentCountry: data.country_name,
          },
          () => this.getData()
        );
      })
      .catch((error) => {
        this.setState({
          isBlocked: true,
          loading: false,
        });
      });
  };

  getData = () => {
    fetch(apiEndpoint)
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          this.setState({
            loading: false,
            isBlocked: true,
          });
          return null;
        }

        this.setState(
          {
            allData: {
              'United States': data['US'],
              ...data,
            },
          },
          () => this.setCountryBasedData()
        );
      })
      .catch((error) => {
        this.setState({
          error: error,
          isBlocked: true,
          loading: false,
        });
      });
  };

  setCountryBasedData = () => {
    const { allData, selectedCountry } = this.state;

    if (!allData) {
      this.getData();
      return;
    }

    const selectedCountryData = this.parseCountryData(selectedCountry);

    this.setState({
      data: selectedCountryData,
      loading: false,
    });
  };

  setCountriesCompareData = () => {
    const { allData, selectedCountries } = this.state;

    if (!allData) {
      this.getData();
      return;
    }

    if (selectedCountries.length === 0) {
      this.setState({
        data: [],
        loading: false,
      });
      return;
    }

    const wholeSet = {};
    const countries = selectedCountries.map((country) => country.label);
    selectedCountries.forEach((country) => {
      const countryData = this.parseCountryData(country.label);
      wholeSet[country.label] = countryData;
    });

    const dataSet = [];
    wholeSet[countries[0]].forEach((dailyData, mainIndex) => {
      const instance = {
        date: dailyData.date,
      };
      countries.forEach((country) => {
        instance[country] = wholeSet[country][mainIndex]['diagnosed'];
      });
      dataSet.push(instance);
    });

    this.setState({
      data: dataSet,
      loading: false,
    });
  };

  parseCountryData = (selectedCountry) => {
    const { allData } = this.state;
    const daysCount = this.getDaysCount();

    return allData[selectedCountry]
      .filter((info, index) => {
        if (daysCount === 0) {
          return true;
        }
        return index > allData[selectedCountry].length - daysCount - 1;
      })
      .map(({ date, confirmed, recovered, deaths }) => ({
        diagnosed: confirmed,
        recovered: recovered,
        unrecovered: confirmed - recovered - deaths,
        died: deaths,
        date: date.substring(5, date.length),
      }));
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

  handleCountrySelect = (country, type) => {
    const { isCompare } = this.state;

    if (isCompare) {
      this.setState(
        {
          selectedCountries: country || [],
        },
        () => this.setCountriesCompareData()
      );
      return;
    }

    if (!isCompare) {
      if (!country || this.state.selectedCountry === country.value) {
        return;
      }
    }

    this.setState(
      {
        selectedCountry: country.value,
      },
      () => this.setCountryBasedData()
    );
  };

  handleIntervalSelect = (interval) => {
    this.setState(
      {
        selectedDateInterval: interval.value,
      },
      () => this.setCountryBasedData()
    );
  };

  toggleCompare = (event, checked) => {
    const { selectedCountry, currentCountry } = this.state;
    const value = event.target.checked;

    if (value) {
      this.setState(
        {
          isCompare: true,
          selectedCountries: [
            {
              value: selectedCountry,
              label: selectedCountry,
            },
          ],
        },
        () => this.setCountriesCompareData()
      );
    } else {
      this.setState(
        {
          isCompare: false,
          selectedCountries: [],
          selectedCountry: currentCountry,
        },
        () => this.setCountryBasedData()
      );
    }
  };

  render() {
    const {
      data,
      countries,
      selectedCountry,
      selectedCountries,
      dateIntervals,
      selectedDateInterval,
      width,
      isBlocked,
      loading,
      isCompare,
    } = this.state;

    if (!selectedCountry && isBlocked) {
      return <DataError onButtonClick={() => this.getCountryByIP()} />;
    }

    if (loading) {
      return <Loader />;
    }

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
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              paddingLeft: 24,
            }}
          >
            <label>
              <Checkbox
                onChange={(checked) => this.toggleCompare(checked)}
                checked={isCompare}
              />{' '}
              Compare multiple countries
            </label>
          </div>
          <Box style={{ marginTop: 12 }}>
            <Selectors
              selectedCountry={selectedCountry}
              selectedCountries={selectedCountries}
              handleCountrySelect={this.handleCountrySelect}
              countries={countries}
              selectedDateInterval={selectedDateInterval}
              handleIntervalSelect={this.handleIntervalSelect}
              dateIntervals={dateIntervals}
              isMulti={isCompare}
            />
          </Box>

          <div>
            <Subtitle
              isSize={6}
              hasTextAlign="centered"
              style={{ marginBottom: 0 }}
            >
              Yesterday:
            </Subtitle>

            <div
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                flexWrap: 'wrap',
                flexBasis: 300,
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              {data &&
                data.length > 0 &&
                Object.keys(colors)
                  .filter((color) => color !== 'unrecovered')
                  .map((type, index) => (
                    <Heading key={type} style={{ paddingRight: 12 }}>
                      <b style={{ fontSize: '150%' }}>
                        {data[data.length - 1] &&
                          data[data.length - 1][type] -
                            data[data.length - 2][type]}
                      </b>{' '}
                      {type}
                    </Heading>
                  ))}
            </div>
          </div>

          <Box style={{ padding: 24 }}>
            <Subtitle
              isSize={6}
              hasTextAlign="centered"
              style={{ marginBottom: 0 }}
            >
              Total:
            </Subtitle>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              {Object.keys(colors).map((type, index) => (
                <LegendCircle
                  key={type}
                  type={type}
                  color={colors[type]}
                  number={data[data.length - 1] && data[data.length - 1][type]}
                />
              ))}
            </div>

            <Title
              hasTextAlign="centered"
              isSize={5}
              style={{ paddingRight: 24 }}
            >
              {selectedCountry}{' '}
              {selectedDateInterval === dates[2] ? ' ' : ' in '}{' '}
              {selectedDateInterval}
            </Title>

            {data && data.length > 0 && (
              <MainChart
                data={data}
                colors={colors}
                width={width}
                isCompare={isCompare}
                selectedCountries={selectedCountries}
              />
            )}
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
                <WidgetGraph
                  color={colors.diagnosed}
                  data={data}
                  dataKey="diagnosed"
                  width={width}
                />
              </div>

              <WidgetAside
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
                <WidgetGraph
                  color={colors.recovered}
                  data={data}
                  dataKey="recovered"
                  width={width}
                />
              </div>

              <WidgetAside
                upText="total of"
                center={
                  data &&
                  data[data.length - 1] &&
                  data[data.length - 1].recovered
                }
                downText="recovered"
              />
              <WidgetAside
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
                <WidgetGraph
                  color={colors.died}
                  data={data}
                  dataKey="died"
                  width={width}
                />
              </div>

              <WidgetAside
                upText="total of"
                center={
                  data && data[data.length - 1] && data[data.length - 1].died
                }
                downText="died"
              />
              <WidgetAside
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

export default Drawer;
