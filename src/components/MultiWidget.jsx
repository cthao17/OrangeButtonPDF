import React from 'react';

const MultiWidget = (widgetForm) => {
    const widget = {
        subwidgets_dict: {
            Value: 'Value Field',
            StartTime: 'Start Time Field',
            Decimals: 'Decimals Field',
            Unit: 'Unit Field',
            EndTime: 'End Time Field',
            Precision: 'Precision Field'
        }
    };

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
                    {widget.subwidgets_dict.Value && (
                        <>
                            <label htmlFor='Value'>{widget.subwidgets_dict.Value}</label>
                        </>
                    )}
                </div>
                <div className='col'>
                    {widget.subwidgets_dict.StartTime && (
                        <>
                            <label htmlFor='StartTime'>{widget.subwidgets_dict.StartTime}</label>
                        </>
                    )}
                </div>
                <div className='col'>
                    {widget.subwidgets_dict.Decimals && (
                        <>
                            <label htmlFor='Decimals'>{widget.subwidgets_dict.Decimals}</label>
                        </>
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
                    {widget.subwidgets_dict.Unit && (
                        <>
                            <label htmlFor='Unit'>{widget.subwidgets_dict.Unit}</label>
                        </>
                    )}
                </div>
                <div className='col'>
                    {widget.subwidgets_dict.EndTime && (
                        <>
                            <label htmlFor='EndTime'>{widget.subwidgets_dict.EndTime}</label>
                        </>
                    )}
                </div>
                <div className='col'>
                    {widget.subwidgets_dict.Precision && (
                        <>
                            <label htmlFor='Precision'>{widget.subwidgets_dict.Precision}</label>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MultiWidget;