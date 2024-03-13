import React, { useState } from 'react';
import MultiWidget from './MultiWidget';

const FieldsForms = ({ form }) => {

    const forms = {
        object_form_dicts: [
            {
                name: 'Dimension',
                form: {
                    prefix: 'dimension',
                    fields: {
                        height: 'Value',
                        length: '',
                        mass: '',
                        weight: '',
                        width: ''
                    }
                },
            },
            {
                name: 'ProdCell',
                form: {
                    prefix: 'ProdCell',
                    CellColor: '',
                    CellCutType: '',
                    CellTechnologyType: '',
                }
            }, 
            {
                name: 'ProdGlazing',
                form: {
                    prefix: 'ProdGlazing',
                    Description: '',
                    FileFolderURL: '',
                    GlazingMaterial: '',
                    Height: '',
                }
            },
            {
                name: 'ModuleElectRatings',
                form: {
                    prefix: 'ModuleElectRatings',
                    CurrentAtMaximumPower: '',
                    CurrentShortCircuit: '',
                    ModuleRatingCondition: '',
                    PowerDC: '',
                    VoltageAtMaximumPower: '', // Corrected typo here
                    VoltageOpenCircuit: '',
                }
            },
        ],
        array_form_dicts: [
            {
                plural: 'testing',
                prefix_plural: 'plural_name',
                object_form_dicts: [
                    {
                        name: 'Form 1', // Added name property
                        form: {
                            prefix: 'form_prefix_1',
                            fields: {
                                // Define fields for this form
                            }
                        }
                    },
                    // Add more object form dictionaries as needed
                ]
            }
            // Add more array form dictionaries as needed
        ]
    };

    // State to manage the open/close status of accordion items
    const [openAccordionItems, setOpenAccordionItems] = useState([]);

    // Function to toggle the accordion item's open/close status
    const toggleAccordionItem = (prefix) => {
        if (openAccordionItems.includes(prefix)) {
            setOpenAccordionItems(openAccordionItems.filter(item => item !== prefix));
        } else {
            setOpenAccordionItems([...openAccordionItems, prefix]);
        }
    };

  return (
    <div className='accordion'>
      {Array.isArray(forms.object_form_dicts) && forms.object_form_dicts.map(fd => (
        <div className='accordion-item' key={fd.form.prefix}>
          <h2 className='accordion-header' id={`${fd.form.prefix}-header`}>
            <button 
              className={`accordion-button ${openAccordionItems.includes(fd.form.prefix) ? '' : 'collapsed'}`} 
              type='button' 
              onClick={() => toggleAccordionItem(fd.form.prefix)}
              aria-expanded={openAccordionItems.includes(fd.form.prefix)} 
              aria-controls={fd.form.prefix}
            >
              {fd.name}
            </button>
          </h2>
          <div 
            id={fd.form.prefix} 
            className={`accordion-collapse collapse ${openAccordionItems.includes(fd.form.prefix) ? 'show' : ''}`} 
            aria-labelledby={`${fd.form.prefix}-header`}
          >
            <div className='accordion-body'>
              <MultiWidget />
            </div>
          </div>
        </div>
      ))}
      {Array.isArray(forms.object_form_dicts) && forms.array_form_dicts.map(afd => (
        <div className='accordion-item' key={afd.prefix_plural}>
          <h2 className='accordion-header' id={`${afd.prefix_plural}-header`}>
            <button 
              className={`accordion-button ${openAccordionItems.includes(afd.prefix_plural) ? '' : 'collapsed'}`} 
              type='button' 
              onClick={() => toggleAccordionItem(afd.prefix_plural)}
              aria-expanded={openAccordionItems.includes(afd.prefix_plural)} 
              aria-controls={afd.prefix_plural}
            >
              {afd.plural}
            </button>
          </h2>
          <div 
            id={afd.prefix_plural} 
            className={`accordion-collapse collapse ${openAccordionItems.includes(afd.prefix_plural) ? 'show' : ''}`} 
            aria-labelledby={`${afd.prefix_plural}-header`}
          >
            <div className='accordion-body'>
              {afd.object_form_dicts.length ? (
                <>
                  <ul className='nav nav-tabs' role='tablist'>
                    {afd.object_form_dicts.map((fd, index) => (
                      <li className='nav-item' role='presentation' key={fd.form.prefix}>
                        <button className={`nav-link ${index === 0 ? 'active' : ''}`} id={`${fd.form.prefix}-tab`} data-bs-toggle='tab' data-bs-target={`#${fd.form.prefix}`} type='button' role='tab' aria-controls={fd.form.prefix} aria-selected={index === 0}>
                          #{index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className='tab-content'>
                    {afd.object_form_dicts.map((fd, index) => (
                      <div className={`tab-pane fade ${index === 0 ? 'show active' : ''}`} id={fd.form.prefix} role='tabpanel' aria-labelledby={`${fd.form.prefix}-tab`} key={fd.form.prefix}>
                        {/* Include the corresponding fields form component */}
                        {/* You can pass form as a prop to the included component */}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>No {afd.plural} have been added.</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FieldsForms;