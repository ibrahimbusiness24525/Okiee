import { api } from '../../../api/api';
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const DashDefault = () => {
  const tabContent = (
    <React.Fragment>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img
              className="rounded-circle"
              style={{ width: '40px' }}
              src={avatar1}
              alt="activity-user"
            />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Silje Larsen</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            3784
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img
              className="rounded-circle"
              style={{ width: '40px' }}
              src={avatar2}
              alt="activity-user"
            />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Julie Vad</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            3544
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img
              className="rounded-circle"
              style={{ width: '40px' }}
              src={avatar3}
              alt="activity-user"
            />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Storm Hanse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            2739
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img
              className="rounded-circle"
              style={{ width: '40px' }}
              src={avatar1}
              alt="activity-user"
            />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Frida Thomse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            1032
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img
              className="rounded-circle"
              style={{ width: '40px' }}
              src={avatar2}
              alt="activity-user"
            />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Silje Larsen</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            8750
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img
              className="rounded-circle"
              style={{ width: '40px' }}
              src={avatar3}
              alt="activity-user"
            />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Storm Hanse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            8750
          </span>
        </div>
      </div>
    </React.Fragment>
  );
  const [persons, setPersons] = useState([]);
  const [isLoadingPersons, setIsLoadingPersons] = useState(true);
  const [showReceivablesTotal, setShowReceivablesTotal] = useState(false);
  const [showPayablesTotal, setShowPayablesTotal] = useState(false);
  const [showReceivablesNumbers, setShowReceivablesNumbers] = useState(false);
  const [showPayablesNumbers, setShowPayablesNumbers] = useState(false);
  const [showTotalCustomers, setShowTotalCustomers] = useState(false);
  const [showReceivables, setShowReceivables] = useState(false);
  const [showPayables, setShowPayables] = useState(false);
  const [showActiveAccounts, setShowActiveAccounts] = useState(false);
  const avatarsArr = [avatar1, avatar2, avatar3];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoadingPersons(true);
        const res = await api.get('/api/person/all');
        if (mounted) {
          setPersons(res?.data || []);
        }
      } catch (e) {
        // silent
      } finally {
        if (mounted) setIsLoadingPersons(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const payables = persons.filter(
    (p) => (p.takingCredit || 0) > (p.givingCredit || 0)
  );
  const receivables = persons.filter(
    (p) => (p.givingCredit || 0) > (p.takingCredit || 0)
  );

  const totalReceivables = receivables.reduce(
    (sum, p) =>
      sum + Math.max((p.givingCredit || 0) - (p.takingCredit || 0), 0),
    0
  );
  const totalPayables = payables.reduce(
    (sum, p) =>
      sum + Math.max((p.takingCredit || 0) - (p.givingCredit || 0), 0),
    0
  );

  return (
    <React.Fragment>
      <style>{`
        @media (max-width: 768px) {
          .quick-actions-container {
            flex-direction: column !important;
          }
          .quick-action-item {
            min-width: 100% !important;
            width: 100% !important;
          }
          .payables-receivables-container {
            flex-direction: column !important;
          }
          .payables-receivables-section {
            width: 100% !important;
            margin-bottom: 20px;
          }
          .payables-receivables-section:last-child {
            margin-bottom: 0;
          }
          .section-title {
            font-size: 18px !important;
          }
          .quick-action-icon {
            width: 50px !important;
            height: 50px !important;
          }
          .quick-action-icon i {
            font-size: 20px !important;
          }
          .stats-card-icon {
            padding: 12px !important;
          }
          .stats-card-icon i {
            font-size: 18px !important;
          }
          .stats-card h4 {
            font-size: 20px !important;
          }
          .recent-activity-header {
            padding: 15px 20px !important;
          }
          .recent-activity-header > div {
            font-size: 18px !important;
          }
          .tab-content-padding {
            padding: 15px !important;
          }
          .payables-receivables-padding {
            padding: 15px !important;
          }
          .quick-action-item > div {
            padding: 20px !important;
          }
        }
        @media (max-width: 576px) {
          .section-title {
            font-size: 16px !important;
          }
          .quick-action-title {
            font-size: 16px !important;
          }
          .quick-action-desc {
            font-size: 12px !important;
          }
          .stats-card h4 {
            font-size: 18px !important;
          }
          .stats-card small {
            font-size: 11px !important;
          }
          .recent-activity-header {
            padding: 12px 15px !important;
          }
          .recent-activity-header > div {
            font-size: 16px !important;
          }
          .tab-content-padding {
            padding: 12px !important;
          }
          .payables-receivables-padding {
            padding: 12px !important;
            gap: 15px !important;
          }
          .quick-action-item > div {
            padding: 15px !important;
            gap: 15px !important;
          }
          .quick-action-icon {
            width: 45px !important;
            height: 45px !important;
          }
          .quick-action-icon i {
            font-size: 18px !important;
          }
        }
      `}</style>
      {/* Professional Stats Overview */}
      <Row className="mb-4">
        <Col xs={12} sm={6} md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3 stats-card-icon">
                  <i className="fa fa-users text-primary fa-lg"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    className="mb-0 text-primary"
                    style={{
                      filter: showTotalCustomers ? 'none' : 'blur(5px)',
                      transition: 'filter 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowTotalCustomers(!showTotalCustomers)}
                  >
                    {persons.length}
                  </h4>
                  <small className="text-muted">Total Customers</small>
                </div>
                <i
                  className={`fa ${showTotalCustomers ? 'fa-eye' : 'fa-eye-slash'} text-primary`}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '8px',
                  }}
                  onClick={() => setShowTotalCustomers(!showTotalCustomers)}
                  title={showTotalCustomers ? 'Hide value' : 'Show value'}
                ></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3 stats-card-icon">
                  <i className="fa fa-arrow-up text-success fa-lg"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    className="mb-0 text-success"
                    style={{
                      filter: showReceivables ? 'none' : 'blur(5px)',
                      transition: 'filter 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowReceivables(!showReceivables)}
                  >
                    Rs. {totalReceivables.toLocaleString()}
                  </h4>
                  <small className="text-muted">Receivables</small>
                </div>
                <i
                  className={`fa ${showReceivables ? 'fa-eye' : 'fa-eye-slash'} text-success`}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '8px',
                  }}
                  onClick={() => setShowReceivables(!showReceivables)}
                  title={showReceivables ? 'Hide value' : 'Show value'}
                ></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="bg-danger bg-opacity-10 rounded-circle p-3 me-3 stats-card-icon">
                  <i className="fa fa-arrow-down text-danger fa-lg"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    className="mb-0 text-danger"
                    style={{
                      filter: showPayables ? 'none' : 'blur(5px)',
                      transition: 'filter 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowPayables(!showPayables)}
                  >
                    Rs. {totalPayables.toLocaleString()}
                  </h4>
                  <small className="text-muted">Payables</small>
                </div>
                <i
                  className={`fa ${showPayables ? 'fa-eye' : 'fa-eye-slash'} text-danger`}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '8px',
                  }}
                  onClick={() => setShowPayables(!showPayables)}
                  title={showPayables ? 'Hide value' : 'Show value'}
                ></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3 stats-card-icon">
                  <i className="fa fa-chart-line text-info fa-lg"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    className="mb-0 text-info"
                    style={{
                      filter: showActiveAccounts ? 'none' : 'blur(5px)',
                      transition: 'filter 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowActiveAccounts(!showActiveAccounts)}
                  >
                    {receivables.length + payables.length}
                  </h4>
                  <small className="text-muted">Active Accounts</small>
                </div>
                <i
                  className={`fa ${showActiveAccounts ? 'fa-eye' : 'fa-eye-slash'} text-info`}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '8px',
                  }}
                  onClick={() => setShowActiveAccounts(!showActiveAccounts)}
                  title={showActiveAccounts ? 'Hide value' : 'Show value'}
                ></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div style={{ marginBottom: '30px' }}>
        <div
          className="section-title"
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2d3748',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <i className="fa fa-bolt" style={{ color: '#667eea' }}></i>
          Quick Actions
        </div>
        <div
          className="quick-actions-container"
          style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}
        >
          <Link
            to={'/todayBook'}
            className="quick-action-item"
            style={{ textDecoration: 'none', flex: '1', minWidth: '300px' }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div
                className="quick-action-icon"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i
                  className="fa fa-book"
                  style={{ fontSize: '24px', color: 'white' }}
                ></i>
              </div>
              <div>
                <div
                  className="quick-action-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    marginBottom: '5px',
                  }}
                >
                  Today Book
                </div>
                <div
                  className="quick-action-desc"
                  style={{ fontSize: '14px', color: '#718096' }}
                >
                  View today's transactions and activities
                </div>
              </div>
            </div>
          </Link>

          <Link
            to={'/app/dashboard/getCustomerRecord'}
            className="quick-action-item"
            style={{ textDecoration: 'none', flex: '1', minWidth: '300px' }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div
                className="quick-action-icon"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background:
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i
                  className="fa fa-users"
                  style={{ fontSize: '24px', color: 'white' }}
                ></i>
              </div>
              <div>
                <div
                  className="quick-action-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    marginBottom: '5px',
                  }}
                >
                  Customer Records
                </div>
                <div
                  className="quick-action-desc"
                  style={{ fontSize: '14px', color: '#718096' }}
                >
                  Manage and view customer data
                </div>
              </div>
            </div>
          </Link>

          <Link
            to={'/app/dashboard/balanceSheet'}
            className="quick-action-item"
            style={{ textDecoration: 'none', flex: '1', minWidth: '300px' }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div
                className="quick-action-icon"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background:
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i
                  className="fa fa-balance-scale"
                  style={{ fontSize: '24px', color: 'white' }}
                ></i>
              </div>
              <div>
                <div
                  className="quick-action-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    marginBottom: '5px',
                  }}
                >
                  Balance Sheet
                </div>
                <div
                  className="quick-action-desc"
                  style={{ fontSize: '14px', color: '#718096' }}
                >
                  View financial overview and reports
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Financial Summary Section */}
      {/* <div style={{ marginBottom: '30px' }}>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2d3748',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <i className="fa fa-chart-pie" style={{ color: '#667eea' }}></i>
            Financial Overview
          </div>
          <div
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '40px',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
              }}
            >
              <div style={{ textAlign: 'center', flex: '1', minWidth: '200px' }}>
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#16a34a',
                    marginBottom: '8px',
                    textShadow: '0 2px 4px rgba(22, 163, 74, 0.3)',
                  }}
                >
                  Rs. {totalReceivables.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '5px',
                  }}
                >
                  Total Receivables
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {receivables.length} accounts
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    background: '#dcfce7',
                    borderRadius: '3px',
                    marginTop: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #16a34a, #22c55e)',
                      borderRadius: '3px',
                    }}
                  ></div>
                </div>
              </div>

              <div style={{ textAlign: 'center', flex: '1', minWidth: '200px' }}>
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#dc2626',
                    marginBottom: '8px',
                    textShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
                  }}
                >
                  Rs. {totalPayables.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '5px',
                  }}
                >
                  Total Payables
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {payables.length} accounts
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    background: '#fef2f2',
                    borderRadius: '3px',
                    marginTop: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #dc2626, #ef4444)',
                      borderRadius: '3px',
                    }}
                  ></div>
                </div>
              </div>

              <div style={{ textAlign: 'center', flex: '1', minWidth: '200px' }}>
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color:
                      totalReceivables > totalPayables ? '#16a34a' : '#dc2626',
                    marginBottom: '8px',
                    textShadow:
                      totalReceivables > totalPayables
                        ? '0 2px 4px rgba(22, 163, 74, 0.3)'
                        : '0 2px 4px rgba(220, 38, 38, 0.3)',
                  }}
                >
                  Rs.{' '}
                  {Math.abs(totalReceivables - totalPayables).toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '5px',
                  }}
                >
                  {totalReceivables > totalPayables
                    ? 'Net Receivables'
                    : 'Net Payables'}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {totalReceivables > totalPayables
                    ? 'Positive balance'
                    : 'Outstanding amount'}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    background:
                      totalReceivables > totalPayables ? '#dcfce7' : '#fef2f2',
                    borderRadius: '3px',
                    marginTop: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background:
                        totalReceivables > totalPayables
                          ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                          : 'linear-gradient(90deg, #dc2626, #ef4444)',
                      borderRadius: '3px',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

      <Row>
        <Col xl={12}>
          <Card
            className="Recent-Users widget-focus-lg"
            style={{
              borderRadius: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <Card.Header>
              <Card.Title
                as="h5"
                style={{ fontWeight: 800, letterSpacing: '0.2px' }}
              >
                Payables & Receivables
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              <div
                className="payables-receivables-container payables-receivables-padding"
                style={{
                  display: 'flex',
                  padding: '26px',
                  gap: '20px',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                {/* Receivables Section */}
                <div
                  className="payables-receivables-section"
                  style={{
                    flex: '1',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    width: '50%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #86efac',
                      padding: '8px 10px',
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <h6
                        style={{ margin: 0, fontWeight: 800, color: '#166534' }}
                      >
                        Receivables
                      </h6>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#065f46',
                          backgroundColor: '#d1fae5',
                          padding: '2px 8px',
                          borderRadius: 999,
                        }}
                      >
                        {receivables.length}
                      </span>
                    </div>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <span
                        onClick={() => setShowReceivablesNumbers((s) => !s)}
                        title={
                          showReceivablesNumbers
                            ? 'Hide numbers'
                            : 'Show numbers'
                        }
                        style={{
                          cursor: 'pointer',
                          color: '#065f46',
                          fontSize: 16,
                        }}
                        className={`fa ${showReceivablesNumbers ? 'fa-eye' : 'fa-eye-slash'}`}
                      />
                      <span
                        onClick={() => setShowReceivablesTotal((s) => !s)}
                        title={
                          showReceivablesTotal ? 'Hide total' : 'Show total'
                        }
                        style={{
                          cursor: 'pointer',
                          color: '#065f46',
                          fontSize: 16,
                        }}
                        className="fa fa-calculator"
                      />
                    </div>
                  </div>
                  {showReceivablesTotal && (
                    <div
                      style={{
                        marginBottom: '8px',
                        backgroundColor: '#f0fdf4',
                        border: '1px dashed #86efac',
                        padding: '8px 10px',
                        borderRadius: 8,
                        color: '#166534',
                        fontWeight: 700,
                      }}
                    >
                      Total Receivables: Rs. {totalReceivables.toLocaleString()}
                    </div>
                  )}
                  <div
                    style={{
                      maxHeight: '360px',
                      overflowY: 'auto',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  >
                    {isLoadingPersons ? (
                      <div
                        style={{
                          padding: '12px',
                          color: '#6b7280',
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
                        Loading…
                      </div>
                    ) : receivables.length === 0 ? (
                      <div
                        style={{
                          padding: '12px',
                          color: '#6b7280',
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
                        No receivables
                      </div>
                    ) : (
                      receivables.map((p, idx) => {
                        const amount =
                          (p.givingCredit || 0) - (p.takingCredit || 0);
                        return (
                          <div
                            key={p._id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '10px 12px',
                              borderBottom: '1px solid #f3f4f6',
                              gap: '10px',
                            }}
                          >
                            <img
                              src={avatarsArr[idx % avatarsArr.length]}
                              alt="avatar"
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <h6
                                  style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#14532d',
                                  }}
                                >
                                  {p.name}
                                </h6>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    color: '#16a34a',
                                    fontWeight: 700,
                                  }}
                                >
                                  Rs. {Math.abs(amount).toLocaleString()}
                                </span>
                              </div>
                              <div
                                style={{ fontSize: '12px', color: '#6b7280' }}
                              >
                                {showReceivablesNumbers
                                  ? p.number
                                  : '••••••••••'}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Payables Section */}
                <div
                  className="payables-receivables-section"
                  style={{
                    flex: '1',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    width: '50%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      padding: '8px 10px',
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <h6
                        style={{ margin: 0, fontWeight: 800, color: '#7f1d1d' }}
                      >
                        Payables
                      </h6>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#7f1d1d',
                          backgroundColor: '#fee2e2',
                          padding: '2px 8px',
                          borderRadius: 999,
                        }}
                      >
                        {payables.length}
                      </span>
                    </div>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <span
                        onClick={() => setShowPayablesNumbers((s) => !s)}
                        title={
                          showPayablesNumbers ? 'Hide numbers' : 'Show numbers'
                        }
                        style={{
                          cursor: 'pointer',
                          color: '#7f1d1d',
                          fontSize: 16,
                        }}
                        className={`fa ${showPayablesNumbers ? 'fa-eye' : 'fa-eye-slash'}`}
                      />
                      <span
                        onClick={() => setShowPayablesTotal((s) => !s)}
                        title={showPayablesTotal ? 'Hide total' : 'Show total'}
                        style={{
                          cursor: 'pointer',
                          color: '#7f1d1d',
                          fontSize: 16,
                        }}
                        className="fa fa-calculator"
                      />
                    </div>
                  </div>
                  {showPayablesTotal && (
                    <div
                      style={{
                        marginBottom: '8px',
                        backgroundColor: '#fef2f2',
                        border: '1px dashed #fecaca',
                        padding: '8px 10px',
                        borderRadius: 8,
                        color: '#7f1d1d',
                        fontWeight: 700,
                      }}
                    >
                      Total Payables: Rs. {totalPayables.toLocaleString()}
                    </div>
                  )}
                  <div
                    style={{
                      maxHeight: '360px',
                      overflowY: 'auto',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  >
                    {isLoadingPersons ? (
                      <div
                        style={{
                          padding: '12px',
                          color: '#6b7280',
                          textAlign: 'center',
                        }}
                      >
                        Loading…
                      </div>
                    ) : payables.length === 0 ? (
                      <div
                        style={{
                          padding: '12px',
                          color: '#6b7280',
                          textAlign: 'center',
                        }}
                      >
                        No payables
                      </div>
                    ) : (
                      payables.map((p, idx) => {
                        const amount =
                          (p.takingCredit || 0) - (p.givingCredit || 0);
                        return (
                          <div
                            key={p._id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '10px 12px',
                              borderBottom: '1px solid #f3f4f6',
                              gap: '10px',
                            }}
                          >
                            <img
                              src={avatarsArr[idx % avatarsArr.length]}
                              alt="avatar"
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <h6
                                  style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#7f1d1d',
                                  }}
                                >
                                  {p.name}
                                </h6>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    color: '#dc2626',
                                    fontWeight: 700,
                                  }}
                                >
                                  Rs. {Math.abs(amount).toLocaleString()}
                                </span>
                              </div>
                              <div
                                style={{ fontSize: '12px', color: '#6b7280' }}
                              >
                                {showPayablesNumbers ? p.number : '••••••••••'}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* <Col md={6} xl={4}>
          <Card
            className="card-event"
            style={{
              borderRadius: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <Card.Body>
              <div className="row align-items-center justify-content-center">
                <div className="col">
                  <h5 className="-m-16" style={{ fontSize: 30 }}>
                    Upcoming Updates
                  </h5>
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="feather icon-zap f-30 text-c-green" />
                </div>
                <div className="col">
                  <span className="d-block text-uppercase">total ideas</span>
                </div>
              </div>
            </Card.Body>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="feather icon-zap f-30 text-c-green" />
                </div>
                <div className="col">
                  <span className="d-block text-uppercase">total ideas</span>
                </div>
              </div>
            </Card.Body>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="feather icon-zap f-30 text-c-green" />
                </div>
                <div className="col">
                  <span className="d-block text-uppercase">total ideas</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col> */}

        <Col xl={12} className="user-activity">
          <div
            style={{
              background: 'white',
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              marginTop: '25px',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              className="recent-activity-header"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '20px 25px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <i className="fa fa-history" style={{ fontSize: '18px' }}></i>
                Recent Activity
              </div>
            </div>

            {/* Tabs */}
            <div style={{ width: '100%' }}>
              <Tabs
                defaultActiveKey="today"
                id="uncontrolled-tab-example"
                className="mb-0"
              >
                <Tab
                  eventKey="today"
                  title={
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      <i className="fa fa-calendar-day"></i>
                      Today
                    </span>
                  }
                >
                  <div
                    className="tab-content-padding"
                    style={{ padding: '25px' }}
                  >
                    {tabContent}
                  </div>
                </Tab>
                <Tab
                  eventKey="week"
                  title={
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      <i className="fa fa-calendar-week"></i>
                      This Week
                    </span>
                  }
                >
                  <div
                    className="tab-content-padding"
                    style={{ padding: '25px' }}
                  >
                    {tabContent}
                  </div>
                </Tab>
                <Tab
                  eventKey="all"
                  title={
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      <i className="fa fa-calendar-alt"></i>
                      All Time
                    </span>
                  }
                >
                  <div
                    className="tab-content-padding"
                    style={{ padding: '25px' }}
                  >
                    {tabContent}
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
