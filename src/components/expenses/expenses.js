import { Button, Divider, Input, List, Modal, Select } from "antd";
import { useState } from "react";
import Reimbursements from "../reimbursement/reimbursement";

const Expenses = ({users}) => {

    const emptyExpense = {
        id: 0,
        title: "",
        amount: 0,
        shared: []
    };

    const [showModal, setShowModal] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [editExpenseIndex, setEditExpenseIndex] = useState(-1);

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0);
    const [sharedUsers, setSharedUsers] = useState([]);

    const setCurrentExpense = (e) => {
        setTitle(e.title);
        setAmount(e.amount);
        setSharedUsers(e.shared);
    }

    const addExpense = () => {
        setCurrentExpense(emptyExpense);
        setShowModal(true);
    }

    const saveExpense = () => {
        console.log("save - ", title, amount, sharedUsers);
        if(!title || !amount || !sharedUsers.length) return;

        const newExpense = {
            id: expenses.length + 1,
            title: title,
            amount: amount,
            shared: sharedUsers
        }
        if(editExpenseIndex === -1) {
            setExpenses([...expenses, newExpense]);
        } else {
            let e = expenses;
            e[editExpenseIndex] = newExpense;
            setExpenses(e);
        }
        setCurrentExpense(emptyExpense);
        setShowModal(false);
    }

    const cancelExpense = () => {
        setCurrentExpense(emptyExpense);
        setShowModal(false);
    }

    const handleUserSelection = (selectedUsers) => {
        let shared = selectedUsers.map(u => users[u]);
        setSharedUsers(shared);
    }

    const editExpense = (expense, index) => {
        setCurrentExpense(expense);
        setShowModal(true);
        setEditExpenseIndex(index);
    }

    const removeExpense = (expenses, index) => {
        setExpenses((current) =>
            current.filter((e, i) => i !== index)
        );
    }

    const editTitle = (e) => {
        setTitle(e.target.value);
    }

    const editAmount = (e) => {
        setAmount(e.target.value);
    }

    return <>
        <Divider orientation="left">Expenses</Divider>
        <Button onClick={addExpense}>Add Expense</Button>

        <Modal title="Add Expense" open={showModal} onOk={saveExpense} onCancel={cancelExpense}>
            <Input placeholder="Enter expense Title" value={title} onChange={editTitle}/>
            <Input type="number" placeholder="Enter Amount" value={amount} onChange={editAmount} />
            <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select relevant Users"
                onChange={handleUserSelection}
                options={users.map((u, index) => {
                    return {
                        "label": u.name,
                        "value": index
                    }
                })}
                value={sharedUsers && sharedUsers.length ? sharedUsers.map(u => users.indexOf(u)) : []}
            />
        </Modal>

        <List
            bordered
            dataSource={expenses}
            renderItem={(expense, index) => (
                <List.Item
                    actions={[
                        <Button onClick={() => editExpense(expense, index)}>Edit</Button>,
                        <Button onClick={() => removeExpense(expense, index)}>Remove</Button>
                    ]}
                >
                    {expense.title} - {expense.amount}$
                </List.Item>
            )}
        />

        <Reimbursements users={users} expenses={expenses} />
    </>
}

export default Expenses;