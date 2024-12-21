import MobilesCard from './MobilesCard';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from 'config/constant';
import { Row, Col, Card, Table, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MobileInvoice from 'Modals/MobileInvoice';

export default function DispachMobilesList() {
    const [mobiles, setMobiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [invoiceModal , setInvoiceModal] = useState(false);
    const [saleInfo,setSaleInfo] = useState()


    useEffect(() => {
        getMobiles();
      }, []);

    const handleClose = () => {
        setInvoiceModal(false);
    }


    const soldMobileInfo = (data)=>{
        setInvoiceModal(true);
    }


    const getMobiles = async () => {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(BASE_URL + `api/phone/getAllPhones/${user._id}`);
        console.log(response.data.phones)
        setMobiles(response.data.phones);
        setIsLoading(false);
    }


    const handleClick = () => {
        console.log("welcome")
        setShowModal(true);
      }


    const [isLoading, setIsLoading] = useState(false);
    const LoadingView = () => {
        return (
            <div className="mt-6 flex h-full w-full items-center justify-center font-dm-sans font-bold sm:text-base md:text-xl">
                <span>Loading...</span>
            </div>
        );
    };

    const renderContent = () => {
        if (isLoading) return <LoadingView />;
        return (
            <Col md={6} xl={12}>

                <Card className="Recent-Users widget-focus-lg">
                    <Card.Header>
             <Card.Title as="h5">Dispach Mobile List</Card.Title>
                    </Card.Header>
                    <Card.Body className="px-0 py-2">
                        <Table responsive hover className="recent-users">
                            <tbody>
                                {
                                    mobiles?.map((mobile) => (
                                        <MobilesCard
                                        handleClick={handleClick}
                                        showModal={showModal}
                                        setShowModal={setShowModal}
                                            data={mobile}
                                            key={mobile._id}
                                            onClick={() =>
                                                console.log('clicked on mobiles')
                                            }
                                            showView
                                            usedIn="mobiles"
                                            setSaleInfo={setSaleInfo}
                                            soldMobileInfo={soldMobileInfo}
                                        />
                                    ))
                                }

                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        )
    };

    const EmptyContent = () => {
        if (isLoading) {
            return <LoadingView />;
        }
        return (
            <div className=" mt-4 flex w-full items-center justify-center bg-gray-lighter font-dm-sans font-semibold text-gray-dark sm:h-[50px] md:h-[100px]">
                <span>No mobiles found</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col max-w-full">
            <span className="font-dm-sans text-gray-X11 sm:text-sm md:text-[16px]">
                All Mobiles
            </span>
            {mobiles === null || (mobiles && mobiles.length === 0) ? (
                <EmptyContent />
            ) : (
                <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"

                >
                    {renderContent()}
                    {invoiceModal && (
                        <MobileInvoice
                        setShowModal={setInvoiceModal}
                        showModal ={ invoiceModal}
                        data={saleInfo}
                        handleClose={handleClose}

                        />
                    )}
                </div>
            )}
        </div>
    );
}
