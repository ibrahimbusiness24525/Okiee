// import { useEffect, useState } from 'react';
// import { api } from '../../../api/api';

// const StockList = () => {
//   const [data, setData] = useState({
//     bulkPhones: [],
//     singlePhones: [],
//   });
//   const [filter, setFilter] = useState('all'); // 'all', 'bulk', 'single'
//   const [selectedItems, setSelectedItems] = useState([]);

//   const getAllStock = async () => {
//     const response = await api.get('/api/purchase/all-purchase-phone');
//     setData(response?.data.data || { bulkPhones: [], singlePhones: [] });
//     return response?.data || [];
//   };

//   useEffect(() => {
//     getAllStock();
//   }, []);

//   const toggleItemSelection = (id, type) => {
//     const itemId = `${type}-${id}`;
//     setSelectedItems((prev) =>
//       prev.includes(itemId)
//         ? prev.filter((item) => item !== itemId)
//         : [...prev, itemId]
//     );
//   };

//   const printSelected = async () => {
//     try {
//       const selectedBulkIds = selectedItems
//         .filter((id) => id.startsWith('bulk-'))
//         .map((id) => id.replace('bulk-', ''));

//       const selectedSingleIds = selectedItems
//         .filter((id) => id.startsWith('single-'))
//         .map((id) => id.replace('single-', ''));

//       const selectedBulkPhones = data.bulkPhones.filter((phone) =>
//         selectedBulkIds.includes(phone._id)
//       );

//       const selectedSinglePhones = data.singlePhones.filter((phone) =>
//         selectedSingleIds.includes(phone._id)
//       );

//       const printContent = preparePrintContent(
//         selectedBulkPhones,
//         selectedSinglePhones
//       );

//       // Create print window
//       const printWindow = window.open('', '_blank', 'width=800,height=600');
//       if (!printWindow) {
//         throw new Error('Popup blocked. Please allow popups for this site.');
//       }

//       printWindow.document.open();
//       printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Stock List Print</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               margin: 0;
//               padding: 10mm;
//               -webkit-print-color-adjust: exact !important;
//               color-adjust: exact !important;
//             }
//             .phone-item {
//               margin-bottom: 20px;
//               border-bottom: 1px solid #eee;
//               padding-bottom: 10px;
//               page-break-inside: avoid;
//             }
//             .header {
//               font-weight: bold;
//               margin-bottom: 5px;
//             }
//             .imei {
//               font-size: 14px;
//             }
//             @page {
//               size: auto;
//               margin: 5mm;
//             }
//             @media print {
//               body {
//                 padding: 0 !important;
//                 margin: 0 !important;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           ${printContent}
//           <script>
//             // Print automatically when content loads
//             window.onload = function() {
//               setTimeout(function() {
//                 window.print();
//                 window.onafterprint = function() {
//                   window.close();
//                 };
//               }, 300);
//             };
//           </script>
//         </body>
//       </html>
//     `);
//       printWindow.document.close();

//     } catch (error) {
//       console.error('Printing failed:', error);
//       alert('Printing failed: ' + error.message);
//     }
//   };
//   const preparePrintContent = (bulkPhones, singlePhones) => {
//     let content = '<h1>Stock List</h1>';

//     // Bulk phones
//     bulkPhones.forEach((phone) => {
//       phone.ramSimDetails?.forEach((detail) => {
//         content += `
//           <div class="phone-item">
//             <div class="header">${detail.companyName} ${detail.modelName} ${detail.ramMemory}</div>
//             <div class="imei">
//               ${detail.imeiNumbers
//             ?.map(
//               (imei) =>
//                 `IMEI1: ${imei.imei1 || ''} IMEI2: ${imei.imei2 || ''}`
//             )
//             .join('<br>')}
//             </div>
//           </div>
//         `;
//       });
//     });

//     // Single phones
//     singlePhones.forEach((phone) => {
//       content += `
//         <div class="phone-item">
//           <div class="header">${phone.companyName} ${phone.modelName} ${phone.ramMemory}</div>
//           <div class="imei">
//             IMEI1: ${phone.imei1 || ''} IMEI2: ${phone.imei2 || ''}
//           </div>
//         </div>
//       `;
//     });

//     return content;
//   };

