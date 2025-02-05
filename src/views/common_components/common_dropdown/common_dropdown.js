
import React from 'react';
import Select from 'react-select';

function CommonDropdown({ options, selectedValues, onChange, height, width }) {
    const customStyles = {
        control: (provided) => ({
            ...provided,
            height: height || 'auto',
            width: width || '100%',
        }),
        menu: (provided) => ({
            ...provided,
            width: width || '100%',
        }),
    };

    return (
        <Select
            options={options}
            labelField="name"
            valueField="id"
            value={selectedValues}
            onChange={(values) => onChange(values)}
            styles={customStyles}
        />
    );
}

export default CommonDropdown;
