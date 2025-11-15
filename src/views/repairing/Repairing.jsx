import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../api/api';
import { toast } from 'react-toastify';
import CustomSelect from 'components/CustomSelect';

const Repairing = () => {
  const [showModal, setShowModal] = useState(false);
  const [accessories, setAccessories] = useState([]);
  const [loadingAccessories, setLoadingAccessories] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showNewEntityForm, setShowNewEntityForm] = useState(false);
  const [getAllEntities, setGetAllEntities] = useState([]);
  const [localEntityData, setLocalEntityData] = useState({
    name: '',
    number: '',
    _id: '',
  });
  const [newEntity, setNewEntity] = useState({ name: '', number: '' });
  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');

  const normalizeJob = (raw) => {
    if (!raw) return raw;
    const id = raw.id || raw._id || '';
    return {
      ...raw,
      id,
    };
  };

  const getNextStatus = (status) => {
    if (status === 'todo') return 'in-progress';
    if (status === 'in-progress') return 'complete';
    if (status === 'complete') return 'handover';
    return 'handover';
  };

  const [form, setForm] = useState({
    customerName: '',
    customerNumber: '',
    customerType: 'existing', // existing | new
    company: '', // company name (for display)
    companyId: '', // backend requires company _id
    model: '', // model name (for display)
    modelId: '', // backend requires model _id
    receivedDate: new Date().toISOString().split('T')[0], // default to today
    deliveryDate: '',
    faultIssue: '',
    isPhoneReceived: false,
    isDeadApproval: false,
    parts: [], // [{id,name,price}]
    estimatedAmount: 0,
    paymentType: 'full', // full | credit
    advance: 0,
    payLate: 0,
    status: 'todo', // todo | in-progress | complete | handover
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/api/repair/repair-jobs');
        const list = (res?.data?.data || []).map(normalizeJob);
        setJobs(list);
      } catch (error) {
        console.error('Failed to fetch repair jobs', error);
        setJobs([]);
        toast.error('Failed to load repair jobs');
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const getAllEnityNameAndId = async () => {
      try {
        const response = await api.get('/api/person/nameAndId');
        setGetAllEntities(response?.data || []);
      } catch (error) {
        console.error('Failed to load entities', error);
      }
    };
    getAllEnityNameAndId();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/api/company/all-companies');
      setCompanies(response?.data?.companies || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      toast.error('Failed to load companies');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedCompanyId) {
        setModels([]);
        return;
      }
      try {
        const response = await api.get(
          `/api/company/models/${selectedCompanyId}`
        );
        setModels(response?.data.models || []);
      } catch (error) {
        console.error('Failed to fetch models:', error);
        setModels([]);
        toast.error('Failed to load models');
      }
    };
    fetchModels();
  }, [selectedCompanyId]);

  // no local persistence; backend is source of truth

  const getAccessories = async () => {
    try {
      setLoadingAccessories(true);
      const res = await api.get('/api/accessory/');
      setAccessories(res?.data || []);
    } catch (e) {
      console.error('Failed to load accessories', e);
      setAccessories([]);
    } finally {
      setLoadingAccessories(false);
    }
  };

  const total = useMemo(() => {
    return Number(form.estimatedAmount || 0);
  }, [form.estimatedAmount]);

  const resetForm = () => {
    setForm({
      customerName: '',
      customerNumber: '',
      customerType: 'existing',
      company: '',
      companyId: '',
      model: '',
      modelId: '',
      receivedDate: new Date().toISOString().split('T')[0],
      deliveryDate: '',
      faultIssue: '',
      isPhoneReceived: false,
      isDeadApproval: false,
      parts: [],
      estimatedAmount: 0,
      paymentType: 'full',
      advance: 0,
      payLate: 0,
      status: 'todo',
    });
    setNewEntity({ name: '', number: '' });
    setLocalEntityData({ name: '', number: '', _id: '' });
    setShowNewEntityForm(false);
    setSelectedCompanyId('');
    setModels([]);
  };

  const openCreate = async () => {
    if (accessories.length === 0) await getAccessories();
    setShowModal(true);
  };

  const addPart = () => {
    setForm((prev) => ({
      ...prev,
      parts: [...prev.parts, { id: '', name: '', price: 0 }],
    }));
  };

  const updatePart = (index, patch) => {
    setForm((prev) => {
      const next = [...prev.parts];
      next[index] = { ...next[index], ...patch };
      return { ...prev, parts: next };
    });
  };

  const removePart = (index) => {
    setForm((prev) => {
      const next = prev.parts.filter((_, i) => i !== index);
      return { ...prev, parts: next };
    });
  };

  const createJob = () => {
    const customerName = String(form.customerName ?? '').trim();
    const customerNumber = String(form.customerNumber ?? '').trim();
    if (!customerName || !customerNumber) {
      alert('Please enter customer name and number');
      return;
    }
    if (!selectedCompanyId || !form.modelId) {
      alert('Please select company and model');
      return;
    }
    if (!form.receivedDate) {
      alert('Please select received date');
      return;
    }
    if (!form.deliveryDate) {
      alert('Please select delivery date');
      return;
    }
    if (!form.faultIssue) {
      alert('Please enter fault/issue');
      return;
    }
    if (form.estimatedAmount <= 0) {
      alert('Please enter estimated amount');
      return;
    }
    if (form.paymentType === 'credit') {
      if (form.advance < 0) {
        alert('Advance and remaining amount cannot be negative');
        return;
      }
    }
    const payload = {
      customerName,
      customerNumber,
      customerType: form.customerType,
      company: selectedCompanyId, // send company _id
      model: form.modelId, // send model _id
      receivedDate: form.receivedDate,
      deliveryDate: form.deliveryDate,
      faultIssue: form.faultIssue,
      isPhoneReceived: form.isPhoneReceived,
      isDeadApproval: form.isDeadApproval,
      parts: form.parts,
      estimatedAmount: form.estimatedAmount,
      paymentType: form.paymentType,
      advance: form.paymentType === 'credit' ? form.advance : undefined,
    };
    api
      .post('/api/repair/repair-job', payload)
      .then((res) => {
        const created = normalizeJob(res?.data?.data);
        if (created && created.id) {
          setJobs((prev) => [created, ...prev]);
        }
        setShowModal(false);
        resetForm();
        toast.success('Repair job created');
      })
      .catch((err) => {
        console.error('Failed to create repair job', err);
        toast.error(
          err?.response?.data?.error || 'Failed to create repair job'
        );
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1
        style={{
          margin: '0 0 16px 0',
          fontSize: 24,
          fontWeight: 800,
          color: '#111827',
          letterSpacing: 0.2,
        }}
      >
        Repair Jobs
      </h1>

      <div style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
        <button
          onClick={openCreate}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '10px 18px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
          }}
        >
          New Job
        </button>
      </div>

      {showModal && (
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
          role="button"
          tabIndex={0}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              setShowModal(false);
            }
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 8,
              width: '95vw',
              maxWidth: 800,
              maxHeight: '90vh',
              overflow: 'auto',
              padding: 16,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb',
              }}
            >
              <h2 style={{ margin: 0, fontWeight: 700 }}>New Repair Job</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: '#6b7280',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 12px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <label
                  style={{ fontSize: 14, color: '#111827', fontWeight: 600 }}
                >
                  Customer
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewEntityForm(false);
                      setForm((p) => ({ ...p, customerType: 'existing' }));
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      background: !showNewEntityForm
                        ? '#e5e7eb'
                        : 'transparent',
                      border: '1px solid #d1d5db',
                      fontWeight: 500,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Select Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewEntityForm(true);
                      setForm((p) => ({ ...p, customerType: 'new' }));
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      background: showNewEntityForm ? '#e5e7eb' : 'transparent',
                      border: '1px solid #d1d5db',
                      fontWeight: 500,
                      fontSize: 13,
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
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 12,
                  }}
                >
                  <div>
                    <label style={{ fontSize: 12, color: '#6b7280' }}>
                      Name
                    </label>
                    <input
                      value={newEntity.name}
                      onChange={(e) => {
                        const updated = { ...newEntity, name: e.target.value };
                        setNewEntity(updated);
                        setLocalEntityData({
                          name: updated.name,
                          number: updated.number,
                          _id: '',
                        });
                        setForm((p) => ({
                          ...p,
                          customerName: updated.name,
                          customerNumber: updated.number,
                        }));
                      }}
                      placeholder="Customer name"
                      style={{
                        width: '100%',
                        padding: 8,
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#6b7280' }}>
                      Number
                    </label>
                    <input
                      value={newEntity.number}
                      onChange={(e) => {
                        const updated = {
                          ...newEntity,
                          number: e.target.value,
                        };
                        setNewEntity(updated);
                        setLocalEntityData({
                          name: updated.name,
                          number: updated.number,
                          _id: '',
                        });
                        setForm((p) => ({
                          ...p,
                          customerName: updated.name,
                          customerNumber: updated.number,
                        }));
                      }}
                      placeholder="03XX-XXXXXXX"
                      style={{
                        width: '100%',
                        padding: 8,
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <CustomSelect
                  value={localEntityData._id}
                  onChange={(selectedOption) => {
                    const selectedEntity = getAllEntities.find(
                      (entity) => entity._id === selectedOption?.value
                    );
                    const entityPayload = selectedEntity || {
                      name: '',
                      number: '',
                      _id: '',
                    };
                    setLocalEntityData(entityPayload);
                    setForm((p) => ({
                      ...p,
                      customerName: entityPayload.name || '',
                      customerNumber: entityPayload.number || '',
                    }));
                  }}
                  options={(getAllEntities || []).map((entity) => ({
                    value: entity._id,
                    label: `${entity.name} || ${entity.number}`,
                  }))}
                />
              )}
            </div>

            {/* Company and Model */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <label style={{ fontSize: 12, color: '#6b7280' }}>
                  Company
                </label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => {
                    const companyId = e.target.value;
                    const selectedOption = e.target.selectedOptions[0];
                    const companyName =
                      selectedOption.getAttribute('data-name') || '';
                    setSelectedCompanyId(companyId);
                    setForm((p) => ({
                      ...p,
                      company: companyName,
                      companyId,
                      model: '', // reset model when company changes
                      modelId: '',
                    }));
                  }}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                  }}
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option
                      key={company._id}
                      value={company._id}
                      data-name={company.name}
                    >
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Model</label>
                <select
                  value={form.modelId}
                  onChange={(e) => {
                    const modelId = e.target.value;
                    const m = models.find((mm) => mm._id === modelId);
                    setForm((p) => ({ ...p, modelId, model: m?.name || '' }));
                  }}
                  disabled={!selectedCompanyId || models.length === 0}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    background:
                      !selectedCompanyId || models.length === 0
                        ? '#f3f4f6'
                        : 'white',
                  }}
                >
                  <option value="">
                    {!selectedCompanyId
                      ? 'Select Company First'
                      : models.length === 0
                      ? 'No Models Available'
                      : 'Select Model'}
                  </option>
                  {models.map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <label style={{ fontSize: 12, color: '#6b7280' }}>
                  Received Date
                </label>
                <input
                  type="date"
                  value={form.receivedDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, receivedDate: e.target.value }))
                  }
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280' }}>
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={form.deliveryDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, deliveryDate: e.target.value }))
                  }
                  min={form.receivedDate}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                  }}
                />
              </div>
            </div>

            {/* Fault/Issue */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#6b7280' }}>
                Fault/Issue
              </label>
              <textarea
                value={form.faultIssue}
                onChange={(e) =>
                  setForm((p) => ({ ...p, faultIssue: e.target.value }))
                }
                placeholder="Describe the fault or issue"
                rows={3}
                style={{
                  width: '100%',
                  padding: 8,
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Checkboxes */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <label style={{ fontSize: 12, color: '#6b7280' }}>
                  Phone/Item Received
                </label>
                <input
                  type="checkbox"
                  checked={form.isPhoneReceived}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      isPhoneReceived: e.target.checked,
                    }))
                  }
                />
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <label style={{ fontSize: 12, color: '#6b7280' }}>
                  Dead Approval
                </label>
                <input
                  type="checkbox"
                  checked={form.isDeadApproval}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      isDeadApproval: e.target.checked,
                    }))
                  }
                />
              </div>
            </div>

            <div
              style={{
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0 }}>Parts</h3>
              <button
                onClick={addPart}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 10px',
                  cursor: 'pointer',
                }}
              >
                + Add Part
              </button>
            </div>

            {loadingAccessories && (
              <div style={{ marginBottom: 8 }}>Loading accessories...</div>
            )}
            {form.parts.length === 0 && !loadingAccessories && (
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
                No parts added yet.
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 140px 80px 60px',
                gap: 8,
              }}
            >
              {form.parts.map((part, idx) => {
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'contents',
                    }}
                  >
                    <select
                      value={part.id}
                      onChange={(e) => {
                        const id = e.target.value;
                        const acc = accessories.find(
                          (a) => (a._id || a.id) === id
                        );
                        updatePart(idx, {
                          id,
                          name: acc ? acc.accessoryName || acc.name || '' : '',
                          price: acc ? Number(acc.perPiecePrice || 0) : 0,
                        });
                      }}
                      style={{
                        padding: 8,
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                      }}
                    >
                      <option value="">Select part</option>
                      {accessories.map((acc) => (
                        <option
                          key={acc._id || acc.id}
                          value={acc._id || acc.id}
                        >
                          {(acc.accessoryName || acc.name) +
                            (acc.perPiecePrice
                              ? ` — Rs. ${acc.perPiecePrice}`
                              : '')}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={part.price}
                      onChange={(e) =>
                        updatePart(idx, { price: Number(e.target.value || 0) })
                      }
                      placeholder="Price"
                      style={{
                        width: '100%',
                        padding: 8,
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 600,
                      }}
                    >
                      Rs. {Number(part.price || 0).toLocaleString()}
                    </div>

                    <button
                      onClick={() => removePart(idx)}
                      style={{
                        background: '#fee2e2',
                        color: '#b91c1c',
                        border: '1px solid #fecaca',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      X
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Payment Section */}
            <div style={{ marginTop: 16, marginBottom: 12 }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Payment</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280' }}>
                    Estimated Amount
                  </label>
                  <input
                    type="number"
                    value={form.estimatedAmount}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        estimatedAmount: Number(e.target.value || 0),
                      }))
                    }
                    placeholder="0"
                    min="0"
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #e5e7eb',
                      borderRadius: 6,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6b7280' }}>
                    Payment Type
                  </label>
                  <select
                    value={form.paymentType}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        paymentType: e.target.value,
                        advance: 0,
                        payLate: 0,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #e5e7eb',
                      borderRadius: 6,
                    }}
                  >
                    <option value="full">Full Payment</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
              </div>

              {form.paymentType === 'credit' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 12,
                  }}
                >
                  <div>
                    <label style={{ fontSize: 12, color: '#6b7280' }}>
                      Advance
                    </label>
                    <input
                      type="number"
                      value={form.advance}
                      onChange={(e) => {
                        const advance = Number(e.target.value || 0);
                        setForm((p) => ({
                          ...p,
                          advance,
                          payLate: p.estimatedAmount - advance,
                        }));
                      }}
                      placeholder="0"
                      min="0"
                      max={form.estimatedAmount}
                      style={{
                        width: '100%',
                        padding: 8,
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#6b7280' }}>
                      Remaining (Pay Later)
                    </label>
                    <input
                      type="number"
                      value={form.payLate}
                      readOnly
                      style={{
                        width: '100%',
                        padding: 8,
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        background: '#f3f4f6',
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
                gap: 12,
                marginTop: 16,
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 14, color: '#374151' }}>
                <strong>Estimated Amount:</strong> Rs.{' '}
                {total.toLocaleString()}
              </div>
              <button
                onClick={createJob}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 16px',
                  cursor: 'pointer',
                }}
              >
                Create Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jobs List - Status Based */}
      <div style={{ marginTop: 20 }}>
        <h2
          style={{
            margin: '0 0 20px 0',
            fontSize: 18,
            fontWeight: 700,
            color: '#111827',
          }}
        >
          Repair Board
        </h2>
        {jobs.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No jobs created yet.</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
            }}
          >
            {['todo', 'in-progress', 'complete', 'handover'].map((status) => {
              const statusJobs = jobs.filter(
                (job) => job.status === status
              );
              const statusLabels = {
                todo: 'To Do',
                'in-progress': 'In Progress',
                complete: 'Complete',
                handover: 'Handover',
              };
              const statusColors = {
                todo: { bg: '#fef3c7', border: '#fde68a', text: '#92400e' },
                'in-progress': { bg: '#dbeafe', border: '#bfdbfe', text: '#1e3a8a' },
                complete: { bg: '#d1fae5', border: '#a7f3d0', text: '#065f46' },
                handover: { bg: '#e0e7ff', border: '#c7d2fe', text: '#3730a3' },
              };
              const colors = statusColors[status] || statusColors.todo;

              return (
                <div
                  key={status}
                  style={{
                    border: `2px solid ${colors.border}`,
                    borderRadius: 8,
                    background: colors.bg,
                    padding: 12,
                    minHeight: 400,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: colors.text,
                      marginBottom: 12,
                      paddingBottom: 8,
                      borderBottom: `2px solid ${colors.border}`,
                    }}
                  >
                    {statusLabels[status]} ({statusJobs.length})
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {statusJobs.length === 0 ? (
                      <div
                        style={{
                          fontSize: 13,
                          color: '#6b7280',
                          textAlign: 'center',
                          padding: 20,
                        }}
                      >
                        No jobs
                      </div>
                    ) : (
                      statusJobs.map((job) => (
                        <div
                          key={job.id}
                          role="button"
                          tabIndex={0}
                          style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: 6,
                            padding: 10,
                            background: '#fff',
                            cursor: 'default',
                          }}
                          onKeyDown={async (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                            }
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: 6,
                            }}
                          >
                            <div style={{ fontWeight: 700, fontSize: 14 }}>
                              {job.customerName}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: '#6b7280',
                              }}
                            >
                              {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: '#374151',
                              marginBottom: 4,
                            }}
                          >
                            {job.customerNumber}
                          </div>
                          {(job.company || job.model) && (
                            <div
                              style={{
                                fontSize: 11,
                                color: '#6b7280',
                                marginBottom: 4,
                              }}
                            >
                              {(job.company && (job.company.name || job.company)) || ''}
                              {job.model || job.model?.name ?
                                ` - ${(job.model && (job.model.name || job.model)) || ''}`
                                : ''}
                            </div>
                          )}
                          {job.faultIssue && (
                            <div
                              style={{
                                fontSize: 11,
                                color: '#6b7280',
                                marginBottom: 4,
                                fontStyle: 'italic',
                              }}
                            >
                              {job.faultIssue.substring(0, 50)}
                              {job.faultIssue.length > 50 ? '...' : ''}
                            </div>
                          )}
                          <div
                            style={{
                              display: 'flex',
                              gap: 4,
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              marginBottom: 6,
                            }}
                          >
                            <span
                              style={{
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                background: job.isPhoneReceived
                                  ? '#dcfce7'
                                  : '#fee2e2',
                                color: job.isPhoneReceived ? '#065f46' : '#991b1b',
                              }}
                            >
                              {job.isPhoneReceived ? 'Received' : 'Not Received'}
                            </span>
                            <span
                              style={{
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                background: job.isDeadApproval
                                  ? '#fee2e2'
                                  : '#dcfce7',
                                color: job.isDeadApproval ? '#991b1b' : '#065f46',
                              }}
                            >
                              {job.isDeadApproval ? 'Dead' : 'OK'}
                            </span>
                            <span
                              style={{
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                background: '#eef2ff',
                                color: '#3730a3',
                              }}
                            >
                              {job.paymentType === 'full' ? 'Full' : 'Credit'}
                            </span>
                          </div>
                          <div
                            style={{
                              textAlign: 'right',
                              marginTop: 6,
                              fontWeight: 600,
                              fontSize: 12,
                            }}
                          >
                            Rs. {Number(job.estimatedAmount || 0).toLocaleString()}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginTop: 8,
                            }}
                          >
                            <div style={{ fontSize: 12, color: '#6b7280' }}>
                              Next: {getNextStatus(job.status)}
                            </div>
                            <button
                              disabled={job.status === 'handover'}
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                try {
                                  const res = await api.patch(
                                    `/api/repair/repair-job/${job.id}/toggle-status`
                                  );
                                  const updatedJob = normalizeJob(res?.data?.data);
                                  if (updatedJob && updatedJob.id) {
                                    setJobs((prev) =>
                                      prev.map((j) => (j.id === job.id ? updatedJob : j))
                                    );
                                    const msg = res?.data?.message || `Moved to ${updatedJob.status}`;
                                    toast.success(msg);
                                  }
                                } catch (err) {
                                  console.error('Failed to toggle status', err);
                                  toast.error('Failed to update status');
                                }
                              }}
                              style={{
                                background: job.status === 'handover' ? '#e5e7eb' : '#3b82f6',
                                color: job.status === 'handover' ? '#6b7280' : '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '6px 10px',
                                cursor: job.status === 'handover' ? 'not-allowed' : 'pointer',
                              }}
                              title={
                                job.status === 'handover'
                                  ? 'Already handed over'
                                  : 'Advance to next status'
                              }
                            >
                              Next
                            </button>
                          </div>
                          {job.receivedDate && (
                            <div
                              style={{
                                fontSize: 10,
                                color: '#6b7280',
                                marginTop: 4,
                              }}
                            >
                              R: {new Date(job.receivedDate).toLocaleDateString()}
                              {job.deliveryDate &&
                                ` | D: ${new Date(job.deliveryDate).toLocaleDateString()}`}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Repairing;
