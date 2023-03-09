import { Button, Divider, Input, List, Modal, Select } from "antd";
import { useState } from "react";

import Payback from "../payback/payback";

const Reimbursements = ({users, expenses}) => {

    const emptyReimbursement = {
        id: 0,
        title: "",
        amount: 0,
        paidBy: {},
        paidTo: {}
    };

    const [showModal, setShowModal] = useState(false);
    const [reimbs, setReimbs] = useState([]);
    const [editReimbIndex, setEditReimbIndex] = useState(-1);

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0);
    const [paidBy, setPaidBy] = useState({});
    const [paidTo, setPaidTo] = useState({});

    const setCurrentReimb = (e) => {
        setTitle(e.title);
        setAmount(e.amount);
        setPaidBy(e.paidBy);
        setPaidTo(e.paidTo);
    }

    const addReimb = () => {
        setCurrentReimb(emptyReimbursement);
        setShowModal(true);
    }

    const saveReimb = () => {
        if(!title || !amount || !paidBy || !paidTo || paidBy === paidTo) return;

        const newReimb = {
            id: reimbs.length + 1,
            title: title,
            amount: amount,
            paidBy: paidBy,
            paidTo: paidTo
        }
        if(editReimbIndex === -1) {
            setReimbs([...reimbs, newReimb]);
        } else {
            let e = expenses;
            e[editReimbIndex] = newReimb;
            setReimbs(e);
        }
        setCurrentReimb(emptyReimbursement);
        setShowModal(false);
    }

    const cancelReimb = () => {
        setCurrentReimb(emptyReimbursement);
        setShowModal(false);
    }

    const handlePaidByUserSelection = (u) => {
        setPaidBy(users[u]);
    }

    const handlePaidToUserSelection = (u) => {
        setPaidTo(users[u]);
    }

    const editReimb = (reimb, index) => {
        setCurrentReimb(reimb);
        setShowModal(true);
        setEditReimbIndex(index);
    }

    const removeReimb = (reimb, index) => {
        setReimbs((current) =>
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
        <Divider orientation="left">Reimbursements</Divider>
        <Button onClick={addReimb}>Add Reimbursements</Button>

        <Modal title="Add Reimbursement" open={showModal} onOk={saveReimb} onCancel={cancelReimb}>
            <Input placeholder="Enter Reimbursement Title" value={title} onChange={editTitle}/>
            <Input type="number" placeholder="Enter Amount" value={amount} onChange={editAmount} />
            <Select
                allowClear
                style={{ width: '100%' }}
                placeholder="Amount Paid By"
                onChange={handlePaidByUserSelection}
                options={users.map((u, index) => {
                    return {
                        "label": u.name,
                        "value": index
                    }
                })}
                value={paidBy}
            />
            <Select
                allowClear
                style={{ width: '100%' }}
                placeholder="Amount paid to"
                onChange={handlePaidToUserSelection}
                options={users.map((u, index) => {
                    return {
                        "label": u.name,
                        "value": index
                    }
                })}
                value={paidTo}
            />
        </Modal>

        <List
            bordered
            dataSource={reimbs}
            renderItem={(reimb, index) => (
                <List.Item
                    actions={[
                        <Button onClick={() => editReimb(reimb, index)}>Edit</Button>,
                        <Button onClick={() => removeReimb(reimb, index)}>Remove</Button>
                    ]}
                >
                    {reimb.title} - Paid {reimb.amount}$ to {reimb.paidTo.name}
                </List.Item>
            )}
        />

        <Payback users={users} expenses={expenses} reimbursements={reimbs} />
    </>
}

export default Reimbursements;