import React from 'react';

function CommonTextLabel({ text, className, style, textTransform, ...props }) {
    const combinedStyle = {
        textTransform: textTransform || 'none',
        ...style,
    };

    return (
        <div className={className} style={combinedStyle} {...props}>
            {text}
        </div>
    );
}

export default CommonTextLabel;
