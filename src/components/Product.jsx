function Product(props){

    const fields = ["ProdType", "ProdMfr", "ProdName", "Description", "ProdDatasheet", "FileFolderURL", "ProdCode", "ProdID"]
    // eventually wanna create js object mapping each item in arr - ProdType: prodtype (based on pdf input)
    return (
        <div id= "product-container"> 
            <div id="product-header">
                <h3>Product Name</h3>
                <h5>ProdCode: ____</h5>
            </div>
            <div id = "product-content">
                <h4>Product Information</h4>
                <div id="product-fields">
                    <table id="product-table">
                        <thead id="product-table-header">
                            <tr>
                                <th scope="col">Field</th>
                                <th scope="col">Value</th>
                                <th scope="col">Unit</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr id="tr-content">
                                <th scope="row">ProdType</th>
                                <td>Battery</td>
                                <td></td>
                                <td>
                                    <button id="show-more-btn">show more</button>
                                </td>
                            </tr>
                            <tr id="tr-content">
                                <th scope="row">ProdMfr</th>
                                <td>First Solar</td>
                                <td></td>
                                <td>
                                    <button id="show-more-btn">show more</button>
                                </td>
                            </tr>
                            <tr id="tr-content">
                                <th scope="row">ProdName</th>
                                <td></td>
                                <td></td>
                                <td>
                                    <button id="show-more-btn">show more</button>
                                </td>
                            </tr>
                            <tr id="tr-content">
                                <th scope="row">Description</th>
                                <td>9.8 kW</td>
                                <td></td>
                                <td>
                                    <button id="show-more-btn">show more</button>
                                </td>
                            </tr>
                            <tr id="tr-content">
                                <th scope="row">FileFolderURL</th>
                                <td></td>
                                <td></td>
                                <td>
                                    <button id="show-more-btn">show more</button>
                                </td>
                            </tr>
                            <tr id="tr-content">
                                <th scope="row">ProdCode</th>
                                <td>_________</td>
                                <td></td>
                                <td>
                                    <button id="show-more-btn">show more</button>
                                </td>
                            </tr>
                            <tr id="tr-content">
                                <th scope="row">ProdID</th>
                                <td>643789-2adhs</td>
                                <td></td>
                                <td>
                                    <button id="show-more-btn">show more</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default Product;