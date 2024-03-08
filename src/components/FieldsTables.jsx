import React from 'react';
import { useLocation } from 'react-router-dom';

const FieldsTables = ({ form }) => {

    const { state } = useLocation();
    const product = state && state.product;
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
                                const fieldValue = product.fieldName;// Assuming product is passed as 'products'
                                return (
                                    <tr key={fieldName}>
                                        <th scope='row'>{fieldName}</th>
                                        <td>{fieldValue}</td>
                                        <td>{/* Add unit if available */}</td>
                                        <td>
                                            {/* Show More button logic */}
                                        </td>
                                    </tr>
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