import { useParams } from "react-router-dom";
import { api } from "../../../api/api";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap"; // assuming you're using react-bootstrap Button
import Table from "components/Table/Table";
import { dateFormatter } from "utils/dateFormatter";

const BankTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const { id } = useParams();

    const getBankTransactions = async () => {
        try {
            const response = await api.get(`/api/banks/getBankTransaction/${id}`);
            setTransactions(response?.data?.transactions || []);
            console.log(response?.data?.transactions);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
        getBankTransactions();
    }, []);

    const handleAddCash = (obj) => {
        console.log('Add Cash', obj);
    };

    const handleRemoveCash = (obj) => {
        console.log('Remove Cash', obj);
    };

    const handleDeleteProceed = (obj) => {
        console.log('Delete Transaction', obj);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ textAlign: "center", fontSize: "32px", marginBottom: "20px", color: "#2c3e50" }}>Bank Transactions</h1>
            <p style={{ textAlign: "center", fontSize: "18px", marginBottom: "30px", color: "#7f8c8d" }}>
                Here is the list of all transactions made in the bank account.
            </p>

            <Table
    routes={["/app/dashboard/bankTransaction"]}
    array={transactions}
    keysToDisplay={["accountCash", "sourceOfAmountAddition", "createdAt", "updatedAt"]}
    label={[
        "Amount (Cash)",
        "Source",
        "Created At",
        "Updated At",
    ]}
    customBlocks={[
        {
            index: 0, // accountCash formatting
            component: (cash) => {
                const isNegative = cash < 0;
                return (
                    <span style={{
                        color: isNegative ? "#e74c3c" : "#2ecc71",
                        fontWeight: "bold",
                        fontSize: "18px",
                        backgroundColor: isNegative ? "#fdecea" : "#e8f8f5",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        display: "inline-block",
                        minWidth: "100px",
                        textAlign: "center"
                    }}>
                        {isNegative ? `-${Math.abs(cash)}` : `+${cash}`}
                    </span>
                );
            },
        },
        {
            index: 1, // sourceOfAmountAddition handling
            component: (source) => {
                return (
                    <span style={{ color: source ? "#34495e" : "#95a5a6", fontStyle: source ? "normal" : "italic" }}>
                        {source || "Not Mentioned"}
                    </span>
                );
            },
        },
        {
            index: 2, // createdAt formatting
            component: (date) => {
                return (
                    <span style={{ color: "#2980b9", fontSize: "14px" }}>
                        {dateFormatter(date)}
                    </span>
                );
            }
        },
        {
            index: 3, // updatedAt formatting
            component: (date) => {
                return (
                    <span style={{ color: "#8e44ad", fontSize: "14px" }}>
                        {dateFormatter(date)}
                    </span>
                );
            }
        },
    ]}
/>

        </div>
    );
};

export default BankTransactions;