//   const filteredBulkPhones =
//     filter === 'all' || filter === 'bulk' ? data.bulkPhones : [];
//   const filteredSinglePhones =
//     filter === 'all' || filter === 'single' ? data.singlePhones : [];

//   return (
//     <div className="stock-list" style={{ padding: '20px' }}>
//       <h1>Stock List</h1>

//       <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
//         <button
//           onClick={() => setFilter('all')}
//           style={{
//             fontWeight: filter === 'all' ? 'bold' : 'normal',
//             background: '#f0f0f0',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             padding: '8px 16px',
//             marginRight: '8px',
//             cursor: 'pointer',
//           }}
//         >
//           All Phones
//         </button>

//         <button
//           onClick={() => setFilter('bulk')}
//           style={{
//             fontWeight: filter === 'bulk' ? 'bold' : 'normal',
//             background: '#f0f0f0',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             padding: '8px 16px',
//             marginRight: '8px',
//             cursor: 'pointer',
//           }}
//         >
//           Bulk Phones
//         </button>

//         <button
//           onClick={() => setFilter('single')}
//           style={{
//             fontWeight: filter === 'single' ? 'bold' : 'normal',
//             background: '#f0f0f0',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             padding: '8px 16px',
//             cursor: 'pointer',
//           }}
//         >
//           Single Phones
//         </button>

//         {selectedItems.length > 0 && (
//           <button
//             onClick={printSelected}
//             style={{
//               marginLeft: 'auto',
//               backgroundColor: '#4CAF50',
//               color: 'white',
//             }}
//           >
//             Print Selected ({selectedItems.length})
//           </button>
//         )}
//       </div>

//       {/* Bulk Phones List */}
//       {filteredBulkPhones.length > 0 && (
//         <div style={{ marginBottom: '30px' }}>
//           <h2>Bulk Phones</h2>
//           {filteredBulkPhones.map((phone) => (
//             <div
//               key={phone._id}
//               style={{
//                 marginBottom: '15px',
//                 border: '1px solid #ddd',
//                 padding: '10px',
//                 backgroundColor: selectedItems.includes(`bulk-${phone._id}`)
//                   ? '#f0f0f0'
//                   : 'white',
//               }}
//             >
//               <div
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   marginBottom: '5px',
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedItems.includes(`bulk-${phone._id}`)}
//                   onChange={() => toggleItemSelection(phone._id, 'bulk')}
//                   style={{ marginRight: '10px' }}
//                 />
//                 <h3 style={{ margin: 0 }}>
//                   {phone.partyName} -{' '}
//                   {new Date(phone.createdAt).toLocaleDateString()}
//                 </h3>
//               </div>

//               {phone.ramSimDetails?.map((detail, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     marginLeft: '20px',
//                     padding: '8px',
//                     backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
//                   }}
//                 >
//                   <div>
//                     <strong>
//                       {detail.companyName} {detail.modelName} {detail.ramMemory}
//                     </strong>
//                   </div>
//                   {detail.imeiNumbers?.map((imei, i) => (
//                     <div key={i} style={{ fontSize: '14px', marginTop: '5px' }}>
//                       IMEI1: {imei.imei1 || 'N/A'} | IMEI2:{' '}
//                       {imei.imei2 || 'N/A'}
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Single Phones List */}
//       {filteredSinglePhones.length > 0 && (
//         <div>
//           <h2>Single Phones</h2>
//           {filteredSinglePhones.map((phone) => (
//             <div
//               key={phone._id}
//               style={{
//                 marginBottom: '15px',
//                 border: '1px solid #ddd',
//                 padding: '10px',
//                 display: 'flex',
//                 backgroundColor: selectedItems.includes(`single-${phone._id}`)
//                   ? '#f0f0f0'
//                   : 'white',
//               }}
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedItems.includes(`single-${phone._id}`)}
//                 onChange={() => toggleItemSelection(phone._id, 'single')}
//                 style={{ marginRight: '10px' }}
//               />
//               <div>
//                 <div>
//                   <strong>
//                     {phone.companyName} {phone.modelName} {phone.ramMemory}
//                   </strong>
//                 </div>
//                 <div style={{ fontSize: '14px', marginTop: '5px' }}>
//                   IMEI1: {phone.imei1 || 'N/A'} | IMEI2: {phone.imei2 || 'N/A'}
//                 </div>
//                 {phone.color && (
//                   <div style={{ fontSize: '14px' }}>Color: {phone.color}</div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StockList;
import { useEffect, useState } from 'react';
import { api } from '../../../api/api';

