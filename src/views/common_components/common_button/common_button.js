// src/components/CommonButton.js
import React from 'react';
import { CButton } from '@coreui/react';
import PropTypes from 'prop-types';

const CommonButton = ({
    color = "primary",
    shape = "rounded-0",
    height,
    width,
    children,
    onClick,
    icon: Icon,
    iconStyle = {},
    textColor = '#fff'

}) => {
    // Inline style object
    const buttonStyle = {
        height: height || 'auto',
        width: width || 'auto',
        color: textColor || '#fff',

    };

    return (
        <CButton
            color={color}
            shape={shape}
            onClick={onClick}
            style={buttonStyle}
        >
            {Icon && <Icon style={{ ...iconStyle, }} />}
            {children}
        </CButton>
    );
};

// Prop types for validation
CommonButton.propTypes = {
    color: PropTypes.string,
    shape: PropTypes.string,
    height: PropTypes.string,
    width: PropTypes.string,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    icon: PropTypes.elementType, // Accepts a React component
};

export default CommonButton;



// // src/components/CommonButton.js
// import React from 'react';
// import { CButton } from '@coreui/react';
// import PropTypes from 'prop-types';

// const CommonButton = ({
//     color = "primary",
//     shape = "rounded-0",
//     height,
//     width,
//     children,
//     onClick,
//     icon: Icon,
//     iconStyle = {},
//     textColor = '#fff'
// }) => {

//     const buttonStyle = {
//         height: height || 'auto',
//         width: width || 'auto',
//         color: textColor || '#fff',
//     };

//     return (
//         <CButton
//             color={color}
//             shape={shape}
//             onClick={onClick}
//             style={buttonStyle}
//         >
//             {Icon && <Icon style={{ ...iconStyle, marginRight: '2%' }} />}
//             {children}
//         </CButton>
//     );
// };


// CommonButton.propTypes = {
//     color: PropTypes.string,
//     shape: PropTypes.string,
//     height: PropTypes.string,
//     width: PropTypes.string,
//     children: PropTypes.node.isRequired,
//     onClick: PropTypes.func,
//     icon: PropTypes.elementType,
//     iconStyle: PropTypes.object,
//     textColor: PropTypes.string,
// };

// export default CommonButton;
