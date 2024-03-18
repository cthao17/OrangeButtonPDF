import React, { useState } from 'react';
import MultiWidget from './MultiWidget';

const FieldsForms = ({ form }) => {
  const [expandedFields, setExpandedFields] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index); // Update active tab index
  };

  const toggleField = (fieldName) => {
    setExpandedFields(prevState => ({
        ...prevState,
        [fieldName]: !prevState[fieldName]
    }));
};

  const forms = {
    object_form_dicts: [
        {
            name: 'Dimension',
            form: {
                Height: { value: '', unit: 'cm' },
                Length: { value: '', unit: 'm' },
                Mass: { value: '', unit: 'kg' },
                Weight: { value: '', unit: 'N' },
                Width: { value: '', unit: 'm' }
            },
        },
        {
            name: 'ProdCell',
            form: {
                CellColor: { value: '', unit: '' }, // You can set the unit to an empty string if not applicable
                CellCutType: { value: '', unit: '' },
                CellTechnologyType: { value: '', unit: '' },
            }
        }, 
        {
            name: 'ProdGlazing',
            form: {
                Description: { value: '', unit: '' },
                FileFolderURL: { value: '', unit: '' },
                GlazingMaterial: { value: '', unit: '' },
                Height: { value: '', unit: 'm' },
            }
        },
        {
            name: 'ModuleElectRatings',
            array_form_dicts:[
              {
                form: {
                CurrentAtMaximumPower: { value: '', unit: 'A' },
                CurrentShortCircuit: { value: '', unit: 'A' },
                ModuleRatingCondition: { value: '', unit: '' },
                PowerDC: { value: '', unit: 'W' },
                VoltageAtMaximumPower: { value: '', unit: 'V' },
                VoltageOpenCircuit: { value: '', unit: 'V' },
                }
              }
            ]
        },
        {
          name: 'AlternativeIdentifier',
        },
        {
          name: 'Packages',
        },
        {
          name: 'ProdCertifications',
          array_form_dicts:
            {
              froms1: {
                CertificateValue: { value: '1', unit: '' },
                CertificationDate: { value: '1', unit: '' },
                CertificationName: { value: '', unit: '' },
                CertificationStandard: { value: '', unit: '' },
                Description: { value: '', unit: '' },
                FileFolderURL: { value: '', unit: '' },
                CertificationAgency: { 
                    name: 'CertificationAgency', 
                    CertificationAgencyName: { value: '', unit: '' },
                    Description: { value: '', unit: '' },
                },
                FirmwareVersions: { value: '', unit: '' },
              },
              froms2: {
                  CertificateValue: { value: '2', unit: '' },
                  CertificationDate: { value: '2', unit: '' },
                  CertificationName: { value: '', unit: '' },
                  CertificationStandard: { value: '', unit: '' },
                  Description: { value: '', unit: '' },
                  FileFolderURL: { value: '', unit: '' },
                  CertificationAgency: { 
                      name: 'CertificationAgency', 
                      CertificationAgencyName: { value: '', unit: '' },
                      Description: { value: '', unit: '' },
                  },
                  FirmwareVersions: { value: '', unit: '' },
              },
              froms3: {
                  CertificateValue: { value: '3', unit: '' },
                  CertificationDate: { value: '3', unit: '' },
                  CertificationName: { value: '', unit: '' },
                  CertificationStandard: { value: '', unit: '' },
                  Description: { value: '', unit: '' },
                  FileFolderURL: { value: '', unit: '' },
                  CertificationAgency: { 
                      name: 'CertificationAgency', 
                      CertificationAgencyName: { value: '', unit: '' },
                      Description: { value: '', unit: '' },
                  },
                  FirmwareVersions: { value: '', unit: '' },
              },
            }
        },
        {
          name: 'ProdInstructions',
        },
        { 
          name: 'ProdSpecifications',
        },
        {
          name: 'Warranties',
        }
    ]
  };

    // State to manage the open/close status of accordion items
    const [openAccordionItems, setOpenAccordionItems] = useState([]);

    // Function to toggle the accordion item's open/close status
    const toggleAccordionItem = (name) => {
        if (openAccordionItems.includes(name)) {
            setOpenAccordionItems(openAccordionItems.filter(item => item !== name));
        } else {
            setOpenAccordionItems([...openAccordionItems, name]);
        }
    };

    return (
      <div className='accordion'>
        {Array.isArray(forms.object_form_dicts) && forms.object_form_dicts.map(fd => (
          <div className='accordion-item' key={fd.name}>
            <h2 className='accordion-header' id={`${fd.name}-header`}>
              <button 
                className={`accordion-button ${openAccordionItems.includes(fd.name) ? '' : 'collapsed'}`} 
                type='button' 
                onClick={() => toggleAccordionItem(fd.name)}
                aria-expanded={openAccordionItems.includes(fd.name)} 
                aria-controls={fd.name}
              >
                {fd.name}
              </button>
            </h2>
            <div 
              id={fd.name} 
              className={`accordion-collapse collapse ${openAccordionItems.includes(fd.name) ? 'show' : ''}`} 
              aria-labelledby={`${fd.name}-header`}
            >
              <div className='accordion-body'>
                {fd.form && (
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
                        {Object.entries(fd.form).map(([fieldLabel, fieldData]) => (
                          <React.Fragment key={fieldLabel}>
                            <tr>
                              <th>{fieldLabel}</th>
                              <td>{fieldData.value}</td>
                              <td>{fieldData.unit}</td>
                              <td>
                                <button 
                                  className='btn btn-secondary' 
                                  type='button' 
                                  onClick={() => toggleField(fieldLabel)}>
                                  {expandedFields[fieldLabel] ? 'Show Less' : 'Show More'}
                                </button>
                              </td>
                            </tr>
                            {expandedFields[fieldLabel] && (
                              <tr>
                                <td colSpan='4'>
                                  <div className='card'>
                                    <MultiWidget />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Check if fd contains array_form_dicts */}
                {fd.array_form_dicts && (
                  <div>
                  {Object.keys(fd.array_form_dicts).length ? (
                <>
                  <ul className='nav nav-tabs' role='tablist'>
                    {Object.keys(fd.array_form_dicts).map((key, index) => (
                      <li className='nav-item' role='presentation' key={key}>
                        <button 
                          className={`nav-link ${index === activeTab ? 'active' : ''}`} 
                          id={`${key}-tab`} 
                          onClick={() => handleTabClick(index)} // Handle tab click
                          data-bs-toggle='tab' 
                          data-bs-target={`#${key}`} 
                          type='button' 
                          role='tab' 
                          aria-controls={key} 
                          aria-selected={index === activeTab}
                        >
                          #{index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className='tab-content'>
                    {Object.keys(fd.array_form_dicts).map((key, index) => (
                      <div className={`tab-pane fade ${index === activeTab ? 'show active' : ''}`} id={key} role='tabpanel' aria-labelledby={`${key}-tab`} key={key}>
                        {/* Render the form based on the active tab */}
                        {fd.array_form_dicts[key] && (
                          <>
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
                                {Object.entries(fd.array_form_dicts[key]).map(([fieldLabel, fieldData]) => (
                                  <React.Fragment key={fieldLabel}>
                                    <tr>
                                      <th>{fieldLabel}</th>
                                      <td>{fieldData.value}</td>
                                      <td>{fieldData.unit}</td>
                                      <td>
                                        <button 
                                          className='btn btn-secondary' 
                                          type='button' 
                                          onClick={() => toggleField(fieldLabel)}
                                        >
                                          {expandedFields[fieldLabel] ? 'Show Less' : 'Show More'}
                                        </button>
                                      </td>
                                    </tr>
                                    {expandedFields[fieldLabel] && (
                                      <tr>
                                        <td colSpan='4'>
                                          <div className='card'>
                                            <MultiWidget />
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                ))}
                              </tbody>
                            </table>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>No {fd.name} have been added.</p>
              )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
};

export default FieldsForms;