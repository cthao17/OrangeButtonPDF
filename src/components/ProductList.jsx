import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductList = () => {
    const location = useLocation();
    const { data } = location.state || {};
    const navigate = useNavigate();

    const handleViewDetails = (product) => {
        navigate(`/product/${product?.ProdMfr?.Value}${product?.PowerSTC?.Unit}`, { state: { product } });
    };

    return (
        <div>
            <h2>Products</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th scope='col'>ProdType</th>
                        <th scope='col'>ProdMfr</th>
                        <th scope='col'>ProdName</th>
                        <th scope='col'>ProdCode</th>
                        <th scope='col'>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(data).map((key) => {
                        const product = data[key]?.ProdModule;
                        if (!product) {
                            return null;
                        }
                        return (
                            <tr key={key}>
                                <td>{product?.ProdType?.Value}</td>
                                <td>{product?.ProdMfr?.Value}</td>
                                <td>{product?.ProdName?.Value}</td>
                                <td>{product?.ProdCode?.Value}</td>
                                <td>
                                    <button onClick={() => handleViewDetails(product)} className='btn btn-secondary' type='button'>
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    {Object.keys(data).length === 0 && (
                        <tr>
                            <td colSpan='5'>
                                <h6>No products matched your search.</h6>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Pagination */}
            {/* Pagination Component */}
        </div>
    );
};

export default ProductList;