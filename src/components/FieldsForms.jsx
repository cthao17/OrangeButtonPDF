import React, { useState } from 'react';
import MultiWidget from './MultiWidget';
import { useLocation } from 'react-router-dom';

const FieldsForms = () => {
  const [expandedFields, setExpandedFields] = useState({});
  const [openAccordionItems, setOpenAccordionItems] = useState({});
  const [activeTabs, setActiveTabs] = useState({});
  const { state } = useLocation();
  const product = state && state.product;

  const handleTabClick = (fieldName, index) => {
    setActiveTabs(prevState => ({
      ...prevState,
      [fieldName]: index,
    }));
  };

  const toggleField = (fieldName) => {
    setExpandedFields(prevState => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  const toggleAccordionItem = (fieldName) => {
    setOpenAccordionItems(prevState => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
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

  return (
    <div className='accordion'>
      {template.map((item, index) => (
        <div className='accordion-item' key={index}>
          {item.fieldNames.map((fieldName, fieldIndex) => {
            let info = product && product[fieldName];
            const accordionOpen = openAccordionItems[fieldName];
            const activeTab = activeTabs[fieldName] || 0;

            if (Array.isArray(info)) {
              return (
                <div key={fieldIndex}>
                  <h2 className='accordion-header' id={`${fieldName}-header`}>
                    <button
                      className={`accordion-button ${accordionOpen ? '' : 'collapsed'}`}
                      type='button'
                      onClick={() => toggleAccordionItem(fieldName)}
                      aria-expanded={accordionOpen}
                      aria-controls={fieldName}
                    >
                      {fieldName}
                    </button>
                  </h2>
                  <div
                    id={fieldName}
                    className={`accordion-collapse collapse ${accordionOpen ? 'show' : ''}`}
                    aria-labelledby={`${fieldName}-header`}
                  >
                    <div className='accordion-body'>
                      <ul className='nav nav-tabs' role='tablist'>
                        {info.map((tabItem, tabIndex) => (
                          <li className='nav-item' role='presentation' key={tabIndex}>
                            <button
                              className={`nav-link ${tabIndex === activeTab ? 'active' : ''}`}
                              id={`${fieldName}-${tabIndex}-tab`}
                              onClick={() => handleTabClick(fieldName, tabIndex)}
                              type='button'
                              role='tab'
                              aria-controls={`${fieldName}-${tabIndex}`}
                              aria-selected={tabIndex === activeTab}
                            >
                              #{tabIndex + 1}
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className='tab-content'>
                        {info.map((tabItem, tabIndex) => (
                          <div
                            className={`tab-pane fade ${tabIndex === activeTab ? 'show active' : ''}`}
                            id={`${fieldName}-${tabIndex}`}
                            role='tabpanel'
                            aria-labelledby={`${fieldName}-${tabIndex}-tab`}
                            key={tabIndex}
                          >
                            {/* Render the tab content based on the active tab */}
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
                                  {Object.entries(tabItem).map(([fieldLabel, fieldData]) => (
                                    <React.Fragment key={fieldLabel}>
                                      <tr>
                                        <th>{fieldLabel}</th>
                                        <td>{fieldData.Value}</td>
                                        <td>{fieldData.Unit}</td>
                                        <td>
                                          <button
                                            className='btn btn-secondary'
                                            type='button'
                                            onClick={() => toggleField(`${fieldName}-${fieldLabel}`)}
                                          >
                                            {expandedFields[`${fieldName}-${fieldLabel}`] ? 'Show Less' : 'Show More'}
                                          </button>
                                        </td>
                                      </tr>
                                      {expandedFields[`${fieldName}-${fieldLabel}`] && (
                                        <tr>
                                          <td colSpan='4'>
                                            <div className='card'>
                                              <MultiWidget form={fieldData}/>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              let accordionInfo = Array.isArray(info) ? info[0] : info;
              return (
                <div key={fieldIndex}>
                  <h2 className='accordion-header' id={`${fieldName}-header`}>
                    <button
                      className={`accordion-button ${accordionOpen ? '' : 'collapsed'}`}
                      type='button'
                      onClick={() => toggleAccordionItem(fieldName)}
                      aria-expanded={accordionOpen}
                      aria-controls={fieldName}
                    >
                      {fieldName}
                    </button>
                  </h2>
                  <div
                    id={fieldName}
                    className={`accordion-collapse collapse ${accordionOpen ? 'show' : ''}`}
                    aria-labelledby={`${fieldName}-header`}
                  >
                    <div className='accordion-body'>
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
                          {Object.entries(accordionInfo).map(([fieldLabel, fieldData]) => (
                            <React.Fragment key={fieldLabel}>
                              <tr>
                                <th>{fieldLabel}</th>
                                <td>{fieldData.Value}</td>
                                <td>{fieldData.Unit}</td>
                                <td>
                                  <button
                                    className='btn btn-secondary'
                                    type='button'
                                    onClick={() => toggleField(`${fieldName}-${fieldLabel}`)}
                                  >
                                    {expandedFields[`${fieldName}-${fieldLabel}`] ? 'Show Less' : 'Show More'}
                                  </button>
                                </td>
                              </tr>
                              {expandedFields[`${fieldName}-${fieldLabel}`] && (
                                <tr>
                                  <td colSpan='4'>
                                    <div className='card'>
                                      <MultiWidget form={fieldData}/>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default FieldsForms;
