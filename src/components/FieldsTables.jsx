import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MultiWidget from './MultiWidget';

const FieldsTables = ({ form }) => {
    const { state } = useLocation();
    const product = state && state.product;

    const [expandedFields, setExpandedFields] = useState({});

    const toggleField = (fieldName) => {
        setExpandedFields(prevState => ({
            ...prevState,
            [fieldName]: !prevState[fieldName]
        }));
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {form.map(({ groupName, fieldNames }) => (
                <div key={groupName}>
                    <h4>{groupName}</h4>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th scope='col'>Field</th>
                                <th scope='col'>Value</th>
                                <th scope='col'>Unit</th>
                                <th scope='col'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(fieldNames) && fieldNames.map(fieldName => {
                                const fieldValue = product[fieldName];
                                const isExpanded = expandedFields[fieldName];

                                return (
                                    <React.Fragment key={fieldName}>
                                        <tr>
                                            <th scope='row'>{fieldName}</th>
                                            <td>{fieldValue}</td>
                                            <td>{/* Add unit if available */}</td>
                                            <td>
                                                <button 
                                                    className='btn btn-secondary' 
                                                    type='button' 
                                                    onClick={() => toggleField(fieldName)}
                                                >
                                                    {isExpanded ? 'Show Less' : 'Show More'}
                                                </button>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan='4'>
                                                    <div className='card'>
                                                        <MultiWidget />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default FieldsTables;