const BalanceSheet = () => {
  // Dummy data
  const assets = [
    { id: 1, name: 'Cash in Hand', amount: 1250000 },
    { id: 2, name: 'Bank Balance', amount: 3500000 },
    { id: 3, name: 'Mobile Inventory', amount: 4200000 },
    { id: 4, name: 'Accessories Stock', amount: 850000 },
    { id: 5, name: 'Accounts Receivable', amount: 1200000 },
  ];

  const liabilities = [
    { id: 1, name: 'Accounts Payable', amount: 750000 },
    { id: 2, name: 'Loans Payable', amount: 2000000 },
    { id: 3, name: 'Taxes Payable', amount: 350000 },
  ];

  const equity = [
    { id: 1, name: "Owner's Capital", amount: 5000000 },
    { id: 2, name: 'Retained Earnings', amount: 1850000 },
  ];

  const profitSources = [
    { id: 1, name: 'Mobile Sales', amount: 3200000 },
    { id: 2, name: 'Accessory Sales', amount: 850000 },
    { id: 3, name: 'Service Charges', amount: 350000 },
  ];

  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div
      style={{
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: '#2c3e50',
          marginBottom: '30px',
          paddingBottom: '15px',
          borderBottom: '2px solid #3498db',
        }}
      >
        Balance Sheet
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* Assets Section */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              color: '#27ae60',
              marginTop: '0',
              paddingBottom: '10px',
              borderBottom: '1px solid #eee',
            }}
          >
            Assets
          </h2>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {assets.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <span>{item.name}</span>
                <span style={{ fontWeight: '600' }}>
                  {item.amount.toLocaleString()} PKR
                </span>
              </li>
            ))}
          </ul>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '15px 0',
              borderTop: '2px solid #27ae60',
              fontWeight: '700',
              fontSize: '18px',
            }}
          >
            <span>Total Assets</span>
            <span>{calculateTotal(assets).toLocaleString()} PKR</span>
          </div>
        </div>

        {/* Liabilities & Equity Section */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              color: '#e74c3c',
              marginTop: '0',
              paddingBottom: '10px',
              borderBottom: '1px solid #eee',
            }}
          >
            Liabilities
          </h2>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {liabilities.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <span>{item.name}</span>
                <span style={{ fontWeight: '600' }}>
                  {item.amount.toLocaleString()} PKR
                </span>
              </li>
            ))}
          </ul>

          <h2
            style={{
              color: '#3498db',
              marginTop: '20px',
              paddingBottom: '10px',
              borderBottom: '1px solid #eee',
            }}
          >
            Equity
          </h2>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {equity.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <span>{item.name}</span>
                <span style={{ fontWeight: '600' }}>
                  {item.amount.toLocaleString()} PKR
                </span>
              </li>
            ))}
          </ul>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '15px 0',
              borderTop: '2px solid #e74c3c',
              fontWeight: '700',
              fontSize: '18px',
            }}
          >
            <span>Total Liabilities & Equity</span>
            <span>
              {(
                calculateTotal(liabilities) + calculateTotal(equity)
              ).toLocaleString()}{' '}
              PKR
            </span>
          </div>
        </div>
      </div>

      {/* Profit Sources Section */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px',
        }}
      >
        <h2
          style={{
            color: '#9b59b6',
            marginTop: '0',
            paddingBottom: '10px',
            borderBottom: '1px solid #eee',
          }}
        >
          Profit Sources
        </h2>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {profitSources.map((item) => (
            <li
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <span>{item.name}</span>
              <span style={{ fontWeight: '600' }}>
                {item.amount.toLocaleString()} PKR
              </span>
            </li>
          ))}
        </ul>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '15px 0',
            borderTop: '2px solid #9b59b6',
            fontWeight: '700',
            fontSize: '18px',
          }}
        >
          <span>Total Profit</span>
          <span>{calculateTotal(profitSources).toLocaleString()} PKR</span>
        </div>
      </div>

      {/* Summary Section */}
      <div
        style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginTop: '0' }}>Financial Summary</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', opacity: '0.8' }}>Net Worth</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>
              {(
                calculateTotal(assets) - calculateTotal(liabilities)
              ).toLocaleString()}{' '}
              PKR
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', opacity: '0.8' }}>
              Current Ratio
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>
              {(
                calculateTotal(assets.slice(0, 3)) / calculateTotal(liabilities)
              ).toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', opacity: '0.8' }}>
              Profit Margin
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>
              {(
                (calculateTotal(profitSources) / calculateTotal(assets)) *
                100
              ).toFixed(2)}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
