
import { useEffect, useState } from 'react';
import { api } from '../../../api/api';
import { FaPrint, FaBoxes } from 'react-icons/fa';

const StockList = () => {
  const [data, setData] = useState({
    bulkPhones: [],
    singlePhones: [],
  });
  const [filter, setFilter] = useState('all'); // 'all', 'bulk', 'single'
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAccessoryModal, setShowAccessoryModal] = useState(false);
  const [accessories, setAccessories] = useState([]);
  const [loadingAccessories, setLoadingAccessories] = useState(false);

  const getAllStock = async () => {
    const response = await api.get('/api/purchase/all-purchase-phone');
    setData(response?.data.data || { bulkPhones: [], singlePhones: [] });
    return response?.data || [];
  };

  useEffect(() => {
    getAllStock();
  }, []);

  const toggleItemSelection = (id, type) => {
    const itemId = `${type}-${id}`;
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((item) => item !== itemId)
        : [...prev, itemId]
    );
  };

  
  const selectAllItems = () => {
    let itemsToSelect = [];

    if (filter === 'all') {
      itemsToSelect = [
        ...data.bulkPhones.map((phone) => `bulk-${phone._id}`),
        ...data.singlePhones.map((phone) => `single-${phone._id}`),
      ];
    } else if (filter === 'bulk') {
      itemsToSelect = data.bulkPhones.map((phone) => `bulk-${phone._id}`);
    } else if (filter === 'single') {
      itemsToSelect = data.singlePhones.map((phone) => `single-${phone._id}`);
    }

    setSelectedItems(itemsToSelect);
  };

  // Deselect all items
  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  // Check if all items in current view are selected
  const areAllItemsSelected = () => {
    if (filter === 'all') {
      const allBulkSelected = data.bulkPhones.every((phone) =>
        selectedItems.includes(`bulk-${phone._id}`)
      );
      const allSingleSelected = data.singlePhones.every((phone) =>
        selectedItems.includes(`single-${phone._id}`)
      );
      return allBulkSelected && allSingleSelected;
    } else if (filter === 'bulk') {
      return data.bulkPhones.every((phone) =>
        selectedItems.includes(`bulk-${phone._id}`)
      );
    } else if (filter === 'single') {
      return data.singlePhones.every((phone) =>
        selectedItems.includes(`single-${phone._id}`)
      );
    }
    return false;
  };


  const printSelected = async () => {
    try {
      const selectedBulkIds = selectedItems
        .filter((id) => id.startsWith('bulk-'))
        .map((id) => id.replace('bulk-', ''));

      const selectedSingleIds = selectedItems
        .filter((id) => id.startsWith('single-'))
        .map((id) => id.replace('single-', ''));

      const selectedBulkPhones = data.bulkPhones.filter((phone) =>
        selectedBulkIds.includes(phone._id)
      );

      const selectedSinglePhones = data.singlePhones.filter((phone) =>
        selectedSingleIds.includes(phone._id)
      );

      const printContent = preparePrintContent(
        selectedBulkPhones,
        selectedSinglePhones
      );

      // Create print window
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      printWindow.document.open();
      printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Stock List Print</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 10mm; 
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .phone-item { 
              margin-bottom: 20px; 
              border-bottom: 1px solid #eee; 
              padding-bottom: 10px; 
              page-break-inside: avoid;
            }
            .header { 
              font-weight: bold; 
              margin-bottom: 5px; 
            }
            .imei { 
              font-size: 14px; 
            }
            .phone-info {
              margin-top: 5px;
              font-size: 14px;
            }
            @page { 
              size: auto; 
              margin: 5mm; 
            }
            @media print {
              body { 
                padding: 0 !important;
                margin: 0 !important;
              }
            }
          </style>
        </head>
        <body>
          <h1 style="text-align: center; margin-bottom: 20px;">Stock List</h1>
          <div style="margin-bottom: 10px;">
            <strong>Printed on:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
          </div>
          <div style="margin-bottom: 20px;">
            <strong>Total Items:</strong> ${selectedItems.length} 
            (${selectedBulkPhones.length} bulk, ${selectedSinglePhones.length} single)
          </div>
          ${printContent}
          <script>
            // Print automatically when content loads
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
      printWindow.document.close();
    } catch (error) {
      console.error('Printing failed:', error);
      alert('Printing failed: ' + error.message);
    }
  };
  const getAllAccessoriesData = async () => {
    try {
      setLoadingAccessories(true);
      const response = await api.get('/api/accessory/');
      console.log("accessories", response?.data);
      setAccessories(response?.data || []);
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching accessories data:', error);
      return [];
    } finally {
      setLoadingAccessories(false);
    }
  };

  const handleShowAccessories = async () => {
    await getAllAccessoriesData();
    setShowAccessoryModal(true);
  };

  const handlePrintAccessories = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Accessory Stock List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            h1 { color: #333; text-align: center; }
            .header { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Accessory Stock List</h1>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Accessory Name</th>
                <th>One Item Price</th>
                <th>Total Stock</th>
                <th>Total Stock Amount</th>
                <th>Created Date</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              ${accessories.map(acc => `
                <tr>
                  <td>${acc.accessoryName || 'N/A'}</td>
                  <td>Rs. ${acc.perPiecePrice?.toLocaleString() || '0'}</td>
                  <td>${acc.stock || '0'}</td>
                  <td>Rs. ${((acc.stock || 0) * (acc.perPiecePrice || 0)).toLocaleString()}</td>
                  <td>${new Date(acc.createdAt).toLocaleDateString()}</td>
                  <td>${new Date(acc.updatedAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  const preparePrintContent = (bulkPhones, singlePhones) => {
    let content = '';

    // Bulk phones
    if (bulkPhones.length > 0) {
      content += '<h2>Bulk Phones</h2>';
      bulkPhones.forEach((phone) => {
        content += `<div style="margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">`;
        content += `<div><strong>Party:</strong> ${phone.partyName || 'N/A'}</div>`;
        content += `<div><strong>Purchase Date:</strong> ${new Date(phone.createdAt).toLocaleDateString()}</div>`;

        phone.ramSimDetails?.forEach((detail) => {
          content += `
          <div class="phone-item" style="margin-top: 10px;">
            <div class="header">${detail.companyName} ${detail.modelName} ${detail.ramMemory}</div>
            <div class="imei">
              ${detail.imeiNumbers
                ?.map(
                  (imei) =>
                    `<div style="margin-top: 5px;">IMEI1: ${imei.imei1 || 'N/A'} | IMEI2: ${imei.imei2 || 'N/A'}</div>`
                )
                .join('')}
            </div>
          </div>
        `;
        });
        content += `</div>`;
      });
    }

    // Single phones
    if (singlePhones.length > 0) {
      content += '<h2 style="margin-top: 20px;">Single Phones</h2>';
      singlePhones.forEach((phone) => {
        content += `
        <div class="phone-item">
          <div class="header">${phone.companyName} ${phone.modelName} ${phone.ramMemory}</div>
          <div class="imei">
            <div>IMEI1: ${phone.imei1 || 'N/A'} | IMEI2: ${phone.imei2 || 'N/A'}</div>
          </div>
          <div class="phone-info">
            ${phone.color ? `<div>Color: ${phone.color}</div>` : ''}
            <div>Purchased: ${new Date(phone.purchaseDate).toLocaleDateString()} | Price: $${phone.purchasePrice || 'N/A'}</div>
          </div>
        </div>
      `;
      });
    }

    return content;
  };
  const filteredBulkPhones =
    filter === 'all' || filter === 'bulk' ? data.bulkPhones : [];
  const filteredSinglePhones =
    filter === 'all' || filter === 'single' ? data.singlePhones : [];

  return (
    <div className="stock-list" style={{ padding: '20px' }}>
      <h1>Stock List</h1>

      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              fontWeight: filter === 'all' ? 'bold' : 'normal',
              background: filter === 'all' ? '#e0e0e0' : '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            All Phones
          </button>

          <button
            onClick={() => setFilter('bulk')}
            style={{
              fontWeight: filter === 'bulk' ? 'bold' : 'normal',
              background: filter === 'bulk' ? '#e0e0e0' : '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            Bulk Phones
          </button>

          <button
            onClick={() => setFilter('single')}
            style={{
              fontWeight: filter === 'single' ? 'bold' : 'normal',
              background: filter === 'single' ? '#e0e0e0' : '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            Single Phones
          </button>

          <button
            onClick={handleShowAccessories}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#7c3aed')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#8b5cf6')
            }
          >
            <FaBoxes /> Show Accessory
          </button>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <button
            onClick={areAllItemsSelected() ? deselectAllItems : selectAllItems}
            style={{
              backgroundColor: areAllItemsSelected() ? '#f44336' : '#4CAF50',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {areAllItemsSelected() ? 'Deselect All' : 'Select All'}
          </button>

          {selectedItems.length > 0 && (
            <button
              onClick={printSelected}
              style={{
                backgroundColor: '#2196F3',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Print Selected ({selectedItems.length})
            </button>
          )}
        </div>
      </div>

      {/* Bulk Phones List */}
      {filteredBulkPhones.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <h2>Bulk Phones ({filteredBulkPhones.length})</h2>
            <button
              onClick={() => {
                const allBulkSelected = filteredBulkPhones.every((phone) =>
                  selectedItems.includes(`bulk-${phone._id}`)
                );
                if (allBulkSelected) {
                  setSelectedItems((prev) =>
                    prev.filter((id) => !id.startsWith('bulk-'))
                  );
                } else {
                  setSelectedItems((prev) => [
                    ...prev.filter((id) => !id.startsWith('bulk-')),
                    ...filteredBulkPhones.map((phone) => `bulk-${phone._id}`),
                  ]);
                }
              }}
              style={{
                backgroundColor: filteredBulkPhones.every((phone) =>
                  selectedItems.includes(`bulk-${phone._id}`)
                )
                  ? '#f44336'
                  : '#4CAF50',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {filteredBulkPhones.every((phone) =>
                selectedItems.includes(`bulk-${phone._id}`)
              )
                ? 'Deselect All Bulk'
                : 'Select All Bulk'}
            </button>
          </div>
          {filteredBulkPhones.map((phone) => (
            <div
              key={phone._id}
              style={{
                marginBottom: '15px',
                border: '1px solid #ddd',
                padding: '10px',
                backgroundColor: selectedItems.includes(`bulk-${phone._id}`)
                  ? '#f0f0f0'
                  : 'white',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '5px',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(`bulk-${phone._id}`)}
                  onChange={() => toggleItemSelection(phone._id, 'bulk')}
                  style={{ marginRight: '10px' }}
                />
                <h3 style={{ margin: 0 }}>
                  {phone.partyName} -{' '}
                  {new Date(phone.createdAt).toLocaleDateString()}
                </h3>
              </div>

              {phone.ramSimDetails?.map((detail, index) => (
                <div
                  key={index}
                  style={{
                    marginLeft: '20px',
                    padding: '8px',
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                  }}
                >
                  <div>
                    <strong>
                      {detail.companyName} {detail.modelName} {detail.ramMemory}
                    </strong>
                  </div>
                  {detail.imeiNumbers?.map((imei, i) => (
                    <div key={i} style={{ fontSize: '14px', marginTop: '5px' }}>
                      IMEI1: {imei.imei1 || 'N/A'} | IMEI2:{' '}
                      {imei.imei2 || 'N/A'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Single Phones List */}
      {filteredSinglePhones.length > 0 && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <h2>Single Phones ({filteredSinglePhones.length})</h2>
            <button
              onClick={() => {
                const allSingleSelected = filteredSinglePhones.every((phone) =>
                  selectedItems.includes(`single-${phone._id}`)
                );
                if (allSingleSelected) {
                  setSelectedItems((prev) =>
                    prev.filter((id) => !id.startsWith('single-'))
                  );
                } else {
                  setSelectedItems((prev) => [
                    ...prev.filter((id) => !id.startsWith('single-')),
                    ...filteredSinglePhones.map(
                      (phone) => `single-${phone._id}`
                    ),
                  ]);
                }
              }}
              style={{
                backgroundColor: filteredSinglePhones.every((phone) =>
                  selectedItems.includes(`single-${phone._id}`)
                )
                  ? '#f44336'
                  : '#4CAF50',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {filteredSinglePhones.every((phone) =>
                selectedItems.includes(`single-${phone._id}`)
              )
                ? 'Deselect All Single'
                : 'Select All Single'}
            </button>
          </div>
          {filteredSinglePhones.map((phone) => (
            <div
              key={phone._id}
              style={{
                marginBottom: '15px',
                border: '1px solid #ddd',
                padding: '10px',
                display: 'flex',
                backgroundColor: selectedItems.includes(`single-${phone._id}`)
                  ? '#f0f0f0'
                  : 'white',
              }}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(`single-${phone._id}`)}
                onChange={() => toggleItemSelection(phone._id, 'single')}
                style={{ marginRight: '10px' }}
              />
              <div style={{ flex: 1 }}>
                <div>
                  <strong>
                    {phone.companyName} {phone.modelName} {phone.ramMemory}
                  </strong>
                </div>
                <div style={{ fontSize: '14px', marginTop: '5px' }}>
                  IMEI1: {phone.imei1 || 'N/A'} | IMEI2: {phone.imei2 || 'N/A'}
                </div>
                {phone.color && (
                  <div style={{ fontSize: '14px' }}>Color: {phone.color}</div>
                )}
                <div style={{ fontSize: '14px' }}>
                  Purchased: {new Date(phone.purchaseDate).toLocaleDateString()}{' '}
                  | Price: ${phone.purchasePrice || 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Accessory Stock Modal */}
      {showAccessoryModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              zIndex: 2147483647
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                Accessory Stock List
              </h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handlePrintAccessories}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = '#2563eb')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = '#3b82f6')
                  }
                >
                  <FaPrint /> Print
                </button>
                <button
                  onClick={() => setShowAccessoryModal(false)}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = '#4b5563')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = '#6b7280')
                  }
                >
                  Close
                </button>
              </div>
            </div>

            {loadingAccessories ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading accessories...</p>
              </div>
            ) : accessories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No accessories found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Accessory Name
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        One Item Price
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Total Stock
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Total Stock Amount
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Created Date
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessories.map((acc, index) => (
                      <tr
                        key={acc._id || index}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                          }}
                        >
                          {acc.accessoryName || 'N/A'}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                          }}
                        >
                          Rs. {acc.perPiecePrice?.toLocaleString() || '0'}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                          }}
                        >
                          {acc.stock || '0'}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                            fontWeight: '600',
                          }}
                        >
                          Rs. {((acc.stock || 0) * (acc.perPiecePrice || 0)).toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                          }}
                        >
                          {new Date(acc.createdAt).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                          }}
                        >
                          {new Date(acc.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockList;
