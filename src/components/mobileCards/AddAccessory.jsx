import React, { useState, useEffect } from 'react';
import Modal from 'components/Modal/Modal';
import { api, editAccessory, reduceAccessoryStock } from '../../../api/api';
import { toast } from 'react-toastify';
import { useGetAccessories } from 'hooks/accessory';
import { Button, Form, Toast } from 'react-bootstrap';
import WalletTransactionModal from 'components/WalletTransaction/WalletTransactionModal';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import CustomSelect from 'components/CustomSelect';

const AddAccessory = () => {
  const navigate = useNavigate();
  const [accessories, setAccessories] = useState([
    {
      accessoryName: '',
      quantity: 1,
      perPiecePrice: 0,
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [allParties, setAllParties] = useState([]);
  const [showNewEntityForm, setShowNewEntityForm] = useState(false);
  const [showPayForPurchaseModel, setShowPayForPurchaseModel] = useState(false);
  const [showGetFromSaleModel, setShowGetFromSaleModel] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [hideAccessories, setHideAccessories] = useState(true);
  const [hideStockValue, setHideStockValue] = useState(true);
  const [addStockForm, setAddStockForm] = useState({
    accessoryId: '',
    quantity: 1,
    purchasePrice: 0,
  });
  const [returnForm, setReturnForm] = useState({
    accessoryId: '',
    quantity: 1,
  });
  const [showNewEntityFormForStock, setShowNewEntityFormForStock] =
    useState(false);
  const [showPayForStockModal, setShowPayForStockModal] = useState(false);
  const [addStockEntityData, setAddStockEntityData] = useState({
    name: '',
    number: '',
    _id: '',
  });
  const [newEntityForStock, setNewEntityForStock] = useState({
    name: '',
    number: '',
  });
  const [addStockPaymentData, setAddStockPaymentData] = useState({
    paymentType: '',
    payableAmountNow: '',
    payableAmountLater: '',
    dateOfPayment: '',
  });
  const [givePaymentForStock, setGivePaymentForStock] = useState({
    amountFromBank: Number(''),
    amountFromPocket: Number(''),
    bankAccountUsed: Number(''),
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
  const [entityData, setEntityData] = useState({
    name: '',
    number: '',
    _id: '',
  });
  const [showAccessoryModal, setShowAccessoryModal] = useState(false);
  const [showPrintDemandModal, setShowPrintDemandModal] = useState(false);
  const [demandList, setDemandList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState(null);
  const [editForm, setEditForm] = useState({
    accessoryName: '',
    perPiecePrice: '',
  });
  const { data } = useGetAccessories();
  const [filteredData, setFilteredData] = useState(data?.data || []);

  const [accessoryData, setAccessoryData] = useState({
    name: '',
    quantity: '',
    price: '',
    paymentType: '',
    payableAmountNow: '',
    payableAmountLater: '',
    dateOfPayment: '',
  });
  const [accessoryList, setAccessoryList] = useState([]);
  const [selectedPartyId, setSelectedPartyId] = useState('');

  const handleSelectChange = (e) => {
    setSelectedPartyId(e.target.value);
  };
  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data);
    }
  }, [data]);
  const handleAddStock = async () => {
    console.log(addStockForm);

    try {
      const payload = {
        quantity: addStockForm.quantity,
        perPiecePrice: addStockForm.purchasePrice,
        givePayment: givePaymentForStock,
        purchasePaymentType: addStockPaymentData.paymentType,
        creditPaymentData: {
          payableAmountNow: addStockPaymentData.payableAmountNow,
          payableAmountLater: addStockPaymentData.payableAmountLater,
          dateOfPayment: addStockPaymentData.dateOfPayment,
        },
        entityData: showNewEntityFormForStock
          ? newEntityForStock
          : addStockEntityData,
      };

      await api.post(`/api/accessory/${addStockForm.accessoryId}`, payload);
      toast.success('Stock added successfully');
      setShowAddStockModal(false);
      // Reset form
      setAddStockForm({
        accessoryId: '',
        quantity: 1,
        purchasePrice: 0,
      });
      setAddStockPaymentData({
        paymentType: '',
        payableAmountNow: '',
        payableAmountLater: '',
        dateOfPayment: '',
      });
      setAddStockEntityData({
        name: '',
        number: '',
        _id: '',
      });
      setNewEntityForStock({
        name: '',
        number: '',
      });
      setGivePaymentForStock({
        amountFromBank: Number(''),
        amountFromPocket: Number(''),
        bankAccountUsed: Number(''),
      });
      setShowNewEntityFormForStock(false);
    } catch (error) {
      console.error('Error adding stock', error);
      toast.error('Error adding stock');
    }
  };

  const handleReturnAccessory = async () => {
    if (!returnForm.accessoryId) {
      toast.error('Please select an accessory');
      return;
    }

    if (!returnForm.quantity || returnForm.quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      const response = await reduceAccessoryStock(
        returnForm.accessoryId,
        returnForm.quantity
      );
      toast.success(response.data.message || 'Stock reduced successfully');
      setShowReturnModal(false);
      // Reset form
      setReturnForm({
        accessoryId: '',
        quantity: 1,
      });
      // Refresh accessories data
      if (data?.refetch) {
        await data.refetch();
      }
      // Also update filtered data if available
      if (response.data?.accessory) {
        setFilteredData((prev) =>
          prev.map((acc) =>
            acc._id === response.data.accessory._id
              ? { ...acc, ...response.data.accessory }
              : acc
          )
        );
      }
    } catch (error) {
      console.error('Error reducing stock', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to reduce accessory stock';
      toast.error(errorMessage);
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
  const getAllParties = async () => {
    try {
      const response = await api.get('/api/partyLedger/partyNameAndId');
      setAllParties(response?.data?.data || []);
    } catch (error) {
      console.error('Error fetching parties:', error);
    }
  };
  console.log('All parties:', allParties);
  const [getAllEntities, setGetAllEntities] = useState([]);
  const [newEntity, setNewEntity] = useState({
    name: '',
    number: '',
  });
  const getAllEnityNameAndId = async () => {
    try {
      const response = await api.get('/api/person/nameAndId');
      setGetAllEntities(response?.data || []);
      console.log('Entity data:', response);
    } catch (error) {
      console.error('Error fetching entity names and ids:', error);
    }
  };
  console.log('getAllEntities:', getAllEntities);
  console.log('entityData:', entityData);

  useEffect(() => {
    getAllParties();
    fetchAccessories();
    getAllEnityNameAndId();
  }, []);
  console.log('accessoryList accessoryList', accessoryList);
  console.log('get payment', getPayment);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const totalPrice =
  //       Number(accessoryData.quantity) * Number(accessoryData.price);
  //     const res = await api.post('/api/accessory/create', {
  //       accessoryName: accessoryData.name,
  //       quantity: Number(accessoryData.quantity),
  //       perPiecePrice: Number(accessoryData.price),
  //       totalPrice,
  //       stock: Number(accessoryData.quantity),
  //       givePayment: givePayment,
  //       purchasePaymentType: accessoryData.paymentType,
  //       creditPaymentData: {
  //         payableAmountNow: accessoryData.payableAmountNow,
  //         payableAmountLater: accessoryData.payableAmountLater,
  //         dateOfPayment: accessoryData.dateOfPayment,
  //       },
  //       entityData: showNewEntityForm ? newEntity : entityData,
  //     });
  //     console.log('Accessory added:', res);

  //     fetchAccessories(); // Refresh the accessory list
  //     setAccessoryList([...accessoryList, res.data]);
  //     toast.success('Accessory added successfully!');
  //     setAccessoryData({ name: '', quantity: '', price: '' });
  //     setShowModal(false);
  //   } catch (error) {
  //     console.error('Error adding accessory', error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedAccessories = accessories.map((acc) => ({
        accessoryName: acc.accessoryName,
        quantity: Number(acc.quantity),
        perPiecePrice: Number(acc.perPiecePrice),
      }));
      // Calculate total amount
      const totalAmount = accessories.reduce((sum, acc) => {
        return sum + Number(acc.quantity) * Number(acc.perPiecePrice);
      }, 0);
      console.log('payload', {
        accessories,
        givePayment,
        purchasePaymentType: accessoryData.paymentType,
        creditPaymentData: {
          payableAmountNow: accessoryData.payableAmountNow,
          payableAmountLater: accessoryData.payableAmountLater,
          dateOfPayment: accessoryData.dateOfPayment,
        },
        entityData: showNewEntityForm ? newEntity : entityData,
      });

      const res = await api.post('/api/accessory/create', {
        accessories: formattedAccessories,
        givePayment,
        purchasePaymentType: accessoryData.paymentType,
        creditPaymentData: {
          payableAmountNow: accessoryData.payableAmountNow,
          payableAmountLater: accessoryData.payableAmountLater,
          dateOfPayment: accessoryData.dateOfPayment,
        },
        entityData: showNewEntityForm ? newEntity : entityData,
      });

      console.log('Accessories added:', res);
      fetchAccessories();
      toast.success(`${accessories.length} accessories added successfully!`);
      setAccessories([{ accessoryName: '', quantity: 1, perPiecePrice: 0 }]);
      setShowModal(false);
    } catch (error) {
      console.error('Error adding accessories', error);
      toast.error('Failed to add accessories');
    }
  };
  const [formData, setFormData] = useState([
    {
      accessoryName: '',
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
  const [invoiceData, setInvoiceData] = useState();
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
          name: accessory.accessoryName,
        })),
        getPayment: getPayment,
        purchasePaymentType: accessoryData.paymentType,
        creditPaymentData: {
          payableAmountNow: accessoryData.payableAmountNow,
          payableAmountLater: accessoryData.payableAmountLater,
          dateOfPayment: accessoryData.dateOfPayment,
        },
        entityData: showNewEntityForm ? newEntity : entityData,
      };
      setInvoiceData({
        sales: formData.map((accessory) => ({
          accessoryId: accessory.accessoryId,
          quantity: Number(accessory.quantity),
          perPiecePrice: Number(accessory.perPiecePrice),
          name: accessory.accessoryName,
        })),
        getPayment: getPayment,
        purchasePaymentType: accessoryData.paymentType,
        creditPaymentData: {
          payableAmountNow: accessoryData.payableAmountNow,
          payableAmountLater: accessoryData.payableAmountLater,
          dateOfPayment: accessoryData.dateOfPayment,
        },
        entityData: showNewEntityForm ? newEntity : entityData,
      });
      await api.post('/api/accessory/sell', payload);

      fetchAccessories(); // Refresh the accessory list
      toast.success('Accessory sold successfully!');
      console.log('THis is the formData', formData);

      setTimeout(() => {
        navigate('/invoice/accessory', {
          state: {
            data: {
              ...payload,
              sales: formData.map((accessory) => ({
                accessoryId: accessory.accessoryId,
                quantity: Number(accessory.quantity),
                perPiecePrice: Number(accessory.perPiecePrice),
                name: accessory.accessoryName,
              })),
            },
            type: 'accessory',
          }, // Pass the invoice data
        });
      }, 2000);
      // setFormData([
      //   {
      //     accessoryId: '',
      //     accessoryName: '',
      //     quantity: 1,
      //     perPiecePrice: 0,
      //   },
      // ]);
      // setShowAccessoryModal(false);
    } catch (error) {
      console.error('Error selling accessory', error);
      toast.error('Failed to sell accessory');
    }
  };
  const confirmDelete = (id) => {
    // Show confirmation modal or alert
    if (window.confirm('Are you sure you want to delete this accessory?')) {
      // Call delete function
      deleteAccessory(id);
    }
  };

  const handleEditAccessory = (accessory) => {
    setEditingAccessory(accessory);
    setEditForm({
      accessoryName: accessory.accessoryName || '',
      perPiecePrice: accessory.perPiecePrice || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateAccessory = async () => {
    if (!editingAccessory?._id) {
      toast.error('Accessory ID is required');
      return;
    }

    // Validate that at least one field is provided
    if (!editForm.accessoryName.trim() && !editForm.perPiecePrice) {
      toast.error('At least one field (name or price) is required to update');
      return;
    }

    // Validate price if provided
    if (editForm.perPiecePrice && Number(editForm.perPiecePrice) <= 0) {
      toast.error('Price must be a positive number');
      return;
    }

    try {
      const updateData = {};
      if (editForm.accessoryName.trim()) {
        updateData.accessoryName = editForm.accessoryName.trim();
      }
      if (editForm.perPiecePrice) {
        updateData.perPiecePrice = Number(editForm.perPiecePrice);
      }

      const response = await editAccessory(editingAccessory._id, updateData);
      toast.success(response.data.message || 'Accessory updated successfully');

      // Refresh the accessory list
      if (data?.refetch) {
        data.refetch();
      }

      // Update local state
      setFilteredData((prev) =>
        prev.map((acc) =>
          acc._id === editingAccessory._id
            ? { ...acc, ...response.data.accessory }
            : acc
        )
      );

      setShowEditModal(false);
      setEditingAccessory(null);
      setEditForm({ accessoryName: '', perPiecePrice: '' });
    } catch (error) {
      console.error('Error updating accessory:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to update accessory'
      );
    }
  };
  const handleAddAccessory = () => {
    setAccessories([
      ...accessories,
      {
        accessoryName: '',
        quantity: 1,
        perPiecePrice: 0,
      },
    ]);
  };

  const deleteAccessory = async (id) => {
    try {
      await api.delete(`/api/accessory/${id}`);
      toast.success('Accessory deleted successfully');
      fetchAccessories(); // Refresh the accessory list
    } catch (error) {
      console.error('Error deleting accessory', error);
      toast.error('Failed to delete accessory');
    }
  };
  const handleRemoveAccessory = (index) => {
    if (accessories.length > 1) {
      const updated = [...accessories];
      updated.splice(index, 1);
      setAccessories(updated);
    }
  };

  const handleAccessoryChange = (index, field, value) => {
    const updated = [...accessories];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setAccessories(updated);
  };

  // Print Demand functionality
  const handlePrintDemand = () => {
    const lowStockAccessories =
      data?.data
        ?.filter((accessory) => accessory.stock < 10)
        .map((item) => ({
          ...item,
          demandQuantity: 0,
        })) || [];
    setDemandList(lowStockAccessories);
    setShowPrintDemandModal(true);
  };

  const handleRemoveFromDemand = (index) => {
    const updated = [...demandList];
    updated.splice(index, 1);
    setDemandList(updated);
  };

  const handleAddToDemand = () => {
    const newAccessory = {
      accessoryName: '',
      demandQuantity: 1,
      _id: `temp_${Date.now()}`,
      isCustom: true,
    };
    setDemandList([...demandList, newAccessory]);
  };

  const handleDemandItemChange = (index, field, value) => {
    const updated = [...demandList];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setDemandList(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const ensureHtml2Pdf = () =>
      new Promise((resolve, reject) => {
        if (window.html2pdf) return resolve();
        const script = document.createElement('script');
        script.src =
          'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load html2pdf.js'));
        document.body.appendChild(script);
      });

    ensureHtml2Pdf()
      .then(() => {
        const container = document.createElement('div');
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.margin = '20px';
        container.innerHTML = `
          <div style="text-align:center; margin-bottom:16px;">
            <h2 style="margin:0;">Accessory Demand List</h2>
          </div>
          <div style="text-align:right; margin-bottom:8px; font-size:12px;">
            Date: ${new Date().toLocaleDateString()}
          </div>
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr>
                <th style="border:1px solid #ddd; padding:8px; text-align:left; background:#f2f2f2;">Accessory Name</th>
                <th style="border:1px solid #ddd; padding:8px; text-align:left; background:#f2f2f2;">Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${demandList
                .map(
                  (item) => `
                <tr>
                  <td style="border:1px solid #ddd; padding:8px;">${item.accessoryName}</td>
                  <td style="border:1px solid #ddd; padding:8px;">${Number(item.demandQuantity) || 0}</td>
                </tr>`
                )
                .join('')}
            </tbody>
          </table>`;

        document.body.appendChild(container);
        const opt = {
          margin: 10,
          filename: `Accessory_Demand_${new Date().toISOString().slice(0, 10)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        // Give the browser a tick to render the container before converting
        setTimeout(() => {
          try {
            window
              .html2pdf()
              .set(opt)
              .from(container)
              .save()
              .then(() => {
                document.body.removeChild(container);
              })
              .catch(async () => {
                document.body.removeChild(container);
                // Fallback to jsPDF minimal text PDF
                await (async () => {
                  const loadJsPDF = () =>
                    new Promise((resolve, reject) => {
                      if (window.jspdf && window.jspdf.jsPDF) return resolve();
                      const s = document.createElement('script');
                      s.src =
                        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                      s.onload = () => resolve();
                      s.onerror = () =>
                        reject(new Error('Failed to load jsPDF'));
                      document.body.appendChild(s);
                    });
                  try {
                    await loadJsPDF();
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF({
                      orientation: 'portrait',
                      unit: 'mm',
                      format: 'a4',
                    });
                    let y = 15;
                    doc.setFontSize(14);
                    doc.text('Accessory Demand List', 105, y, {
                      align: 'center',
                    });
                    y += 8;
                    doc.setFontSize(10);
                    doc.text(
                      `Date: ${new Date().toLocaleDateString()}`,
                      195,
                      y,
                      { align: 'right' }
                    );
                    y += 8;
                    doc.setFontSize(11);
                    doc.text('Accessory Name', 10, y);
                    doc.text('Quantity', 170, y);
                    y += 6;
                    doc.setLineWidth(0.2);
                    doc.line(10, y, 200, y);
                    y += 6;
                    const lineHeight = 6;
                    demandList.forEach((item) => {
                      const name = String(item.accessoryName || '');
                      const qty = String(Number(item.demandQuantity) || 0);
                      const maxWidth = 150;
                      const nameLines = doc.splitTextToSize(name, maxWidth);
                      nameLines.forEach((line, idx) => {
                        if (y > 280) {
                          doc.addPage();
                          y = 15;
                        }
                        doc.text(line, 10, y + idx * lineHeight);
                      });
                      doc.text(qty, 170, y);
                      y += Math.max(lineHeight, nameLines.length * lineHeight);
                    });
                    doc.save(
                      `Accessory_Demand_${new Date().toISOString().slice(0, 10)}.pdf`
                    );
                  } catch (e) {
                    // As last resort, open printable view
                    const w = window.open('', '_blank');
                    if (w) {
                      w.document.write(`
                        <html><head><title>Accessory Demand List</title>
                        <style>
                          body { font-family: Arial, sans-serif; margin: 20px; }
                          table { width: 100%; border-collapse: collapse; }
                          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                          th { background-color: #f2f2f2; }
                        </style></head><body>
                        <h2>Accessory Demand List</h2>
                        <table><thead><tr><th>Accessory Name</th><th>Quantity</th></tr></thead><tbody>
                        ${demandList
                          .map(
                            (item) =>
                              `<tr><td>${item.accessoryName}</td><td>${Number(item.demandQuantity) || 0}</td></tr>`
                          )
                          .join('')}
                        </tbody></table></body></html>`);
                      w.document.close();
                      w.focus();
                      w.print();
                    }
                  }
                })();
              });
          } catch (err) {
            if (document.body.contains(container)) {
              document.body.removeChild(container);
            }
          }
        }, 0);
      })
      .catch(() => {
        // Fallback: open printable view
        const w = window.open('', '_blank');
        if (!w) return;
        w.document.write(`
          <html><head><title>Accessory Demand List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style></head><body>
          <h2>Accessory Demand List</h2>
          <table><thead><tr><th>Accessory Name</th><th>Quantity</th></tr></thead><tbody>
          ${demandList
            .map(
              (item) => `
            <tr><td>${item.accessoryName}</td><td>${Number(item.demandQuantity) || 0}</td></tr>`
            )
            .join('')}
          </tbody></table></body></html>`);
        w.document.close();
        w.focus();
        w.print();
      });
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
          <div
            style={{
              paddingLeft: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
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
                  filter: hideAccessories ? 'blur(5px)' : 'none',
                  transition: 'filter 0.3s ease',
                }}
              >
                {accessoryList.length}
              </div>
            </div>
            <div
              style={{
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                ':hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
              onClick={() => setHideAccessories(!hideAccessories)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

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
          <div
            style={{
              paddingLeft: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
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
                  filter: hideStockValue ? 'blur(5px)' : 'none',
                  transition: 'filter 0.3s ease',
                }}
              >
                {accessoryList
                  .reduce(
                    (sum, item) => sum + (Number(item.totalPrice) || 0),
                    0
                  )
                  .toLocaleString()}
              </div>
            </div>
            <div
              style={{
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                ':hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
              onClick={() => setHideStockValue(!hideStockValue)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(to right, #4f46e5, #4f46e5)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              border: '2px solid #4f46e5',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              marginBottom: '30px',
              transition: 'all 0.3s ease',
              marginRight: '10px',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
              },
            }}
          >
            + Purchase Accessory
          </button>

          <button
            onClick={() => handleSaleAccessory(data)}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(to right, #ef4444, #f87171)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              border: '2px solid #dc2626',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              marginBottom: '30px',
              transition: 'all 0.3s ease',
              marginRight: '10px',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)',
              },
            }}
          >
            - Sale Accessory
          </button>

          <button
            onClick={() => setShowAddStockModal(true)}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(to right, #f59e0b, #fbbf24)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              border: '2px solid #d97706',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              marginBottom: '30px',
              transition: 'all 0.3s ease',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(245, 158, 11, 0.4)',
              },
            }}
          >
            + Add Stock
          </button>

          <button
            onClick={() => setShowReturnModal(true)}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(to right, #dc2626, #ef4444)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              border: '2px solid #b91c1c',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              marginBottom: '30px',
              transition: 'all 0.3s ease',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(220, 38, 38, 0.4)',
              },
            }}
          >
            ↻ Return Accessory
          </button>
        </div>

        <button
          onClick={handlePrintDemand}
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(to right, #8b5cf6, #a78bfa)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            border: '2px solid #7c3aed',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            marginBottom: '30px',
            transition: 'all 0.3s ease',
            ':hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(139, 92, 246, 0.4)',
            },
          }}
        >
          📄 Print Demand
        </button>
      </div>

      {/* <Modal size="sm" show={showModal} toggleModal={() => setShowModal(false)}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#111827',
          }}
        >
          Purchase New Accessory
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                Select Payment Type
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
                value={accessoryData.paymentType}
                onChange={(e) =>
                  setAccessoryData({
                    ...accessoryData,
                    paymentType: e.target.value,
                  })
                }
              >
                <option value="">Select Payment</option>
                <option value="full-payment">Full Payment</option>
                <option value="credit">Credit</option>
              </select>
            </div>

            {accessoryData.paymentType !== '' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <label style={{ fontWeight: '600' }}>Entity *</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setShowNewEntityForm(false)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: !showNewEntityForm
                          ? '#e5e7eb'
                          : 'transparent',
                        border: '1px solid #d1d5db',
                        fontWeight: '500',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      Select Existing
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewEntityForm(true)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: showNewEntityForm
                          ? '#e5e7eb'
                          : 'transparent',
                        border: '1px solid #d1d5db',
                        fontWeight: '500',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      Create New
                    </button>
                  </div>
                </div>

                {showNewEntityForm ? (
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                          color: '#4b5563',
                        }}
                      >
                        Entity Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newEntity.name}
                        onChange={(e) =>
                          setNewEntity({ ...newEntity, name: e.target.value })
                        }
                        placeholder="Enter entity name"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                          color: '#4b5563',
                        }}
                      >
                        Entity Number *
                      </label>
                      <input
                        name="number"
                        type="text"
                        value={newEntity.number}
                        onChange={(e) =>
                          setNewEntity({ ...newEntity, number: e.target.value })
                        }
                        placeholder="Enter entity number"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <CustomSelect
                      value={entityData._id}
                      onChange={(selectedOption) => {
                        const selectedEntity = getAllEntities.find(
                          (entity) => entity._id === selectedOption?.value
                        );

                        setEntityData(
                          selectedEntity || { name: '', number: '', _id: '' }
                        );
                      }}
                      options={getAllEntities.map((entity) => ({
                        value: entity._id,
                        label: `${entity.name} || ${entity.number}`,
                      }))}
                    />

            
                  </>
                )}
              </div>
            )}
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
                borderRadius: '8px',
                fontSize: '14px',
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
                borderRadius: '8px',
                fontSize: '14px',
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
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            {accessoryData.paymentType === 'credit' && (
              <div style={{ marginTop: '16px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        color: '#4b5563',
                      }}
                    >
                      Payable Now
                    </label>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={accessoryData.payableAmountNow || ''}
                      onChange={(e) =>
                        setAccessoryData({
                          ...accessoryData,
                          payableAmountNow: e.target.value,
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        color: '#4b5563',
                      }}
                    >
                      Payable Later
                    </label>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={accessoryData.payableAmountLater || ''}
                      onChange={(e) =>
                        setAccessoryData({
                          ...accessoryData,
                          payableAmountLater: e.target.value,
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      color: '#4b5563',
                    }}
                  >
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    value={accessoryData.dateOfPayment || ''}
                    onChange={(e) =>
                      setAccessoryData({
                        ...accessoryData,
                        dateOfPayment: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '24px',
            }}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ':hover': {
                  backgroundColor: '#f3f4f6',
                },
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#10b981',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ':hover': {
                  backgroundColor: '#059669',
                },
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </Modal> */}
      <Modal size="sm" show={showModal} toggleModal={() => setShowModal(false)}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#111827',
          }}
        >
          Purchase Accessories
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Payment Type Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Select Payment Type *
            </label>
            <select
              value={accessoryData.paymentType}
              onChange={(e) =>
                setAccessoryData({
                  ...accessoryData,
                  paymentType: e.target.value,
                })
              }
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
              required
            >
              <option value="">Select Payment Type</option>
              <option value="full-payment">Full Payment</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          {/* Entity Selection */}
          {accessoryData.paymentType && (
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <label style={{ fontWeight: '600' }}>Entity *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowNewEntityForm(false)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: !showNewEntityForm
                        ? '#e5e7eb'
                        : 'transparent',
                      border: '1px solid #d1d5db',
                      fontWeight: '500',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Select Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewEntityForm(true)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: showNewEntityForm ? '#e5e7eb' : 'transparent',
                      border: '1px solid #d1d5db',
                      fontWeight: '500',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Create New
                  </button>
                </div>
              </div>

              {showNewEntityForm ? (
                <div
                  style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        color: '#4b5563',
                      }}
                    >
                      Entity Name *
                    </label>
                    <input
                      type="text"
                      value={newEntity.name}
                      onChange={(e) =>
                        setNewEntity({ ...newEntity, name: e.target.value })
                      }
                      placeholder="Enter entity name"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        color: '#4b5563',
                      }}
                    >
                      Entity Number *
                    </label>
                    <input
                      type="text"
                      value={newEntity.number}
                      onChange={(e) =>
                        setNewEntity({ ...newEntity, number: e.target.value })
                      }
                      placeholder="Enter entity number"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      color: '#4b5563',
                    }}
                  >
                    Select Entity *
                  </label>
                  <select
                    value={entityData._id}
                    onChange={(e) => {
                      const selectedEntity = getAllEntities.find(
                        (entity) => entity._id === e.target.value
                      );
                      setEntityData(
                        selectedEntity || { name: '', number: '', _id: '' }
                      );
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    required
                  >
                    <option value="">Select Entity</option>
                    {getAllEntities.map((entity) => (
                      <option key={entity._id} value={entity._id}>
                        {entity.name} ({entity.number})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Accessories List */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <label style={{ fontWeight: '600' }}>Accessories</label>
              <button
                type="button"
                onClick={handleAddAccessory}
                style={{
                  padding: '6px 12px',
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                + Add Another
              </button>
            </div>

            {accessories.map((accessory, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  position: 'relative',
                }}
              >
                {accessories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAccessory(index)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    ×
                  </button>
                )}

                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '500',
                      fontSize: '14px',
                    }}
                  >
                    Accessory Name *
                  </label>
                  <input
                    type="text"
                    value={accessory.accessoryName}
                    onChange={(e) =>
                      handleAccessoryChange(
                        index,
                        'accessoryName',
                        e.target.value
                      )
                    }
                    placeholder="Enter accessory name"
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        fontSize: '14px',
                      }}
                    >
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={accessory.quantity}
                      onChange={(e) =>
                        handleAccessoryChange(index, 'quantity', e.target.value)
                      }
                      placeholder="Qty"
                      required
                      min="1"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        fontSize: '14px',
                      }}
                    >
                      Price *
                    </label>
                    <input
                      type="number"
                      value={accessory.perPiecePrice}
                      onChange={(e) =>
                        handleAccessoryChange(
                          index,
                          'perPiecePrice',
                          e.target.value
                        )
                      }
                      placeholder="Price"
                      required
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Credit payment fields (shown only when paymentType is credit) */}
          {accessoryData.paymentType === 'credit' && (
            <div style={{ marginBottom: '24px' }}>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                Credit Details
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                    }}
                  >
                    Payable Now
                  </label>
                  <input
                    type="number"
                    value={accessoryData.payableAmountNow}
                    onChange={(e) =>
                      setAccessoryData({
                        ...accessoryData,
                        payableAmountNow: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                    }}
                  >
                    Payable Later
                  </label>
                  <input
                    type="number"
                    value={accessoryData.payableAmountLater}
                    onChange={(e) =>
                      setAccessoryData({
                        ...accessoryData,
                        payableAmountLater: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                  }}
                >
                  Due Date
                </label>
                <input
                  type="date"
                  value={accessoryData.dateOfPayment}
                  onChange={(e) =>
                    setAccessoryData({
                      ...accessoryData,
                      dateOfPayment: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>
          )}
          <Button
            variant="secondary"
            onClick={() => setShowPayForPurchaseModel(!showPayForPurchaseModel)}
          >
            Proceed To Give Payment
          </Button>
          {/* Submit buttons */}
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: 'white',
                color: '#374151',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                background: '#10b981',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Purchase Accessories
            </button>
          </div>
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
          {/* <button
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
          </button> */}
        </div>

        {data?.data?.length > 0 ? (
          <>
            {/* Search Bar */}
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search by accessory or party name..."
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  marginBottom: '15px',
                }}
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  const filtered = data.data.filter(
                    (item) =>
                      item.accessoryName.toLowerCase().includes(searchTerm) ||
                      (
                        item.personId?.name?.toLowerCase() || 'not mentioned'
                      ).includes(searchTerm)
                  );

                  setFilteredData(filtered);
                }}
              />
            </div>

            {/* Party Filter Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}
            >
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onClick={() => {
                  // Reset to show all items
                  setFilteredData(data.data);
                }}
              >
                All
              </button>
              {[
                ...new Set(
                  data.data.map(
                    (item) => item.personId?.name || 'Not Mentioned'
                  )
                ),
              ].map((party, i) => (
                <button
                  key={i}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#e2e8f0',
                    color: '#1e293b',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  onClick={() => {
                    const filtered = data.data.filter(
                      (item) =>
                        (item.personId?.name || 'Not Mentioned') === party
                    );
                    setFilteredData(filtered);
                  }}
                >
                  {party}
                </button>
              ))}
            </div>

            {/* Grid Items - Note: You'll need to use filteredData instead of data.data if implementing the filters */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px',
                alignItems: 'stretch',
              }}
            >
              {filteredData.map((accessory, index) => (
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
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
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
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        <FaEdit
                          onClick={() => handleEditAccessory(accessory)}
                          style={{
                            color: '#3b82f6',
                            cursor: 'pointer',
                            fontSize: '1rem',
                          }}
                          title="Edit accessory"
                        />
                        <FaTrash
                          onClick={() => confirmDelete(accessory._id)}
                          style={{
                            color: '#e53935',
                            cursor: 'pointer',
                            fontSize: '1rem',
                          }}
                          title="Delete accessory"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#475569',
                      }}
                    >
                      Per Piece Price: {accessory.perPiecePrice.toFixed(0)} PKR
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#475569',
                      }}
                    >
                      Total Stock Price: {accessory.totalPrice.toFixed(0)} PKR
                    </div>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#475569',
                      }}
                    >
                      Party: {accessory.personId?.name || 'Not Mentioned'}
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
          </>
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
          size="sm"
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {/* Select Accessory */}
              <Form.Group className="mb-3">
                <Form.Label>Select Accessory</Form.Label>
                <CustomSelect
                  value={addStockForm.accessoryId}
                  onChange={(selectedOption) =>
                    setAddStockForm({
                      ...addStockForm,
                      accessoryId: selectedOption?.value || '', // fallback if null
                    })
                  }
                  options={data?.data?.map((item) => ({
                    value: item._id,
                    label: `${item.accessoryName} || Remaining: ${item.stock} || Per Piece: ${item.perPiecePrice}`,
                  }))}
                  placeholder="Select Accessory"
                  noOptionsMessage="No accessories found"
                />
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

              {/* Per Piece Price */}
              <Form.Group controlId="purchasePrice">
                <Form.Label>Per Piece Price</Form.Label>
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

              {/* Payment Type Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                  }}
                >
                  Select Payment Type *
                </label>
                <select
                  value={addStockPaymentData.paymentType}
                  onChange={(e) =>
                    setAddStockPaymentData({
                      ...addStockPaymentData,
                      paymentType: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                  required
                >
                  <option value="">Select Payment Type</option>
                  <option value="full-payment">Full Payment</option>
                  <option value="credit">Credit</option>
                </select>
              </div>

              {/* Entity Selection */}
              {addStockPaymentData.paymentType && (
                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <label style={{ fontWeight: '600' }}>Entity *</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setShowNewEntityFormForStock(false)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: !showNewEntityFormForStock
                            ? '#e5e7eb'
                            : 'transparent',
                          border: '1px solid #d1d5db',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        Select Existing
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewEntityFormForStock(true)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: showNewEntityFormForStock
                            ? '#e5e7eb'
                            : 'transparent',
                          border: '1px solid #d1d5db',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        Create New
                      </button>
                    </div>
                  </div>

                  {showNewEntityFormForStock ? (
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            color: '#4b5563',
                          }}
                        >
                          Entity Name *
                        </label>
                        <input
                          type="text"
                          value={newEntityForStock.name}
                          onChange={(e) =>
                            setNewEntityForStock({
                              ...newEntityForStock,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter entity name"
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            color: '#4b5563',
                          }}
                        >
                          Entity Number *
                        </label>
                        <input
                          type="text"
                          value={newEntityForStock.number}
                          onChange={(e) =>
                            setNewEntityForStock({
                              ...newEntityForStock,
                              number: e.target.value,
                            })
                          }
                          placeholder="Enter entity number"
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginBottom: '16px' }}>
                      <CustomSelect
                        value={addStockEntityData._id}
                        onChange={(selectedOption) => {
                          const selectedEntity = getAllEntities.find(
                            (entity) => entity._id === selectedOption?.value
                          );
                          setAddStockEntityData(
                            selectedEntity || { name: '', number: '', _id: '' }
                          );
                        }}
                        options={getAllEntities.map((entity) => ({
                          value: entity._id,
                          label: `${entity.name} || ${entity.number}`,
                        }))}
                        placeholder="Select Entity"
                        noOptionsMessage="No entities found"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Credit Payment Fields */}
              {addStockPaymentData.paymentType === 'credit' && (
                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                        }}
                      >
                        Payable Now
                      </label>
                      <input
                        type="number"
                        value={addStockPaymentData.payableAmountNow}
                        onChange={(e) =>
                          setAddStockPaymentData({
                            ...addStockPaymentData,
                            payableAmountNow: e.target.value,
                          })
                        }
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                        }}
                      >
                        Payable Later
                      </label>
                      <input
                        type="number"
                        value={addStockPaymentData.payableAmountLater}
                        onChange={(e) =>
                          setAddStockPaymentData({
                            ...addStockPaymentData,
                            payableAmountLater: e.target.value,
                          })
                        }
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                      }}
                    >
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={addStockPaymentData.dateOfPayment}
                      onChange={(e) =>
                        setAddStockPaymentData({
                          ...addStockPaymentData,
                          dateOfPayment: e.target.value,
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Proceed To Pay Button */}
              {addStockPaymentData.paymentType && (
                <Button
                  variant="secondary"
                  onClick={() => setShowPayForStockModal(!showPayForStockModal)}
                  style={{ marginBottom: '10px' }}
                >
                  Proceed To Give Payment
                </Button>
              )}

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

        {/* Return Accessory Modal */}
        <Modal
          size="sm"
          show={showReturnModal}
          toggleModal={() => setShowReturnModal(!showReturnModal)}
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
              Return Accessory
            </h2>

            <Form
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {/* Select Accessory */}
              <Form.Group className="mb-3">
                <Form.Label>Select Accessory</Form.Label>
                <CustomSelect
                  value={returnForm.accessoryId}
                  onChange={(selectedOption) =>
                    setReturnForm({
                      ...returnForm,
                      accessoryId: selectedOption?.value || '',
                    })
                  }
                  options={data?.data?.map((item) => ({
                    value: item._id,
                    label: `${item.accessoryName} | Price: $${item.perPiecePrice} | Stock: ${item.stock}`,
                  }))}
                  placeholder="Select Accessory"
                  noOptionsMessage="No accessories found"
                />
              </Form.Group>

              {/* Quantity to Return */}
              <Form.Group controlId="returnQuantity">
                <Form.Label>Quantity to Return</Form.Label>
                <Form.Control
                  type="number"
                  value={returnForm.quantity}
                  onChange={(e) =>
                    setReturnForm({
                      ...returnForm,
                      quantity: Number(e.target.value),
                    })
                  }
                  placeholder="Enter quantity to return"
                  required
                  min="1"
                />
              </Form.Group>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <Button variant="primary" onClick={handleReturnAccessory}>
                  Return Accessory
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowReturnModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
      <Modal
        size="sm"
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
          <h4
            style={{
              textAlign: 'center',
              marginBottom: '14px',
              fontWeight: '600',
            }}
          >
            Sell Accessory
          </h4>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Select Payment Type
            </label>
            <select
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
              value={accessoryData.paymentType}
              onChange={(e) =>
                setAccessoryData({
                  ...accessoryData,
                  paymentType: e.target.value,
                })
              }
            >
              <option value="">Select Payment</option>
              <option value="full-payment">Full Payment</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          {accessoryData.paymentType !== '' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <label style={{ fontWeight: '600' }}>Entity *(Optional)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowNewEntityForm(false)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: !showNewEntityForm
                        ? '#e5e7eb'
                        : 'transparent',
                      border: '1px solid #d1d5db',
                      fontWeight: '500',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Select Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewEntityForm(true)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: showNewEntityForm ? '#e5e7eb' : 'transparent',
                      border: '1px solid #d1d5db',
                      fontWeight: '500',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Create New
                  </button>
                </div>
              </div>

              {showNewEntityForm ? (
                <div
                  style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        color: '#4b5563',
                      }}
                    >
                      Entity Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newEntity.name}
                      onChange={(e) =>
                        setNewEntity({ ...newEntity, name: e.target.value })
                      }
                      placeholder="Enter entity name"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        color: '#4b5563',
                      }}
                    >
                      Entity Number *
                    </label>
                    <input
                      name="number"
                      type="text"
                      value={newEntity.number}
                      onChange={(e) =>
                        setNewEntity({ ...newEntity, number: e.target.value })
                      }
                      placeholder="Enter entity number"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <CustomSelect
                    value={entityData._id}
                    onChange={(selectedOption) => {
                      const selectedEntity = getAllEntities.find(
                        (entity) => entity._id === selectedOption?.value
                      );
                      setEntityData(
                        selectedEntity || { name: '', number: '', _id: '' }
                      );
                    }}
                    options={getAllEntities.map((entity) => ({
                      value: entity._id,
                      label: `${entity.name} || ${entity.number}`,
                    }))}
                    placeholder="Select Entity"
                    noOptionsMessage="No entities found"
                  />
                </div>
              )}
            </div>
          )}
          <hr style={{ margin: 0 }} />
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
                  <CustomSelect
                    value={accessory.accessoryId}
                    onChange={(selectedOption) => {
                      const selectedId = selectedOption?.value;
                      const selectedAccessory = data?.data?.find(
                        (item) => item._id === selectedId
                      );

                      setFormData((prev) => {
                        const newData = [...prev];
                        newData[index].accessoryId = selectedId;
                        newData[index].accessoryName = selectedAccessory
                          ? selectedAccessory.accessoryName
                          : '';
                        return newData;
                      });
                    }}
                    options={data?.data?.map((item) => ({
                      value: item._id,
                      label: `${item.accessoryName} || Remaining: ${item.stock} || Per Piece: ${item.perPiecePrice}`,
                    }))}
                    placeholder="Select Accessory"
                    noOptionsMessage="No accessories found"
                  />
                  {/* <Form.Select
                    value={accessory.accessoryId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedAccessory = data?.data?.find(
                        (item) => item._id === selectedId
                      );
                      setFormData((prev) => {
                        const newData = [...prev];
                        newData[index].accessoryId = selectedId;
                        newData[index].accessoryName = selectedAccessory
                          ? selectedAccessory.accessoryName
                          : '';
                        return newData;
                      });
                    }}
                  >
                    <option value="">Select an accessory</option>
                    {data?.data?.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.accessoryName}
                      </option>
                    ))}
                  </Form.Select> */}
                </Form.Group>
                {/* <Form.Group className="mb-3">
                  <Form.Label>Select Accessory</Form.Label>
                  <Form.Select
                    value={accessory.accessoryId}
                    onChange={
                      (e) => 
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
                </Form.Group> */}

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
          <div
            style={{
              backgroundColor: '#f8fafc',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#64748b',
                }}
              >
                Total Sale Price:
              </span>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1e293b',
                }}
              >
                Rs.{' '}
                {formData
                  .reduce((total, accessory) => {
                    const quantity = Number(accessory.quantity) || 0;
                    const price = Number(accessory.perPiecePrice) || 0;
                    return total + quantity * price;
                  }, 0)
                  .toLocaleString()}
              </span>
            </div>

            {formData.length > 0 && (
              <div
                style={{
                  fontSize: '12px',
                  color: '#64748b',
                  textAlign: 'right',
                  fontStyle: 'italic',
                }}
              >
                ({formData.length} {formData.length === 1 ? 'item' : 'items'})
              </div>
            )}
          </div>
          {accessoryData.paymentType === 'credit' && (
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      color: '#4b5563',
                    }}
                  >
                    Payable Now
                  </label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={accessoryData.payableAmountNow || ''}
                    onChange={(e) =>
                      setAccessoryData({
                        ...accessoryData,
                        payableAmountNow: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      color: '#4b5563',
                    }}
                  >
                    Payable Later
                  </label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={accessoryData.payableAmountLater || ''}
                    onChange={(e) =>
                      setAccessoryData({
                        ...accessoryData,
                        payableAmountLater: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '14px',
                    color: '#4b5563',
                  }}
                >
                  Payment Due Date
                </label>
                <input
                  type="date"
                  value={accessoryData.dateOfPayment || ''}
                  onChange={(e) =>
                    setAccessoryData({
                      ...accessoryData,
                      dateOfPayment: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}
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
          <Button onClick={handleConfirmSale} variant="primary">
            Sell Accessory
          </Button>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowGetFromSaleModel(!showGetFromSaleModel)}
        >
          Proceed To Get Payment
        </Button>
        {/* <Button
          variant="secondary"
          onClick={() =>
            navigate('/invoice/accessory', {
              state: { data: invoiceData, type: 'accessory' }, // Pass the invoice data
            })
          }
        >
          Want To get Invoice?
        </Button> */}
      </Modal>
      <WalletTransactionModal
        show={showPayForPurchaseModel}
        toggleModal={() => setShowPayForPurchaseModel(!showPayForPurchaseModel)}
        singleTransaction={givePayment}
        setSingleTransaction={setGivePayment}
      />
      <WalletTransactionModal
        show={showGetFromSaleModel}
        toggleModal={() => setShowGetFromSaleModel(!showGetFromSaleModel)}
        singleTransaction={getPayment}
        setSingleTransaction={setGetPayment}
      />
      <WalletTransactionModal
        show={showPayForStockModal}
        toggleModal={() => setShowPayForStockModal(!showPayForStockModal)}
        singleTransaction={givePaymentForStock}
        setSingleTransaction={setGivePaymentForStock}
        type="purchase"
      />

      {/* Print Demand Modal */}
      <Modal
        size="lg"
        show={showPrintDemandModal}
        toggleModal={() => setShowPrintDemandModal(!showPrintDemandModal)}
      >
        <div id="print-content" style={{ padding: '20px' }}>
          <style>
            {`@media print { .no-print { display: none !important; } }`}
          </style>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '15px',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
              }}
            >
              📄 Accessory Demand List
            </h2>
            <div />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Items with stock below 10 units
            </p>
          </div>

          {demandList.length > 0 ? (
            <div style={{ marginBottom: '20px' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      Accessory Name
                    </th>
                    <th
                      className="no-print"
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      Current Quantity
                    </th>
                    <th
                      className="no-print"
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      Per Piece Price
                    </th>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      Quantity to Demand
                    </th>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#374151',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {demandList.map((item, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: '1px solid #f1f5f9' }}
                    >
                      <td style={{ padding: '12px' }}>
                        {item.isCustom ? (
                          <input
                            type="text"
                            value={item.accessoryName}
                            onChange={(e) =>
                              handleDemandItemChange(
                                index,
                                'accessoryName',
                                e.target.value
                              )
                            }
                            placeholder="Enter accessory name"
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '14px',
                            }}
                          />
                        ) : (
                          <span style={{ fontWeight: '500' }}>
                            {item.accessoryName}
                          </span>
                        )}
                      </td>
                      <td className="no-print" style={{ padding: '12px' }}>
                        <span
                          style={{
                            color:
                              !item.isCustom && Number(item.stock) < 10
                                ? '#f59e0b'
                                : '#374151',
                            fontWeight: '600',
                          }}
                        >
                          {item.isCustom ? '-' : Number(item.stock) || 0}
                        </span>
                      </td>
                      <td className="no-print" style={{ padding: '12px' }}>
                        {item.isCustom ? (
                          <input
                            type="number"
                            value={Number(item.perPiecePrice) || 0}
                            onChange={(e) =>
                              handleDemandItemChange(
                                index,
                                'perPiecePrice',
                                Number(e.target.value)
                              )
                            }
                            placeholder="Price"
                            min="0"
                            step="0.01"
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '14px',
                            }}
                          />
                        ) : (
                          <span>
                            {Number(item.perPiecePrice || 0).toFixed(2)} PKR
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <input
                          type="number"
                          value={Number(item.demandQuantity) || 0}
                          onChange={(e) =>
                            handleDemandItemChange(
                              index,
                              'demandQuantity',
                              Number(e.target.value)
                            )
                          }
                          placeholder="Quantity"
                          min="0"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '14px',
                          }}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleRemoveFromDemand(index)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: '#64748b',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📦</div>
              <p style={{ fontSize: '16px', margin: 0 }}>
                No accessories with low stock found.
              </p>
            </div>
          )}

          {/* Add Custom and Print/Download buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '12px',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <button
              onClick={handleAddToDemand}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                background: '#10b981',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              + Add Custom Item
            </button>
            <button
              onClick={() => setShowPrintDemandModal(false)}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: 'white',
                color: '#374151',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                background: '#3b82f6',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              🖨️ Print
            </button>
            <button
              onClick={handleDownloadPDF}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                background: '#10b981',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              📄 Download PDF
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Accessory Modal */}
      {showEditModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => {
            setShowEditModal(false);
            setEditingAccessory(null);
            setEditForm({ accessoryName: '', perPiecePrice: '' });
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 8,
              width: '90vw',
              maxWidth: 500,
              padding: 24,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                paddingBottom: 12,
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
                Edit Accessory
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAccessory(null);
                  setEditForm({ accessoryName: '', perPiecePrice: '' });
                }}
                style={{
                  background: '#6b7280',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: 8,
                }}
              >
                Accessory Name
              </label>
              <input
                type="text"
                value={editForm.accessoryName}
                onChange={(e) =>
                  setEditForm({ ...editForm, accessoryName: e.target.value })
                }
                placeholder="Enter accessory name"
                style={{
                  width: '100%',
                  padding: 10,
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  fontSize: 14,
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: 8,
                }}
              >
                Per Piece Price
              </label>
              <input
                type="number"
                value={editForm.perPiecePrice}
                onChange={(e) =>
                  setEditForm({ ...editForm, perPiecePrice: e.target.value })
                }
                placeholder="Enter price (must be > 0)"
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: 10,
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  fontSize: 14,
                }}
              />
              <p
                style={{
                  fontSize: 12,
                  color: '#6b7280',
                  marginTop: 4,
                  marginBottom: 0,
                }}
              >
                At least one field (name or price) must be provided
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
              }}
            >
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAccessory(null);
                  setEditForm({ accessoryName: '', perPiecePrice: '' });
                }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  background: 'white',
                  color: '#374151',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAccessory}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: 6,
                  background: '#3b82f6',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Update Accessory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAccessory;
