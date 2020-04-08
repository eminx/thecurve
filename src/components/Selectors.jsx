import React from 'react';
import Select from 'react-select';

function Selectors({
  selectedCountry,
  handleCountrySelect,
  countries,
  selectedDateInterval,
  handleIntervalSelect,
  dateIntervals,
}) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'stretch',
      }}
    >
      <Select
        isClearable
        placeholder={<b style={{ color: '#3e3e3e' }}>{selectedCountry}</b>}
        value={selectedCountry}
        onChange={handleCountrySelect}
        options={countries}
        styles={{
          container: (provided) => ({
            flexGrow: 1,
            paddingRight: 6,
            ...provided,
          }),
        }}
      />
      <Select
        isSearchable={false}
        placeholder={<b style={{ color: '#3e3e3e' }}>{selectedDateInterval}</b>}
        value={selectedDateInterval}
        onChange={handleIntervalSelect}
        options={dateIntervals}
        styles={{
          container: (provided) => ({ flexGrow: 1, ...provided }),
        }}
      />
    </div>
  );
}

export default Selectors;
