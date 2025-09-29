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

  const payables = persons.filter((p) => (p.takingCredit || 0) > (p.givingCredit || 0));
  const receivables = persons.filter((p) => (p.givingCredit || 0) > (p.takingCredit || 0));

  const totalReceivables = receivables.reduce((sum, p) => sum + Math.max((p.givingCredit || 0) - (p.takingCredit || 0), 0), 0);
  const totalPayables = payables.reduce((sum, p) => sum + Math.max((p.takingCredit || 0) - (p.givingCredit || 0), 0), 0);

  return (
    <React.Fragment>
      <Row>
        <Col xl={6} xxl={4} style={{ marginBottom: 25 }}>
          <Link to={'/todayBook'}>
            <Card
              style={{
                borderRadius: 10,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              <Card.Body>
                <h6
                  className="mb-1 mr-20"
                  style={{ fontSize: 30, color: '#04a9f5' }}
                >
                  Today Book
                </h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                      <i className={`feather } f-30 m-r-20`} />
                    </h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col xl={6} xxl={4} style={{ marginBottom: 25 }}>
          <Link to={'/app/dashboard/getCustomerRecord'}>
            <Card
              style={{
                borderRadius: 10,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              <Card.Body>
                <h6
                  className="mb-1 mr-20"
                  style={{ fontSize: 30, color: '#04a9f5' }}
                >
                    Customer Records
                </h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9"></div>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col xl={6} xxl={4} style={{ marginBottom: 25 }}>
          <Link to={'/app/dashboard/balanceSheet'}>
            <Card
              style={{
                borderRadius: 10,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              <Card.Body>
                <h6
                  className="mb-1 mr-20"
                  style={{ fontSize: 30, color: '#04a9f5' }}
                >
                  Balance Sheet
                </h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9"></div>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col >
          <Card
            className="Recent-Users widget-focus-lg"
            style={{
              borderRadius: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <Card.Header>
              <Card.Title as="h5" style={{ fontWeight: 800, letterSpacing: '0.2px' }}>Payables & Receivables</Card.Title>
            </Card.Header>
            <div style={{ padding: 0,width: '100%',}}>
              <div
                style={{
                  display: 'flex',
                  padding:"26px",
                  gap:"10px",
                  alignItems:"center",
                  justifyContent:"center",
                  
                }}
              >
                {/* Receivables Section */}
                <div style={{ flex: '0 0 50%', width: '50%', minWidth: 0, boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', backgroundColor: '#ecfdf5', border: '1px solid #86efac', padding: '8px 10px', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h6 style={{ margin: 0, fontWeight: 800, color: '#166534' }}>Receivables</h6>
                      <span style={{ fontSize: '12px', color: '#065f46', backgroundColor: '#d1fae5', padding: '2px 8px', borderRadius: 999 }}>{receivables.length}</span>
                    </div>
                    <span
                      onClick={() => setShowReceivablesTotal((s) => !s)}
                      title={showReceivablesTotal ? 'Hide total' : 'Show total'}
                      style={{ cursor: 'pointer', color: '#065f46', fontSize: 16 }}
                      className="fa fa-eye"
                    />
                  </div>
                  {showReceivablesTotal && (
                    <div style={{ marginBottom: '8px', backgroundColor: '#f0fdf4', border: '1px dashed #86efac', padding: '8px 10px', borderRadius: 8, color: '#166534', fontWeight: 700 }}>
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
                      <div style={{ padding: '12px', color: '#6b7280', textAlign: 'center', width: '100%' }}>Loading…</div>) : (
                      receivables.length === 0 ? (
                        <div style={{ padding: '12px', color: '#6b7280', textAlign: 'center', width: '100%' }}>No receivables</div>
                      ) : (
                        receivables.map((p, idx) => {
                          const amount = (p.givingCredit || 0) - (p.takingCredit || 0);
                          return (
                            <div key={p._id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px 12px',
                                borderBottom: '1px solid #f3f4f6',
                                gap: '10px',
                              }}
                            >
                              <img src={avatarsArr[idx % avatarsArr.length]} alt="avatar"
                                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <h6 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#14532d' }}>{p.name}</h6>
                                  <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>Rs. {Math.abs(amount).toLocaleString()}</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{p.number}</div>
                              </div>
                            </div>
                          );
                        })
                      )
                    )}
                  </div>
                </div>

                {/* Payables Section */}
                <div style={{ flex: '0 0 50%', width: '50%', minWidth: 0, boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '8px 10px', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h6 style={{ margin: 0, fontWeight: 800, color: '#7f1d1d' }}>Payables</h6>
                      <span style={{ fontSize: '12px', color: '#7f1d1d', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: 999 }}>{payables.length}</span>
                    </div>
                    <span
                      onClick={() => setShowPayablesTotal((s) => !s)}
                      title={showPayablesTotal ? 'Hide total' : 'Show total'}
                      style={{ cursor: 'pointer', color: '#7f1d1d', fontSize: 16 }}
                      className="fa fa-eye"
                    />
                  </div>
                  {showPayablesTotal && (
                    <div style={{ marginBottom: '8px', backgroundColor: '#fef2f2', border: '1px dashed #fecaca', padding: '8px 10px', borderRadius: 8, color: '#7f1d1d', fontWeight: 700 }}>
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
                      <div style={{ padding: '12px', color: '#6b7280', textAlign: 'center' }}>Loading…</div>) : (
                      payables.length === 0 ? (
                        <div style={{ padding: '12px', color: '#6b7280', textAlign: 'center' }}>No payables</div>
                      ) : (
                        payables.map((p, idx) => {
                          const amount = (p.takingCredit || 0) - (p.givingCredit || 0);
                          return (
                            <div key={p._id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px 12px',
                                borderBottom: '1px solid #f3f4f6',
                                gap: '10px',
                              }}
                            >
                              <img src={avatarsArr[idx % avatarsArr.length]} alt="avatar"
                                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <h6 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#7f1d1d' }}>{p.name}</h6>
                                  <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 700 }}>Rs. {Math.abs(amount).toLocaleString()}</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{p.number}</div>
                              </div>
                            </div>
                          );
                        })
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
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

        <Col md={6} xl={12} className="user-activity">
          <Card
            style={{
              marginTop: 25,
              borderRadius: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
              <Tab eventKey="today" title="Today">
                {tabContent}
              </Tab>
              <Tab eventKey="week" title="This Week">
                {tabContent}
              </Tab>
              <Tab eventKey="all" title="All">
                {tabContent}
              </Tab>
            </Tabs>
          </Card>
        </Col>
        <Col md={6} xl={12} className="about-us-section"></Col>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
