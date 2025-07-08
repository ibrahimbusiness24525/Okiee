import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { Card, Divider, Progress, Statistic, Table, Tag } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  BankOutlined,
  ShopOutlined,
  MoneyCollectOutlined,
  WalletOutlined,
} from "@ant-design/icons";

const BalanceSheet = () => {
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [loading, setLoading] = useState(true);

  const getBalanceSheet = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/balanceSheet/');
      setBalanceSheet(response.data.balanceSheet);
    } catch (error) {
      console.error("Error fetching balance sheet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBalanceSheet();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading balance sheet...</div>;
  }

  if (!balanceSheet) {
    return <div className="error-container">Failed to load balance sheet data</div>;
  }

  // Format numbers with commas and 2 decimal places
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value).replace('PKR', '').trim();
  };

  // Calculate financial ratios
  const currentRatio = balanceSheet.assets.currentAssets.cashAndEquivalents.total /
    (balanceSheet.liabilities.currentLiabilities.total || 1);
  const netWorth = balanceSheet.totals.totalAssets - balanceSheet.totals.totalLiabilitiesAndEquity;
  const profitMargin = (balanceSheet.equity.retainedEarnings / balanceSheet.totals.totalAssets) * 100;

  // Prepare data for tables
  const assetsData = [
    {
      key: 'cash',
      name: 'Cash & Equivalents',
      amount: balanceSheet.assets.currentAssets.cashAndEquivalents.total,
      children: [
        { key: 'bank', name: 'Bank Balances', amount: balanceSheet.assets.currentAssets.cashAndEquivalents.bankBalances },
        { key: 'pocket', name: 'Pocket Cash', amount: balanceSheet.assets.currentAssets.cashAndEquivalents.pocketCash },
      ],
    },
    {
      key: 'inventory',
      name: 'Inventory',
      amount: balanceSheet.assets.currentAssets.inventory.total,
      children: [
        { key: 'accessories', name: 'Accessories', amount: balanceSheet.assets.currentAssets.inventory.accessories },
        { key: 'phones', name: 'Single Phones', amount: balanceSheet.assets.currentAssets.inventory.phones },
        { key: 'bulkPhones', name: 'Bulk Phones', amount: balanceSheet.assets.currentAssets.inventory.bulkPhones },
      ],
    },
    {
      key: 'receivables',
      name: 'Receivables',
      amount: balanceSheet.assets.currentAssets.receivables.total,
      children: [
        { key: 'customers', name: 'Customers', amount: balanceSheet.assets.currentAssets.receivables.customers },
        { key: 'entities', name: 'Entities', amount: balanceSheet.assets.currentAssets.receivables.entities },
      ],
    },
  ];

  const liabilitiesData = [
    {
      key: 'payables',
      name: 'Payables',
      amount: balanceSheet.liabilities.currentLiabilities.payables.total,
      children: [
        { key: 'customers', name: 'Customers', amount: balanceSheet.liabilities.currentLiabilities.payables.customers },
        { key: 'entities', name: 'Entities', amount: balanceSheet.liabilities.currentLiabilities.payables.entities },
        { key: 'bulkPurchases', name: 'Bulk Purchases', amount: balanceSheet.liabilities.currentLiabilities.payables.bulkPurchases },
      ],
    },
  ];

  const equityData = [
    { key: 'retained', name: 'Retained Earnings', amount: balanceSheet.equity.retainedEarnings },
  ];

  // Columns for expandable tables
  const columns = [
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span style={{ fontWeight: record.children ? '600' : '400' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Amount (PKR)',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount) => (
        <span style={{ color: amount < 0 ? '#f5222d' : '#389e0d' }}>
          {formatCurrency(amount)}
        </span>
      ),
    },
  ];

  return (
    <div className="balance-sheet-container">
      <div style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        margin: '0 auto',
        marginTop: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            margin: 0,
            color: '#2c3e50',
            fontSize: '2.5rem',
            fontWeight: 600
          }}>Balance Sheet</h1>
          <p style={{
            margin: '5px 0 0',
            color: '#7f8c8d',
            fontSize: '1rem',
            fontStyle: 'italic'
          }}>As of {new Date().toLocaleDateString()}</p>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            {
              title: "Total Assets",
              value: formatCurrency(balanceSheet.totals.totalAssets),
              icon: <DollarOutlined style={{ color: '#389e0d', fontSize: '24px' }} />,
              color: '#389e0d',
              background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)'
            },
            {
              title: "Total Liabilities",
              value: formatCurrency(balanceSheet.totals.totalLiabilitiesAndEquity - balanceSheet.equity.totalEquity),
              icon: <MoneyCollectOutlined style={{ color: '#f5222d', fontSize: '24px' }} />,
              color: '#f5222d',
              background: 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)'
            },
            {
              title: "Net Worth",
              value: formatCurrency(netWorth),
              icon: <WalletOutlined style={{
                color: netWorth >= 0 ? '#389e0d' : '#f5222d',
                fontSize: '24px'
              }} />,
              color: netWorth >= 0 ? '#389e0d' : '#f5222d',
              background: netWorth >= 0
                ? 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)'
                : 'linear-gradient(135deg, #fff1f0 0%, #ffa39e 100%)'
            },
            {
              title: "Retained Earnings",
              value: formatCurrency(balanceSheet.equity.retainedEarnings),
              icon: <BankOutlined style={{
                color: balanceSheet.equity.retainedEarnings >= 0 ? '#389e0d' : '#f5222d',
                fontSize: '24px'
              }} />,
              color: balanceSheet.equity.retainedEarnings >= 0 ? '#389e0d' : '#f5222d',
              background: balanceSheet.equity.retainedEarnings >= 0
                ? 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)'
                : 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)'
            }
          ].map((card, index) => (
            <div key={index} style={{
              background: card.background,
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s',
              ':hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ marginRight: '15px' }}>{card.icon}</div>
                <span style={{
                  fontSize: '1rem',
                  color: '#595959',
                  fontWeight: 500
                }}>{card.title}</span>
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: card.color,
                textAlign: 'right'
              }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Assets Section */}
        <div style={{
          marginBottom: '30px',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            background: '#389e0d',
            color: 'white',
            padding: '15px 20px',
            fontSize: '1.2rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center'
          }}>
            <DollarOutlined style={{ marginRight: '10px', fontSize: '20px' }} />
            Assets
          </div>
          <div style={{ background: 'white', padding: '0' }}>
            <Table
              columns={columns}
              dataSource={assetsData}
              pagination={false}
              bordered={false}
              style={{ border: 'none' }}
              expandable={{ defaultExpandAllRows: true }}
              summary={() => (
                <Table.Summary.Row style={{ background: '#f6ffed' }}>
                  <Table.Summary.Cell index={0} colSpan={1}>
                    <strong>Total Assets</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <strong style={{ color: '#389e0d' }}>
                      {formatCurrency(balanceSheet.totals.totalAssets)}
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </div>
        </div>

        {/* Liabilities & Equity Section */}
        <div style={{
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            background: '#f5222d',
            color: 'white',
            padding: '15px 20px',
            fontSize: '1.2rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center'
          }}>
            <MoneyCollectOutlined style={{ marginRight: '10px', fontSize: '20px' }} />
            Liabilities & Equity
          </div>
          <div style={{ background: 'white', padding: '0' }}>
            <Table
              columns={columns}
              dataSource={liabilitiesData}
              pagination={false}
              bordered={false}
              style={{ border: 'none', marginBottom: '0' }}
              expandable={{ defaultExpandAllRows: true }}
            />
            <Table
              columns={columns}
              dataSource={equityData}
              pagination={false}
              bordered={false}
              style={{ border: 'none' }}
              summary={() => (
                <Table.Summary.Row style={{ background: '#fff2f0' }}>
                  <Table.Summary.Cell index={0} colSpan={1}>
                    <strong>Total Liabilities & Equity</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <strong style={{ color: '#f5222d' }}>
                      {formatCurrency(balanceSheet.totals.totalLiabilitiesAndEquity)}
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </div>
        </div>
      </div>
      {/* <div className="header-section">
        <h1> Balance Sheet</h1>
        <p className="last-updated">As of {new Date().toLocaleDateString()}</p>
      </div>

    
      <div className="summary-cards">
        <Card className="summary-card">
          <Statistic
            title="Total Assets"
            value={formatCurrency(balanceSheet.totals.totalAssets)}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#389e0d' }}
          />
        </Card>
        <Card className="summary-card">
          <Statistic
            title="Total Liabilities"
            value={formatCurrency(balanceSheet.totals.totalLiabilitiesAndEquity - balanceSheet.equity.totalEquity)}
            prefix={<MoneyCollectOutlined />}
            valueStyle={{ color: '#f5222d' }}
          />
        </Card>
        <Card className="summary-card">
          <Statistic
            title="Net Worth"
            value={formatCurrency(netWorth)}
            prefix={<WalletOutlined />}
            valueStyle={{ color: netWorth >= 0 ? '#389e0d' : '#f5222d' }}
          />
        </Card>
        <Card className="summary-card">
          <Statistic
            title="Retained Earnings"
            value={formatCurrency(balanceSheet.equity.retainedEarnings)}
            prefix={<BankOutlined />}
            valueStyle={{ color: balanceSheet.equity.retainedEarnings >= 0 ? '#389e0d' : '#f5222d' }}
          />
        </Card>
      </div>


      <Card
        title="Assets"
        className="section-card"
        headStyle={{ borderBottom: '2px solid #389e0d', color: '#389e0d' }}
      >
        <Table
          columns={columns}
          dataSource={assetsData}
          pagination={false}
          bordered
          expandable={{
            defaultExpandAllRows: true,
          }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={1}>
                <strong>Total Assets</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <strong>{formatCurrency(balanceSheet.totals.totalAssets)}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>


      <Card
        title="Liabilities & Equity"
        className="section-card"
        headStyle={{ borderBottom: '2px solid #f5222d', color: '#f5222d' }}
      >
        <Table
          columns={columns}
          dataSource={liabilitiesData}
          pagination={false}
          bordered
          expandable={{
            defaultExpandAllRows: true,
          }}
          style={{ marginBottom: '20px' }}
        />

        <Table
          columns={columns}
          dataSource={equityData}
          pagination={false}
          bordered
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={1}>
                <strong>Total Liabilities & Equity</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <strong>{formatCurrency(balanceSheet.totals.totalLiabilitiesAndEquity)}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card> */}

      {/* Financial Health Indicators */}
      {/* <Card title="Financial Health Indicators" className="section-card">
        <div className="indicators-grid">
          <div className="indicator-card">
            <h3>Current Ratio</h3>
            <Progress
              type="dashboard"
              percent={Math.min(currentRatio * 10, 100)}
              format={() => currentRatio.toFixed(2)}
              strokeColor={currentRatio > 1.5 ? '#389e0d' : currentRatio > 1 ? '#faad14' : '#f5222d'}
            />
            <p>
              {currentRatio > 1.5 ? 'Healthy' : currentRatio > 1 ? 'Adequate' : 'Risk'} liquidity position
            </p>
          </div>

          <div className="indicator-card">
            <h3>Profit Margin</h3>
            <Progress
              type="dashboard"
              percent={Math.min(profitMargin, 100)}
              format={() => `${profitMargin.toFixed(2)}%`}
              strokeColor={profitMargin > 15 ? '#389e0d' : profitMargin > 5 ? '#faad14' : '#f5222d'}
            />
            <p>
              {profitMargin > 15 ? 'Strong' : profitMargin > 5 ? 'Moderate' : 'Low'} profitability
            </p>
          </div>

          <div className="indicator-card">
            <h3>Debt to Equity</h3>
            <Progress
              type="dashboard"
              percent={Math.min(
                (balanceSheet.liabilities.totalLiabilities /
                  (balanceSheet.equity.totalEquity || 1)) * 50,
                100
              )}
              format={() => (
                (balanceSheet.liabilities.totalLiabilities /
                  (balanceSheet.equity.totalEquity || 1)).toFixed(2)
              )}
              strokeColor={
                (balanceSheet.liabilities.totalLiabilities /
                  (balanceSheet.equity.totalEquity || 1)) < 1 ? '#389e0d' :
                  (balanceSheet.liabilities.totalLiabilities /
                    (balanceSheet.equity.totalEquity || 1)) < 2 ? '#faad14' : '#f5222d'
              }
            />
            <p>
              {(balanceSheet.liabilities.totalLiabilities /
                (balanceSheet.equity.totalEquity || 1)) < 1 ? 'Conservative' :
                (balanceSheet.liabilities.totalLiabilities /
                  (balanceSheet.equity.totalEquity || 1)) < 2 ? 'Moderate' : 'Aggressive'} leverage
            </p>
          </div>
        </div>
      </Card> */}

      {/* Notes Section */}
      {/* <Card title="Notes" className="section-card">
        <ul className="notes-list">
          <li>
            <Tag color="gold">Note</Tag> Values are shown in Pakistani Rupees (PKR)
          </li>
          <li>
            <Tag color="gold">Note</Tag> Inventory values are shown at cost
          </li>
          <li>
            <Tag color="gold">Note</Tag> Negative values in receivables indicate net payables
          </li>
        </ul>
      </Card> */}
    </div>
  );
};

export default BalanceSheet;