const StockList = () => {
  const [data, setData] = useState({
    bulkPhones: [],
    singlePhones: [],
  });
  const [filter, setFilter] = useState('all'); // 'all', 'bulk', 'single'
  const [selectedItems, setSelectedItems] = useState([]);

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

  // Select all items in current view
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

  // const printSelected = async () => {
  //   try {
  //     const selectedBulkIds = selectedItems
  //       .filter((id) => id.startsWith('bulk-'))
  //       .map((id) => id.replace('bulk-', ''));

  //     const selectedSingleIds = selectedItems
  //       .filter((id) => id.startsWith('single-'))
  //       .map((id) => id.replace('single-', ''));

  //     const selectedBulkPhones = data.bulkPhones.filter((phone) =>
  //       selectedBulkIds.includes(phone._id)
  //     );

  //     const selectedSinglePhones = data.singlePhones.filter((phone) =>
  //       selectedSingleIds.includes(phone._id)
  //     );

  //     const printContent = preparePrintContent(
  //       selectedBulkPhones,
  //       selectedSinglePhones
  //     );

  //     // Create print window
  //     const printWindow = window.open('', '_blank', 'width=800,height=600');
  //     if (!printWindow) {
  //       throw new Error('Popup blocked. Please allow popups for this site.');
  //     }

  //     printWindow.document.open();
  //     printWindow.document.write(`
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <title>Stock List Print</title>
  //         <style>
  //           body {
  //             font-family: Arial, sans-serif;
  //             margin: 0;
  //             padding: 10mm;
  //             -webkit-print-color-adjust: exact !important;
  //             color-adjust: exact !important;
  //           }
  //           .phone-item {
  //             margin-bottom: 20px;
  //             border-bottom: 1px solid #eee;
  //             padding-bottom: 10px;
  //             page-break-inside: avoid;
  //           }
  //           .header {
  //             font-weight: bold;
  //             margin-bottom: 5px;
  //           }
  //           .imei {
  //             font-size: 14px;
  //           }
  //           @page {
  //             size: auto;
  //             margin: 5mm;
  //           }
  //           @media print {
  //             body {
  //               padding: 0 !important;
  //               margin: 0 !important;
  //             }
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         ${printContent}
  //         <script>
  //           // Print automatically when content loads
  //           window.onload = function() {
  //             setTimeout(function() {
  //               window.print();
  //               window.onafterprint = function() {
  //                 window.close();
  //               };
  //             }, 300);
  //           };
  //         </script>
  //       </body>
  //     </html>
  //   `);
  //     printWindow.document.close();
  //   } catch (error) {
  //     console.error('Printing failed:', error);
  //     alert('Printing failed: ' + error.message);
  //   }
  // };

  // const preparePrintContent = (bulkPhones, singlePhones) => {
  //   let content = '<h1>Stock List</h1>';

  //   // Bulk phones
  //   bulkPhones.forEach((phone) => {
  //     phone.ramSimDetails?.forEach((detail) => {
  //       content += `
  //         <div class="phone-item">
  //           <div class="header">${detail.companyName} ${detail.modelName} ${detail.ramMemory}</div>
  //           <div class="imei">
  //             ${detail.imeiNumbers
  //               ?.map(
  //                 (imei) =>
  //                   `IMEI1: ${imei.imei1 || ''} IMEI2: ${imei.imei2 || ''}`
  //               )
  //               .join('<br>')}
  //           </div>
  //         </div>
  //       `;
  //     });
  //   });

  //   // Single phones
  //   singlePhones.forEach((phone) => {
  //     content += `
  //       <div class="phone-item">
  //         <div class="header">${phone.companyName} ${phone.modelName} ${phone.ramMemory}</div>
  //         <div class="imei">
  //           IMEI1: ${phone.imei1 || ''} IMEI2: ${phone.imei2 || ''}
  //         </div>
  //       </div>
  //     `;
  //   });

  //   return content;
  // };
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
    </div>
  );
};

export default StockList;
