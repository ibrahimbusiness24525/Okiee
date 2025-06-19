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

  // const printSelected = () => {
  //   const selectedBulkIds = selectedItems
  //     .filter((id) => id.startsWith('bulk-'))
  //     .map((id) => id.replace('bulk-', ''));

  //   const selectedSingleIds = selectedItems
  //     .filter((id) => id.startsWith('single-'))
  //     .map((id) => id.replace('single-', ''));

  //   const selectedBulkPhones = data.bulkPhones.filter((phone) =>
  //     selectedBulkIds.includes(phone._id)
  //   );

  //   const selectedSinglePhones = data.singlePhones.filter((phone) =>
  //     selectedSingleIds.includes(phone._id)
  //   );

  //   // Prepare print content
  //   const printContent = preparePrintContent(
  //     selectedBulkPhones,
  //     selectedSinglePhones
  //   );

  //   // Open print window
  //   const printWindow = window.open('', '_blank');
  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Stock List Print</title>
  //         <style>
  //           body { font-family: Arial, sans-serif; }
  //           .phone-item { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
  //           .header { font-weight: bold; margin-bottom: 5px; }
  //           .imei { font-size: 14px; }
  //         </style>
  //       </head>
  //       <body>
  //         ${printContent}
  //         <script>
  //           window.onload = function() {
  //             window.print();
  //             setTimeout(() => window.close(), 1000);
  //           };
  //         </script>
  //       </body>
  //     </html>
  //   `);
  //   printWindow.document.close();
  // };
  const printSelected = () => {
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

      // Prepare print content
      const printContent = preparePrintContent(
        selectedBulkPhones,
        selectedSinglePhones
      );

      // Create a hidden iframe instead of a new window
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.style.left = '-9999px';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

      iframeDoc.open();
      iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Stock List Print</title>
          <style>
            @media print {
              body { font-family: Arial, sans-serif; margin: 0; padding: 10mm; }
              .phone-item { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
              .header { font-weight: bold; margin-bottom: 5px; }
              .imei { font-size: 14px; }
              @page { size: auto; margin: 5mm; }
            }
            @media screen {
              body { background-color: #fff; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
      iframeDoc.close();

      // Wait for content to load
      iframe.onload = function () {
        setTimeout(() => {
          // Focus the iframe window and print
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();

          // Remove the iframe after printing
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }, 500);
      };

    } catch (error) {
      console.error('Printing failed:', error);
      alert('Printing failed. Please check console for details.');
    }
  };

  const preparePrintContent = (bulkPhones, singlePhones) => {
    let content = '<h1>Stock List</h1>';

    // Bulk phones
    bulkPhones.forEach((phone) => {
      phone.ramSimDetails?.forEach((detail) => {
        content += `
          <div class="phone-item">
            <div class="header">${detail.companyName} ${detail.modelName} ${detail.ramMemory}</div>
            <div class="imei">
              ${detail.imeiNumbers
            ?.map(
              (imei) =>
                `IMEI1: ${imei.imei1 || ''} IMEI2: ${imei.imei2 || ''}`
            )
            .join('<br>')}
            </div>
          </div>
        `;
      });
    });

    // Single phones
    singlePhones.forEach((phone) => {
      content += `
        <div class="phone-item">
          <div class="header">${phone.companyName} ${phone.modelName} ${phone.ramMemory}</div>
          <div class="imei">
            IMEI1: ${phone.imei1 || ''} IMEI2: ${phone.imei2 || ''}
          </div>
        </div>
      `;
    });

    return content;
  };

  const filteredBulkPhones =
    filter === 'all' || filter === 'bulk' ? data.bulkPhones : [];
  const filteredSinglePhones =
    filter === 'all' || filter === 'single' ? data.singlePhones : [];

  return (
    <div className="stock-list" style={{ padding: '20px' }}>
      <h1>Stock List</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            fontWeight: filter === 'all' ? 'bold' : 'normal',
            background: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px 16px',
            marginRight: '8px',
            cursor: 'pointer',
          }}
        >
          All Phones
        </button>

        <button
          onClick={() => setFilter('bulk')}
          style={{
            fontWeight: filter === 'bulk' ? 'bold' : 'normal',
            background: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px 16px',
            marginRight: '8px',
            cursor: 'pointer',
          }}
        >
          Bulk Phones
        </button>

        <button
          onClick={() => setFilter('single')}
          style={{
            fontWeight: filter === 'single' ? 'bold' : 'normal',
            background: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          Single Phones
        </button>

        {selectedItems.length > 0 && (
          <button
            onClick={printSelected}
            style={{
              marginLeft: 'auto',
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
          >
            Print Selected ({selectedItems.length})
          </button>
        )}
      </div>

      {/* Bulk Phones List */}
      {filteredBulkPhones.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2>Bulk Phones</h2>
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
          <h2>Single Phones</h2>
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
              <div>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockList;
// import { useEffect, useState } from 'react';
// import { api } from '../../../api/api';

// const StockList = () => {
//   const [data, setData] = useState({
//     bulkPhones: [],
//     singlePhones: [],
//   });
//   const [filter, setFilter] = useState('all'); // 'all', 'bulk', 'single'
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const getAllStock = async () => {
//     try {
//       setIsLoading(true);
//       const response = await api.get('/api/purchase/all-purchase-phone');
//       setData(response?.data?.data || { bulkPhones: [], singlePhones: [] });
//     } catch (error) {
//       console.error('Error fetching stock:', error);
//       setData({ bulkPhones: [], singlePhones: [] });
//     } finally {
//       setIsLoading(false);
//     }
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

//   const printSelected = () => {
//     const selectedBulkIds = selectedItems
//       .filter((id) => id.startsWith('bulk-'))
//       .map((id) => id.replace('bulk-', ''));

//     const selectedSingleIds = selectedItems
//       .filter((id) => id.startsWith('single-'))
//       .map((id) => id.replace('single-', ''));

//     const selectedBulkPhones = data.bulkPhones.filter(
//       (phone) => phone?._id && selectedBulkIds.includes(phone._id)
//     );

//     const selectedSinglePhones = data.singlePhones.filter(
//       (phone) => phone?._id && selectedSingleIds.includes(phone._id)
//     );

//     // Prepare print content
//     const printContent = preparePrintContent(
//       selectedBulkPhones,
//       selectedSinglePhones
//     );

//     // Only open print window if there's content to print
//     if (printContent.includes('phone-item')) {
//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(`
//         <html>
//           <head>
//             <title>Stock List Print</title>
//             <style>
//               body { font-family: Arial, sans-serif; margin: 20px; }
//               .phone-item {
//                 margin-bottom: 20px;
//                 border-bottom: 1px solid #eee;
//                 padding-bottom: 10px;
//                 page-break-inside: avoid;
//               }
//               .header {
//                 font-weight: bold;
//                 margin-bottom: 5px;
//                 font-size: 16px;
//                 color: #333;
//               }
//               .imei {
//                 font-size: 14px;
//                 color: #555;
//               }
//               @media print {
//                 body { padding: 0; margin: 0; }
//                 .phone-item { border-bottom: 1px solid #ddd; }
//               }
//             </style>
//           </head>
//           <body>
//             <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
//               Stock List
//             </h1>
//             ${printContent}
//             <script>
//               window.onload = function() {
//                 setTimeout(() => {
//                   window.print();
//                   setTimeout(() => window.close(), 500);
//                 }, 200);
//               };
//             </script>
//           </body>
//         </html>
//       `);
//       printWindow.document.close();
//     } else {
//       alert('No valid items selected for printing');
//     }
//   };

//   const preparePrintContent = (bulkPhones, singlePhones) => {
//     let content = '';

//     // Bulk phones
//     bulkPhones.forEach((phone) => {
//       if (phone?.ramSimDetails) {
//         phone.ramSimDetails.forEach((detail) => {
//           if (detail?.companyName && detail?.modelName) {
//             content += `
//               <div class="phone-item">
//                 <div class="header">${detail.companyName} ${detail.modelName} ${detail.ramMemory || ''}</div>
//                 <div class="imei">
//                   ${detail.imeiNumbers
//                     ?.filter((imei) => imei?.imei1 || imei?.imei2)
//                     ?.map(
//                       (imei) =>
//                         `IMEI1: ${imei.imei1 || ''} IMEI2: ${imei.imei2 || ''}`
//                     )
//                     .join('<br>')}
//                 </div>
//               </div>
//             `;
//           }
//         });
//       }
//     });

//     // Single phones
//     singlePhones.forEach((phone) => {
//       if (phone?.companyName && phone?.modelName) {
//         content += `
//           <div class="phone-item">
//             <div class="header">${phone.companyName} ${phone.modelName} ${phone.ramMemory || ''}</div>
//             <div class="imei">
//               IMEI1: ${phone.imei1 || ''} IMEI2: ${phone.imei2 || ''}
//             </div>
//           </div>
//         `;
//       }
//     });

//     return content;
//   };

//   const filteredBulkPhones =
//     filter === 'all' || filter === 'bulk' ? data.bulkPhones : [];
//   const filteredSinglePhones =
//     filter === 'all' || filter === 'single' ? data.singlePhones : [];

//   // Button styles
//   const buttonBaseStyle = {
//     padding: '8px 16px',
//     borderRadius: '4px',
//     border: 'none',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     fontSize: '14px',
//   };

//   const filterButtonStyle = (active) => ({
//     ...buttonBaseStyle,
//     backgroundColor: active ? '#3498db' : '#ecf0f1',
//     color: active ? 'white' : '#2c3e50',
//     fontWeight: active ? '600' : 'normal',
//     boxShadow: active ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
//   });

//   const printButtonStyle = {
//     ...buttonBaseStyle,
//     backgroundColor: '#2ecc71',
//     color: 'white',
//     fontWeight: '600',
//     marginLeft: 'auto',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//   };

//   // Card styles
//   const cardStyle = {
//     backgroundColor: 'white',
//     borderRadius: '8px',
//     boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//     padding: '15px',
//     marginBottom: '20px',
//   };

//   const selectedCardStyle = {
//     ...cardStyle,
//     backgroundColor: '#f8f9fa',
//     borderLeft: '4px solid #3498db',
//   };

//   if (isLoading) {
//     return (
//       <div
//         style={{
//           padding: '20px',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '200px',
//         }}
//       >
//         <div style={{ fontSize: '18px', color: '#7f8c8d' }}>
//           Loading stock data...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
//       <h1
//         style={{
//           color: '#2c3e50',
//           marginBottom: '20px',
//           borderBottom: '2px solid #3498db',
//           paddingBottom: '10px',
//         }}
//       >
//         Stock List
//       </h1>

//       <div
//         style={{
//           marginBottom: '25px',
//           display: 'flex',
//           gap: '10px',
//           alignItems: 'center',
//           flexWrap: 'wrap',
//         }}
//       >
//         <button
//           onClick={() => setFilter('all')}
//           style={filterButtonStyle(filter === 'all')}
//         >
//           All Phones
//         </button>
//         <button
//           onClick={() => setFilter('bulk')}
//           style={filterButtonStyle(filter === 'bulk')}
//         >
//           Bulk Phones
//         </button>
//         <button
//           onClick={() => setFilter('single')}
//           style={filterButtonStyle(filter === 'single')}
//         >
//           Single Phones
//         </button>

//         {selectedItems.length > 0 && (
//           <button onClick={printSelected} style={printButtonStyle}>
//             Print Selected ({selectedItems.length})
//           </button>
//         )}
//       </div>

//       {/* Bulk Phones List */}
//       {filteredBulkPhones.length > 0 && (
//         <div style={{ marginBottom: '30px' }}>
//           <h2
//             style={{
//               color: '#34495e',
//               marginBottom: '15px',
//               paddingBottom: '5px',
//               borderBottom: '1px solid #bdc3c7',
//             }}
//           >
//             Bulk Phones
//           </h2>
//           {filteredBulkPhones.map((phone) => (
//             <div
//               key={phone._id}
//               style={
//                 selectedItems.includes(`bulk-${phone._id}`)
//                   ? selectedCardStyle
//                   : cardStyle
//               }
//             >
//               <div
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   marginBottom: '10px',
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedItems.includes(`bulk-${phone._id}`)}
//                   onChange={() => toggleItemSelection(phone._id, 'bulk')}
//                   style={{
//                     marginRight: '15px',
//                     width: '18px',
//                     height: '18px',
//                     cursor: 'pointer',
//                   }}
//                 />
//                 <h3
//                   style={{
//                     margin: 0,
//                     color: '#2c3e50',
//                     fontSize: '16px',
//                   }}
//                 >
//                   {phone.partyName || 'Unknown Seller'} -{' '}
//                   {phone.createdAt
//                     ? new Date(phone.createdAt).toLocaleDateString()
//                     : 'No Date'}
//                 </h3>
//               </div>

//               {phone.ramSimDetails?.map((detail, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     marginLeft: '35px',
//                     padding: '12px',
//                     backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
//                     borderRadius: '6px',
//                     marginBottom: '8px',
//                   }}
//                 >
//                   <div style={{ fontWeight: '500', marginBottom: '6px' }}>
//                     {detail.companyName || 'Unknown Brand'}{' '}
//                     {detail.modelName || ''} {detail.ramMemory || ''}
//                   </div>
//                   {detail.imeiNumbers?.map((imei, i) => (
//                     <div
//                       key={i}
//                       style={{
//                         fontSize: '14px',
//                         marginTop: '5px',
//                         color: '#7f8c8d',
//                         fontFamily: 'monospace',
//                       }}
//                     >
//                       {imei?.imei1 && `IMEI1: ${imei.imei1}`}
//                       {imei?.imei2 && ` | IMEI2: ${imei.imei2}`}
//                       {!imei?.imei1 && !imei?.imei2 && 'No IMEI numbers'}
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
//           <h2
//             style={{
//               color: '#34495e',
//               marginBottom: '15px',
//               paddingBottom: '5px',
//               borderBottom: '1px solid #bdc3c7',
//             }}
//           >
//             Single Phones
//           </h2>
//           <div
//             style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//               gap: '15px',
//             }}
//           >
//             {filteredSinglePhones.map((phone) => (
//               <div
//                 key={phone._id}
//                 style={
//                   selectedItems.includes(`single-${phone._id}`)
//                     ? { ...selectedCardStyle, marginBottom: 0 }
//                     : { ...cardStyle, marginBottom: 0 }
//                 }
//               >
//                 <div style={{ display: 'flex' }}>
//                   <input
//                     type="checkbox"
//                     checked={selectedItems.includes(`single-${phone._id}`)}
//                     onChange={() => toggleItemSelection(phone._id, 'single')}
//                     style={{
//                       marginRight: '15px',
//                       width: '18px',
//                       height: '18px',
//                       cursor: 'pointer',
//                       alignSelf: 'flex-start',
//                       marginTop: '3px',
//                     }}
//                   />
//                   <div style={{ flex: 1 }}>
//                     <div
//                       style={{
//                         fontWeight: '500',
//                         marginBottom: '6px',
//                         fontSize: '15px',
//                       }}
//                     >
//                       {phone.companyName || 'Unknown Brand'}{' '}
//                       {phone.modelName || ''} {phone.ramMemory || ''}
//                     </div>
//                     <div
//                       style={{
//                         fontSize: '14px',
//                         marginTop: '5px',
//                         color: '#7f8c8d',
//                         fontFamily: 'monospace',
//                       }}
//                     >
//                       {phone.imei1 && `IMEI1: ${phone.imei1}`}
//                       {phone.imei2 && ` | IMEI2: ${phone.imei2}`}
//                       {!phone.imei1 && !phone.imei2 && 'No IMEI numbers'}
//                     </div>
//                     {phone.color && (
//                       <div
//                         style={{
//                           fontSize: '14px',
//                           marginTop: '5px',
//                           color: '#7f8c8d',
//                         }}
//                       >
//                         Color: {phone.color}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {filteredBulkPhones.length === 0 && filteredSinglePhones.length === 0 && (
//         <div
//           style={{
//             padding: '40px',
//             textAlign: 'center',
//             backgroundColor: '#f8f9fa',
//             borderRadius: '8px',
//             color: '#7f8c8d',
//           }}
//         >
//           No phones found matching the current filter
//         </div>
//       )}
//     </div>
//   );
// };

// export default StockList;
