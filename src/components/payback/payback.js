import { Avatar, Divider, List } from "antd";
import { useEffect, useState } from "react";

const Payback = ({users, expenses, reimbursements}) => {

    const emptyPayback = {
        user: {},
        expense: {},
        amountSpent: 0,
        // amountPending: []
    }
    const [expensePayback, setExpensePayback] = useState([]);
    const [userExpensePaybackMatrix, setUserExpensePaybackMatrix] = useState([]);

    useEffect(() => {
        if(!expenses || !expenses.length) return;
        calculatePayback();
    }, [users, expenses]);

    const calculatePayback = () => {
        let e = [];
        let userPaybackMatrix = users;

        // Calculate Amount spent by each member
        for(let i=0; i<expenses.length; i++) {
            const amountSpent = parseFloat(expenses[i].amount)/expenses[i].shared.length;
            e.push({
                ...expenses[i],
                amountSpent
            });

            // expenses[i].shared.forEach((u) => {
            //     userPaybackMatrix[users.findIndex(u)].amountSpent += parseFloat(amountSpent);
            // });
        }

        console.log("user payback m - ", userPaybackMatrix);

        setExpensePayback(e);

        // Creating a user matrix for calculating amount owed to each other
        userPaybackMatrix = userPaybackMatrix.map((upm) => {
            upm.userMatrix = [];
            upm.userMatrix = users.map((u) => ({
                ...u,
                amountTheyPaid: 0,
                amountIPaid: 0
            }));
            return upm;
        })

        console.log("creatong user payback m - ", userPaybackMatrix);

        // Compare user payback matrix with reimbursements
        for(let i=0; i<reimbursements.length; i++) {
            let r = reimbursements[i];

            userPaybackMatrix = userPaybackMatrix.map((upm) => {
                if(upm.id === r.paidBy.id) {
                    upm.userMatrix = upm.userMatrix.map((um) => {
                        if(um.id === r.paidTo.id) {
                            um.amountIPaid += r.amount;
                        }
                        return um;
                    });
                }

                if(upm.id === r.paidTo.id) {
                    upm.userMatrix = upm.userMatrix.map((um) => {
                        if(um.id === r.paidBy.id) {
                            um.amountTheyPaid += r.amount;
                        }
                        return um;
                    });
                }
                return upm;
            })
        }

        console.log("final user payback m - ", userPaybackMatrix);
        setUserExpensePaybackMatrix(userPaybackMatrix);
    }

    const calculateAndRender = (ep, userName) => {
        let amountDiff = parseFloat(ep.amountIPaid) - parseFloat(ep.amountTheyPaid);

        switch(amountDiff) {
            case (amountDiff < 0):
                return `${userName} owes ${ep.name} ${amountDiff}$`;
            case (amountDiff > 0):
                return `${userName} lended ${ep.name} ${amountDiff}$`;
            case (amountDiff === 0):
            default:
                return `${userName} owes ${ep.name} 0$`;
        }
    }

    return <>
        <Divider orientation="left">Expenditure Report</Divider>
        <List
            bordered
            dataSource={expensePayback}
            renderItem={(ep, index) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={`https://joesch.moe/api/v1/random?key=${index}`} />}
                        title={`${ep.title} - ${ep.amount}$`}
                        description={<ul>
                            {ep.shared.map((u) => <p>{u.name} spent ${ep.amountSpent}</p>)}
                        </ul>}
                    />
                </List.Item>
            )}
        />

    <Divider orientation="left">Expense Payback Report</Divider>
        <List
            bordered
            dataSource={userExpensePaybackMatrix[0]?.userMatrix || []}
            renderItem={(ep, index) => (
                <List.Item>
                    {calculateAndRender(ep, userExpensePaybackMatrix[0].name)}
                </List.Item>
            )}
        />
    </>
}

export default Payback;