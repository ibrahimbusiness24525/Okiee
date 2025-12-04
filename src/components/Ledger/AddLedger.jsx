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

  const fetchExpenses = async () => {
    try {
      const res = await getExpenses();
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

  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
        padding: '24px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          marginBottom: '24px',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '4px',
          }}
        >
          Expenses
        </h1>
        <p style={{ color: '#64748b', margin: 0 }}>
          Add expenses, manage types, and see all expenses in one place.
        </p>
        <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
          Total records: <b>{summary.count}</b> | Total amount:{' '}
          <b>PKR {Number(summary.totalAmount || 0).toLocaleString()}</b>
        </p>
      </div>

      {/* Add Expense + Type */}
      <div
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          marginBottom: '24px',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '16px',
            color: '#0f172a',
          }}
        >
          Add Expense
        </h2>

        <div
          style={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            marginBottom: '16px',
          }}
        >
          {/* Expense Type */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px',
                display: 'block',
              }}
            >
              Expense Type
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
                  border: '1px solid #d1d5db',
                  padding: '10px 12px',
                  fontSize: '14px',
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
                  border: '1px solid #c7d2fe',
                  background: '#eef2ff',
                  color: '#4f46e5',
                  padding: '8px 12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                + New Type
              </button>
            </div>

            {isCreatingType && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <input
                  type="text"
                  placeholder="Type name (e.g. Rent, Salary)"
                  value={newType.name}
                  onChange={(e) =>
                    setNewType({ ...newType, name: e.target.value })
                  }
                  style={{
                    width: '100%',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    padding: '8px 10px',
                    fontSize: '13px',
                    marginBottom: '6px',
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
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    padding: '8px 10px',
                    fontSize: '13px',
                    marginBottom: '8px',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleCreateExpenseType}
                    style={{
                      borderRadius: '6px',
                      border: 'none',
                      background:
                        'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                      color: 'white',
                      padding: '8px 14px',
                      fontSize: '13px',
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
                color: '#334155',
                marginBottom: '6px',
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
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                padding: '10px 12px',
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
                color: '#334155',
                marginBottom: '6px',
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
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                padding: '9px 12px',
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
                color: '#334155',
                marginBottom: '6px',
                display: 'block',
              }}
            >
              Note (optional)
            </label>
            <textarea
              rows={2}
              value={expenseData.note}
              onChange={(e) =>
                setExpenseData({ ...expenseData, note: e.target.value })
              }
              placeholder="Add a short description..."
              style={{
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                padding: '10px 12px',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button
            type="button"
            onClick={handleCreateExpense}
            disabled={!expenseData.expenseTypeId || !expenseData.price}
            style={{
              borderRadius: '8px',
              border: 'none',
              padding: '10px 22px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              cursor:
                !expenseData.expenseTypeId || !expenseData.price
                  ? 'not-allowed'
                  : 'pointer',
              background:
                !expenseData.expenseTypeId || !expenseData.price
                  ? '#9ca3af'
                  : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            }}
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '16px',
            color: '#0f172a',
          }}
        >
          All Expenses
        </h2>

        {expenses?.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            No expenses found. Add your first expense above.
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
                    background: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <th style={{ padding: '8px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Note</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>
                    Amount (PKR)
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses?.map((exp, idx) => (
                  <tr
                    key={exp.id || exp._id || idx}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      background: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                    }}
                  >
                    <td style={{ padding: '8px' }}>{formatDate(exp.date)}</td>
                    <td style={{ padding: '8px' }}>
                      {exp.expenseType?.name || '-'}
                    </td>
                    <td style={{ padding: '8px' }}>
                      {exp.note || exp.expenseType?.description || '-'}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>
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
