import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaUser,
  FaPhone,
  FaFileAlt,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaStickyNote,
  FaEdit,
} from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { api } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import Modal from 'components/Modal/Modal';
import { FaEyeSlash } from 'react-icons/fa';
import WalletTransactionModal from 'components/WalletTransaction/WalletTransactionModal';
import { Button } from 'react-bootstrap';
import { Favorite } from '@mui/icons-material';
import { toast } from 'react-toastify';
// Types

const PayablesAndReceivables = () => {
  const router = useNavigate();
  const [persons, setPersons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPersonData, setEditPersonData] = useState({
    id: '',
    name: '',
    number: '',
    reference: '',
  });

  const [showGiveCreditModal, setShowGiveCreditModal] = useState(false);
  const [showGiveCreditChildModal, setShowGiveCreditChildModal] =
    useState(false);
  const [showTakeCreditModal, setShowTakeCreditModal] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTakingCredit, setShowTakingCredit] = useState(false);
  const [showGivingCredit, setShowGivingCredit] = useState(false);
  const [showWalletTransactionModal, setShowWalletTransactionModal] =
    useState(false);
  const [giveCredit, setGiveCredit] = useState([]);
  const [takeCredit, setTakeCredit] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const takingCreditTotal = persons.reduce(
    (acc, person) => acc + person.takingCredit,
    0
  );
  const givingCreditTotal = persons.reduce(
    (acc, person) => acc + person.givingCredit,
    0
  );
  const fetchPersons = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/api/person/all');
      setPersons(data?.data || []);
      setFilteredPersons(data?.data || []);
    } catch (error) {
      alert('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  console.log('Persons:', persons);

  const handleSearch = (searchTerm) => {
    const filtered = persons.filter(
      (person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.number.toString().includes(searchTerm) ||
        person.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPersons(filtered);
  };

  const handleStatusFilter = (status) => {
    if (status === 'all') {
      setFilteredPersons(persons);
      return;
    }
    const filtered = persons.filter((person) => person.status === status);
    setFilteredPersons(filtered);
  };

  // Form states
  const [createPersonData, setCreatePersonData] = useState({
    name: '',
    number: '',
    reference: '',
  });

  const [creditData, setCreditData] = useState({
    personId: '',
    amount: '',
    description: '',
  });

  // Create person
  const handleCreatePerson = async (e) => {
    e.preventDefault();
    if (
      !createPersonData.name ||
      !createPersonData.number ||
      !createPersonData.reference
    ) {
      alert('Please fill all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/api/person/create', {
        name: createPersonData.name,
        number: Number.parseInt(createPersonData.number),
        reference: createPersonData.reference,
      });

      setShowCreateModal(false);
      setCreatePersonData({ name: '', number: '', reference: '' });
      fetchPersons();
      alert('Person created successfully!');
    } catch (error) {
      console.error('Error creating person:', error);
      alert('Error creating person. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Give credit
  const handleGiveCredit = async (e) => {
    e.preventDefault();
    if (!creditData.personId || !creditData.amount) {
      alert('Please fill all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/api/person/give-credit', {
        personId: creditData.personId,
        amount: Number.parseFloat(creditData.amount),
        description: creditData.description || '',
        giveCredit: giveCredit,
      });

      setShowGiveCreditModal(false);
      setCreditData({ personId: '', amount: '' });
      fetchPersons();
      alert('Credit given successfully!');
    } catch (error) {
      console.error('Error giving credit:', error);
      alert('Error giving credit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Take credit
  const handleTakeCredit = async (e) => {
    e.preventDefault();
    if (!creditData.personId || !creditData.amount) {
      alert('Please fill all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/api/person/take-credit', {
        personId: creditData.personId,
        amount: Number.parseFloat(creditData.amount),
        description: creditData.description || '',
        takeCredit: takeCredit,
      });

      setShowTakeCreditModal(false);
      setCreditData({ personId: '', amount: '' });
      fetchPersons();
      alert('Credit taken successfully!');
    } catch (error) {
      console.error('Error taking credit:', error);
      alert('Error taking credit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to person detail
  const handlePersonClick = (personId) => {
    router(`/app/dashboard/PayablesAndReceivables/${personId}`);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Payable':
        return '#ef4444'; // red
      case 'Receivable':
        return '#22c55e'; // green
      case 'Settled':
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  // Get status background color
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Payable':
        return '#fef2f2'; // red-50
      case 'Receivable':
        return '#f0fdf4'; // green-50
      case 'Settled':
        return '#f9fafb'; // gray-50
      default:
        return '#f9fafb';
    }
  };

  // Calculate totals
  //   const calculateTotals = () => {
  //     const totalPayable = persons.reduce((sum, person) => sum + person.takingCredit, 0)
  //     const totalReceivable = persons.reduce((sum, person) => sum + person.givingCredit, 0)
  //     const netAmount = totalReceivable - totalPayable

  //     return { totalPayable, totalReceivable, netAmount }
  //   }

  useEffect(() => {
    fetchPersons();
  }, []);
  const confirmDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      api
        .delete(`/api/person/${id}`)
        .then(() => {
          fetchPersons();
          alert('Person deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting person:', error);
          alert('Error deleting person. Please try again.');
        });
    }
  };
  //   const { totalPayable, totalReceivable, netAmount } = calculateTotals()
  const toggleFavorite = async (id) => {
    try {
      await api.patch(`/api/person/${id}`);
      toast.success('Favorite status updated successfully!');
      fetchPersons();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error updating favorite status. Please try again.');
    }
  };

  const editPerson = (person) => {
    setEditPersonData({
      id: person._id,
      name: person.name,
      number: person.number,
      reference: person.reference,
    });
    setShowEditModal(true);
  };
  const handleEditPerson = async (e) => {
    e.preventDefault();
    if (
      !editPersonData.name ||
      !editPersonData.number ||
      !editPersonData.reference
    ) {
      alert('Please fill all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.put(`/api/person/update/${editPersonData.id}`, {
        name: editPersonData.name,
        number: Number.parseInt(editPersonData.number),
        reference: editPersonData.reference,
      });

      setShowEditModal(false);
      setEditPersonData({ name: '', number: '', reference: '' });
      fetchPersons();
      toast.success('Person updated successfully!');
    } catch (error) {
      console.error('Error updating person:', error);
      toast.error('Error updating person. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div style={{ backgroundColor: '#f8fafc' }}>
      <div style={{ margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 8px 0',
                }}
              >
                Payables & Receivables
              </h1>
              <p
                style={{
                  color: '#6b7280',
                  margin: 0,
                  fontSize: '16px',
                }}
              >
                Manage your credit transactions and track outstanding amounts
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = '#2563eb')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = '#3b82f6')
                }
              >
                <FaPlus /> Create Entity
              </button>

              <button
                onClick={() => setShowGiveCreditModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = '#059669')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = '#10b981')
                }
              >
                <FaArrowUp /> MAINE DIYE
                {/* <FaArrowUp /> Give Credit */}
              </button>

              <button
                onClick={() => setShowTakeCreditModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = '#d97706')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = '#f59e0b')
                }
              >
                <FaArrowDown /> MAINE LIYE
                {/* <FaArrowDown /> Take Credit */}
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '1rem',
          }}
        >
          {/* Credit Summary Row */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Taking Credit Button */}
            <div
              style={{
                flex: '1',
                minWidth: '220px',
                maxWidth: 'calc(50% - 8px)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              <button
                onClick={() => setShowTakingCredit(!showTakingCredit)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = '#dc2626')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = '#ef4444')
                }
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FaArrowUp style={{ fontSize: '16px' }} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div
                      style={{
                        fontSize: '13px',
                        opacity: 0.9,
                        marginBottom: '4px',
                      }}
                    >
                      MAINE LIYE
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {showTakingCredit
                        ? `${takingCreditTotal.toLocaleString()} PKR`
                        : '••••••••'}
                    </div>
                  </div>
                </div>
                {showTakingCredit ? (
                  <FaEyeSlash style={{ fontSize: '18px', opacity: 0.8 }} />
                ) : (
                  <FaEye style={{ fontSize: '18px', opacity: 0.8 }} />
                )}
              </button>
            </div>

            {/* Giving Credit Button */}
            <div
              style={{
                flex: '1',
                minWidth: '220px',
                maxWidth: 'calc(50% - 8px)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              <button
                onClick={() => setShowGivingCredit(!showGivingCredit)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = '#059669')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = '#10b981')
                }
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FaArrowDown style={{ fontSize: '16px' }} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div
                      style={{
                        fontSize: '13px',
                        opacity: 0.9,
                        marginBottom: '4px',
                      }}
                    >
                      MAINE DIYE
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {showGivingCredit
                        ? `${givingCreditTotal.toLocaleString()} PKR`
                        : '••••••••'}
                    </div>
                  </div>
                </div>
                {showGivingCredit ? (
                  <FaEyeSlash style={{ fontSize: '18px', opacity: 0.8 }} />
                ) : (
                  <FaEye style={{ fontSize: '18px', opacity: 0.8 }} />
                )}
              </button>
            </div>
          </div>

          {/* Search and Filter Row */}
          <div
            style={{
              width: '100%',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search persons..."
                  style={{
                    width: '100%',
                    padding: '10px 16px 10px 40px',
                    borderRadius: '20px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box',
                  }}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <svg
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '18px',
                    height: '18px',
                    color: '#999',
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() => handleStatusFilter('all')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: '#e0e0e0',
                    color: '#333',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Show All
                </button>
                <button
                  onClick={() => handleStatusFilter('Receivable')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Receivable
                </button>
                <button
                  onClick={() => handleStatusFilter('Payable')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: '#F44336',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Payable
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Summary Cards */}
        {/* <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              borderRadius: "16px",
              padding: "24px",
              color: "white",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", opacity: 0.9 }}>Total Payable</p>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "bold" }}>
                  {totalPayable.toLocaleString()} PKR
                </h3>
                <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>Amount you owe to others</p>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  padding: "12px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FaArrowDown style={{ fontSize: "24px" }} />
              </div>
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              borderRadius: "16px",
              padding: "24px",
              color: "white",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", opacity: 0.9 }}>Total Receivable</p>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "bold" }}>
                  {totalReceivable.toLocaleString()} PKR
                </h3>
                <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>Amount others owe to you</p>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  padding: "12px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FaArrowUp style={{ fontSize: "24px" }} />
              </div>
            </div>
          </div>

          <div
            style={{
              background:
                netAmount >= 0
                  ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                  : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              borderRadius: "16px",
              padding: "24px",
              color: "white",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", opacity: 0.9 }}>Net Amount</p>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "bold" }}>
                  {Math.abs(netAmount).toLocaleString()} PKR
                </h3>
                <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>
                  {netAmount >= 0 ? "Net receivable" : "Net payable"}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  padding: "12px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FaDollarSign style={{ fontSize: "24px" }} />
              </div>
            </div>
          </div>
        </div> */}

        {/* Persons List */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 24px 0',
            }}
          >
            All Persons ({persons.length})
          </h2>

          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              ></div>
            </div>
          ) : persons.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#6b7280',
              }}
            >
              <FaUser
                style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}
              />
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
                No persons found
              </h3>
              <p style={{ margin: 0 }}>
                Create your first person to start tracking credits
              </p>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px',
                  width: '100%',
                  '@media (min-width: 1200px)': {
                    gridTemplateColumns: 'repeat(5, 1fr)', // 5 columns on large screens
                  },
                  '@media (min-width: 768px) and (max-width: 1199px)': {
                    gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns on medium screens
                  },
                  '@media (max-width: 767px)': {
                    gridTemplateColumns: '1fr', // 1 column on small screens
                  },
                }}
              >
                {filteredPersons.map((person, index) => (
                  <div
                    key={person._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      backgroundColor: getStatusBgColor(person.status),
                      border: `2px solid ${getStatusColor(person.status)}20`,
                      borderRadius: '12px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: 'hidden',
                      minHeight: '220px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                    whileHover={{
                      y: -4,
                      boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {/* Status Badge - Responsive positioning */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          // position: 'absolute',
                          top: '16px',
                          right: '16px',
                          backgroundColor: getStatusColor(person.status),
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: 'clamp(10px, 2vw, 12px)',
                          fontWeight: '500',
                          zIndex: 1,
                        }}
                      >
                        {person.status}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center',
                        }}
                      >
                        <Favorite
                          onClick={() => toggleFavorite(person._id)}
                          style={{
                            color: person.favourite ? '#e53935' : '#6b7280',
                            cursor: 'pointer',
                            fontSize: '1.25rem',
                          }}
                        />
                        <FaTrash
                          onClick={() => confirmDelete(person._id)}
                          style={{
                            color: '#e53935',
                            cursor: 'pointer',
                            fontSize: '1rem',
                          }}
                        />
                        <FaEdit
                          onClick={() => editPerson(person)}
                          style={{
                            color: '#3b82f6',
                            cursor: 'pointer',
                            fontSize: '1rem',
                          }}
                        />
                      </div>
                    </div>
                    {/* Person Info Section */}
                    <div style={{ marginBottom: '16px', zIndex: 1 }}>
                      <h3
                        style={{
                          margin: '0 0 8px 0',
                          fontSize: 'clamp(16px, 4vw, 18px)',
                          fontWeight: 'bold',
                          color: '#1f2937',
                          paddingRight: '60px',
                          lineHeight: '1.3',
                        }}
                      >
                        {person.name}
                      </h3>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <FaPhone
                            style={{
                              fontSize: '14px',
                              color: '#6b7280',
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 'clamp(12px, 3vw, 14px)',
                              color: '#6b7280',
                            }}
                          >
                            {person.number}
                          </span>
                        </div>

                        {person.reference && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <FaFileAlt
                              style={{
                                fontSize: '14px',
                                color: '#6b7280',
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontSize: 'clamp(12px, 3vw, 14px)',
                                color: '#6b7280',
                              }}
                            >
                              {person.reference}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Credit Cards - Responsive grid */}
                    {/* <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '12px',
                        marginBottom: '16px',
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          borderRadius: '8px',
                          padding: '12px',
                          textAlign: 'center',
                          minWidth: '120px',
                        }}
                      >
                        <p
                          style={{
                            margin: '0 0 4px 0',
                            fontSize: 'clamp(10px, 2.5vw, 12px)',
                            color: '#6b7280',
                          }}
                        >
                          Taking Credit
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 'clamp(14px, 3.5vw, 16px)',
                            fontWeight: 'bold',
                            color: '#ef4444',
                          }}
                        >
                          {person.takingCredit.toLocaleString()} PKR
                        </p>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          borderRadius: '8px',
                          padding: '12px',
                          textAlign: 'center',
                          minWidth: '120px',
                        }}
                      >
                        <p
                          style={{
                            margin: '0 0 4px 0',
                            fontSize: 'clamp(10px, 2.5vw, 12px)',
                            color: '#6b7280',
                          }}
                        >
                          Giving Credit
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 'clamp(14px, 3.5vw, 16px)',
                            fontWeight: 'bold',
                            color: '#22c55e',
                          }}
                        >
                          {person.givingCredit.toLocaleString()} PKR
                        </p>
                      </div>
                    </div> */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '16px',
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            person.takingCredit > person.givingCredit
                              ? 'rgba(239, 68, 68, 0.1)'
                              : person.givingCredit > person.takingCredit
                                ? 'rgba(34, 197, 94, 0.1)'
                                : 'rgba(156, 163, 175, 0.1)',
                          borderRadius: '8px',
                          padding: '12px',
                          textAlign: 'center',
                          minWidth: '120px',
                        }}
                      >
                        <p
                          style={{
                            margin: '0 0 4px 0',
                            fontSize: 'clamp(10px, 2.5vw, 12px)',
                            color: '#6b7280',
                          }}
                        ></p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 'clamp(14px, 3.5vw, 16px)',
                            fontWeight: 'bold',
                            color:
                              person.takingCredit > person.givingCredit
                                ? '#ef4444'
                                : person.givingCredit > person.takingCredit
                                  ? '#22c55e'
                                  : '#6b7280',
                          }}
                        >
                          {Math.abs(
                            person.takingCredit - person.givingCredit
                          ).toLocaleString()}{' '}
                          PKR
                        </p>
                      </div>
                    </div>
                    {/* View Details Footer */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                        zIndex: 1,
                      }}
                    >
                      <div
                        onClick={() => handlePersonClick(person._id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: getStatusColor(person.status),
                          fontSize: 'clamp(12px, 3vw, 14px)',
                          fontWeight: '500',
                        }}
                      >
                        <FaEye />
                        View Details
                      </div>
                    </div>

                    {/* Background pattern for better visual */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '100px',
                        height: '100px',
                        background: `linear-gradient(135deg, ${getStatusColor(person.status)}10 0%, transparent 70%)`,
                        borderRadius: '50% 0 0 0',
                        opacity: 0.6,
                      }}
                    />
                  </div>
                ))}
              </div>
              {/* {filteredPersons.map((person, index) => (
                <div
                  key={person._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handlePersonClick(person._id)}
                  style={{
                    backgroundColor: getStatusBgColor(person.status),
                    border: `2px solid ${getStatusColor(person.status)}20`,
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px -8px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      backgroundColor: getStatusColor(person.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {person.status}
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <h3
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        paddingRight: '80px',
                      }}
                    >
                      {person.name}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <FaPhone style={{ fontSize: '12px', color: '#6b7280' }} />
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        {person.number}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <FaFileAlt
                        style={{ fontSize: '12px', color: '#6b7280' }}
                      />
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        {person.reference}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        textAlign: 'center',
                      }}
                    >
                      <p
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '12px',
                          color: '#6b7280',
                        }}
                      >
                        Taking Credit
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#ef4444',
                        }}
                      >
                        {person.takingCredit.toLocaleString()} PKR
                      </p>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        textAlign: 'center',
                      }}
                    >
                      <p
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '12px',
                          color: '#6b7280',
                        }}
                      >
                        Giving Credit
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#22c55e',
                        }}
                      >
                        {person.givingCredit.toLocaleString()} PKR
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: getStatusColor(person.status),
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      <FaEye />
                      View Details
                    </div>
                  </div>
                </div>
              ))} */}
            </div>
          )}
        </div>

        {/* Create Person Modal */}
        <Modal
          toggleModal={() => setShowCreateModal(false)}
          show={showCreateModal}
          size="sm"
          onClick={() => setShowCreateModal(false)}
        >
          <h2
            style={{
              margin: '0 0 24px 0',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
            }}
          >
            Create New Person
          </h2>

          <form onSubmit={handleCreatePerson}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Name *
              </label>
              <div style={{ position: 'relative' }}>
                <FaUser
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '16px',
                  }}
                />
                <input
                  type="text"
                  value={createPersonData.name}
                  onChange={(e) =>
                    setCreatePersonData({
                      ...createPersonData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter person name"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Phone Number *
              </label>
              <div style={{ position: 'relative' }}>
                <FaPhone
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '16px',
                  }}
                />
                <input
                  type="tel"
                  value={createPersonData.number}
                  onChange={(e) =>
                    setCreatePersonData({
                      ...createPersonData,
                      number: e.target.value,
                    })
                  }
                  placeholder="Enter phone number"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Reference *
              </label>
              <div style={{ position: 'relative' }}>
                <FaFileAlt
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '16px',
                  }}
                />
                <input
                  type="text"
                  value={createPersonData.reference}
                  onChange={(e) =>
                    setCreatePersonData({
                      ...createPersonData,
                      reference: e.target.value,
                    })
                  }
                  placeholder="Enter reference"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = '#f9fafb')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = 'white')
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting)
                    e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting)
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
              >
                {isSubmitting ? 'Creating...' : 'Create Person'}
              </button>
            </div>
          </form>
        </Modal>
        <Modal
          toggleModal={() => setShowEditModal(false)}
          show={showEditModal}
          size="sm"
          onClick={() => setShowEditModal(false)}
        >
          <h2
            style={{
              margin: '0 0 24px 0',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
            }}
          >
            Edit Person
          </h2>

          <form onSubmit={handleEditPerson}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Name *
              </label>
              <div style={{ position: 'relative' }}>
                <FaUser
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '16px',
                  }}
                />
                <input
                  type="text"
                  value={editPersonData.name}
                  onChange={(e) =>
                    setEditPersonData({
                      ...editPersonData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter person name"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Phone Number *
              </label>
              <div style={{ position: 'relative' }}>
                <FaPhone
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '16px',
                  }}
                />
                <input
                  type="tel"
                  value={editPersonData.number}
                  onChange={(e) =>
                    setEditPersonData({
                      ...editPersonData,
                      number: e.target.value,
                    })
                  }
                  placeholder="Enter phone number"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Reference *
              </label>
              <div style={{ position: 'relative' }}>
                <FaFileAlt
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '16px',
                  }}
                />
                <input
                  type="text"
                  value={editPersonData.reference}
                  onChange={(e) =>
                    setEditPersonData({
                      ...editPersonData,
                      reference: e.target.value,
                    })
                  }
                  placeholder="Enter reference"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = '#f9fafb')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = 'white')
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting)
                    e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting)
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
              >
                {isSubmitting ? 'Updating...' : 'Update Person'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Give Credit Modal */}

        <Modal
          size="sm"
          show={showGiveCreditModal}
          toggleModal={() => setShowGiveCreditModal(false)}
        >
          <h2
            style={{
              margin: '0 0 24px 0',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
            }}
          >
            Give Credit
          </h2>

          <form onSubmit={handleGiveCredit}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Select Person *
              </label>
              <select
                value={creditData.personId}
                onChange={(e) =>
                  setCreditData({ ...creditData, personId: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                required
              >
                <option value="">Select a person</option>
                {[...persons]
                  .sort(
                    (a, b) => (b.favourite === true) - (a.favourite === true)
                  )
                  .map((person) => (
                    <option key={person._id} value={person._id}>
                      {person.name} - {person.number}
                    </option>
                  ))}
              </select>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Amount (PKR) *
              </label>
              <div style={{ position: 'relative' }}>
                <FaDollarSign
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '16px',
                  }}
                />
                <input
                  type="number"
                  value={creditData.amount}
                  onChange={(e) =>
                    setCreditData({ ...creditData, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Desciption *
              </label>
              <div style={{ position: 'relative' }}>
                <FaStickyNote
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '16px',
                  }}
                />
                <input
                  type="text"
                  value={creditData.description}
                  onChange={(e) =>
                    setCreditData({
                      ...creditData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter description"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                  required
                />
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() =>
                setShowGiveCreditChildModal(!showGiveCreditChildModal)
              }
            >
              Proceed To Pay
            </Button>
            <WalletTransactionModal
              show={showGiveCreditChildModal}
              toggleModal={() =>
                setShowGiveCreditChildModal(!showGiveCreditChildModal)
              }
              singleTransaction={giveCredit}
              setSingleTransaction={setGiveCredit}
            />

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setShowGiveCreditModal(false)}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = '#f9fafb')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = 'white')
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: isSubmitting ? '#9ca3af' : '#10b981',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting)
                    e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting)
                    e.currentTarget.style.backgroundColor = '#10b981';
                }}
              >
                {isSubmitting ? 'Processing...' : 'Give Credit'}
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          size="sm"
          show={showTakeCreditModal}
          toggleModal={() => setShowTakeCreditModal(false)}
        >
          <h2
            style={{
              margin: '0 0 24px 0',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
            }}
          >
            Take Credit
          </h2>

          <form onSubmit={handleTakeCredit}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Select Person *
              </label>
              <select
                value={creditData.personId}
                onChange={(e) =>
                  setCreditData({ ...creditData, personId: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                required
              >
                <option value="">Select a person</option>
                {/* {persons.map((person) => (
                  <option key={person._id} value={person._id}>
                    {person.name} - {person.number}
                  </option>
                ))} */}
                {[...persons]
                  .sort(
                    (a, b) => (b.favourite === true) - (a.favourite === true)
                  )
                  .map((person) => (
                    <option key={person._id} value={person._id}>
                      {person.name} - {person.number}
                    </option>
                  ))}
              </select>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Amount (PKR) *
              </label>
              <div style={{ position: 'relative' }}>
                <FaDollarSign
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '16px',
                  }}
                />
                <input
                  type="number"
                  value={creditData.amount}
                  onChange={(e) =>
                    setCreditData({ ...creditData, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Desciption *
              </label>
              <div style={{ position: 'relative' }}>
                <FaStickyNote
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '16px',
                  }}
                />
                <input
                  type="text"
                  value={creditData.description}
                  onChange={(e) =>
                    setCreditData({
                      ...creditData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter description"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                  required
                />
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() =>
                setShowWalletTransactionModal(!showWalletTransactionModal)
              }
            >
              Proceed To Get Payment
            </Button>
            <WalletTransactionModal
              show={showWalletTransactionModal}
              toggleModal={() =>
                setShowWalletTransactionModal(!showWalletTransactionModal)
              }
              singleTransaction={takeCredit}
              setSingleTransaction={setTakeCredit}
            />
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setShowTakeCreditModal(false)}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = '#f9fafb')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = 'white')
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: isSubmitting ? '#9ca3af' : '#f59e0b',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting)
                    e.currentTarget.style.backgroundColor = '#d97706';
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting)
                    e.currentTarget.style.backgroundColor = '#f59e0b';
                }}
              >
                {isSubmitting ? 'Processing...' : 'Take Credit'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default PayablesAndReceivables;
