import React, { useState, useEffect } from 'react';
import Modal from 'components/Modal/Modal';
import { api } from '../../../api/api';
import { toast } from 'react-toastify';
import { useGetAccessories } from 'hooks/accessory';
import { Button, Form, Toast } from 'react-bootstrap';
import WalletTransactionModal from 'components/WalletTransaction/WalletTransactionModal';

const AddAccessory = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPayForPurchaseModel, setShowPayForPurchaseModel] = useState(false);
  const [showGetFromSaleModel, setShowGetFromSaleModel] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [addStockForm, setAddStockForm] = useState({
    accessoryId: '',
    quantity: 1,
    purchasePrice: 0,
  });
  const [getPayment, setGetPayment] = useState({
    amountFromBank: Number(''),
    amountFromPocket: Number(''),
    bankAccountUsed: Number(''),
  });
  const [givePayment, setGivePayment] = useState({
    amountFromBank: Number(''),
    amountFromPocket: Number(''),
    bankAccountUsed: Number(''),
  });
  const [showAccessoryModal, setShowAccessoryModal] = useState(false);
  const { data } = useGetAccessories();
  const [accessoryData, setAccessoryData] = useState({
    name: '',
    quantity: '',
    price: '',
  });
  const [accessoryList, setAccessoryList] = useState([]);
  const handleAddStock = async () => {
    console.log(addStockForm);

    try {
      await api.post(`/api/accessory/${addStockForm.accessoryId}`, {
        quantity: addStockForm.quantity,
        perPiecePrice: addStockForm.purchasePrice,
      });
      toast.success('Stock added successfully');
      setShowAddStockModal(false);
    } catch (error) {
      console.error('Error adding stock', error);
      toast.console.error();
      ('error adding stock');
    }
  };
  const fetchAccessories = async () => {
    try {
      const res = await api.get('/api/accessory');
      setAccessoryList(res.data);
    } catch (error) {
      console.error('Error fetching accessories', error);
    }
  };
  useEffect(() => {
    fetchAccessories();
  }, []);
  console.log('accessoryList accessoryList', accessoryList);
  console.log('get payment', getPayment);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalPrice =
        Number(accessoryData.quantity) * Number(accessoryData.price);
      const res = await api.post('/api/accessory/create', {
        accessoryName: accessoryData.name,
        quantity: Number(accessoryData.quantity),
        perPiecePrice: Number(accessoryData.price),
        totalPrice,
        stock: Number(accessoryData.quantity),
        givePayment: givePayment,
      });
      fetchAccessories(); // Refresh the accessory list
      setAccessoryList([...accessoryList, res.data]);
      toast.success('Accessory added successfully!');
      setAccessoryData({ name: '', quantity: '', price: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error adding accessory', error);
    }
  };
  const [formData, setFormData] = useState([
    {
      accessoryId: '',
      quantity: 1,
      perPiecePrice: 0,
    },
  ]);
  const handleSaleAccessory = async (accessory) => {
    // Optional: prefill first item with selected accessory
    setFormData((prev) => {
      const newData = [...prev];
      newData[0].accessoryId = accessory._id;
      newData[0].accessoryName = accessory.accessoryName || '';
      return newData;
    });

    setShowAccessoryModal(true);
  };
  const handleConfirmSale = async () => {
    try {
      for (let accessory of formData) {
        if (
          !accessory.accessoryId ||
          !accessory.quantity ||
          !accessory.perPiecePrice
        ) {
          toast.error('Please fill all fields');
          return;
        }
      }

      const payload = {
        sales: formData.map((accessory) => ({
          accessoryId: accessory.accessoryId,
          quantity: Number(accessory.quantity),
          perPiecePrice: Number(accessory.perPiecePrice),
        })),
        getPayment: getPayment,
      };

      await api.post('/api/accessory/sell', payload);

      fetchAccessories(); // Refresh the accessory list
      toast.success('Accessory sold successfully!');
      setFormData([
        {
          accessoryId: '',
          accessoryName: '',
          quantity: 1,
          perPiecePrice: 0,
        },
      ]);
      setShowAccessoryModal(false);
    } catch (error) {
      console.error('Error selling accessory', error);
      toast.error('Failed to sell accessory');
    }
  };

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
        maxWidth: '100%',
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          fontSize: '30px',
          fontWeight: '700',
          marginBottom: '24px',
          color: '#111827',
        }}
      >
        🎯 Accessories Manager
      </h2>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {/* Total Accessories Box */}
        <div
          style={{
            flex: '1',
            minWidth: '200px',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '4px',
              height: '100%',
              backgroundColor: '#3b82f6',
            }}
          />
          <div style={{ paddingLeft: '12px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#64748b',
                marginBottom: '8px',
              }}
            >
              Total Accessories
            </div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1e293b',
              }}
            >
              {accessoryList.length}
            </div>
          </div>
        </div>

        {/* Total Stock Value Box */}
        <div
          style={{
            flex: '1',
            minWidth: '200px',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '4px',
              height: '100%',
              backgroundColor: '#10b981',
            }}
          />
          <div style={{ paddingLeft: '12px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#64748b',
                marginBottom: '8px',
              }}
            >
              Total Stock Value
            </div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1e293b',
              }}
            >
              {' '}
              {accessoryList.reduce(
                (sum, item) => sum + (Number(item.totalPrice) || 0),
                0
              )}{' '}
            </div>
          </div>
        </div>

        {/* Optional: Add more metric boxes with different colors */}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(to right, #2563eb, #3b82f6)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
            marginBottom: '30px',
          }}
        >
          + Add Accessory
        </button>
        <Button onClick={() => handleSaleAccessory(data)}>
          - Sale Accessory
        </Button>
      </div>

      {/* Modal */}
      <Modal size="sm" show={showModal} toggleModal={() => setShowModal(false)}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#111827',
          }}
        >
          Add New Accessory
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Accessory Name *
            </label>
            <input
              type="text"
              value={accessoryData.name}
              onChange={(e) =>
                setAccessoryData({ ...accessoryData, name: e.target.value })
              }
              placeholder="Enter accessory name"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Quantity *
            </label>
            <input
              type="number"
              value={accessoryData.quantity}
              onChange={(e) =>
                setAccessoryData({ ...accessoryData, quantity: e.target.value })
              }
              placeholder="Enter quantity"
              required
              min="1"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Per Piece Price *
            </label>
            <input
              type="number"
              value={accessoryData.price}
              onChange={(e) =>
                setAccessoryData({ ...accessoryData, price: e.target.value })
              }
              placeholder="Enter price"
              required
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
              }}
            />
          </div>

          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                padding: '12px 24px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(to right, #10b981, #059669)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Submit
            </button>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowPayForPurchaseModel(!showPayForPurchaseModel)}
          >
            Proceed To Pay
          </Button>
        </form>
      </Modal>
      <WalletTransactionModal
        show={showPayForPurchaseModel}
        toggleModal={() => setShowPayForPurchaseModel(!showPayForPurchaseModel)}
        singleTransaction={givePayment}
        setSingleTransaction={setGivePayment}
        type="purchase"
      />

      {/* Layout */}
      <div
        style={{
          flex: '1',
          minWidth: '280px',
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
          height: 'fit-content',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>🗂</span>
            <h3
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0,
              }}
            >
              Accessory Categories
            </h3>
          </div>
          <button
            onClick={() => setShowAddStockModal(true)}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: '#2563eb',
              },
            }}
          >
            <span>+</span> Add Stock
          </button>
        </div>

        {data?.data?.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
              alignItems: 'stretch',
            }}
          >
            {data.data.map((accessory, index) => (
              <div
                key={index}
                style={{
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  backgroundColor: '#fefefe',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Gradient accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '4px',
                    background:
                      'linear-gradient(90deg, #3b82f6 0%, #9333ea 100%)',
                  }}
                />

                <div style={{ marginBottom: '12px', flex: '1' }}>
                  <h4
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1e293b',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {accessory.accessoryName}
                  </h4>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#475569',
                    }}
                  >
                    Per Piece Price: {accessory.perPiecePrice} PKR
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#475569',
                    }}
                  >
                    Total Stock Price: {accessory.totalPrice} PKR
                  </div>
                </div>

                {/* Optional Stock Info if applicable */}
                {accessory.stock !== undefined && (
                  <div
                    style={{
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#64748b',
                          textTransform: 'uppercase',
                          marginBottom: '4px',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Stock Available
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: accessory.stock < 10 ? '#ef4444' : '#059669',
                        }}
                      >
                        {accessory.stock} units
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor:
                            accessory.stock < 10 ? '#ef4444' : '#10b981',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: accessory.stock < 10 ? '#ef4444' : '#059669',
                        }}
                      >
                        {accessory.stock < 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#64748b',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>❌</div>
            <p style={{ fontSize: '16px', fontStyle: 'italic' }}>
              No categories found.
            </p>
          </div>
        )}

        {/* Add Stock Modal */}
        <Modal
          size="md"
          show={showAddStockModal}
          toggleModal={() => setShowAddStockModal(!showAddStockModal)}
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
              Add Stock to Accessory
            </h2>

            <Form
              // onSubmit={(e) => {
              //   e.preventDefault();
              //   // Handle add stock logic here
              //   console.log('Adding stock:', addStockForm);
              //   setShowAddStockModal(false);
              // }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {/* Select Accessory */}
              <Form.Group className="mb-3">
                <Form.Label>Select Accessory</Form.Label>
                <Form.Select
                  value={addStockForm.accessoryId}
                  onChange={(e) =>
                    setAddStockForm({
                      ...addStockForm,
                      accessoryId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select an accessory</option>
                  {data?.data?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.accessoryName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Quantity to Add */}
              <Form.Group controlId="quantity">
                <Form.Label>Quantity to Add</Form.Label>
                <Form.Control
                  type="number"
                  value={addStockForm.quantity}
                  onChange={(e) =>
                    setAddStockForm({
                      ...addStockForm,
                      quantity: Number(e.target.value),
                    })
                  }
                  placeholder="Enter quantity to add"
                  required
                  min="1"
                />
              </Form.Group>

              {/* Purchase Price */}
              <Form.Group controlId="purchasePrice">
                <Form.Label>Purchase Price</Form.Label>
                <Form.Control
                  type="number"
                  value={addStockForm.purchasePrice}
                  onChange={(e) =>
                    setAddStockForm({
                      ...addStockForm,
                      purchasePrice: Number(e.target.value),
                    })
                  }
                  placeholder="Enter purchase price"
                  required
                  min="0"
                  step="0.01"
                />
              </Form.Group>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <Button variant="primary" onClick={handleAddStock}>
                  Add Stock
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowAddStockModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
      <Modal
        size="md"
        show={showAccessoryModal}
        toggleModal={() => setShowAccessoryModal(!showAccessoryModal)}
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
            Sell Accessory
          </h2>

          {Array.isArray(formData) &&
            formData.map((accessory, index) => (
              <Form
                key={index}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleConfirmSale(accessory);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {/* Select Accessory */}
                <Form.Group className="mb-3">
                  <Form.Label>Select Accessory</Form.Label>
                  <Form.Select
                    value={accessory.accessoryId}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const newData = [...prev];
                        newData[index].accessoryId = e.target.value;
                        return newData;
                      })
                    }
                  >
                    <option value="">Select an accessory</option>
                    {data?.data?.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.accessoryName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Quantity */}
                <Form.Group controlId={`quantity-${index}`}>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={accessory.quantity}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const newData = [...prev];
                        newData[index].quantity = Number(e.target.value);
                        return newData;
                      })
                    }
                    placeholder="Enter quantity"
                    required
                    min="1"
                  />
                </Form.Group>

                {/* Per Piece Price */}
                <Form.Group controlId={`perPiecePrice-${index}`}>
                  <Form.Label>Per Piece Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={accessory.perPiecePrice}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const newData = [...prev];
                        newData[index].perPiecePrice = Number(e.target.value);
                        return newData;
                      })
                    }
                    placeholder="Enter price"
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
                <hr style={{ margin: '20px 0', background: '#000' }} />
              </Form>
            ))}
          <Button onClick={handleConfirmSale} variant="primary">
            Sell Accessory
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              setFormData((prev) => [
                ...prev,
                {
                  accessoryId: '',
                  quantity: 1,
                  perPiecePrice: 0,
                },
              ])
            }
          >
            Add Another Accessory
          </Button>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowGetFromSaleModel(!showGetFromSaleModel)}
        >
          Proceed To Get Payment
        </Button>
      </Modal>
      <WalletTransactionModal
        show={showGetFromSaleModel}
        toggleModal={() => setShowGetFromSaleModel(!showGetFromSaleModel)}
        singleTransaction={getPayment}
        setSingleTransaction={setGetPayment}
      />
    </div>
  );
};

export default AddAccessory;
