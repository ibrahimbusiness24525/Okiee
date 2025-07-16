// src/templates/stocklist.js
export const StockListComponent = ({ stockData }) => {
    // Static stock data
    const staticStockData = {
        sections: [
            {
                title: "Stock",
                items: [
                    {
                        qty: 1,
                        name: "Ezvez Smart home camera",
                        code: "303101577",
                        code2: "L0258757",
                        rate: "10,000"
                    }
                ],
                totalQty: 1,
                totalAmount: "10,000"
            },
            {
                title: "FC",
                items: [
                    {
                        qty: 1,
                        name: "FC Watch Amazfit Pace",
                        code: "1258748952000",
                        rate: "4,000"
                    },
                    {
                        qty: 1,
                        name: "FC Watch Amazfit Pace",
                        code: "1258748952000",
                        rate: "4,000"
                    },
                    {
                        qty: 1,
                        name: "FC Watch Amazfit Pace",
                        code: "1258748952000",
                        rate: "4,000"
                    }
                ],
                totalQty: 3,
                totalAmount: "12,000"
            }
        ]
    };

    const handlePrintStockList = () => {
        // Use stockData if provided, otherwise fallback to staticStockData
        const data = stockData || staticStockData;

        const stockHtml = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Stock & Company List</title>
            <style>
                @page {
                    size: 80mm auto;
                    margin: 0;
                }
                @media print {
                    html, body {
                        margin: 0;
                        padding: 0;
                    }
                    body {
                        background: none;
                    }
                }
                @media screen {
                    body {
                        margin: 20px;
                        padding: 20px;
                        background: #f5f5f5;
                    }
                }
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 10px;
                    background: #fff;
                }
                .invoice {
                    width: 80mm;
                    background: #fff;
                    margin: 0 auto;
                    padding: 5mm;
                    box-sizing: border-box;
                }
                h2 {
                    font-size: 14px;
                    margin: 12px 0 6px;
                    text-align: center;
                    text-transform: uppercase;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 4px;
                }
                th, td {
                    border: 1px solid #000;
                    padding: 4px;
                    font-size: 12px;
                }
                th {
                    background: #f0f0f0;
                    text-align: left;
                }
                .item-sn {
                    width: 8%;
                }
                .item-desc {
                    width: 60%;
                }
                .item-rate {
                    width: 32%;
                    text-align: right;
                }
                small {
                    display: block;
                    color: #555;
                    margin-top: 2px;
                    font-size: 10px;
                }
                .qty-total {
                    font-size: 16px;
                    text-align: center;
                }
                .total-text {
                    font-size: 16px;
                    text-align: center;
                }
                .amount-total {
                    font-size: 16px;
                    text-align: right;
                }
            </style>
        </head>
        <body>
            <div class="invoice">
                ${data.sections.map(section => `
                    <h2>${section.title}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th class="item-sn">Qty</th>
                                <th class="item-desc">Items</th>
                                <th class="item-rate">Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${section.items.map(item => `
                                <tr>
                                    <td>${item.qty}</td>
                                    <td>
                                        <b>${item.name}</b><br>
                                        <span>${item.code}</span><br>
                                        <span>${item.code2}</span>
                                    </td>
                                    <td>${item.rate}</td>
                                </tr>
                                
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th class="qty-total">${section.totalQty}</th>
                                <th class="total-text">Company Total</th>
                                <th class="amount-total">${section.totalAmount}</th>
                            </tr>
                        </tfoot>
                    </table>
                    
                `).join('')}
            <table>
                <thead>
                    <tr>
                        <th class="total-text">Company name</th>
                        <th class="qty-total">Qty</th>
                        <th class="amount-total">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><b>Apple</b></td>
                        <td>10</td>
                        <td>500,000</td>
                    </tr>
                    <tr>
                        <td><b>Apple</b></td>
                        <td>10</td>
                        <td>500,000</td>
                    </tr>
                    <tr>
                        <td><b>Apple</b></td>
                        <td>10</td>
                        <td>500,000</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th><b>Grand Total</b></th>
                        <th>10</th>
                        <th>500,000</th>
                    </tr>
                </tfoot>

            </table>
        </div>
        </body>
        </html>`;

        const printWindow = window.open('', '_blank', 'width=400,height=600');
        printWindow.document.open();
        printWindow.document.write(stockHtml);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    return (
        <div>
            <button onClick={handlePrintStockList} style={{ backgroundColor: "#987654", padding: "1rem" }}>
                Print Stock List
            </button>
        </div>
    )
};