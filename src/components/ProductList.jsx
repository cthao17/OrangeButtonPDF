import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const ProductList = ({ pageProducts, searchQuery }) => {

    if (!pageProducts) {
        pageProducts = [
            {
                ProdType: 'Module',
                ProdMfr: 'Manufacturer A',
                ProdName: 'Product 1',
                Description:'500 W Module',
                ProdDatasheet:'',
                FileFolderURL:'',
                ProdCode: 'P001',
                ProdID: '1',
                IsCECListed:'Yes',
                CECListingDate:'',
                CECNotes:'',
                JunctionBoxProtectionCertification:'',
                PowerWarranty:'',
                ProductWarranty:''
            },
            {
                ProdType: 'Module',
                ProdMfr: 'Manufacturer B',
                ProdName: 'Product 2',
                Description:'500 W Module',
                ProdDatasheet:'',
                FileFolderURL:'',
                ProdCode: 'P001',
                ProdID: '2',
                IsCECListed:'Yes',
                CECListingDate:'',
                CECNotes:'',
                JunctionBoxProtectionCertification:'',
                PowerWarranty:'',
                ProductWarranty:''
            },
            {
                ProdType: 'Module',
                ProdMfr: 'Manufacturer C',
                ProdName: 'Product 3',
                Description:'500 W Module',
                ProdDatasheet:'',
                FileFolderURL:'',
                ProdCode: 'P001',
                ProdID: '3',
                IsCECListed:'Yes',
                CECListingDate:'',
                CECNotes:'',
                JunctionBoxProtectionCertification:'',
                PowerWarranty:'',
                ProductWarranty:''
            },
            {
                ProdType: 'Module',
                ProdMfr: 'Manufacturer D',
                ProdName: 'Product 4',
                Description:'500 W Module',
                ProdDatasheet:'',
                FileFolderURL:'',
                ProdCode: 'P001',
                ProdID: '4',
                IsCECListed:'Yes',
                CECListingDate:'',
                CECNotes:'',
                JunctionBoxProtectionCertification:'',
                PowerWarranty:'',
                ProductWarranty:''
            },
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