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

  const printSelected = () => {
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

    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Stock List Print</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .phone-item { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .header { font-weight: bold; margin-bottom: 5px; }
            .imei { font-size: 14px; }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
          style={{ fontWeight: filter === 'all' ? 'bold' : 'normal' }}
        >
          All Phones
        </button>
        <button
          onClick={() => setFilter('bulk')}
          style={{ fontWeight: filter === 'bulk' ? 'bold' : 'normal' }}
        >
          Bulk Phones
        </button>
        <button
          onClick={() => setFilter('single')}
          style={{ fontWeight: filter === 'single' ? 'bold' : 'normal' }}
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
