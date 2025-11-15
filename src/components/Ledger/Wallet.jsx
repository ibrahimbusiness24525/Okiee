import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { api } from '../../../api/api';
import Table from 'components/Table/Table';
import { dateFormatter } from 'utils/dateFormatter';
import { ModeEdit } from '@mui/icons-material';
import { Button } from 'react-bootstrap';
import Modal from 'components/Modal/Modal';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
  const Navigate = useNavigate();
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    accountType: '',
    sourceOfAmountAddition: '',
    sourceOfAmountDeduction: '',
    accountCash: '',
    accountNumber: '',
  });
  const [banks, setBanks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showRemovalModal, setShowRemovalModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [totalCash, setTotalCash] = useState(0);
  const [id, setId] = useState('');

  const fetchTotalCash = async () => {
    try {
      const res = await api.get('/api/pocketCash/total');
      setTotalCash(res.data.total);
      console.log('Pocket Cash Response:', res);
      setId(res.data.id);
    } catch (error) {
      console.error('Failed to fetch total cash:', error);
    }
  };
  const [addPocketCashModal, setAddPocketCashModal] = useState(false);
  const [removePocketCashModal, setRemovePocketCashModal] = useState(false);
  const [isRemovingCash, setIsRemovingCash] = useState(false);
  const handleTransaction = async (type) => {
    if (type === 'deduct' && isRemovingCash) return; // Prevent multiple clicks

    try {
      if (type === 'deduct') setIsRemovingCash(true);

      const endpoint =
        type === 'add' ? '/api/pocketCash/add' : '/api/pocketCash/deduct';
      await api.post(endpoint, {
        amount: Number(formData.accountCash),
        ...(type === 'add'
          ? { sourceOfAmountAddition: formData.sourceOfAmountAddition }
          : { reasonOfAmountDeduction: formData.sourceOfAmountDeduction }),
      });
      setAddPocketCashModal(false);
      setRemovePocketCashModal(false);
      toast.success('transaction is successful!');
      fetchTotalCash();
    } catch (error) {
      toast.error('Error in making transaction!');
      console.error(`Failed to ${type} cash:`, error);
    } finally {
      if (type === 'deduct') setIsRemovingCash(false);
    }
  };

  const handleCreateBank = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        '/api/banks/create', // your create bank endpoint
        formData
      );
      toast.success('Bank created successfully!');
      setFormData({ bankName: '', accountType: '', accountNumber: '' }); // Reset form data
      getAllBanks(); // Fetch all banks when the component mounts
    } catch (error) {
      console.error('Error creating bank:', error);
      toast.error('error creating bank!');
    }
  };

  const getAllBanks = async () => {
    try {
      const response = await api.get('/api/banks/getAllBanks'); // your get all banks endpoint
      setBanks(response?.data?.banks); // Set the banks state with the fetched data
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  const handleAddCash = (bank) => {
    setSelectedBank(bank);
    setShowModal(true); // Show the modal when the button is clicked
  };
  const handleRemoveCash = (bank) => {
    setSelectedBank(bank);
    setShowRemovalModal(true); // Show the modal when the button is clicked
  };
  const handleDeleteProceed = (bank) => {
    setSelectedBank(bank);
    setShowDeleteModal(true); // Show the modal when the button is clicked
  };
  const handleConfirmAddCash = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await api.post(
        '/api/banks/addCash',
        {
          bankId: selectedBank._id, // Use the selected bank's ID
          sourceOfAmountAddition: formData.sourceOfAmountAddition, // Get the source of amount from the form data
          accountCash: formData.accountCash, // Get the account cash from the form data
        } // your add cash endpoint
      );
      toast.success('Cash added successfully!');
      getAllBanks();
      setShowModal(false);
    } catch (error) {
      console.error('Error adding cash:', error);
      toast.error('Error adding cash!');
    }
  };

  const handleConfirmRemoveCash = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await api.post(
        '/api/banks/removeCash',
        {
          bankId: selectedBank._id, // Use the selected bank's ID
          sourceOfAmountDeduction: formData.sourceOfAmountDeduction, // Get the source of amount from the form data
          accountCash: formData.accountCash, // Get the account cash from the form data
        } // your add cash endpoint
      );
      toast.success('Cash removed successfully!');
      getAllBanks();
      setShowRemovalModal(false);
    } catch (error) {
      console.error('Error removed cash:', error);
      toast.error('Error removed cash!');
    }
  };

  const handleDeleteBank = async () => {
    try {
      const response = api.delete(`/api/banks/delete/${selectedBank._id}`);
      toast.success('Bank Deleted Successfully');
      getAllBanks();
    } catch (error) {
      console.error('error', error);
      toast.success('Error in deleting bank');
    }
  };

  useEffect(() => {
    getAllBanks(); // Fetch all banks when the component mounts
    fetchTotalCash();
  }, []);

  return (
    <>
      <button
        onClick={() => setShowAnalyticsModal(true)}
        style={{
          padding: '15px 30px',
          margin: '20px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          backgroundColor: '#28a745',
          color: 'white',
          transition: 'transform 0.2s ease, background-color 0.3s',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        View Analytics
      </button>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={styles.cardStyle}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        >
          <h2>Pocket Cash 💸</h2>
          <h3
            style={{ fontSize: '36px', margin: '20px 0', fontWeight: 'bold' }}
          >
            {totalCash}
          </h3>

          <div>
            <button
              style={addButtonStyle}
              onClick={() => setAddPocketCashModal(true)}
            >
              Add Cash
            </button>
            <button
              style={removeButtonStyle}
              onClick={() => setRemovePocketCashModal(true)}
            >
              Remove Cash
            </button>
          </div>
          <button
            style={{
              ...styles.buttonStyle,
              backgroundColor: '#007bff',
              color: 'white',
              marginTop: '20px',
            }}
            onClick={() =>
              Navigate(`/app/dashboard/pocketCashTransactions/${id}`)
            }
          >
            View Transactions
          </button>
        </div>
        <div style={styles.container}>
          <h1 style={styles.heading}>Add Bank</h1>

          <form onSubmit={handleCreateBank} style={styles.form}>
            <input
              type="text"
              placeholder="Bank Name"
              value={formData.bankName}
              onChange={(e) =>
                setFormData({ ...formData, bankName: e.target.value })
              }
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Account Type (e.g., Savings, Current)"
              value={formData.accountType}
              onChange={(e) =>
                setFormData({ ...formData, accountType: e.target.value })
              }
              style={styles.input}
              required
            />
            <input
              type="number"
              placeholder="Account Number"
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Create Bank
            </button>
          </form>
        </div>
      </div>

      <Table
        routes={['/app/dashboard/bankTransaction']}
        array={banks}
        // search={"ban"}
        keysToDisplay={[
          'bankName',
          'accountType',
          'accountCash',
          'accountNumber',
          'cashIn',
          'cashOut',
          'createdAt',
        ]}
        label={[
          'Bank Name',
          'Account Type',
          'Account Cash',
          'Account Number',
          'Cash In',
          'Cash Out',
          'Created At',
          'Actions',
        ]}
        customBlocks={[
          {
            index: 2,
            component: (cash) => {
              return (
                <h4
                  style={{
                    fontSize: '18px',
                    color: '#2c3e50',
                    fontWeight: '600',
                    backgroundColor: '#ecf0f1',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    display: 'inline-block',
                    minWidth: '80px',
                    textAlign: 'center',
                  }}
                >
                  {cash}
                </h4>
              );
            },
          },
          {
            index: 3,
            component: (accountNumber) => {
              return accountNumber ? (
                <h4
                  style={{
                    fontSize: '18px',
                    color: '#2c3e50',
                    fontWeight: '600',
                    backgroundColor: '#ecf0f1',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    display: 'inline-block',
                    minWidth: '80px',
                    textAlign: 'center',
                  }}
                >
                  {accountNumber}
                </h4>
              ) : (
                <h4
                  style={{
                    fontSize: '18px',
                    color: '#e74c3c',
                    fontWeight: '600',
                    padding: '8px 12px',
                    display: 'inline-block',
                  }}
                >
                  Not Available
                </h4>
              );
            },
          },

          {
            index: 5,
            component: (cashout) => {
              return (
                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '12px',
                  }}
                >
                  -{cashout}
                </p>
              );
            },
          },
          {
            index: 6,
            component: (date) => {
              return dateFormatter(date);
            },
          },
        ]}
        extraColumns={[
          (obj) => {
            return (
              <>
                <Button
                  variant="success"
                  onClick={() => handleAddCash(obj)}
                  size="sm"
                  style={{ marginRight: '5px' }}
                >
                  Add Cash
                </Button>
                <Button
                  onClick={() => handleRemoveCash(obj)}
                  variant="warning"
                  size="sm"
                  style={{ marginRight: '5px', color: 'white' }}
                >
                  Remove Cash
                </Button>
                <Button
                  onClick={() => handleDeleteProceed(obj)}
                  variant="danger"
                  size="sm"
                >
                  Delete
                </Button>
              </>
            );
          },
        ]}
      />
      <Modal
        toggleModal={() => setShowModal(!showModal)}
        size="md"
        show={showModal}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Cash</h2>
        <form onSubmit={handleConfirmAddCash} style={styles.form}>
          <input
            type="text"
            placeholder="Enter Source of Amount"
            value={formData.sourceOfAmountAddition}
            onChange={(e) =>
              setFormData({
                ...formData,
                sourceOfAmountAddition: e.target.value,
              })
            }
            style={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Enter Cash to Deposit"
            value={formData.accountCash}
            onChange={(e) =>
              setFormData({ ...formData, accountCash: e.target.value })
            }
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Add Cash
          </button>
        </form>
      </Modal>
      <Modal
        toggleModal={() => setShowRemovalModal(!showRemovalModal)}
        size="md"
        show={showRemovalModal}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Remove Cash
        </h2>
        <form onSubmit={handleConfirmRemoveCash} style={styles.form}>
          <input
            type="text"
            placeholder="Enter Source"
            value={formData.sourceOfAmountDeduction}
            onChange={(e) =>
              setFormData({
                ...formData,
                sourceOfAmountDeduction: e.target.value,
              })
            }
            style={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Enter Cash to Remove"
            value={formData.accountCash}
            onChange={(e) =>
              setFormData({ ...formData, accountCash: e.target.value })
            }
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Deduct Cash
          </button>
        </form>
      </Modal>
      <Modal
        toggleModal={() => setShowDeleteModal(!showDeleteModal)}
        size="md"
        show={showDeleteModal}
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2
            style={{
              marginBottom: '20px',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            Confirm it
          </h2>
          <p style={{ marginBottom: '30px', fontSize: '16px' }}>
            Do you really want to delete the bank?
          </p>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
          >
            <Button
              variant="success"
              onClick={() => setShowDeleteModal(false)}
              size="sm"
              style={{
                minWidth: '80px',
                padding: '8px 12px',
                fontSize: '14px',
              }}
            >
              No
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteBank}
              size="sm"
              style={{
                minWidth: '80px',
                padding: '8px 12px',
                fontSize: '14px',
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        toggleModal={() => setAddPocketCashModal(!addPocketCashModal)}
        size="md"
        show={addPocketCashModal}
        centered
      >
        <div style={{ padding: 30, borderRadius: 10 }}>
          <h4
            style={{
              marginBottom: 25,
              textAlign: 'center',
              color: '#198754',
              fontWeight: 'bold',
            }}
          >
            Add Pocket Cash
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <input
              type="number"
              placeholder="Enter Amount"
              value={formData.accountCash}
              onChange={(e) =>
                setFormData({ ...formData, accountCash: e.target.value })
              }
              style={{
                padding: 12,
                borderRadius: 8,
                border: '1px solid #ced4da',
                width: '100%',
              }}
              required
            />
            <input
              type="text"
              placeholder="Enter Source of Amount (Reference)"
              value={formData.sourceOfAmountAddition}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sourceOfAmountAddition: e.target.value,
                })
              }
              style={{
                padding: 12,
                borderRadius: 8,
                border: '1px solid #ced4da',
                width: '100%',
              }}
              required
            />
            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}
            >
              <Button
                variant="secondary"
                onClick={() => setAddPocketCashModal(false)}
                style={{ padding: '6px 16px' }}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={() => handleTransaction('add')}
                style={{ padding: '6px 16px' }}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        toggleModal={() => setRemovePocketCashModal(!removePocketCashModal)}
        size="md"
        show={removePocketCashModal}
        centered
      >
        <div style={{ padding: 30, borderRadius: 10 }}>
          <h4
            style={{
              marginBottom: 25,
              textAlign: 'center',
              color: '#dc3545',
              fontWeight: 'bold',
            }}
          >
            Remove Pocket Cash
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <input
              type="number"
              placeholder="Enter Amount"
              value={formData.accountCash}
              onChange={(e) =>
                setFormData({ ...formData, accountCash: e.target.value })
              }
              style={{
                padding: 12,
                borderRadius: 8,
                border: '1px solid #ced4da',
                width: '100%',
              }}
              required
            />
            <input
              type="text"
              placeholder="Enter Source of Deduction (Reference)"
              value={formData.sourceOfAmountDeduction}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sourceOfAmountDeduction: e.target.value,
                })
              }
              style={{
                padding: 12,
                borderRadius: 8,
                border: '1px solid #ced4da',
                width: '100%',
              }}
              required
            />
            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}
            >
              <Button
                variant="secondary"
                onClick={() => setRemovePocketCashModal(false)}
                style={{ padding: '6px 16px' }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleTransaction('deduct')}
                style={{ padding: '6px 16px' }}
                disabled={isRemovingCash}
              >
                {isRemovingCash ? 'Processing...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        toggleModal={() => setShowAnalyticsModal(!showAnalyticsModal)}
        size="lg"
        show={showAnalyticsModal}
      >
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <h2
            style={{ fontWeight: 'bold', color: '#007bff', marginBottom: 30 }}
          >
            Wallet Analytics
          </h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 40,
              flexWrap: 'wrap',
              marginBottom: 40,
            }}
          >
            {/* Pocket Cash Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                borderRadius: 16,
                boxShadow: '0 4px 16px rgba(67,233,123,0.15)',
                padding: 32,
                minWidth: 260,
                textAlign: 'center',
              }}
            >
              <h4
                style={{ color: '#0a3d62', fontWeight: 700, marginBottom: 10 }}
              >
                Pocket Cash
              </h4>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#009432',
                  marginBottom: 8,
                }}
              >
                {totalCash}
              </div>
              <div style={{ color: '#222f3e', fontSize: 16 }}>
                Current Balance
              </div>
            </div>
            {/* Banks Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
                borderRadius: 16,
                boxShadow: '0 4px 16px rgba(116,235,213,0.15)',
                padding: 32,
                minWidth: 260,
                textAlign: 'center',
              }}
            >
              <h4
                style={{ color: '#222f3e', fontWeight: 700, marginBottom: 10 }}
              >
                Total Bank Balance
              </h4>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#1e3799',
                  marginBottom: 8,
                }}
              >
                {' '}
                {banks.reduce(
                  (sum, b) => sum + (Number(b.accountCash) || 0),
                  0
                )}
              </div>
              <div style={{ color: '#222f3e', fontSize: 16 }}>
                Across {banks.length} Bank{banks.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
                borderRadius: 16,
                boxShadow: '0 4px 16px rgba(247,151,30,0.12)',
                padding: 32,
                minWidth: 260,
                textAlign: 'center',
              }}
            >
              <h4
                style={{ color: '#b06ab3', fontWeight: 700, marginBottom: 10 }}
              >
                Profit / Loss
              </h4>
              {(() => {
                // Calculate profit/loss: (cashIn - cashOut) for all banks + pocket cash
                const totalIn = banks.reduce(
                  (sum, b) => sum + (Number(b.cashIn) || 0),
                  0
                );
                const totalOut = banks.reduce(
                  (sum, b) => sum + (Number(b.cashOut) || 0),
                  0
                );
                // For pocket cash, profit is just the current totalCash (since no cashIn/cashOut breakdown)
                // So, total profit = (bank cashIn - bank cashOut) + (current pocket cash)
                const profit = totalIn - totalOut + (Number(totalCash) || 0);
                return (
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: profit >= 0 ? '#27ae60' : '#e74c3c',
                      marginBottom: 8,
                    }}
                  >
                    {profit}
                  </div>
                );
              })()}
              <div style={{ color: '#222f3e', fontSize: 16 }}>
                Total (Banks + Pocket Cash)
              </div>
            </div>
          </div>
          {/* Transaction Summary Table */}
          <div
            style={{
              margin: '0 auto',
              maxWidth: 900,
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              padding: 24,
            }}
          >
            <h4
              style={{
                color: '#222f3e',
                fontWeight: 700,
                marginBottom: 18,
                textAlign: 'left',
              }}
            >
              Bank-wise Summary
            </h4>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 16,
              }}
            >
              <thead>
                <tr style={{ background: '#f1f2f6' }}>
                  <th
                    style={{ padding: 10, borderRadius: 6, textAlign: 'left' }}
                  >
                    Bank Name
                  </th>
                  <th style={{ padding: 10, textAlign: 'right' }}>Balance</th>
                  <th style={{ padding: 10, textAlign: 'right' }}>Cash In</th>
                  <th style={{ padding: 10, textAlign: 'right' }}>Cash Out</th>
                  <th style={{ padding: 10, textAlign: 'right' }}>Net</th>
                </tr>
              </thead>
              <tbody>
                {banks.map((b, idx) => {
                  const net =
                    (Number(b.cashIn) || 0) - (Number(b.cashOut) || 0);
                  return (
                    <tr
                      key={b._id || idx}
                      style={{ borderBottom: '1px solid #f1f2f6' }}
                    >
                      <td style={{ padding: 10, fontWeight: 600 }}>
                        {b.bankName}
                      </td>
                      <td style={{ padding: 10, textAlign: 'right' }}>
                        {b.accountCash}
                      </td>
                      <td
                        style={{
                          padding: 10,
                          textAlign: 'right',
                          color: '#27ae60',
                        }}
                      >
                        + {b.cashIn || 0}
                      </td>
                      <td
                        style={{
                          padding: 10,
                          textAlign: 'right',
                          color: '#e74c3c',
                        }}
                      >
                        - {b.cashOut || 0}
                      </td>
                      <td
                        style={{
                          padding: 10,
                          textAlign: 'right',
                          color: net >= 0 ? '#27ae60' : '#e74c3c',
                          fontWeight: 700,
                        }}
                      >
                        {net}
                      </td>
                    </tr>
                  );
                })}
                {banks.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: 'center',
                        padding: 20,
                        color: '#888',
                      }}
                    >
                      No bank data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAnalyticsModal(false)}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              marginTop: '30px',
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

