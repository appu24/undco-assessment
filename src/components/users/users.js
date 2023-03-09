import { Button, Divider, Input, List } from "antd"
import { useState } from "react"
import Expenses from "../expenses/expenses";

const existingUsers = [{
    id: 1,
    name: "Aparajitha",
    email: "apk@gmail.com",
    amountSpent: 0
}, {
    id: 2,
    name: "Vinay",
    email: "vinay@gmail.com",
    amountSpent: 0
}]

const UsersComponent = (props) => {

    const [users, setUsers] = useState(existingUsers);
    const [newUser, setNewUser] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [updatingUserID, setUpdatingUserID] = useState(-1);

    const addOrUpdateUsers = () => {
        if(updatingUserID === -1) {
            setUsers([...users, {
                id: users.length + 1,
                name: newUser,
                email: newUserEmail,
                amountSpent: 0
            }]);
        } else {
            let u = users;
            u[updatingUserID].name = newUser;
            u[updatingUserID].email = newUserEmail;
            u[updatingUserID].amountSpent = 0;
            setUsers(u);
        }
        setNewUser("");
        setNewUserEmail("");
    }

    const enterNewUser = (e) => {
        setNewUser(e.target.value);
    }

    const enterNewUserEmail = (e) => {
        setNewUserEmail(e.target.value);
    }

    const editUser = (user, index) => {
        setUpdatingUserID(index);
        setNewUser(user.name);
        setNewUserEmail(user.email)
    }

    const removeUser = (user, index) => {
        setUsers((current) =>
            current.filter((u, i) => i !== index)
        );
    }

    return <div>
        <Divider orientation="left">Users</Divider>
        
        <Input style={{ width: 'calc(100% - 200px)' }} value={newUser} placeholder="Enter User Name" onChange={enterNewUser} />
        <Input placeholder="Enter email" onChange={enterNewUserEmail} value={newUserEmail} />
        <Button type="primary" disabled={(newUser === '' && newUserEmail !== "")} onClick={addOrUpdateUsers}>
            {updatingUserID === -1 ? "Add User" : "Update User"}
        </Button>

        <List
            bordered
            dataSource={users}
            renderItem={(user, index) => (
                <List.Item
                    actions={[
                        <Button onClick={() => editUser(user, index)}>Edit</Button>,
                        <Button onClick={() => removeUser(user, index)}>Remove</Button>
                    ]}
                >
                    {user.name} - {user.email}
                </List.Item>
            )}
        />
        <Expenses users={users} />
    </div>
}

export default UsersComponent