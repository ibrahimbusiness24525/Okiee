import { useEffect, useState } from 'react';
import { api } from '../../../api/api';
import { FaPrint, FaBoxes, FaTrash } from 'react-icons/fa';

const StockList = () => {
  const [data, setData] = useState({
    bulkPhones: [],
    singlePhones: [],
  });
  const [filter, setFilter] = useState('all'); // 'all', 'bulk', 'single'
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAccessoryModal, setShowAccessoryModal] = useState(false);
  const [accessories, setAccessories] = useState([]);
  const [loadingAccessories, setLoadingAccessories] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('all'); // 'all' or specific company name
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bulkToDelete, setBulkToDelete] = useState(null);
  const [selectedImeis, setSelectedImeis] = useState([]);

  const getAllStock = async () => {
    const response = await api.get('/api/purchase/all-purchase-phone');
    setData(response?.data.data || { bulkPhones: [], singlePhones: [] });
    return response?.data || [];
  };

  // Get all unique companies from the data
  const getAllCompanies = () => {
    const companies = new Set();

    // Add companies from bulk phones
    data.bulkPhones.forEach((phone) => {
      phone.ramSimDetails?.forEach((detail) => {
        if (detail.companyName) {
          companies.add(detail.companyName);
        }
      });
    });

    // Add companies from single phones
    data.singlePhones.forEach((phone) => {
      if (phone.companyName) {
        companies.add(phone.companyName);
      }
    });

    return Array.from(companies).sort();
  };

  useEffect(() => {
    getAllStock();
  }, []);

  const toggleItemSelection = (id, type) => {
    const itemId = `${type}-${id}`;
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((item) => item !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    let itemsToSelect = [];

    if (filter === 'all') {
      itemsToSelect = [
        ...filteredBulkPhones.map((phone) => `bulk-${phone._id}`),
        ...filteredSinglePhones.map((phone) => `single-${phone._id}`),
      ];
    } else if (filter === 'bulk') {
      itemsToSelect = filteredBulkPhones.map((phone) => `bulk-${phone._id}`);
    } else if (filter === 'single') {
      itemsToSelect = filteredSinglePhones.map(
        (phone) => `single-${phone._id}`
      );
    }

    setSelectedItems(itemsToSelect);
  };

  // Deselect all items
  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  // Check if all items in current view are selected
  const areAllItemsSelected = () => {
    if (filter === 'all') {
      const allBulkSelected = filteredBulkPhones.every((phone) =>
        selectedItems.includes(`bulk-${phone._id}`)
      );
      const allSingleSelected = filteredSinglePhones.every((phone) =>
        selectedItems.includes(`single-${phone._id}`)
      );
      return allBulkSelected && allSingleSelected;
    } else if (filter === 'bulk') {
      return filteredBulkPhones.every((phone) =>
        selectedItems.includes(`bulk-${phone._id}`)
      );
    } else if (filter === 'single') {
      return filteredSinglePhones.every((phone) =>
        selectedItems.includes(`single-${phone._id}`)
      );
    }
    return false;
  };

  const printSelected = async () => {
    try {
      const selectedBulkIds = selectedItems
        .filter((id) => id.startsWith('bulk-'))
        .map((id) => id.replace('bulk-', ''));

      const selectedSingleIds = selectedItems
        .filter((id) => id.startsWith('single-'))
        .map((id) => id.replace('single-', ''));

      const selectedBulkPhones = data.bulkPhones.filter((phone) =>
        selectedBulkIds.includes(phone._id)
      );

      const selectedSinglePhones = data.singlePhones.filter((phone) =>
        selectedSingleIds.includes(phone._id)
      );

      const printContent = preparePrintContent(
        selectedBulkPhones,
        selectedSinglePhones
      );

      // Create print window
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      printWindow.document.open();
      printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Stock List Print</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 10mm;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              line-height: 1.3;
            }
            h1 { font-size: 18px; margin: 0 0 10px 0; }
            h2 { font-size: 14px; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 4px; }
            th { background: #f3f4f6; }
            @page { size: auto; margin: 8mm; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1 style="text-align:center;">Selected Phones</h1>
          <div style="margin-bottom: 8px; font-size: 12px;">
            <strong>Total Selected:</strong> ${selectedItems.length} &nbsp; | &nbsp;
            <strong>Bulk Selected:</strong> ${selectedBulkPhones.length} &nbsp; | &nbsp;
            <strong>Single Selected:</strong> ${selectedSinglePhones.length}
          </div>
          ${printContent}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() { window.close(); };
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
      printWindow.document.close();
    } catch (error) {
      console.error('Printing failed:', error);
      alert('Printing failed: ' + error.message);
    }
  };
  const getAllAccessoriesData = async () => {
    try {
      setLoadingAccessories(true);
      const response = await api.get('/api/accessory/');
      console.log('accessories', response?.data);
      setAccessories(response?.data || []);
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching accessories data:', error);
      return [];
    } finally {
      setLoadingAccessories(false);
    }
  };

  const handleShowAccessories = async () => {
    await getAllAccessoriesData();
    setShowAccessoryModal(true);
  };

  const handlePrintAccessories = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Accessory Stock List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            h1 { color: #333; text-align: center; }
            .header { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Accessory Stock List</h1>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Accessory Name</th>
                <th>One Item Price</th>
                <th>Total Stock</th>
                <th>Total Stock Amount</th>
                <th>Created Date</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              ${accessories
                .map(
                  (acc) => `
                <tr>
                  <td>${acc.accessoryName || ''}</td>
                  <td>Rs. ${acc.perPiecePrice?.toLocaleString() || '0'}</td>
                  <td>${acc.stock || '0'}</td>
                  <td>Rs. ${((acc.stock || 0) * (acc.perPiecePrice || 0)).toLocaleString()}</td>
                  <td>${new Date(acc.createdAt).toLocaleDateString()}</td>
                  <td>${new Date(acc.updatedAt).toLocaleDateString()}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Extract all IMEI1 values from a bulk purchase
  const getAllImeisFromBulk = (bulkPhone) => {
    const imeis = [];
    if (bulkPhone?.ramSimDetails) {
      bulkPhone.ramSimDetails.forEach((detail) => {
        if (detail?.imeiNumbers && Array.isArray(detail.imeiNumbers)) {
          detail.imeiNumbers.forEach((imeiObj) => {
            if (imeiObj?.imei1) {
              imeis.push({
                imei1: imeiObj.imei1,
                color: imeiObj.color || 'N/A',
                companyName: detail.companyName || '',
                modelName: detail.modelName || '',
                ramMemory: detail.ramMemory || '',
              });
            }
          });
        }
      });
    }
    return imeis;
  };

  // Open delete modal with bulk purchase data
  const handleDeleteBulk = (bulkId) => {
    const bulkPhone = data.bulkPhones.find((p) => p._id === bulkId);
    if (!bulkPhone) {
      alert('Bulk purchase not found.');
      return;
    }

    setBulkToDelete(bulkPhone);
    setSelectedImeis([]);
    setShowDeleteModal(true);
  };

  // Toggle IMEI selection
  const toggleImeiSelection = (imei1) => {
    setSelectedImeis((prev) =>
      prev.includes(imei1)
        ? prev.filter((imei) => imei !== imei1)
        : [...prev, imei1]
    );
  };

  // Select all IMEIs
  const selectAllImeis = () => {
    if (bulkToDelete) {
      const allImeis = getAllImeisFromBulk(bulkToDelete);
      setSelectedImeis(allImeis.map((item) => item.imei1));
    }
  };

  // Deselect all IMEIs
  const deselectAllImeis = () => {
    setSelectedImeis([]);
  };

  // Confirm and execute deletion
  const confirmDeleteBulk = async () => {
    if (!bulkToDelete) return;

    const deleteEntireBulk = selectedImeis.length === 0;

    if (
      !deleteEntireBulk &&
      !window.confirm(
        `Are you sure you want to delete ${selectedImeis.length} selected IMEI(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    if (
      deleteEntireBulk &&
      !window.confirm(
        'Are you sure you want to delete the entire bulk purchase? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      setDeletingId(bulkToDelete._id);

      // Build API URL with IMEI parameter if IMEIs are selected
      let apiUrl = `/api/purchase/purchase-bulk/delete/${bulkToDelete._id}`;
      if (!deleteEntireBulk && selectedImeis.length > 0) {
        const imeiParam = selectedImeis.join(',');
        apiUrl += `?imei=${imeiParam}`;
      }

      await api.delete(apiUrl);

      // Remove from selected items if it was selected
      setSelectedItems((prev) =>
        prev.filter((id) => id !== `bulk-${bulkToDelete._id}`)
      );

      // Close modal
      setShowDeleteModal(false);
      setBulkToDelete(null);
      setSelectedImeis([]);

      // Refresh the data
      await getAllStock();

      alert(
        deleteEntireBulk
          ? 'Bulk purchase deleted successfully!'
          : `${selectedImeis.length} IMEI(s) deleted successfully!`
      );
    } catch (error) {
      console.error('Error deleting bulk purchase:', error);
      alert('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Delete a single phone
  const handleDeleteSingle = async (singleId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this single phone? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      setDeletingId(singleId);
      await api.delete(`/api/Purchase/purchase-phone/delete/${singleId}`);

      // Remove from selected items if it was selected
      setSelectedItems((prev) =>
        prev.filter((id) => id !== `single-${singleId}`)
      );

      // Refresh the data
      await getAllStock();

      alert('Single phone deleted successfully!');
    } catch (error) {
      console.error('Error deleting single phone:', error);
      alert('Failed to delete single phone. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };
  const preparePrintContent = (bulkPhones, singlePhones) => {
    // Group by company name across single and bulk
    const groups = new Map();

    const ensureGroup = (company) => {
      const key = company || 'Unknown';
      if (!groups.has(key)) {
        groups.set(key, { single: [], bulk: [] });
      }
      return groups.get(key);
    };

    // Collect single phones by company
    singlePhones.forEach((p) => {
      const company = p.companyName || 'Unknown';
      const group = ensureGroup(company);
      group.single.push({
        model: p.modelName || '',
        imei1: p.imei1 || '',
        imei2: p.imei2 || '',
      });
    });

    // Collect bulk phones by company from ramSimDetails
    bulkPhones.forEach((bp) => {
      (bp.ramSimDetails || []).forEach((d) => {
        const company = d?.companyName || 'Unknown';
        const group = ensureGroup(company);
        const imeiNumbers = Array.isArray(d?.imeiNumbers) ? d.imeiNumbers : [];
        const qty = imeiNumbers.length || 0;
        const imeiList = imeiNumbers.map((x) => x?.imei1).filter(Boolean);
        group.bulk.push({
          model: d?.modelName || '',
          imeis: imeiList,
          qty,
        });
      });
    });

    // Render each company section
    const companySections = Array.from(groups.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([company, data]) => {
        // Single rows
        const singleRows = data.single
          .map(
            (item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${item.model}</td>
              <td>${item.imei1}</td>
              <td>${item.imei2}</td>
              <td style="text-align:right;">1</td>
            </tr>
          `
          )
          .join('');

        // Bulk rows, consolidate by model (sum qty, merge a sample of imeis)
        const bulkByModel = new Map();
        data.bulk.forEach((b) => {
          const key = b.model || 'Unknown';
          if (!bulkByModel.has(key)) {
            bulkByModel.set(key, { model: key, qty: 0, imeis: [] });
          }
          const node = bulkByModel.get(key);
          node.qty += Number(b.qty || 0);
          // keep up to 20 imeis to display
          if (Array.isArray(b.imeis)) {
            node.imeis = node.imeis.concat(b.imeis).slice(0, 20);
          }
        });
        const bulkRows = Array.from(bulkByModel.values())
          .map((item) => {
            const more =
              item.imeis.length > 10 ? ` +${item.imeis.length - 10} more` : '';
            const sampleImei = item.imeis.slice(0, 10).join(', ');
            return `
              <tr>
                <td>${item.model}</td>
                <td>${sampleImei}${more}</td>
                <td style="text-align:right;">${item.qty}</td>
              </tr>
            `;
          })
          .join('');

        const totalSingleQty = data.single.length;
        const totalBulkQty = data.bulk.reduce(
          (sum, b) => sum + Number(b.qty || 0),
          0
        );

        return `
          <div style="margin-top: 10px;">
            <h2 style="margin: 8px 0 6px 0; font-size: 14px;">${company}</h2>
            ${
              data.single.length > 0
                ? `
            <div style="margin: 4px 0; font-size: 12px;"><strong>Single Phones:</strong> ${totalSingleQty}</div>
            <table style="width:100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px;">
              <thead>
                <tr>
                  <th style="border:1px solid #000; padding:4px; text-align:left; width:40px;">#</th>
                  <th style="border:1px solid #000; padding:4px; text-align:left;">Model</th>
                  <th style="border:1px solid #000; padding:4px; text-align:left;">IMEI1</th>
                  <th style="border:1px solid #000; padding:4px; text-align:left;">IMEI2</th>
                  <th style="border:1px solid #000; padding:4px; text-align:right; width:60px;">Qty</th>
                </tr>
              </thead>
              <tbody>
                ${singleRows}
              </tbody>
            </table>
            `
                : ''
            }

            ${
              data.bulk.length > 0
                ? `
            <div style="margin: 4px 0; font-size: 12px;"><strong>Bulk Phones:</strong> Total Qty ${totalBulkQty}</div>
            <table style="width:100%; border-collapse: collapse; font-size: 12px; margin-bottom: 12px;">
              <thead>
                <tr>
                  <th style="border:1px solid #000; padding:4px; text-align:left;">Model</th>
                  <th style="border:1px solid #000; padding:4px; text-align:left;">IMEIs (sample)</th>
                  <th style="border:1px solid #000; padding:4px; text-align:right; width:80px;">Qty</th>
                </tr>
              </thead>
              <tbody>
                ${bulkRows}
              </tbody>
            </table>
            `
                : ''
            }
          </div>
        `;
      })
      .join('');

    return companySections;
  };
  // Helper: total IMEIs in a bulk purchase
  const getBulkImeiCount = (bulk) => {
    if (!bulk || !Array.isArray(bulk.ramSimDetails)) return 0;
    return bulk.ramSimDetails.reduce((sum, detail) => {
      const count = Array.isArray(detail?.imeiNumbers)
        ? detail.imeiNumbers.length
        : 0;
      return sum + count;
    }, 0);
  };

  // Filter phones by type and company, exclude bulk with zero phones
  const filteredBulkPhones = (() => {
    let phones = filter === 'all' || filter === 'bulk' ? data.bulkPhones : [];

    // Exclude bulk records that have 0 IMEIs overall
    phones = phones.filter((bulk) => getBulkImeiCount(bulk) > 0);

    if (selectedCompany !== 'all') {
      phones = phones.filter((phone) =>
        phone.ramSimDetails?.some(
          (detail) => detail.companyName === selectedCompany
        )
      );
    }

    // Reverse the array to show newest first
    return [...phones].reverse();
  })();

  const filteredSinglePhones = (() => {
    let phones =
      filter === 'all' || filter === 'single' ? data.singlePhones : [];

    if (selectedCompany !== 'all') {
      phones = phones.filter((phone) => phone.companyName === selectedCompany);
    }

    return phones;
  })();
  console.log('singlePhones', data.singlePhones);

  // Build base lists for current type filter (without company filter) for pills/counts
  const baseBulkForFilter =
    filter === 'all' || filter === 'bulk'
      ? data.bulkPhones.filter((bulk) => getBulkImeiCount(bulk) > 0)
      : [];
  const baseSingleForFilter =
    filter === 'all' || filter === 'single' ? data.singlePhones : [];

  // Compute companies only from the current type filter (not from other types)
  const getCompaniesForCurrentFilter = () => {
    const companies = new Set();
    // Bulk side (ramSimDetails nested)
    baseBulkForFilter.forEach((phone) => {
      phone.ramSimDetails?.forEach((detail) => {
        if (detail.companyName) companies.add(detail.companyName);
      });
    });
    // Single side
    baseSingleForFilter.forEach((phone) => {
      if (phone.companyName) companies.add(phone.companyName);
    });
    return Array.from(companies).sort();
  };

  // Helper to count items for a company under current type filter
  const getCompanyCountUnderFilter = (company) => {
    let count = 0;
    // For bulk, count total IMEI entries for the given company across ramSimDetails
    baseBulkForFilter.forEach((bulk) => {
      (bulk.ramSimDetails || [])
        .filter((detail) => detail.companyName === company)
        .forEach((detail) => {
          const imeis = Array.isArray(detail.imeiNumbers)
            ? detail.imeiNumbers.length
            : 0;
          count += imeis;
        });
    });
    // For single, each phone counts as 1 if company matches
    baseSingleForFilter.forEach((phone) => {
      if (phone.companyName === company) count++;
    });
    return count;
  };

  // Total items under current type filter (without company filter)
  // Bulk counts total IMEI entries; single counts number of phones
  const totalUnderCurrentFilter = (() => {
    const bulkQty = baseBulkForFilter.reduce((sum, bulk) => {
      const qty = (bulk.ramSimDetails || []).reduce((acc, detail) => {
        const imeis = Array.isArray(detail.imeiNumbers)
          ? detail.imeiNumbers.length
          : 0;
        return acc + imeis;
      }, 0);
      return sum + qty;
    }, 0);
    const singleQty = baseSingleForFilter.length;
    return bulkQty + singleQty;
  })();

  // If selectedCompany is not available under current filter, reset to 'all'
  useEffect(() => {
    const available = getCompaniesForCurrentFilter();
    if (selectedCompany !== 'all' && !available.includes(selectedCompany)) {
      setSelectedCompany('all');
    }
  }, [filter, data]);

  return (
    <div className="stock-list" style={{ padding: '20px' }}>
      <h1>Stock List</h1>

      {/* Company Filter Pills */}
      <div style={{ marginBottom: '20px' }}>
        <h3
          style={{ margin: '0 0 10px 0', color: '#374151', fontSize: '16px' }}
        >
          Filter by Company:
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setSelectedCompany('all')}
            style={{
              backgroundColor:
                selectedCompany === 'all' ? '#3b82f6' : '#f3f4f6',
              color: selectedCompany === 'all' ? 'white' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              padding: '6px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: selectedCompany === 'all' ? '600' : '400',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onMouseOver={(e) => {
              if (selectedCompany !== 'all') {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseOut={(e) => {
              if (selectedCompany !== 'all') {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            All Companies ({totalUnderCurrentFilter})
          </button>

          {getCompaniesForCurrentFilter().map((company) => {
            const companyCount = getCompanyCountUnderFilter(company);
            return (
              <button
                key={company}
                onClick={() => setSelectedCompany(company)}
                style={{
                  backgroundColor:
                    selectedCompany === company ? '#3b82f6' : '#f3f4f6',
                  color: selectedCompany === company ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: selectedCompany === company ? '600' : '400',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onMouseOver={(e) => {
                  if (selectedCompany !== company) {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedCompany !== company) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
              >
                {company} ({companyCount})
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              fontWeight: filter === 'all' ? 'bold' : 'normal',
              background: filter === 'all' ? '#e0e0e0' : '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            All Phones
          </button>

          <button
            onClick={() => setFilter('bulk')}
            style={{
              fontWeight: filter === 'bulk' ? 'bold' : 'normal',
              background: filter === 'bulk' ? '#e0e0e0' : '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            Bulk Phones
          </button>

          <button
            onClick={() => setFilter('single')}
            style={{
              fontWeight: filter === 'single' ? 'bold' : 'normal',
              background: filter === 'single' ? '#e0e0e0' : '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            Single Phones
          </button>

          <button
            onClick={handleShowAccessories}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#7c3aed')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#8b5cf6')
            }
          >
            <FaBoxes /> Show Accessory
          </button>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <button
            onClick={areAllItemsSelected() ? deselectAllItems : selectAllItems}
            style={{
              backgroundColor: areAllItemsSelected() ? '#f44336' : '#4CAF50',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {areAllItemsSelected() ? 'Deselect All' : 'Select All'}
          </button>

          {selectedItems.length > 0 && (
            <button
              onClick={printSelected}
              style={{
                backgroundColor: '#2196F3',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Print Selected ({selectedItems.length})
            </button>
          )}
        </div>
      </div>

      {/* Bulk Phones List */}
      {filteredBulkPhones.length > 0 && (
        <div>
          <div style={{ marginBottom: '30px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              {/* <h2>Bulk Phones ({filteredBulkPhones.length})</h2> */}
              <button
                onClick={() => {
                  const allBulkSelected = filteredBulkPhones.every((phone) =>
                    selectedItems.includes(`bulk-${phone._id}`)
                  );
                  if (allBulkSelected) {
                    setSelectedItems((prev) =>
                      prev.filter((id) => !id.startsWith('bulk-'))
                    );
                  } else {
                    setSelectedItems((prev) => [
                      ...prev.filter((id) => !id.startsWith('bulk-')),
                      ...filteredBulkPhones.map((phone) => `bulk-${phone._id}`),
                    ]);
                  }
                }}
                style={{
                  backgroundColor: filteredBulkPhones.every((phone) =>
                    selectedItems.includes(`bulk-${phone._id}`)
                  )
                    ? '#f44336'
                    : '#4CAF50',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {filteredBulkPhones.every((phone) =>
                  selectedItems.includes(`bulk-${phone._id}`)
                )
                  ? 'Deselect All Bulk'
                  : 'Select All Bulk'}
              </button>
            </div>

            {filteredBulkPhones.map((phone) => (
              <div
                key={phone._id}
                style={{
                  marginBottom: '15px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  backgroundColor: selectedItems.includes(`bulk-${phone._id}`)
                    ? '#f0f0f0'
                    : 'white',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '5px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(`bulk-${phone._id}`)}
                    onChange={() => toggleItemSelection(phone._id, 'bulk')}
                    style={{ marginRight: '10px' }}
                  />

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <h3
                        style={{
                          margin: '0',
                          color: '#1f2937',
                          fontSize: '18px',
                        }}
                      >
                        {phone.personId?.name || ''} -{' '}
                        {new Date(
                          phone.date || phone.createdAt
                        ).toLocaleDateString()}
                      </h3>
                      <button
                        onClick={() => handleDeleteBulk(phone._id)}
                        disabled={deletingId === phone._id}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          cursor:
                            deletingId === phone._id
                              ? 'not-allowed'
                              : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          opacity: deletingId === phone._id ? 0.6 : 1,
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                          if (deletingId !== phone._id) {
                            e.currentTarget.style.backgroundColor = '#b91c1c';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (deletingId !== phone._id) {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                          }
                        }}
                      >
                        <FaTrash />
                        {deletingId === phone._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '10px',
                        marginBottom: '15px',
                      }}
                    >
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Purchase Date:</strong>{' '}
                        {new Date(
                          phone.date || phone.createdAt
                        ).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Total Quantity:</strong>{' '}
                        {phone.totalQuantity || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Status:</strong>
                        <span
                          style={{
                            color:
                              phone.status === 'Available'
                                ? '#059669'
                                : '#dc2626',
                            fontWeight: 'bold',
                            marginLeft: '5px',
                          }}
                        >
                          {phone.status || ''}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Payment Status:</strong>
                        <span
                          style={{
                            color:
                              phone.purchasePaymentStatus === 'paid'
                                ? '#059669'
                                : '#dc2626',
                            fontWeight: 'bold',
                            marginLeft: '5px',
                          }}
                        >
                          {phone.purchasePaymentStatus || ''}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Payment Type:</strong>{' '}
                        {phone.purchasePaymentType || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Buying Price:</strong> Rs.{' '}
                        {phone.prices?.buyingPrice?.toLocaleString() || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Dealer Price:</strong> Rs.{' '}
                        {phone.prices?.dealerPrice?.toLocaleString() || ''}
                      </div>
                    </div>
                  </div>
                </div>

                {(phone.ramSimDetails || [])
                  .filter(
                    (detail) =>
                      Array.isArray(detail?.imeiNumbers) &&
                      detail.imeiNumbers.length > 0
                  )
                  .map((detail, index) => (
                    <div
                      key={index}
                      style={{
                        marginLeft: '20px',
                        padding: '15px',
                        backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        marginBottom: '10px',
                      }}
                    >
                      <div style={{ marginBottom: '10px' }}>
                        <h4
                          style={{
                            margin: '0 0 8px 0',
                            color: '#374151',
                            fontSize: '16px',
                          }}
                        >
                          {detail.companyName} {detail.modelName}{' '}
                          {detail.ramMemory}
                        </h4>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '8px',
                            marginBottom: '15px',
                          }}
                        >
                          <div>
                            <strong>Price per Unit:</strong> Rs.{' '}
                            {detail.priceOfOne?.toLocaleString() || ''}
                          </div>
                          <div>
                            <strong>SIM Option:</strong>{' '}
                            {detail.simOption || ''}
                          </div>
                          <div>
                            <strong>Battery Health:</strong>{' '}
                            {detail.batteryHealth || ''}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '10px' }}>
                        <h5
                          style={{
                            margin: '0 0 8px 0',
                            color: '#6b7280',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          IMEI Numbers ({detail.imeiNumbers?.length || 0}):
                        </h5>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '10px',
                          }}
                        >
                          {detail.imeiNumbers?.map((imei, i) => (
                            <div
                              key={i}
                              style={{
                                fontSize: '13px',
                                padding: '12px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                              }}
                            >
                              <div style={{ marginBottom: '6px' }}>
                                <strong style={{ color: '#374151' }}>
                                  IMEI1:
                                </strong>
                                <span
                                  style={{
                                    marginLeft: '5px',
                                    fontFamily: 'monospace',
                                  }}
                                >
                                  {imei.imei1 || 'N/A'}
                                </span>
                              </div>
                              <div style={{ marginBottom: '6px' }}>
                                <strong style={{ color: '#374151' }}>
                                  IMEI2:
                                </strong>
                                <span
                                  style={{
                                    marginLeft: '5px',
                                    fontFamily: 'monospace',
                                  }}
                                >
                                  {imei.imei2 || 'N/A'}
                                </span>
                              </div>
                              <div style={{ marginBottom: '6px' }}>
                                <strong style={{ color: '#374151' }}>
                                  Color:
                                </strong>
                                <span
                                  style={{
                                    marginLeft: '5px',
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {imei.color || 'N/A'}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  paddingTop: '6px',
                                  borderTop: '1px solid #e5e7eb',
                                }}
                              >
                                <strong style={{ color: '#374151' }}>
                                  Dispatched:
                                </strong>
                                <span
                                  style={{
                                    color: imei.isDispatched
                                      ? '#059669'
                                      : '#dc2626',
                                    fontWeight: 'bold',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: imei.isDispatched
                                      ? '#d1fae5'
                                      : '#fee2e2',
                                    fontSize: '12px',
                                  }}
                                >
                                  {imei.isDispatched ? 'Yes' : 'No'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Single Phones List */}
      {filteredSinglePhones.length > 0 && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <h2>Single Phones ({filteredSinglePhones.length})</h2>
            <button
              onClick={() => {
                const allSingleSelected = filteredSinglePhones.every((phone) =>
                  selectedItems.includes(`single-${phone._id}`)
                );
                if (allSingleSelected) {
                  setSelectedItems((prev) =>
                    prev.filter((id) => !id.startsWith('single-'))
                  );
                } else {
                  setSelectedItems((prev) => [
                    ...prev.filter((id) => !id.startsWith('single-')),
                    ...filteredSinglePhones.map(
                      (phone) => `single-${phone._id}`
                    ),
                  ]);
                }
              }}
              style={{
                backgroundColor: filteredSinglePhones.every((phone) =>
                  selectedItems.includes(`single-${phone._id}`)
                )
                  ? '#f44336'
                  : '#4CAF50',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {filteredSinglePhones.every((phone) =>
                selectedItems.includes(`single-${phone._id}`)
              )
                ? 'Deselect All Single'
                : 'Select All Single'}
            </button>
          </div>
          {filteredSinglePhones.map((phone) => (
            <div
              key={phone._id}
              style={{
                marginBottom: '15px',
                border: '1px solid #ddd',
                padding: '10px',
                display: 'flex',
                backgroundColor: selectedItems.includes(`single-${phone._id}`)
                  ? '#f0f0f0'
                  : 'white',
              }}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(`single-${phone._id}`)}
                onChange={() => toggleItemSelection(phone._id, 'single')}
                style={{ marginRight: '10px' }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: '0 0 10px 0',
                        color: '#1f2937',
                        fontSize: '18px',
                      }}
                    >
                      {phone.companyName} {phone.modelName} {phone.ramMemory}
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '10px',
                      }}
                    >
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>IMEI1:</strong> {phone.imei1 || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>IMEI2:</strong> {phone.imei2 || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Color:</strong> {phone.color || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Condition:</strong> {phone.phoneCondition || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Battery Health:</strong>{' '}
                        {phone.batteryHealth || ''}%
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Warranty:</strong> {phone.warranty || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Specifications:</strong>{' '}
                        {phone.specifications || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Customer:</strong> {phone.name || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>CNIC:</strong> {phone.cnic || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Mobile:</strong> {phone.mobileNumber || ''}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <strong>Approved from Egadgets:</strong>{' '}
                        {phone.isApprovedFromEgadgets ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '200px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <div>
                        <strong>Purchase Price:</strong> Rs.{' '}
                        {phone.price?.purchasePrice?.toLocaleString() || ''}
                      </div>
                    </div>
                    <div>
                      <strong>Purchase Date:</strong>{' '}
                      {new Date(
                        phone.date || phone.createdAt
                      ).toLocaleDateString()}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <button
                        onClick={() => handleDeleteSingle(phone._id)}
                        disabled={deletingId === phone._id}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          cursor:
                            deletingId === phone._id
                              ? 'not-allowed'
                              : 'pointer',
                          fontSize: '12px',
                          opacity: deletingId === phone._id ? 0.6 : 1,
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                          if (deletingId !== phone._id) {
                            e.currentTarget.style.backgroundColor = '#b91c1c';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (deletingId !== phone._id) {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                {/* {phone.accessories && (
                  <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '14px' }}>Accessories:</h4>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <div><strong>Box:</strong> {phone.accessories.box ? '✓' : '✗'}</div>
                      <div><strong>Charger:</strong> {phone.accessories.charger ? '✓' : '✗'}</div>
                      <div><strong>Hand Free:</strong> {phone.accessories.handFree ? '✓' : '✗'}</div>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Bulk Purchase Modal with IMEI Selection */}
      {showDeleteModal && bulkToDelete && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
              setBulkToDelete(null);
              setSelectedImeis([]);
            }
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '800px',
              width: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              zIndex: 1001,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#dc2626',
                }}
              >
                Delete Bulk Purchase
              </h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBulkToDelete(null);
                  setSelectedImeis([]);
                }}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Close
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  color: '#374151',
                }}
              >
                <strong>Bulk Purchase:</strong>{' '}
                {bulkToDelete.personId?.name || 'N/A'} -{' '}
                {new Date(
                  bulkToDelete.date || bulkToDelete.createdAt
                ).toLocaleDateString()}
              </p>
              <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                Select specific IMEIs to delete, or leave all unselected to
                delete the entire bulk purchase.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <button
                onClick={selectAllImeis}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Select All IMEIs
              </button>
              <button
                onClick={deselectAllImeis}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Deselect All
              </button>
              <div
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                  color: '#374151',
                }}
              >
                <strong>
                  {selectedImeis.length === 0
                    ? 'Delete entire bulk purchase'
                    : `${selectedImeis.length} IMEI(s) selected`}
                </strong>
              </div>
            </div>

            <div
              style={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '20px',
              }}
            >
              {(() => {
                const allImeis = getAllImeisFromBulk(bulkToDelete);
                if (allImeis.length === 0) {
                  return (
                    <p
                      style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        padding: '20px',
                      }}
                    >
                      No IMEIs found in this bulk purchase.
                    </p>
                  );
                }

                return (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {allImeis.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => toggleImeiSelection(item.imei1)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px',
                          border: selectedImeis.includes(item.imei1)
                            ? '2px solid #3b82f6'
                            : '1px solid #e5e7eb',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          backgroundColor: selectedImeis.includes(item.imei1)
                            ? '#eff6ff'
                            : 'white',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                          if (!selectedImeis.includes(item.imei1)) {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!selectedImeis.includes(item.imei1)) {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedImeis.includes(item.imei1)}
                          onChange={() => toggleImeiSelection(item.imei1)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            marginRight: '12px',
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '4px',
                            }}
                          >
                            {item.companyName} {item.modelName} {item.ramMemory}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              fontFamily: 'monospace',
                              marginBottom: '2px',
                            }}
                          >
                            <strong>IMEI1:</strong> {item.imei1}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              textTransform: 'capitalize',
                            }}
                          >
                            <strong>Color:</strong> {item.color}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBulkToDelete(null);
                  setSelectedImeis([]);
                }}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBulk}
                disabled={deletingId === bulkToDelete._id}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  cursor:
                    deletingId === bulkToDelete._id ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: deletingId === bulkToDelete._id ? 0.6 : 1,
                }}
              >
                {deletingId === bulkToDelete._id
                  ? 'Deleting...'
                  : selectedImeis.length === 0
                    ? 'Delete Entire Bulk'
                    : `Delete ${selectedImeis.length} IMEI(s)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accessory Stock Modal */}
      {showAccessoryModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              zIndex: 2147483647,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                }}
              >
                Accessory Stock List
              </h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handlePrintAccessories}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
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
                  <FaPrint /> Print
                </button>
                <button
                  onClick={() => setShowAccessoryModal(false)}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = '#4b5563')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = '#6b7280')
                  }
                >
                  Close
                </button>
              </div>
            </div>

            {loadingAccessories ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading accessories...</p>
              </div>
            ) : accessories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No accessories found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Accessory Name
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        One Item Price
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Total Stock
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Total Stock Amount
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Created Date
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessories.map((acc, index) => (
                      <tr
                        key={acc._id || index}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? '#ffffff' : '#f9fafb',
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                          }}
                        >
                          {acc.accessoryName || ''}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                          }}
                        >
                          Rs. {acc.perPiecePrice?.toLocaleString() || '0'}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                          }}
                        >
                          {acc.stock || '0'}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                            fontWeight: '600',
                          }}
                        >
                          Rs.{' '}
                          {(
                            (acc.stock || 0) * (acc.perPiecePrice || 0)
                          ).toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                          }}
                        >
                          {new Date(acc.createdAt).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                          }}
                        >
                          {new Date(acc.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockList;