const styles = {
  container: {
    width: '450px',
    margin: '60px auto',
    minHeight: '310px',
    padding: '30px 25px',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease-in-out',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '28px',
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  input: {
    padding: '12px 15px',
    border: '1px solid #d1d1d1',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#fafafa',
    transition: 'border-color 0.2s ease',
  },
  button: {
    padding: '14px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '17px',
    fontWeight: '600',
    cursor: 'pointer',
    letterSpacing: '0.5px',
    transition: 'background-color 0.3s ease',
  },
  message: {
    marginTop: '18px',
    textAlign: 'center',
    color: '#3498db',
    fontSize: '16px',
  },
  cardStyle: {
    border: '1px solid #ccc',
    borderRadius: '20px',
    padding: '40px 30px',
    maxWidth: '500px',
    margin: '50px auto',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #00c6ff, #0072ff)', // Updated gradient
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    boxSizing: 'border-box',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
  },

  buttonStyle: {
    padding: '15px 30px',
    margin: '15px 10px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'transform 0.2s ease, background-color 0.3s',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};
const addButtonStyle = {
  ...styles.buttonStyle,
  backgroundColor: '#00C851',
  color: 'white',
};

const removeButtonStyle = {
  ...styles.buttonStyle,
  backgroundColor: '#ff4444',
  color: 'white',
};

export default Wallet;
