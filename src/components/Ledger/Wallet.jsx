import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { api } from '../../../api/api';
import Table from 'components/Table/Table';
import { dateFormatter } from 'utils/dateFormatter';
import { ModeEdit } from '@mui/icons-material';
import { Button } from 'react-bootstrap';
import Modal from 'components/Modal/Modal';


const Wallet = () => {
    const [formData,setFormData] = useState({
        bankName: '',
        accountType: '',
        sourceOfAmount:'',
        accountCash:'',
    });
    const [banks, setBanks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);
    const [showRemovalModal, setShowRemovalModal] = useState(null);

  const handleCreateBank = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        '/api/banks/create', // your create bank endpoint
        formData,
      );
      console.log('Bank created successfully:', response.data);
      toast.success('Bank created successfully!');
      setFormData({ bankName: '', accountType: '' }); // Reset form data
      getAllBanks(); // Fetch all banks when the component mounts
    } catch (error) {
        console.error('Error creating bank:', error);
        toast.error('error creating bank!');
    }
  };

  const getAllBanks = async () => {
    try {
      const response = await api.get('/api/banks/getAllBanks'); // your get all banks endpoint
      console.log('All banks:', response?.data?.banks);
      setBanks(response?.data?.banks); // Set the banks state with the fetched data
    } catch (error) {
      console.error('Error fetching banks:', error);
      toast.error('Error fetching banks!');
    }
  }

  const handleAddCash = (bank) => {
    setSelectedBank(bank); 
    setShowModal(true); // Show the modal when the button is clicked
};
const handleRemoveCash = (bank) =>{
      setSelectedBank(bank); 
      setShowRemovalModal(true); // Show the modal when the button is clicked
  }
  const handleConfirmAddCash = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
        const response = await api.post(
            '/api/banks/addCash',
            {
                bankId: selectedBank._id, // Use the selected bank's ID
                sourceOfAmount: formData.sourceOfAmount, // Get the source of amount from the form data
                accountCash: formData.accountCash, // Get the account cash from the form data
            } // your add cash endpoint
            )
        console.log('Cash added successfully:', response.data);
        toast.success('Cash added successfully!');
        getAllBanks()
    }catch (error) {
        console.error('Error adding cash:', error);
        toast.error('Error adding cash!');
    }
    }
  const handleConfirmRemoveCash = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
        const response = await api.post(
            '/api/banks/removeCash',
            {
                bankId: selectedBank._id, // Use the selected bank's ID
                sourceOfAmount: formData.sourceOfAmount, // Get the source of amount from the form data
                accountCash: formData.accountCash, // Get the account cash from the form data
            } // your add cash endpoint
            )
        console.log('Cash removed successfully:', response.data);
        toast.success('Cash removed successfully!');
        getAllBanks()
    }catch (error) {
        console.error('Error removed cash:', error);
        toast.error('Error removed cash!');
    }
    }
  useEffect(() => {
    getAllBanks(); // Fetch all banks when the component mounts
  }
, []);
console.log("banks", banks);


  return (
    <>
    <div style={styles.container}>
      <h1 style={styles.heading}>Wallet</h1>
      <form onSubmit={handleCreateBank} style={styles.form}>
        <input
          type="text"
          placeholder="Bank Name"
            value={formData.bankName}
          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Account Type (e.g., Savings, Current)"
         value={formData.accountType}
          onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Create Bank
        </button>
      </form>
    </div>
    <Table
            // routes={["/app/dashboard/ledgerRecords"]}
            array={banks}
            // search={"ban"}
            keysToDisplay={["bankName", "accountType", "accountCash","createdAt" ]}
            label={[
                "Bank Name",
                "Account Type",
                "Account Cash",
                "Created At",
                "Actions"
            ]}
            customBlocks={[
                {
                    index: 2,
                    component: (cash) => {
                      return (
                        <h4
                          style={{
                            fontSize: '18px',
                            color: '#2c3e50',
                            fontWeight: '600',
                            backgroundColor: '#ecf0f1',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            display: 'inline-block',
                            minWidth: '80px',
                            textAlign: 'center',
                          }}
                        >
                          {cash}
                        </h4>
                      );
                    },
                  },
                {
                    index: 3,
                    component: (date) => {
                        return dateFormatter(date)
                    }
                }
            ]}
           
            extraColumns={[
                (obj) => {
                  return (
                    <>
                      <Button variant="success" onClick={()=>handleAddCash(obj)} size="sm" style={{ marginRight: '5px' }}>
                        Add Cash
                      </Button>
                      <Button onClick={()=> handleRemoveCash(obj)} variant="warning" size="sm" style={{ marginRight: '5px', color: 'white' }}>
                        Remove Cash
                      </Button>
                      <Button variant="danger" size="sm">
                        Delete
                      </Button>
                    </>
                  );
                },
              ]}
              
        />
        <Modal toggleModal={() => setShowModal(!showModal)} size="md" show={showModal}>
             <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Cash</h2>
            <form onSubmit={handleConfirmAddCash} style={styles.form}>
                <input
                    type="text"
                    placeholder="Enter Source of Amount"
                    value={formData.sourceOfAmount}
                    onChange={(e) => setFormData({ ...formData, sourceOfAmount: e.target.value })}
                    style={styles.input}
                    required
                />
                <input
                    type="number"
                    placeholder="Enter Cash to Deposit"
                    value={formData.accountCash}
                    onChange={(e) => setFormData({ ...formData, accountCash: e.target.value })}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button}>
                    Add Cash
                </button>
            </form>
        </Modal>
        <Modal toggleModal={() => setShowRemovalModal(!showRemovalModal)} size="md" show={showRemovalModal}>
             <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Remove Cash</h2>
            <form onSubmit={handleConfirmRemoveCash} style={styles.form}>
                <input
                    type="text"
                    placeholder="Enter Source"
                    value={formData.sourceOfAmount}
                    onChange={(e) => setFormData({ ...formData, sourceOfAmount: e.target.value })}
                    style={styles.input}
                    required
                />
                <input
                    type="number"
                    placeholder="Enter Cash to Remove"
                    value={formData.accountCash}
                    onChange={(e) => setFormData({ ...formData, accountCash: e.target.value })}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button}>
                    Add Cash
                </button>
            </form>
        </Modal>
    </>
  );
};

const styles = {
    container: {
      maxWidth: '500px',
      margin: '60px auto',
      padding: '30px 25px',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
      backgroundColor: '#ffffff',
      transition: 'all 0.3s ease-in-out',
    },
    heading: {
      textAlign: 'center',
      marginBottom: '25px',
      fontSize: '28px',
      color: '#2c3e50',
      fontWeight: 'bold',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
    },
    input: {
      padding: '12px 15px',
      border: '1px solid #d1d1d1',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: '#fafafa',
      transition: 'border-color 0.2s ease',
    },
    button: {
      padding: '14px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '17px',
      fontWeight: '600',
      cursor: 'pointer',
      letterSpacing: '0.5px',
      transition: 'background-color 0.3s ease',
    },
    message: {
      marginTop: '18px',
      textAlign: 'center',
      color: '#3498db',
      fontSize: '16px',
    },
  };
  
export default Wallet;
