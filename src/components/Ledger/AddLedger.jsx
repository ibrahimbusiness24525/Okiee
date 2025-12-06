import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  createExpenseType,
  getExpenseTypes,
  createExpenseApi,
  getExpenses,
} from '../../../api/api';

const AddLedger = () => {
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ count: 0, totalAmount: 0 });

  const [expenseData, setExpenseData] = useState({
    expenseTypeId: '',
    price: '',
    note: '',
    date: '',
  });

  const [isCreatingType, setIsCreatingType] = useState(false);
  const [newType, setNewType] = useState({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilters, setDateFilters] = useState({
    startDate: '',
    endDate: '',
  });

  const fetchExpenseTypes = async () => {
    try {
      const res = await getExpenseTypes();
      const raw = res?.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : [];
      setExpenseTypes(list);
    } catch (e) {
      setExpenseTypes([]);
    }
  };

  const fetchExpenses = async (params = {}) => {
    try {
      const queryParams = {};
      if (dateFilters.startDate) {
        queryParams.startDate = dateFilters.startDate;
      }
      if (dateFilters.endDate) {
        queryParams.endDate = dateFilters.endDate;
      }
      const res = await getExpenses({ ...queryParams, ...params });
      if (res?.data?.success) {
        setSummary({
          count: res.data.count,
          totalAmount: res.data.totalAmount,
        });
        setExpenses(res.data.data || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchExpenseTypes();
    fetchExpenses();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [dateFilters.startDate, dateFilters.endDate]);

  const handleCreateExpenseType = async () => {
    try {
      if (!newType.name.trim()) {
        toast.error('Expense type name is required');
        return;
      }
      await createExpenseType({
        name: newType.name.trim(),
        description: newType.description.trim() || undefined,
      });
      toast.success('Expense type created');
      setNewType({ name: '', description: '' });
      setIsCreatingType(false);
      fetchExpenseTypes();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to create type');
    }
  };

  const handleCreateExpense = async () => {
    try {
      if (!expenseData.expenseTypeId || !expenseData.price) return;

      await createExpenseApi({
        expenseTypeId: expenseData.expenseTypeId,
        price: Number(expenseData.price),
        note: expenseData.note || undefined,
        date: expenseData.date || undefined,
      });

      toast.success('Expense added');
      setExpenseData({ expenseTypeId: '', price: '', note: '', date: '' });
      fetchExpenses();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to add expense');
    }
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString();
  };

  const setQuickDateFilter = (period) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let startDate = '';
    let endDate = '';

    if (period === 'today') {
      startDate = today.toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
    } else if (period === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      startDate = weekAgo.toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
    } else if (period === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      startDate = monthAgo.toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
    }

    setDateFilters({ startDate, endDate });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilters({ startDate: '', endDate: '' });
  };

  // Filter expenses based on search term (client-side)
  const filteredExpenses = expenses.filter((exp) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase().trim();
    const typeName = (exp.expenseType?.name || '').toLowerCase();
    const note = (exp.note || '').toLowerCase();
    const description = (exp.expenseType?.description || '').toLowerCase();
    return (
      typeName.includes(search) ||
      note.includes(search) ||
      description.includes(search)
    );
  });

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 700,
            color: '#2c3e50',
            marginBottom: '10px',
          }}
        >
          💰 Expense Management
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '16px', margin: '10px 0' }}>
          Track, manage, and analyze all your business expenses in one place
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginTop: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
              color: 'white',
              padding: '15px 25px',
              borderRadius: '8px',
              boxShadow: '0px 4px 10px rgba(52, 152, 219, 0.3)',
            }}
          >
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Records</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>
              {summary.count}
            </div>
          </div>
          <div
            style={{
              background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
              color: 'white',
              padding: '15px 25px',
              borderRadius: '8px',
              boxShadow: '0px 4px 10px rgba(39, 174, 96, 0.3)',
            }}
          >
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Amount</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>
              PKR {Number(summary.totalAmount || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense + Type */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '20px',
            color: '#2c3e50',
            textAlign: 'center',
          }}
        >
          Add New Expense
        </h2>

        <div
          style={{
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            marginBottom: '20px',
          }}
        >
          {/* Expense Type */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#2c3e50',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Expense Type
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                value={expenseData.expenseTypeId}
                onChange={(e) =>
                  setExpenseData({
                    ...expenseData,
                    expenseTypeId: e.target.value,
                  })
                }
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Select expense type...</option>
                {Array.isArray(expenseTypes) &&
                  expenseTypes.map((t) => (
                    <option key={t.id || t._id} value={t.id || t._id}>
                      {t.name}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={() => setIsCreatingType((v) => !v)}
                style={{
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#8e44ad',
                  color: 'white',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0px 2px 5px rgba(142, 68, 173, 0.3)',
                }}
              >
                + New Type
              </button>
            </div>

            {isCreatingType && (
              <div
                style={{
                  marginTop: '15px',
                  padding: '15px',
                  borderRadius: '8px',
                  background: '#f8f9fa',
                  border: '1px solid #e2e8f0',
                }}
              >
                <input
                  type="text"
                  placeholder="Type name (e.g. Rent, Salary, Utilities)"
                  value={newType.name}
                  onChange={(e) =>
                    setNewType({ ...newType, name: e.target.value })
                  }
                  style={{
                    width: '100%',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    padding: '10px',
                    fontSize: '14px',
                    marginBottom: '10px',
                  }}
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newType.description}
                  onChange={(e) =>
                    setNewType({ ...newType, description: e.target.value })
                  }
                  style={{
                    width: '100%',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    padding: '10px',
                    fontSize: '14px',
                    marginBottom: '10px',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleCreateExpenseType}
                    style={{
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: '#27ae60',
                      color: 'white',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Save Type
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#2c3e50',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={expenseData.price}
              onChange={(e) =>
                setExpenseData({ ...expenseData, price: e.target.value })
              }
              placeholder="0.00"
              style={{
                width: '100%',
                borderRadius: '4px',
                border: '1px solid #ccc',
                padding: '12px',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Date */}
          <div>
            <label
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#2c3e50',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Date (optional)
            </label>
            <input
              type="date"
              value={expenseData.date}
              onChange={(e) =>
                setExpenseData({ ...expenseData, date: e.target.value })
              }
              style={{
                width: '100%',
                borderRadius: '4px',
                border: '1px solid #ccc',
                padding: '10px',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Note */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#2c3e50',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Note (optional)
            </label>
            <textarea
              rows={3}
              value={expenseData.note}
              onChange={(e) =>
                setExpenseData({ ...expenseData, note: e.target.value })
              }
              placeholder="Add a short description..."
              style={{
                width: '100%',
                borderRadius: '4px',
                border: '1px solid #ccc',
                padding: '10px',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleCreateExpense}
            disabled={!expenseData.expenseTypeId || !expenseData.price}
            style={{
              padding: '12px 30px',
              backgroundColor:
                !expenseData.expenseTypeId || !expenseData.price
                  ? '#95a5a6'
                  : '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor:
                !expenseData.expenseTypeId || !expenseData.price
                  ? 'not-allowed'
                  : 'pointer',
              fontSize: '16px',
              fontWeight: 600,
              boxShadow:
                !expenseData.expenseTypeId || !expenseData.price
                  ? 'none'
                  : '0px 4px 10px rgba(230, 126, 34, 0.3)',
            }}
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '20px',
            color: '#2c3e50',
            textAlign: 'center',
          }}
        >
          All Expenses
        </h2>

        {/* Search and Filter Section */}
        <div
          style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '15px',
            }}
          >
            {/* Search Bar */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#2c3e50',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                🔍 Search Expenses
              </label>
              <input
                type="text"
                placeholder="Search by type name, note, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Date Filters */}
            <div>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#2c3e50',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                📅 From Date
              </label>
              <input
                type="date"
                value={dateFilters.startDate}
                onChange={(e) =>
                  setDateFilters({
                    ...dateFilters,
                    startDate: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#2c3e50',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                📅 To Date
              </label>
              <input
                type="date"
                value={dateFilters.endDate}
                onChange={(e) =>
                  setDateFilters({
                    ...dateFilters,
                    endDate: e.target.value,
                  })
                }
                min={dateFilters.startDate || undefined}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#2c3e50',
                marginRight: '10px',
              }}
            >
              Quick Filters:
            </span>
            <button
              type="button"
              onClick={() => setQuickDateFilter('today')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#3498db',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0px 2px 5px rgba(52, 152, 219, 0.3)',
              }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setQuickDateFilter('week')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#e67e22',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0px 2px 5px rgba(230, 126, 34, 0.3)',
              }}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => setQuickDateFilter('month')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#8e44ad',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0px 2px 5px rgba(142, 68, 173, 0.3)',
              }}
            >
              This Month
            </button>
            {(searchTerm || dateFilters.startDate || dateFilters.endDate) && (
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  backgroundColor: '#ffffff',
                  color: '#2c3e50',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginLeft: 'auto',
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Active Filters Info */}
          {(searchTerm || dateFilters.startDate || dateFilters.endDate) && (
            <div
              style={{
                marginTop: '15px',
                padding: '10px',
                backgroundColor: '#e8f5e9',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#27ae60',
              }}
            >
              <strong>Active Filters:</strong>{' '}
              {searchTerm && `Search: "${searchTerm}"`}
              {searchTerm &&
                (dateFilters.startDate || dateFilters.endDate) &&
                ' | '}
              {dateFilters.startDate &&
                `From: ${new Date(dateFilters.startDate).toLocaleDateString()}`}
              {dateFilters.startDate && dateFilters.endDate && ' | '}
              {dateFilters.endDate &&
                `To: ${new Date(dateFilters.endDate).toLocaleDateString()}`}{' '}
              <span style={{ color: '#7f8c8d' }}>
                ({filteredExpenses.length} result
                {filteredExpenses.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>

        {filteredExpenses?.length === 0 ? (
          <p
            style={{
              color: '#95a5a6',
              fontSize: '16px',
              textAlign: 'center',
              padding: '40px',
            }}
          >
            {expenses?.length === 0
              ? 'No expenses found. Add your first expense above.'
              : 'No expenses match your search criteria. Try adjusting your filters.'}
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)',
                    color: 'white',
                  }}
                >
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 600,
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 600,
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 600,
                    }}
                  >
                    Note
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'right',
                      fontWeight: 600,
                    }}
                  >
                    Amount (PKR)
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses?.map((exp, idx) => (
                  <tr
                    key={exp.id || exp._id || idx}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      background: idx % 2 === 0 ? '#ffffff' : '#f8f9fa',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ecf0f1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        idx % 2 === 0 ? '#ffffff' : '#f8f9fa';
                    }}
                  >
                    <td style={{ padding: '12px', color: '#2c3e50' }}>
                      {formatDate(exp.date)}
                    </td>
                    <td style={{ padding: '12px', color: '#2c3e50' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          backgroundColor: '#e8f5e9',
                          color: '#27ae60',
                          fontWeight: 600,
                          fontSize: '12px',
                        }}
                      >
                        {exp.expenseType?.name || '-'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#7f8c8d' }}>
                      {exp.note || exp.expenseType?.description || '-'}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        color: '#2c3e50',
                        fontWeight: 600,
                      }}
                    >
                      {Number(exp.price || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddLedger;
