import React, { useEffect, useState } from 'react';
import Table from 'components/Table/Table';
import { dateFormatter } from 'utils/dateFormatter';
import { StyledHeading } from 'components/StyledHeading/StyledHeading';
import { api, returnPurchasePhone, returnAccessoryPurchase } from '../../../api/api';
import BarcodePrinter from 'components/BarcodePrinter/BarcodePrinter';
import { toast } from 'react-toastify';
import Modal from 'components/Modal/Modal';
import { Button, Form } from 'react-bootstrap';
import WalletTransactionModal from 'components/WalletTransaction/WalletTransactionModal';
const PurchaseRecords = () => {
  const [purchasedPhones, setPurchasedPhone] = useState([]);
  const [newPhones, setNewPhones] = useState([]);
  const [oldPhones, setOldPhones] = useState([]);
  const [accessoriesRecords, setAccessoriesRecords] = useState([]);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [returningItem, setReturningItem] = useState(null);
  const [returnType, setReturnType] = useState(''); // 'single', 'bulk', or 'accessory'
  const [returnForm, setReturnForm] = useState({
    returnAmount: '',
    bankAccountUsed: '',
    amountFromPocket: 0,
    amountFromBank: '',
  });
  const [walletTransaction, setWalletTransaction] = useState({
    bankAccountUsed: '',
    amountFromBank: '',
    amountFromPocket: '',
  });

  const getAccessoriesRecords = async () => {
    try {
      const response = await api.get(`api/accessory/accessoryRecord/purchase`);
      console.log('Accessories Records:', response.data);
      setAccessoriesRecords(response?.data);
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching accessories records:', error);
      return [];
    }
  };

  const handleReturnClick = (item, type) => {
    setReturningItem(item);
    setReturnType(type);
    // Set default return amount based on item
    if (type === 'accessory') {
      setReturnForm({
        returnAmount: item.totalPrice || '',
        bankAccountUsed: '',
        amountFromPocket: 0,
        amountFromBank: '',
      });
    } else {
      // For phones, use price.finalPrice or similar
      const price = item.price?.finalPrice || item.totalPrice || '';
      setReturnForm({
        returnAmount: price,
        bankAccountUsed: '',
        amountFromPocket: 0,
        amountFromBank: '',
      });
    }
    // Reset wallet transaction
    setWalletTransaction({
      bankAccountUsed: '',
      amountFromBank: '',
      amountFromPocket: '',
    });
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async () => {
    if (!returningItem || !returningItem._id) {
      toast.error('Invalid item selected');
      return;
    }

    try {
      const payload = {
        returnAmount: returnForm.returnAmount ? Number(returnForm.returnAmount) : undefined,
        bankAccountUsed: walletTransaction.bankAccountUsed || undefined,
        amountFromPocket: walletTransaction.amountFromPocket
          ? Number(walletTransaction.amountFromPocket)
          : 0,
      };

      if (returnType === 'accessory') {
        await returnAccessoryPurchase(returningItem._id, payload);
        toast.success('Accessory purchase returned successfully');
      } else {
        // For single or bulk phones
        payload.phoneType = returnType;
        await returnPurchasePhone(returningItem._id, payload);
        toast.success('Purchase phone returned successfully');
      }

      // Refresh data
      getAllPurchasedPhones();
      getAccessoriesRecords();
      setShowReturnModal(false);
      setReturningItem(null);
      setReturnForm({
        returnAmount: '',
        bankAccountUsed: '',
        amountFromPocket: 0,
        amountFromBank: '',
      });
      setWalletTransaction({
        bankAccountUsed: '',
        amountFromBank: '',
        amountFromPocket: '',
      });
    } catch (error) {
      console.error('Error returning purchase:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to return purchase';
      toast.error(errorMessage);
    }
  };
  // Inline styles for the table
  const styles = {
    container: {
      width: '100%',
      padding: '20px',
      // backgroundColor: 'rgb(249, 250, 251)',
      borderRadius: '8px',
    },
    tableWrapper: {
      maxHeight: '400px', // Set maximum height for scroll
      overflowY: 'auto', // Enable vertical scrolling
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    header: {
      backgroundColor: 'rgb(220, 220, 220)',
      color: '#333',
      textAlign: 'center',
      padding: '10px',
      borderBottom: '2px solid #ddd', // Divider in the header
      position: 'sticky', // Make header sticky
      top: 0, // Stick to the top
      zIndex: 1, // Ensure it appears above other content
    },
    headerCell: {
      padding: '8px',
      fontWeight: 'bold',
      fontSize: '1.1em',
    },
    row: {
      transition: 'background-color 0.3s',
    },
    cell: {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'center',
      color: '#333',
    },
    printIcon: {
      cursor: 'pointer',
      color: '#000',
      transition: 'color 0.3s',
    },
    oddRow: {
      backgroundColor: '#fff',
    },
    evenRow: {
      backgroundColor: 'rgb(249, 250, 251)',
    },
    rowHover: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Light gray on row hover
    },
  };

  const getAllPurchasedPhones = async () => {
    try {
      const response = await api.get('api/Purchase/all-purchase-phone');
      // const response = await axios.get(`${BASE_URL}api/Purchase/all-purchase-phone`)
      setNewPhones(
        response?.data?.data?.singlePhones?.filter((item) => {
          return item.phoneCondition === 'New';
        })
      );
      setOldPhones(
        response?.data?.data?.singlePhones?.filter((item) => {
          return item.phoneCondition === 'Used';
        })
      );
      setPurchasedPhone(response?.data?.data);
    } catch (error) {
      console.error('Error fetching purchased phones:', error);
    }
  };

  useEffect(() => {
    getAllPurchasedPhones();
    getAccessoriesRecords();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>
        Purchase Records
      </h2>
      {/* <button
  onClick={() => setList(!list)}
  style={{
    padding: "10px 16px",
    backgroundColor: "#2563EB",
    color: "white",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1E40AF")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
>
  Change Record Design
</button> */}

      {/* <BarcodeReader onScan={handleScan} /> */}
      <div>
        <h3
          style={{
            textAlign: 'start',
            marginBottom: '40px',
            fontWeight: '700',
          }}
        >
          Single Purchases
        </h3>
      </div>
      <StyledHeading>New Phones</StyledHeading>
      {/* {list? 
      <>
         <List sx={{ width: '100%',margin:"12px", bgcolor: 'background.paper' }}>
    {newPhones.map((phone, index) => {
    const labelId = `checkbox-list-label-${phone._id}`;

    return (
    
      <ListItem
        key={phone._id}
        secondaryAction={
          <IconButton edge="end" aria-label="comments">
            <CommentIcon />
          </IconButton>
        }
        disablePadding
      >
        <ListItemButton role={undefined} onClick={handleToggle(phone._id)} dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={checked.includes(phone._id)}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': labelId }}
            />
          </ListItemIcon>
          <ListItemText 
            id={labelId} 
            primary={`${phone.companyName} - ${phone.modelName}`} 
            secondary={`IMEI: ${phone.imei1 || "N/A"}, Price: ${phone.price.finalPrice}`}
          />
        </ListItemButton>
      </ListItem>
    );
  })}
</List>
      </>:
      <> */}
      <Table
        routes={['/purchase/purchaseRecords']}
        array={newPhones}
        search={'imei1'}
        keysToDisplay={[
          'modelName',
          'phoneCondition',
          'imei1',
          'warranty',
          'name',
          'date',
        ]}
        label={[
          'Model Name',
          'Phone Condition',
          'Imei of mobile',
          'Mobile Warranty',
          'Name of Seller',
          'Date of Purchase',

          'Actions',
        ]}
        customBlocks={[
          {
            index: 5,
            component: (date) => {
              return dateFormatter(date);
            },
          },
        ]}
        extraColumns={[
          (obj) => (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <BarcodePrinter obj={obj} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReturnClick(obj, 'single');
                }}
                style={{
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Return
              </button>
            </div>
          ),
        ]}
      />
      {/* </>
    }
    */}

      <div style={{ marginTop: '3rem' }}>
        <StyledHeading>Used Phones</StyledHeading>
        <Table
          routes={['/purchase/purchaseRecords']}
          array={oldPhones}
          search={'imei1'}
          keysToDisplay={[
            'modelName',
            'phoneCondition',
            'imei1',
            'warranty',
            'name',
            'date',
          ]}
          label={[
            'Model Name',
            'Phone Condition',
            'Imei of mobile',
            'Mobile Warranty',
            'Name of Seller',
            'Date of Purchase',

            'Actions',
          ]}
          customBlocks={[
            {
              index: 5,
              component: (date) => {
                return dateFormatter(date);
              },
            },
          ]}
          extraColumns={[
            (obj) => (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <BarcodePrinter type={'single'} obj={obj} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReturnClick(obj, 'single');
                  }}
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                >
                  Return
                </button>
              </div>
            ),
          ]}
        />
      </div>
      <div>
        <h3
          style={{
            textAlign: 'start',
            marginBottom: '40px',
            fontWeight: '700',
            marginTop: '5rem',
          }}
        >
          Bulk Purchases
        </h3>
      </div>
      <Table
        routes={['/purchase/purchaseRecords/bulkPurchase']}
        array={
          purchasedPhones?.bulkPhones
            ? [...purchasedPhones.bulkPhones].reverse()
            : []
        }
        search={'imeiNumbers'}
        keysToDisplay={['personId', 'totalQuantity', 'status', 'date']}
        label={[
          'Party Name',
          'No of quantity',
          'Status',
          'Date of Purchasing',
          'Actions',
        ]}
        customBlocks={[
          {
            index: 0,
            component: (personObject) => {
              return <p>{personObject?.name || "Not Added"}</p>
            },
          },
          {
            index: 3,
            component: (date) => {
              return dateFormatter(date);
            },
          },
        ]}
        extraColumns={[
          (obj) => (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ marginRight: '1rem' }}>
                <select
                  style={{
                    padding: '7px 16px',
                    borderRadius: '5px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    minWidth: '100px',
                    fontSize: '15px',
                    fontWeight: 500,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    outline: 'none',
                    width: '100%',
                    marginRight: '20px',
                    appearance: 'none', // hides default arrow
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg fill='%23666' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '18px 18px',
                  }}
                >
                  {obj?.ramSimDetails?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.modelName}
                    </option>
                  ))}
                </select>
              </div>

              <BarcodePrinter type="bulk" obj={obj} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReturnClick(obj, 'bulk');
                }}
                style={{
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Return
              </button>
            </div>
          ),
        ]}
      />
      <h3
        style={{
          textAlign: 'start',
          marginBottom: '40px',
          fontWeight: '700',
          marginTop: '2rem',
        }}
      >
        Accessory Record
      </h3>
      <Table
        array={accessoriesRecords}
        search={'accessoryName'}
        keysToDisplay={[
          'type',
          'personName',
          'accessoryList',
          'perPiecePrice',
          'quantity',
          'personTakingCredit',
          'totalPrice',
          'createdAt',
        ]}
        label={[
          'Payment',
          'Customer',
          'Product',
          'Unit Price',
          'Qty',
          'Credit',
          'Total',
          'Date',
        ]}
        customBlocks={[
          {
            index: 0, // Type column
            component: (_, row) => (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  backgroundColor:
                    row.personStatus === 'Payable' ? '#FFEBEE' : '#E8F5E9',
                  color: row.personStatus === 'Payable' ? '#D32F2F' : '#388E3C',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                {row.personStatus === 'Payable' ? 'Credit' : 'Paid'}
              </div>
            ),
          },
          {
            index: 1, // Customer name
            component: (name) => (
              <span
                style={{
                  fontWeight: 500,
                  color: '#1976D2',
                }}
              >
                {name || 'Walk-in'}
              </span>
            ),
          },
          {
            index: 2, // Product column
            component: (accessoryList) => (
              <span
                style={{
                  fontWeight: 500,
                  color: '#1976D2',
                }}
              >
                <select
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#fff',
                    color: '#1976D2',
                    fontWeight: 500,
                    fontSize: '0.95em',
                    outline: 'none',
                    minWidth: '100px',
                  }}
                >
                  {Array.isArray(accessoryList) && accessoryList.length > 0 ? (
                    accessoryList.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} quantity ({item.quantity}) price (
                        {item?.perPiecePrice})
                      </option>
                    ))
                  ) : (
                    <option value="">No products</option>
                  )}
                </select>
              </span>
            ),
          },
          {
            index: 3, // Unit Price column
            component: (price) => (
              <span
                style={{
                  fontWeight: 500,
                  color: '#2E7D32',
                }}
              >
                Rs. {price?.toLocaleString() || '0'}
              </span>
            ),
          },
          {
            index: 5, // Credit amount
            component: (amount) => (
              <span
                style={{
                  fontWeight: 500,
                  color: amount > 0 ? '#D32F2F' : '#388E3C',
                }}
              >
                {amount > 0 ? `Rs. ${amount.toLocaleString()}` : 'Cleared'}
              </span>
            ),
          },
          {
            index: 6, // Total price
            component: (price) => (
              <span
                style={{
                  fontWeight: 600,
                  color: '#1976D2',
                }}
              >
                Rs. {price.toLocaleString()}
              </span>
            ),
          },
          {
            index: 7, // Date
            component: (date) => (
              <span
                style={{
                  color: '#616161',
                  fontSize: '0.875rem',
                }}
              >
                {new Date(date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            ),
          },
        ]}
        extraColumns={[
          (obj) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReturnClick(obj, 'accessory');
              }}
              style={{
                backgroundColor: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              Return
            </button>
          ),
        ]}
      />

      {/* Return Modal */}
      <Modal
        size="sm"
        show={showReturnModal}
        toggleModal={() => {
          setShowReturnModal(false);
          setReturningItem(null);
          setReturnForm({
            returnAmount: '',
            bankAccountUsed: '',
            amountFromPocket: 0,
            amountFromBank: '',
          });
          setWalletTransaction({
            bankAccountUsed: '',
            amountFromBank: '',
            amountFromPocket: '',
          });
        }}
      >
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
            Return {returnType === 'accessory' ? 'Accessory Purchase' : 'Purchase Phone'}
          </h2>

          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            {/* Return Amount */}
            <Form.Group controlId="returnAmount">
              <Form.Label>
                Return Amount {returnType !== 'accessory' && '(optional)'}
              </Form.Label>
              <Form.Control
                type="number"
                value={returnForm.returnAmount}
                onChange={(e) =>
                  setReturnForm({
                    ...returnForm,
                    returnAmount: e.target.value,
                  })
                }
                placeholder="Enter return amount (defaults to purchase price)"
                min="0"
                step="0.01"
              />
              <Form.Text className="text-muted">
                Leave empty to use original purchase price
              </Form.Text>
            </Form.Group>

            {/* Wallet Transaction Button */}
            <div style={{ marginTop: '10px' }}>
              <Button
                variant="secondary"
                onClick={() => setShowWalletModal(true)}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                Select Payment Method (Bank/Pocket Cash)
              </Button>
              {(walletTransaction.bankAccountUsed ||
                walletTransaction.amountFromPocket) && (
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    marginBottom: '10px',
                  }}
                >
                  {walletTransaction.bankAccountUsed && (
                    <div>
                      <strong>Bank Account:</strong> {walletTransaction.bankAccountUsed}
                      {walletTransaction.amountFromBank && (
                        <span>
                          {' '}
                          - Amount: {walletTransaction.amountFromBank}
                        </span>
                      )}
                    </div>
                  )}
                  {walletTransaction.amountFromPocket && (
                    <div>
                      <strong>Pocket Cash:</strong> {walletTransaction.amountFromPocket}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Button variant="primary" onClick={handleReturnSubmit}>
                Confirm Return
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowReturnModal(false);
                  setReturningItem(null);
                  setReturnForm({
                    returnAmount: '',
                    bankAccountUsed: '',
                    amountFromPocket: 0,
                    amountFromBank: '',
                  });
                  setWalletTransaction({
                    bankAccountUsed: '',
                    amountFromBank: '',
                    amountFromPocket: '',
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Wallet Transaction Modal */}
      <WalletTransactionModal
        show={showWalletModal}
        toggleModal={() => setShowWalletModal(false)}
        singleTransaction={walletTransaction}
        setSingleTransaction={setWalletTransaction}
        type="return"
      />
    </div>
  );
};

export default PurchaseRecords;
