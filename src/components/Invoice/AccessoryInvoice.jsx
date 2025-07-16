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
  const taxRate = 0.18; // 18% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

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
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 no-print">
          <h1 className="text-2xl font-bold text-gray-800">
            Accessory Invoice
          </h1>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Print Invoice
          </button>
        </div>

        <div
          ref={invoiceRef}
          className="invoice-container bg-white p-6 rounded-lg shadow-md"
        >
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8 border-b pb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Accessory Invoice
              </h2>
              <p className="text-gray-600">
                Invoice #: {Math.floor(Math.random() * 1000000)}
              </p>
              <p className="text-gray-600">Date: {invoiceDate}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold text-gray-800">Shop Name</h3>
              <p className="text-gray-600">123 Business Street</p>
              <p className="text-gray-600">City, State 10001</p>
              <p className="text-gray-600">Phone: (123) 456-7890</p>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">
                    Item
                  </th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">
                    Price
                  </th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">
                    Qty
                  </th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 text-gray-800">
                      {item.accessoryName || `Accessory ${index + 1}`}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      ₹{item.perPiecePrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-800 font-medium">
                      ₹{(item.perPiecePrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Tax (18%):</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t text-center text-gray-500 text-sm">
            <p>Thank you for your business!</p>
            <p className="mt-2">
              Terms & Conditions: Payment due within 15 days
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm no-print">
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
