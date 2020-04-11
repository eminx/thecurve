import React from 'react';
import Select from 'react-select';

function Selectors({
  selectedCountry,
  selectedCountries,
  handleCountrySelect,
  countries,
  selectedDateInterval,
  handleIntervalSelect,
  dateIntervals,
  isMulti,
}) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'stretch',
        flexWrap: isMulti ? 'wrap' : 'nowrap',
        paddingBottom: 12,
        borderBottom: '1px solid #ccc',
      }}
    >
      <Select
        isClearable
        isMulti={isMulti}
        placeholder={
          isMulti ? (
            'Select countries'
          ) : (
            <b style={{ color: '#3e3e3e' }}>{selectedCountry}</b>
          )
        }
        value={isMulti ? selectedCountries : selectedCountry}
        onChange={handleCountrySelect}
        options={countries}
        styles={{
          container: (provided) => ({
            flexGrow: 1,
            paddingRight: 6,
            paddingBottom: isMulti ? 6 : 0,
            flexBasis: isMulti ? 350 : '50%',
            ...provided,
          }),
          placeholder: (provided) => ({
            whiteSpace: 'nowrap',
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
          container: (provided) => ({
            flexGrow: 1,
            paddingRight: 6,
            ...provided,
          }),
          placeholder: (provided) => ({
            whiteSpace: 'nowrap',
            ...provided,
          }),
        }}
      />
    </div>
  );
}

export default Selectors;
