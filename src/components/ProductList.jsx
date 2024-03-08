import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const ProductList = ({ pageProducts, searchQuery }) => {

    if (!pageProducts) {
        pageProducts = [
            {
                ProdType: 'Type 1',
                ProdMfr: 'Manufacturer A',
                ProdName: 'Product 1',
                ProdCode: 'P001',
                ProdID: '1'
            },
            {
                ProdType: 'Type 2',
                ProdMfr: 'Manufacturer B',
                ProdName: 'Product 2',
                ProdCode: 'P002',
                ProdID: '2'
            }
        ];
    }

    const navigate = useNavigate();

    const handleViewDetails = (product) => {
        navigate(`/product/${product.ProdID}`, { state: { product } });
    };

    return (
        <div>
            <h2>Products</h2>
            {/* Pagination */}
            {/* Pagination Component */}

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
                    {pageProducts.map(p => (
                        <tr key={p.ProdID}>
                            <td>{p.ProdType}</td>
                            <td>{p.ProdMfr}</td>
                            <td>{p.ProdName}</td>
                            <td>{p.ProdCode}</td>
                            <td>
                            <button onClick={() => handleViewDetails(p)} className='btn btn-secondary' type='button'>
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                    {pageProducts.length === 0 && (
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