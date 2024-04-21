import React, { useState } from 'react';
import MultiWidget from './MultiWidget';
import { useLocation } from 'react-router-dom';

const FieldsForms = () => {
  const [expandedFields, setExpandedFields] = useState({});
  const [openAccordionItems, setOpenAccordionItems] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const { state } = useLocation();
  const product = state && state.product;

  const handleTabClick = (index) => {
    setActiveTab(index); // Update active tab index
  };

  const toggleField = (fieldName) => {
    setExpandedFields(prevState => ({
        ...prevState,
        [fieldName]: !prevState[fieldName]
    }));
  };

  const template = [
    {
      fieldNames: [
          'Dimension',
          'ProdCell',
          'ProdGlazing',
          'ModuleElectRatings',
          'AlternativeIdentifiers',
          'Packages',
          'ProdCertifications',
          'ProdInstructions',
          'ProdSpecifications',
          'Warranties'
      ]
    }
  ];

  // Function to toggle the accordion item's open/close status
  const toggleAccordionItem = (fieldName) => {
    if (openAccordionItems.includes(fieldName)) {
      setOpenAccordionItems(openAccordionItems.filter(item => item !== fieldName));
    } else {
      setOpenAccordionItems([...openAccordionItems, fieldName]);
    }
  };

  return (
    <div className='accordion'>
      {template.map((item, index) => (
        <div className='accordion-item' key={index}>
          {item.fieldNames.map((fieldName, fieldIndex) => {
            let info = product && product.ProdModule[fieldName];
            if(Array.isArray(info)) {
              info = info[0]; //gets the first object that contains all the JSON data for that field
            }
            return (
              <div key={fieldIndex}>
                <h2 className='accordion-header' id={`${fieldName}-header`}>
                  <button 
                    className={`accordion-button ${openAccordionItems.includes(fieldName) ? '' : 'collapsed'}`} 
                    type='button' 
                    onClick={() => toggleAccordionItem(fieldName)}
                    aria-expanded={openAccordionItems.includes(fieldName)} 
                    aria-controls={fieldName}
                  >
                    {fieldName}
                  </button>
                </h2>
                <div 
                  id={fieldName} 
                  className={`accordion-collapse collapse ${openAccordionItems.includes(fieldName) ? 'show' : ''}`} 
                  aria-labelledby={`${fieldName}-header`}
                >
                  <div className='accordion-body'>
                    {info && (
                      <div>
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
                            {Object.entries(info).map(([fieldLabel, fieldData]) => {                                
                              return (
                                <React.Fragment key={fieldLabel}>
                                  <tr>
                                    <th>{fieldLabel}</th>
                                    <td>{fieldData.Value}</td>
                                    <td>{fieldData.Unit}</td>
                                    <td>
                                      <button 
                                        className='btn btn-secondary' 
                                        type='button' 
                                        onClick={() => toggleField(fieldLabel)}
                                      >
                                        {expandedFields[fieldName] ? 'Show Less' : 'Show More'}
                                      </button>
                                    </td>
                                  </tr>
                                  {expandedFields[fieldName] && (
                                    <tr key={`${fieldName}-details`}>
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
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default FieldsForms;