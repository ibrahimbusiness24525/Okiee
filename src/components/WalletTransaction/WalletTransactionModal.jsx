import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"; // Assuming you are using react-bootstrap
import { api } from "../../../api/api";

const WalletTransactionModal = ({ show, toggleModal, singleTransaction, setSingleTransaction, type = "purchase" }) => {
  const [banks, setBanks] = useState([]);
  const [transactionType, setTransactionType] = useState(""); // wallet | bank | both
  const [loading, setLoading] = useState(false);

  const getAllBanks = async () => {
    try {
      const response = await api.get('/api/banks/getAllBanks');
      setBanks(response?.data?.banks || []);
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  useEffect(() => {
    if (show) {
      getAllBanks(); // Fetch banks when modal opens
      setTransactionType(""); // reset selection
    }
  }, [show]);

  const handleSave = () => {
    toggleModal();
  };

  const handleCancel = () => {
    setSingleTransaction(prev => ({
      ...prev,
      bankAccountUsed: "",
      amountFromBank: "",
      amountFromPocket: "",
    }));
    toggleModal();
  };

  return (
    <Modal size="md" show={show} onHide={toggleModal} backdrop="static"
      modalClassName="z-top-modal"
      Zindex={1000000}
      style={{
        zIndex: 1000000,
      }}
    >
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Wallet Transaction</h2>

        {/* Transaction Type Selector */}
        <Form.Group controlId="transactionType" style={{ marginBottom: '25px' }}>
          <Form.Label style={{ fontWeight: 'bold', marginBottom: '10px' }}>Select Payment Method</Form.Label>
          <Form.Select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', fontSize: '15px' }}
          >
            <option value="">-- Select Method --</option>
            <option value="wallet">Pocket Cash</option>
            <option value="bank">Bank</option>
            <option value="both">Both (Bank + Pocket Cash)</option>
          </Form.Select>
        </Form.Group>

        {/* Conditional Rendered Inputs */}

        {(transactionType === "bank" || transactionType === "both") && (
          <div style={{ marginBottom: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <Form.Group controlId="bankAccount">
              <Form.Label style={{ fontWeight: 'bold', marginBottom: '8px' }}>Select Bank Account</Form.Label>
              <Form.Select
                value={singleTransaction.bankAccountUsed || ""}
                onChange={(e) =>
                  setSingleTransaction({ ...singleTransaction, bankAccountUsed: e.target.value })
                }
                style={{ padding: '10px', borderRadius: '6px', fontSize: '15px', marginBottom: '10px' }}
              >
                <option value="">-- Select Bank --</option>
                {banks.map((bank) => (
                  <option key={bank._id} value={bank._id}>
                    {bank.bankName} - {bank.accountType}
                  </option>
                ))}
              </Form.Select>

              <Form.Control
                value={singleTransaction.amountFromBank || ""}
                name="amountFromBank"
                onChange={(e) => setSingleTransaction({ ...singleTransaction, amountFromBank: e.target.value })}
                type="number"
                placeholder="Enter Amount From Bank"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                }}
              />
            </Form.Group>
          </div>
        )}

        {(transactionType === "wallet" || transactionType === "both") && (
          <div style={{ marginTop: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <Form.Group controlId="pocketCash">
              <Form.Label style={{ fontWeight: 'bold', marginBottom: '8px' }}>Enter Pocket Cash Amount</Form.Label>
              <Form.Control
                value={singleTransaction.amountFromPocket || ""}
                name="amountFromPocket"
                onChange={(e) => setSingleTransaction({ ...singleTransaction, amountFromPocket: e.target.value })}
                type="number"
                placeholder="Enter Amount From Pocket Cash"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                }}
              />
            </Form.Group>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            style={{ minWidth: '100px', padding: '8px 0', fontSize: '14px', borderRadius: '6px' }}
          >
            Save
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleCancel}
            style={{ minWidth: '100px', padding: '8px 0', fontSize: '14px', borderRadius: '6px' }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WalletTransactionModal;
