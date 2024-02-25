import React from 'react';
import Product from './Product';
import { Row, Col } from 'react-bootstrap';

function Results() {
    let products = [0,1,2,3,4,5,6,7,8,9,10]
    return(<>
    <Row>
        <Col>
            <h1 id="results-header">Results</h1>
            <p>Your input yielded (x) results</p>
        </Col>
        
    </Row>
    <Row>
        <Col>
            <div id="results">
                <Product/>
                {products.map(p => (
                    <Product key = {p}/>
                ))}
            </div>
        </Col>
    </Row>
    
    
    </>);
}

export default Results;