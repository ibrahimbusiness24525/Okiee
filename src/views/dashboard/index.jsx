import React from 'react';
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
          <Link to={'/app/dashboard/partyLedger'}>
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
                  Parties
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
        <Col md={6} xl={8}>
          <Card
            className="Recent-Users widget-focus-lg"
            style={{
              borderRadius: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <Card.Header>
              <Card.Title as="h5">Recent Users</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-0 ">
              <Table responsive hover className="recent-users">
                <tbody>
                  <tr className="unread">
                    <td>
                      <img
                        className="rounded-circle"
                        style={{ width: '40px' }}
                        src={avatar1}
                        alt="activity-user"
                      />
                    </td>
                    <td>
                      <h6 className="mb-1">Isabella Christensen</h6>
                      <p className="m-0">
                        Lorem Ipsum is simply dummy text of…
                      </p>
                    </td>
                    <td>
                      <h6 className="text-muted">
                        <i className="fa fa-circle text-c-green f-10 m-r-15" />
                        11 MAY 12:56
                      </h6>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        Reject
                      </Link>
                      <Link to="#" className="label theme-bg text-white f-12">
                        Approve
                      </Link>
                    </td>
                  </tr>
                  <tr className="unread">
                    <td>
                      <img
                        className="rounded-circle"
                        style={{ width: '40px' }}
                        src={avatar2}
                        alt="activity-user"
                      />
                    </td>
                    <td>
                      <h6 className="mb-1">Mathilde Andersen</h6>
                      <p className="m-0">
                        Lorem Ipsum is simply dummy text of…
                      </p>
                    </td>
                    <td>
                      <h6 className="text-muted">
                        <i className="fa fa-circle text-c-red f-10 m-r-15" />
                        11 MAY 10:35
                      </h6>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        Reject
                      </Link>
                      <Link to="#" className="label theme-bg text-white f-12">
                        Approve
                      </Link>
                    </td>
                  </tr>
                  <tr className="unread">
                    <td>
                      <img
                        className="rounded-circle"
                        style={{ width: '40px' }}
                        src={avatar3}
                        alt="activity-user"
                      />
                    </td>
                    <td>
                      <h6 className="mb-1">Karla Sorensen</h6>
                      <p className="m-0">
                        Lorem Ipsum is simply dummy text of…
                      </p>
                    </td>
                    <td>
                      <h6 className="text-muted">
                        <i className="fa fa-circle text-c-green f-10 m-r-15" />9
                        MAY 17:38
                      </h6>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        Reject
                      </Link>
                      <Link to="#" className="label theme-bg text-white f-12">
                        Approve
                      </Link>
                    </td>
                  </tr>
                  <tr className="unread">
                    <td>
                      <img
                        className="rounded-circle"
                        style={{ width: '40px' }}
                        src={avatar1}
                        alt="activity-user"
                      />
                    </td>
                    <td>
                      <h6 className="mb-1">Ida Jorgensen</h6>
                      <p className="m-0">
                        Lorem Ipsum is simply dummy text of…
                      </p>
                    </td>
                    <td>
                      <h6 className="text-muted f-w-300">
                        <i className="fa fa-circle text-c-red f-10 m-r-15" />
                        19 MAY 12:56
                      </h6>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        Reject
                      </Link>
                      <Link to="#" className="label theme-bg text-white f-12">
                        Approve
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4}>
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
                  {/* <h3 className="f-w-300">235</h3> */}
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
                  {/* <h3 className="f-w-300">235</h3> */}
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
                  {/* <h3 className="f-w-300">235</h3> */}
                  <span className="d-block text-uppercase">total ideas</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

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
