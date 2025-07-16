import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const AccessoryInvoice = () => {
  const { state } = useLocation();
  const invoiceData = state?.data || [];
  const invoiceRef = useRef();

  // Calculate totals
  const subtotal = invoiceData.reduce(
    (sum, item) => sum + item.perPiecePrice * item.quantity,
    0
  );
  //   const taxRate = 0.18; // 18% tax
  //   const tax = subtotal * taxRate;
  const total = subtotal;
  //   const total = subtotal + tax;

  // Format date
  const invoiceDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    pageStyle: `
      @page {
        size: A5;
        margin: 0;
      }
      @media print {
        body {
          padding: 0;
          margin: 0;
        }
        .no-print {
          display: none !important;
        }
        .invoice-container {
          box-shadow: none;
          border: none;
          margin: 0;
          padding: 0;
          width: 100%;
        }
      }
    `,
  });

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#f9fafb',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '56rem',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
          className="no-print"
        >
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
            }}
          >
            Accessory Invoice
          </h1>
          <button
            onClick={handlePrint}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#2563eb')}
          >
            Print Invoice
          </button>
        </div>

        <div
          ref={invoiceRef}
          style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            width: '100%',
          }}
        >
          {/* Invoice Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '2rem',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '1.5rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.5rem',
                }}
              >
                Accessory Invoice
              </h2>
              <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>
                Invoice #: {Math.floor(Math.random() * 1000000)}
              </p>
              <p style={{ color: '#4b5563' }}>Date: {invoiceDate}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem',
                }}
              >
                Shop Name
              </h3>
              <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>
                123 Business Street
              </p>
              <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>
                City, State 10001
              </p>
              <p style={{ color: '#4b5563' }}>Phone: (123) 456-7890</p>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div style={{ marginBottom: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Item
                  </th>
                  <th
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        color: '#1f2937',
                      }}
                    >
                      {item.accessoryName || `Accessory ${index + 1}`}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'right',
                        color: '#4b5563',
                      }}
                    >
                      {item.perPiecePrice.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'right',
                        color: '#4b5563',
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'right',
                        color: '#1f2937',
                        fontWeight: '500',
                      }}
                    >
                      {(item.perPiecePrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '16rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <span style={{ color: '#4b5563' }}>Subtotal:</span>
                <span style={{ fontWeight: '500' }}>{subtotal.toFixed(2)}</span>
              </div>
              {/* <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <span style={{ color: '#4b5563' }}>Tax (18%):</span>
                <span style={{ fontWeight: '500' }}>{tax.toFixed(2)}</span>
              </div> */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                }}
              >
                <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  Total:
                </span>
                <span style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: '3rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.875rem',
            }}
          >
            <p>Thank you for your business!</p>
            <p style={{ marginTop: '0.5rem' }}>
              Terms & Conditions: Payment due within 15 days
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '0.875rem',
          }}
          className="no-print"
        >
          <p>
            This is a computer generated invoice and does not require a
            signature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessoryInvoice;
