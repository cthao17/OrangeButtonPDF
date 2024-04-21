import React from 'react';

const MultiWidget = (widget) => {
    // Destructure widget to access the form property directly
    const { form } = widget;

    // If form is undefined or null, initialize it as an empty object
    const formValues = form || {};

    return (
        <div className='card-body'>
            <div className='row'>
                <div className='col'>
                    <strong>Value</strong>
                </div>
                <div className='col'>
                    <strong>StartTime</strong>
                </div>
                <div className='col'>
                    <strong>Decimals</strong>
                </div>
            </div>
            <div className='row'>
                <div className='col'>
                    {formValues.Value ? (
                        <label htmlFor='Value'>{formValues.Value}</label>
                    ) : (
                        <div className="placeholder"></div>
                    )}
                </div>
                <div className='col'>
                    {formValues.StartTime ? (
                        <label htmlFor='StartTime'>{formValues.StartTime}</label>
                    ) : (
                        <div className="placeholder"></div>
                    )}
                </div>
                <div className='col'>
                    {formValues.Decimals ? (
                        <label htmlFor='Decimals'>{formValues.Decimals}</label>
                    ) : (
                        <div className="placeholder"></div>
                    )}
                </div>
            </div>
            <div className='row'>
                <div className='col'>
                    <strong>Unit</strong>
                </div>
                <div className='col'>
                    <strong>EndTime</strong>
                </div>
                <div className='col'>
                    <strong>Precision</strong>
                </div>
            </div>
            <div className='row'>
                <div className='col'>
                    {formValues.Unit ? (
                        <label htmlFor='Unit'>{formValues.Unit}</label>
                    ) : (
                        <div className="placeholder"></div>
                    )}
                </div>
                <div className='col'>
                    {formValues.EndTime ? (
                        <label htmlFor='EndTime'>{formValues.EndTime}</label>
                    ) : (
                        <div className="placeholder"></div>
                    )}
                </div>
                <div className='col'>
                    {formValues.Precision ? (
                        <label htmlFor='Precision'>{formValues.Precision}</label>
                    ) : (
                        <div className="placeholder"></div>
                    )}
                </div>
            </div>
            {/* Add similar rows for other properties */}
        </div>
    );
};

export default MultiWidget;