import React from 'react';
import { useLocation } from 'react-router-dom';
import FieldsTables from './FieldsTables';
import FieldsForms from './FieldsForms';

const ProductDetail = () => {
    // Extract product details from location state
    const { state } = useLocation();
    const product = state && state.product;

    if (!product) {
        return <div>Loading...</div>;
    }

    const form = [
        {
            groupName: 'Product Information',
            fieldNames: [
                'ProdType',
                'ProdMfr',
                'ProdName',
                'Description',
                'ProdDatasheet',
                'FileFolderURL',
                'ProdCode',
                'ProdID'
            ]
        },
        {
            groupName: 'Certifications',
            fieldNames: [
                'IsCECListed',
                'CECListingDate',
                'CECNotes',
                'JunctionBoxProtectionCertification'
            ]
        },
        {
            groupName: 'Power/Product Warranties',
            fieldNames: [
                'PowerWarranty',
                'ProductWarranty'
            ]
        },
        {
            groupName: 'Details',
            fieldNames: [
                'BacksheetColor',
                'BacksheetMaterial',
                'BypassDiodeQuantity',
                'CableConnector',
                'CableCrossSectionArea',
                'CableLength',
                'CellCount',
                'CellStringsParallelQuantity',
                'CellsInSeries',
                'FrameColor',
                'FrameMaterialType',
                'FuseSeriesRating',
                'IsBIPV',
                'IsBifacial',
                'ModuleArea',
                'ModuleBusbarDescription',
                'ModuleEfficiency',
                'PowerSTC',
                'PowerToleranceMax',
                'PowerToleranceMin',
                'ShadeResponse',
                'TemperatureCoefficientMaxPowerCurrent',
                'TemperatureCoefficientMaxPowerVoltage',
                'TemperatureCoefficientMaximumPower',
                'TemperatureCoefficientOpenCircuitVoltage',
                'TemperatureCoefficientShortCircuitCurrent',
                'TemperatureMaximumOperating',
                'TemperatureMinimumOperating',
                'TemperatureNOCT',
                'VoltageMaximumSystem'
            ]
        }
    ];
    return (
        <div>
            <div className='container'>
                <h2>
                    {product.ProdMfr}
                    {product.ProdName && `: ${product.ProdName}`}
                </h2>
                <h6>ProdCode: {product.ProdCode}</h6>
            </div>
            <div className='container' style={{ marginTop: '2rem' }}>
                <FieldsTables form={form} />
                <FieldsForms form={form}/>
            </div>
            <div style={{ marginBottom: '2rem' }}></div> {/* Add space here */}
        </div>
    );
}

export default ProductDetail;