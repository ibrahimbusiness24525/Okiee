import { useEffect, useMemo, useState } from 'react';
import {
  api,
  toggleRepairJobStatusPrevious,
  updateRepairJob,
  deleteRepairJob,
  returnRepairJob,
} from '../../../api/api';
import { toast } from 'react-toastify';
import CustomSelect from 'components/CustomSelect';
import RepairJobInvoice from 'components/Invoice/RepairJobInvoice';

const Repairing = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedJobForInvoice, setSelectedJobForInvoice] = useState(null);
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
  const [handoverFilters, setHandoverFilters] = useState({
    search: '',
    fromDate: '',
    toDate: '',
  });
  // Bottom \"table\" (handover) default: show 10 rows, then increment with button
  const [handoverDisplayLimit, setHandoverDisplayLimit] = useState(10);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returningJob, setReturningJob] = useState(null);
  const [returnForm, setReturnForm] = useState({
    note: '',
  });

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

  const getPreviousStatus = (status) => {
    if (status === 'handover') return 'complete';
    if (status === 'complete') return 'in-progress';
    if (status === 'in-progress') return 'todo';
    return 'todo'; // stays at todo if already there
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

  const getJobProfit = (job) => {
    if (!job) return 0;
    if (typeof job.profit === 'number') return Math.max(0, job.profit);
    // Fallback: approximate from estimatedAmount and parts, in case profit is missing
    const estimatedAmount = Number(job.estimatedAmount || 0);
    const totalPartsCost = Array.isArray(job.parts)
      ? job.parts.reduce((sum, part) => sum + Number(part?.price || 0), 0)
      : 0;
    const profit = estimatedAmount - totalPartsCost;
    return profit > 0 ? profit : 0;
  };

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

  const openEdit = async (job) => {
    if (accessories.length === 0) await getAccessories();
    setEditingJob(job);
    // Populate form with job data
    const companyId = job.company?._id || job.company || '';
    setSelectedCompanyId(companyId);

    // Fetch models for the company
    if (companyId) {
      try {
        const response = await api.get(`/api/company/models/${companyId}`);
        setModels(response?.data.models || []);
      } catch (error) {
        console.error('Failed to fetch models:', error);
        setModels([]);
      }
    }

    setForm({
      customerName: job.customerName || '',
      customerNumber: job.customerNumber || '',
      customerType: 'existing',
      company: job.company?.name || job.company || '',
      companyId: companyId,
      model: job.model?.name || job.model || '',
      modelId: job.model?._id || job.model || '',
      receivedDate: job.receivedDate
        ? new Date(job.receivedDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      deliveryDate: job.deliveryDate
        ? new Date(job.deliveryDate).toISOString().split('T')[0]
        : '',
      faultIssue: job.faultIssue || '',
      isPhoneReceived: job.isPhoneReceived || false,
      isDeadApproval: job.isDeadApproval || false,
      parts: job.parts || [],
      estimatedAmount: job.estimatedAmount || 0,
      paymentType: job.paymentType || 'full',
      advance: job.advance || 0,
      payLate: (job.estimatedAmount || 0) - (job.advance || 0),
      status: job.status || 'todo',
    });

    // Set entity data if customer exists
    const existingEntity = getAllEntities.find(
      (e) => e.name === job.customerName && e.number === job.customerNumber
    );
    if (existingEntity) {
      setLocalEntityData(existingEntity);
    } else {
      setLocalEntityData({
        name: job.customerName || '',
        number: job.customerNumber || '',
        _id: '',
      });
      setShowNewEntityForm(false);
    }

    setShowEditModal(true);
  };

  const updateJob = () => {
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
      company: selectedCompanyId,
      model: form.modelId,
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

    updateRepairJob(editingJob.id, payload)
      .then((res) => {
        const updated = normalizeJob(res?.data?.data);
        if (updated && updated.id) {
          setJobs((prev) =>
            prev.map((j) => (j.id === editingJob.id ? updated : j))
          );
        }
        setShowEditModal(false);
        resetForm();
        setEditingJob(null);
        toast.success('Repair job updated successfully');
      })
      .catch((err) => {
        console.error('Failed to update repair job', err);
        toast.error(
          err?.response?.data?.message || 'Failed to update repair job'
        );
      });
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

  const handleDeleteJob = async (job) => {
    if (!job?.id) return;
    const confirmed = window.confirm(
      'Are you sure you want to delete this repair job?'
    );
    if (!confirmed) return;

    try {
      const res = await deleteRepairJob(job.id);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      toast.success(res?.data?.message || 'Repair job deleted successfully');
    } catch (err) {
      console.error('Failed to delete repair job', err);
      // If backend says not found, remove it locally as well
      if (err?.response?.status === 404) {
        setJobs((prev) => prev.filter((j) => j.id !== job.id));
      }
      toast.error(
        err?.response?.data?.message || 'Failed to delete repair job'
      );
    }
  };

  const handleOpenReturnModal = (job) => {
    if (job.status !== 'handover') {
      toast.error('Only jobs with status "handover" can be returned');
      return;
    }
    setReturningJob(job);
    setReturnForm({ note: '' });
    setShowReturnModal(true);
  };

  const handleReturnJob = async () => {
    if (!returningJob?.id) {
      toast.error('Repair job ID is required');
      return;
    }

    // Validate that note is provided (required)
    if (!returnForm.note.trim()) {
      toast.error('Note is required for return');
      return;
    }

    try {
      const returnData = {
        note: returnForm.note.trim(),
      };

      const response = await returnRepairJob(returningJob.id, returnData);
      toast.success(
        response.data.message || 'Repair job returned successfully'
      );

      // Update the job in the list
      const updatedJob = normalizeJob(response.data.data);
      if (updatedJob && updatedJob.id) {
        setJobs((prev) =>
          prev.map((j) => (j.id === returningJob.id ? updatedJob : j))
        );
      }

      setShowReturnModal(false);
      setReturningJob(null);
      setReturnForm({ note: '' });
    } catch (error) {
      console.error('Error returning repair job:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to return repair job'
      );
    }
  };

  return (
    <div
      style={{
        padding: 20,
        backgroundColor: '#f8f9fa', // match ForSupport page background
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          margin: '0 0 16px 0',
          fontSize: 24,
          fontWeight: 800,
          color: '#2c3e50', // ForSupport heading color
          letterSpacing: 0.2,
        }}
      >
        Repair Jobs
      </h1>

      <div style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
        <button
          onClick={openCreate}
          style={{
            background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '10px 18px',
            cursor: 'pointer',
            boxShadow: '0 6px 14px rgba(44, 62, 80, 0.35)',
            fontWeight: 600,
            letterSpacing: 0.3,
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
                  background: '#27ae60', // ForSupport success green
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
                <strong>Estimated Amount:</strong> Rs. {total.toLocaleString()}
              </div>
              <button
                onClick={createJob}
                style={{
                  background: '#3498db', // ForSupport primary blue
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

      {/* Edit Modal */}
      {showEditModal && editingJob && (
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
            if (e.target === e.currentTarget) {
              setShowEditModal(false);
              setEditingJob(null);
              resetForm();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              setShowEditModal(false);
              setEditingJob(null);
              resetForm();
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
              <h2 style={{ margin: 0, fontWeight: 700 }}>Edit Repair Job</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingJob(null);
                  resetForm();
                }}
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

            {/* Same form fields as create modal - reuse the form structure */}
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
                      model: '',
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
                  background: '#27ae60',
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
                <strong>Estimated Amount:</strong> Rs. {total.toLocaleString()}
              </div>
              <button
                onClick={updateJob}
                style={{
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 16px',
                  cursor: 'pointer',
                }}
              >
                Update Job
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
          <>
            {/* First three columns: todo, in-progress, complete */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 20,
                marginBottom: 24,
              }}
            >
              {['todo', 'in-progress', 'complete'].map((status) => {
                const statusJobs = jobs.filter((job) => job.status === status);
                const statusLabels = {
                  todo: 'To Do',
                  'in-progress': 'In Progress',
                  complete: 'Complete',
                };
                const statusColors = {
                  // Use ForSupport palette
                  todo: { bg: '#fef5e7', border: '#e67e22', text: '#e67e22' },
                  'in-progress': {
                    bg: '#ebf5fb',
                    border: '#3498db',
                    text: '#3498db',
                  },
                  complete: {
                    bg: '#e9f7ef',
                    border: '#27ae60',
                    text: '#27ae60',
                  },
                };
                const colors = statusColors[status] || statusColors.todo;

                // Regular UI for other columns
                return (
                  <div
                    key={status}
                    style={{
                      borderRadius: 16,
                      background: `linear-gradient(135deg, ${colors.bg} 0%, #ffffff 65%)`,
                      padding: 16,
                      minHeight: 420,
                      boxShadow:
                        '0 10px 25px rgba(15, 23, 42, 0.18), 0 4px 10px rgba(15, 23, 42, 0.08)',
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 20,
                        color: colors.text,
                        marginBottom: 16,
                        paddingBottom: 10,
                        borderBottom: `2px solid ${colors.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{statusLabels[status]}</span>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: 999,
                          backgroundColor: '#11182710',
                          color: colors.text,
                        }}
                      >
                        {statusJobs.length}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14,
                        flex: 1,
                        overflowY: 'auto',
                        paddingRight: 4,
                      }}
                    >
                      {statusJobs.length === 0 ? (
                        <div
                          style={{
                            fontSize: 14,
                            color: '#6b7280',
                            textAlign: 'center',
                            padding: 24,
                            borderRadius: 12,
                            backgroundColor: '#f9fafb90',
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
                              borderRadius: 12,
                              padding: 12,
                              background: '#fff',
                              boxShadow:
                                '0 4px 10px rgba(15, 23, 42, 0.12), 0 1px 3px rgba(15, 23, 42, 0.08)',
                              cursor: 'default',
                              transition:
                                'transform 0.15s ease, box-shadow 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                'translateY(-2px)';
                              e.currentTarget.style.boxShadow =
                                '0 10px 18px rgba(15, 23, 42, 0.20), 0 3px 6px rgba(15, 23, 42, 0.14)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow =
                                '0 4px 10px rgba(15, 23, 42, 0.12), 0 1px 3px rgba(15, 23, 42, 0.08)';
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
                                marginBottom: 8,
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 800,
                                  fontSize: 16,
                                  color: '#111827',
                                }}
                              >
                                {job.customerName}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: '#6b7280',
                                }}
                              >
                                {new Date(job.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: '#374151',
                                marginBottom: 4,
                              }}
                            >
                              {job.customerNumber}
                            </div>
                            {(job.company || job.model) && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: '#6b7280',
                                  marginBottom: 4,
                                }}
                              >
                                {(job.company &&
                                  (job.company.name || job.company)) ||
                                  ''}
                                {job.model || job.model?.name
                                  ? ` - ${(job.model && (job.model.name || job.model)) || ''}`
                                  : ''}
                              </div>
                            )}
                            {job.faultIssue && (
                              <div
                                style={{
                                  fontSize: 12,
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
                                marginBottom: 8,
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
                                  color: job.isPhoneReceived
                                    ? '#065f46'
                                    : '#991b1b',
                                }}
                              >
                                {job.isPhoneReceived
                                  ? 'Received'
                                  : 'Not Received'}
                              </span>
                              <span
                                style={{
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  fontSize: 10,
                                  background: job.isDeadApproval
                                    ? '#fee2e2'
                                    : '#dcfce7',
                                  color: job.isDeadApproval
                                    ? '#991b1b'
                                    : '#065f46',
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
                              <div>
                                Rs.{' '}
                                {Number(
                                  job.estimatedAmount || 0
                                ).toLocaleString()}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: '#10b981',
                                  marginTop: 2,
                                }}
                              >
                                Profit: Rs. {getJobProfit(job).toLocaleString()}
                              </div>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 8,
                                gap: 8,
                              }}
                            >
                              <div style={{ fontSize: 12, color: '#6b7280' }}>
                                {job.status !== 'todo' && (
                                  <span>
                                    Prev: {getPreviousStatus(job.status)}
                                  </span>
                                )}
                                {job.status !== 'todo' &&
                                  job.status !== 'handover' &&
                                  ' | '}
                                {job.status !== 'handover' && (
                                  <span>Next: {getNextStatus(job.status)}</span>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: 6 }}>
                                {job.status !== 'todo' && (
                                  <button
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      try {
                                        const res =
                                          await toggleRepairJobStatusPrevious(
                                            job.id
                                          );
                                        const updatedJob = normalizeJob(
                                          res?.data?.data
                                        );
                                        if (updatedJob && updatedJob.id) {
                                          setJobs((prev) =>
                                            prev.map((j) =>
                                              j.id === job.id ? updatedJob : j
                                            )
                                          );
                                          const msg =
                                            res?.data?.message ||
                                            `Reverted to ${updatedJob.status}`;
                                          toast.success(msg);
                                        }
                                      } catch (err) {
                                        console.error(
                                          'Failed to revert status',
                                          err
                                        );
                                        toast.error(
                                          err?.response?.data?.message ||
                                            'Failed to revert status'
                                        );
                                      }
                                    }}
                                    style={{
                                      background: '#6b7280',
                                      color: '#fff',
                                      border: 'none',
                                      borderRadius: 6,
                                      padding: '6px 10px',
                                      cursor: 'pointer',
                                      fontSize: 11,
                                    }}
                                    title="Revert to previous status"
                                  >
                                    Prev
                                  </button>
                                )}
                                <button
                                  disabled={job.status === 'handover'}
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (
                                      job.status === 'complete' &&
                                      !window.confirm(
                                        'Are you sure you want to mark this job as handed over?'
                                      )
                                    ) {
                                      return;
                                    }
                                    try {
                                      const res = await api.patch(
                                        `/api/repair/repair-job/${job.id}/toggle-status`
                                      );
                                      const updatedJob = normalizeJob(
                                        res?.data?.data
                                      );
                                      if (updatedJob && updatedJob.id) {
                                        setJobs((prev) =>
                                          prev.map((j) =>
                                            j.id === job.id ? updatedJob : j
                                          )
                                        );
                                        const msg =
                                          res?.data?.message ||
                                          `Moved to ${updatedJob.status}`;
                                        toast.success(msg);
                                      }
                                    } catch (err) {
                                      console.error(
                                        'Failed to toggle status',
                                        err
                                      );
                                      toast.error('Failed to update status');
                                    }
                                  }}
                                  style={{
                                    background:
                                      job.status === 'handover'
                                        ? '#bdc3c7'
                                        : '#3498db',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 6,
                                    padding: '6px 10px',
                                    cursor:
                                      job.status === 'handover'
                                        ? 'not-allowed'
                                        : 'pointer',
                                    fontSize: 11,
                                  }}
                                  title={
                                    job.status === 'handover'
                                      ? 'Already handed over'
                                      : job.status === 'complete'
                                        ? 'Mark as handed over'
                                        : 'Advance to next status'
                                  }
                                >
                                  {job.status === 'complete'
                                    ? 'Handover'
                                    : 'Next'}
                                </button>
                                {(job.status === 'in-progress' ||
                                  job.status === 'todo') && (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      openEdit(job);
                                    }}
                                    style={{
                                      background: '#10b981',
                                      color: '#fff',
                                      border: 'none',
                                      borderRadius: 6,
                                      padding: '6px 10px',
                                      cursor: 'pointer',
                                      fontSize: 11,
                                    }}
                                    title="Edit repair job"
                                  >
                                    Edit
                                  </button>
                                )}
                                {job.status === 'handover' && (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleOpenReturnModal(job);
                                    }}
                                    style={{
                                      background: '#f59e0b',
                                      color: '#fff',
                                      border: 'none',
                                      borderRadius: 6,
                                      padding: '6px 10px',
                                      cursor: 'pointer',
                                      fontSize: 11,
                                    }}
                                    title="Return repair job"
                                  >
                                    Return
                                  </button>
                                )}
                                {job.status === 'todo' && (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDeleteJob(job);
                                    }}
                                    style={{
                                      background: '#ef4444',
                                      color: '#fff',
                                      border: 'none',
                                      borderRadius: 6,
                                      padding: '6px 10px',
                                      cursor: 'pointer',
                                      fontSize: 11,
                                    }}
                                    title="Delete repair job"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>
                            {job.receivedDate && (
                              <div
                                style={{
                                  fontSize: 10,
                                  color: '#6b7280',
                                  marginTop: 4,
                                }}
                              >
                                R:{' '}
                                {new Date(
                                  job.receivedDate
                                ).toLocaleDateString()}
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

            {/* Handover Section - Card List with Filters */}
            {(() => {
              const handoverJobs = jobs.filter(
                (job) => job.status === 'handover'
              );
              const filteredHandoverJobs = handoverJobs.filter((job) => {
                const query = handoverFilters.search
                  ? handoverFilters.search.toLowerCase().trim()
                  : '';

                if (query) {
                  const number = String(job.customerNumber || '')
                    .toLowerCase()
                    .trim();
                  const name = String(job.customerName || '')
                    .toLowerCase()
                    .trim();
                  const modelText = `${String(
                    job.company?.name || job.company || ''
                  )} ${String(job.model?.name || job.model || '')}`
                    .toLowerCase()
                    .trim();

                  const matches =
                    number.includes(query) ||
                    name.includes(query) ||
                    modelText.includes(query);

                  if (!matches) return false;
                }

                const jobDate =
                  job.deliveryDate || job.receivedDate || job.createdAt;
                if (!jobDate) return true;
                const d = new Date(jobDate).toISOString().split('T')[0];
                if (handoverFilters.fromDate && d < handoverFilters.fromDate) {
                  return false;
                }
                if (handoverFilters.toDate && d > handoverFilters.toDate) {
                  return false;
                }
                return true;
              });
              const handoverColors = {
                // Use a purple from ForSupport palette for handover
                bg: '#f5eef8',
                border: '#8e44ad',
                text: '#8e44ad',
              };

              return (
                <div
                  style={{
                    border: `1px solid ${handoverColors.border}`,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${handoverColors.bg} 0%, #ffffff 65%)`,
                    padding: 20,
                    marginTop: 24,
                    width: '100%',
                    boxShadow:
                      '0 12px 30px rgba(15, 23, 42, 0.18), 0 4px 10px rgba(15, 23, 42, 0.08)',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 22,
                      color: handoverColors.text,
                      marginBottom: 16,
                      paddingBottom: 12,
                      borderBottom: `2px solid ${handoverColors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Handover</span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 999,
                        backgroundColor: '#11182710',
                        color: handoverColors.text,
                      }}
                    >
                      {filteredHandoverJobs.length} / {handoverJobs.length}
                    </span>
                  </div>
                  {/* Filters: single search field for whole table + dates */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search by customer / number / company / model"
                      value={handoverFilters.search}
                      onChange={(e) =>
                        setHandoverFilters((p) => ({
                          ...p,
                          search: e.target.value,
                        }))
                      }
                      style={{
                        flex: '2 1 260px',
                        minWidth: 220,
                        padding: 8,
                        borderRadius: 8,
                        border: '1px solid #d1d5db',
                        fontSize: 13,
                      }}
                    />
                    <input
                      type="date"
                      value={handoverFilters.fromDate}
                      onChange={(e) =>
                        setHandoverFilters((p) => ({
                          ...p,
                          fromDate: e.target.value,
                        }))
                      }
                      style={{
                        flex: '0 1 150px',
                        padding: 8,
                        borderRadius: 8,
                        border: '1px solid #d1d5db',
                        fontSize: 12,
                      }}
                    />
                    <input
                      type="date"
                      value={handoverFilters.toDate}
                      onChange={(e) =>
                        setHandoverFilters((p) => ({
                          ...p,
                          toDate: e.target.value,
                        }))
                      }
                      style={{
                        flex: '0 1 150px',
                        padding: 8,
                        borderRadius: 8,
                        border: '1px solid #d1d5db',
                        fontSize: 12,
                      }}
                    />
                    {(handoverFilters.search ||
                      handoverFilters.fromDate ||
                      handoverFilters.toDate) && (
                      <button
                        type="button"
                        onClick={() =>
                          setHandoverFilters({
                            search: '',
                            fromDate: '',
                            toDate: '',
                          })
                        }
                        style={{
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: 'none',
                          background: '#4b5563',
                          color: '#fff',
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {handoverJobs.length === 0 ? (
                    <div
                      style={{
                        fontSize: 14,
                        color: '#6b7280',
                        textAlign: 'center',
                        padding: 40,
                        background: '#fff',
                        borderRadius: 12,
                      }}
                    >
                      No jobs in handover
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                      }}
                    >
                      {filteredHandoverJobs.length === 0 ? (
                        <div
                          style={{
                            fontSize: 14,
                            color: '#6b7280',
                            textAlign: 'center',
                            padding: 40,
                            background: '#fff',
                            borderRadius: 12,
                          }}
                        >
                          No jobs match current filters
                        </div>
                      ) : (
                        <>
                          {filteredHandoverJobs
                            .slice(0, handoverDisplayLimit || 10)
                            .map((job) => (
                              <div
                                key={job.id}
                                style={{
                                  background:
                                    'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
                                  borderRadius: 12,
                                  padding: 14,
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 12,
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  boxShadow:
                                    '0 4px 10px rgba(15, 23, 42, 0.12), 0 1px 3px rgba(15, 23, 42, 0.08)',
                                }}
                              >
                                <div
                                  style={{ minWidth: 200, flex: '1 1 220px' }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 700,
                                      color: '#111827',
                                      marginBottom: 4,
                                      fontSize: 15,
                                    }}
                                  >
                                    {job.customerName}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 13,
                                      color: '#6b7280',
                                      marginBottom: 4,
                                    }}
                                  >
                                    {job.customerNumber}
                                  </div>
                                  {job.receivedDate && (
                                    <div
                                      style={{
                                        fontSize: 12,
                                        color: '#9ca3af',
                                      }}
                                    >
                                      Delivered:{' '}
                                      {new Date(
                                        job.deliveryDate || job.receivedDate
                                      ).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                                <div
                                  style={{ minWidth: 200, flex: '1 1 220px' }}
                                >
                                  <div
                                    style={{
                                      fontSize: 13,
                                      color: '#374151',
                                    }}
                                  >
                                    {job.company?.name || job.company || 'N/A'}
                                    {job.model?.name || job.model
                                      ? ` - ${job.model?.name || job.model}`
                                      : ''}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    minWidth: 140,
                                    textAlign: 'right',
                                    flex: '0 0 140px',
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 700,
                                      color: '#111827',
                                      fontSize: 15,
                                    }}
                                  >
                                    Rs.{' '}
                                    {Number(
                                      job.estimatedAmount || 0
                                    ).toLocaleString()}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 12,
                                      color: '#10b981',
                                      marginTop: 2,
                                      fontWeight: 600,
                                    }}
                                  >
                                    Profit: Rs.{' '}
                                    {getJobProfit(job).toLocaleString()}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    minWidth: 140,
                                    textAlign: 'center',
                                    flex: '0 0 150px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setSelectedJobForInvoice(job);
                                      setShowInvoiceModal(true);
                                    }}
                                    style={{
                                      background:
                                        'linear-gradient(135deg, #3498db 0%, #34495e 100%)',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: 999,
                                      padding: '8px 18px',
                                      cursor: 'pointer',
                                      fontSize: 13,
                                      fontWeight: 600,
                                      boxShadow:
                                        '0 2px 4px rgba(37, 99, 235, 0.2)',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    Get Invoice
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleOpenReturnModal(job);
                                    }}
                                    style={{
                                      background: '#f59e0b',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: 999,
                                      padding: '8px 18px',
                                      cursor: 'pointer',
                                      fontSize: 13,
                                      fontWeight: 600,
                                      boxShadow:
                                        '0 2px 4px rgba(245, 158, 11, 0.2)',
                                      whiteSpace: 'nowrap',
                                    }}
                                    title="Return repair job"
                                  >
                                    Return
                                  </button>
                                </div>
                              </div>
                            ))}
                          {filteredHandoverJobs.length >
                            (handoverDisplayLimit || 10) && (
                            <div
                              style={{
                                textAlign: 'center',
                                padding: '10px 0',
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setHandoverDisplayLimit(
                                    (prev) => (prev || 10) + 10
                                  )
                                }
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: 8,
                                  border: '1px solid #d1d5db',
                                  background: '#ffffff',
                                  cursor: 'pointer',
                                  fontSize: 13,
                                  color: '#374151',
                                }}
                              >
                                Show more (
                                {filteredHandoverJobs.length -
                                  (handoverDisplayLimit || 10)}{' '}
                                remaining)
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Statistics Cards Section */}
            {(() => {
              const todoJobs = jobs.filter((job) => job.status === 'todo');
              const inProgressJobs = jobs.filter(
                (job) => job.status === 'in-progress'
              );
              const completeJobs = jobs.filter(
                (job) => job.status === 'complete'
              );
              const handoverJobs = jobs.filter(
                (job) => job.status === 'handover'
              );

              const totalDealsDone = completeJobs.length + handoverJobs.length;
              const totalPending = todoJobs.length + inProgressJobs.length;

              const totalRevenue = jobs.reduce(
                (sum, job) => sum + Number(job.estimatedAmount || 0),
                0
              );
              const totalProfit = jobs.reduce(
                (sum, job) => sum + getJobProfit(job),
                0
              );

              const handoverRevenue = handoverJobs.reduce(
                (sum, job) => sum + Number(job.estimatedAmount || 0),
                0
              );
              const handoverProfit = handoverJobs.reduce(
                (sum, job) => sum + getJobProfit(job),
                0
              );

              return (
                <div
                  style={{
                    marginTop: '40px',
                    padding: '30px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow:
                      '0 10px 25px rgba(15, 23, 42, 0.18), 0 4px 10px rgba(15, 23, 42, 0.08)',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '28px',
                      fontWeight: 700,
                      marginBottom: '30px',
                      color: '#2c3e50',
                      textAlign: 'center',
                    }}
                  >
                    📊 Repair Jobs Statistics
                  </h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '20px',
                    }}
                  >
                    {/* Total Deals Done Card */}
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                        borderTop: '4px solid #27ae60',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0px 8px 20px rgba(39, 174, 96, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0px 4px 15px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#7f8c8d',
                              marginBottom: '4px',
                            }}
                          >
                            Total Deals Done
                          </div>
                          <div
                            style={{
                              fontSize: '32px',
                              fontWeight: 700,
                              color: '#2c3e50',
                            }}
                          >
                            {totalDealsDone}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background:
                              'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                          }}
                        >
                          ✅
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#7f8c8d',
                        }}
                      >
                        Complete: {completeJobs.length} | Handover:{' '}
                        {handoverJobs.length}
                      </div>
                    </div>

                    {/* Pending Jobs Card */}
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                        borderTop: '4px solid #e67e22',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0px 8px 20px rgba(230, 126, 34, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0px 4px 15px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#7f8c8d',
                              marginBottom: '4px',
                            }}
                          >
                            Pending Jobs
                          </div>
                          <div
                            style={{
                              fontSize: '32px',
                              fontWeight: 700,
                              color: '#2c3e50',
                            }}
                          >
                            {totalPending}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background:
                              'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                          }}
                        >
                          ⏳
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#7f8c8d',
                        }}
                      >
                        Todo: {todoJobs.length} | In Progress:{' '}
                        {inProgressJobs.length}
                      </div>
                    </div>

                    {/* Todo Jobs Card */}
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                        borderTop: '4px solid #f39c12',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0px 8px 20px rgba(243, 156, 18, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0px 4px 15px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#7f8c8d',
                              marginBottom: '4px',
                            }}
                          >
                            To Do
                          </div>
                          <div
                            style={{
                              fontSize: '32px',
                              fontWeight: 700,
                              color: '#2c3e50',
                            }}
                          >
                            {todoJobs.length}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background:
                              'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                          }}
                        >
                          📝
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#7f8c8d',
                        }}
                      >
                        Jobs waiting to start
                      </div>
                    </div>

                    {/* In Progress Jobs Card */}
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                        borderTop: '4px solid #3498db',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0px 8px 20px rgba(52, 152, 219, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0px 4px 15px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#7f8c8d',
                              marginBottom: '4px',
                            }}
                          >
                            In Progress
                          </div>
                          <div
                            style={{
                              fontSize: '32px',
                              fontWeight: 700,
                              color: '#2c3e50',
                            }}
                          >
                            {inProgressJobs.length}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background:
                              'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                          }}
                        >
                          🔧
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#7f8c8d',
                        }}
                      >
                        Currently being repaired
                      </div>
                    </div>

                    {/* Complete Jobs Card */}
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                        borderTop: '4px solid #27ae60',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0px 8px 20px rgba(39, 174, 96, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0px 4px 15px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#7f8c8d',
                              marginBottom: '4px',
                            }}
                          >
                            Complete
                          </div>
                          <div
                            style={{
                              fontSize: '32px',
                              fontWeight: 700,
                              color: '#2c3e50',
                            }}
                          >
                            {completeJobs.length}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background:
                              'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                          }}
                        >
                          ✓
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#7f8c8d',
                        }}
                      >
                        Ready for handover
                      </div>
                    </div>

                    {/* Handover Jobs Card */}
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                        borderTop: '4px solid #8e44ad',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0px 8px 20px rgba(142, 68, 173, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0px 4px 15px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#7f8c8d',
                              marginBottom: '4px',
                            }}
                          >
                            Handover
                          </div>
                          <div
                            style={{
                              fontSize: '32px',
                              fontWeight: 700,
                              color: '#2c3e50',
                            }}
                          >
                            {handoverJobs.length}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background:
                              'linear-gradient(135deg, #8e44ad 0%, #7d3c98 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                          }}
                        >
                          📦
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#7f8c8d',
                        }}
                      >
                        Delivered to customers
                      </div>
                    </div>

                    {/* Total Revenue Card */}
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                        borderTop: '4px solid #16a085',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0px 8px 20px rgba(22, 160, 133, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0px 4px 15px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#7f8c8d',
                              marginBottom: '4px',
                            }}
                          >
                            Total Revenue
                          </div>
                          <div
                            style={{
                              fontSize: '24px',
                              fontWeight: 700,
                              color: '#2c3e50',
                            }}
                          >
                            Rs. {Number(totalRevenue || 0).toLocaleString()}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background:
                              'linear-gradient(135deg, #16a085 0%, #138d75 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                          }}
                        >
                          💰
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#7f8c8d',
                        }}
                      >
                        From all {jobs.length} jobs
                      </div>
                    </div>

                    {/* Total Profit Card */}
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                        borderTop: '4px solid #10b981',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0px 8px 20px rgba(16, 185, 129, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0px 4px 15px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#7f8c8d',
                              marginBottom: '4px',
                            }}
                          >
                            Total Profit
                          </div>
                          <div
                            style={{
                              fontSize: '24px',
                              fontWeight: 700,
                              color: '#2c3e50',
                            }}
                          >
                            Rs. {Number(totalProfit || 0).toLocaleString()}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background:
                              'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                          }}
                        >
                          📈
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#7f8c8d',
                        }}
                      >
                        After parts cost deduction
                      </div>
                    </div>

                    {/* Handover Revenue Card */}
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                        borderTop: '4px solid #9b59b6',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0px 8px 20px rgba(155, 89, 182, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0px 4px 15px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#7f8c8d',
                              marginBottom: '4px',
                            }}
                          >
                            Handover Revenue
                          </div>
                          <div
                            style={{
                              fontSize: '24px',
                              fontWeight: 700,
                              color: '#2c3e50',
                            }}
                          >
                            Rs. {Number(handoverRevenue || 0).toLocaleString()}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background:
                              'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                          }}
                        >
                          💵
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#7f8c8d',
                        }}
                      >
                        Profit: Rs.{' '}
                        {Number(handoverProfit || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedJobForInvoice && (
        <RepairJobInvoice
          jobData={selectedJobForInvoice}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedJobForInvoice(null);
          }}
        />
      )}

      {/* Return Repair Job Modal */}
      {showReturnModal && returningJob && (
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
            setShowReturnModal(false);
            setReturningJob(null);
            setReturnForm({ note: '' });
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 8,
              width: '95vw',
              maxWidth: 600,
              maxHeight: '90vh',
              overflow: 'auto',
              padding: 16,
            }}
            onClick={(e) => e.stopPropagation()}
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
              <h2 style={{ margin: 0, fontWeight: 700 }}>Return Repair Job</h2>
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setReturningJob(null);
                  setReturnForm({ note: '' });
                }}
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
                  fontSize: 13,
                  color: '#6b7280',
                  marginBottom: 8,
                }}
              >
                <strong>Customer:</strong> {returningJob.customerName}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#6b7280',
                  marginBottom: 16,
                }}
              >
                <strong>Job ID:</strong> {returningJob.id}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontSize: 12,
                  color: '#6b7280',
                  fontWeight: 600,
                }}
              >
                Return Note <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={returnForm.note}
                onChange={(e) =>
                  setReturnForm({ ...returnForm, note: e.target.value })
                }
                placeholder="Enter return note (required)"
                rows={4}
                required
                style={{
                  width: '100%',
                  padding: 8,
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  resize: 'vertical',
                  marginTop: 4,
                }}
              />
              <p
                style={{
                  fontSize: 11,
                  color: '#6b7280',
                  marginTop: 4,
                  marginBottom: 0,
                }}
              >
                Note is required to return this repair job
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
                  setShowReturnModal(false);
                  setReturningJob(null);
                  setReturnForm({ note: '', description: '', reason: '' });
                }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  background: 'white',
                  color: '#374151',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReturnJob}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: 6,
                  background: '#f59e0b',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Return Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repairing;
