import React from 'react';
import PropTypes from 'prop-types';

const InputField = ({
    type,
    id,
    label,
    placeholder,
    text,
    ariaDescribedBy,
    value,
    onChange
}) => {
    return (
        <div className="form-group">
            {label && <label htmlFor={id}>{label}</label>}
            <input
                type={type}
                id={id}
                className="form-control"
                placeholder={placeholder}
                aria-describedby={ariaDescribedBy}
                value={value}
                onChange={onChange}
            />
            {text && <small id={ariaDescribedBy} className="form-text text-muted">{text}</small>}
        </div>
    );
};

// Define prop types
InputField.propTypes = {
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    text: PropTypes.string,
    ariaDescribedBy: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default InputField;
