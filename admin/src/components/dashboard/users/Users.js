// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Users.css";
import { trefoil } from "ldrs";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState("all");
    const [openRole, setOpenRole]=useState(false);
    const [openVerification, setOpenVerification]=useState(false);
    const [verificationFilter, setVerificationFilter] = useState("all");
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    trefoil.register();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${apiUrl}/admin/fetchUsers`, {
                    method: "GET",
                    credentials: "include",
                });
                const result = await response.json();
                if (response.ok) {
                    setLoading(false);
                    setUsers(result.users);
                    setFilteredUsers(result.users); 
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        let filteredUsers = [...users];
        if (roleFilter !== "all") {
            filteredUsers = filteredUsers.filter(user => user.role.toLowerCase() === roleFilter);
        }
        if (verificationFilter !== "all") {
            filteredUsers = filteredUsers.filter(user =>
                verificationFilter === "verified" ? user.verified : !user.verified
            );
        }
        setFilteredUsers(filteredUsers);
    }, [roleFilter, verificationFilter, users]);

    function openRoleList(){
        setOpenRole(!openRole);
    }

    function openVerificationList(){
        setOpenVerification(!openVerification);
    }

    return loading ? (
        <div className="loading">
            <l-trefoil
                size="50"
                stroke="5"
                stroke-length="0.15"
                bg-opacity="0.1"
                speed="1.4"
                color="var(--red)"
            ></l-trefoil>
            <p>Loading users...</p>
        </div>
    ) : (
        <div className="users">
            {users.length > 0 ? (
                <>
                    <h1>Users</h1>
                    <div className="users-tableContainer">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>
                                        <button onClick={openRoleList} className="users-selectionButton">
                                            {roleFilter==="all" ? "All Roles" : roleFilter}
                                            <img src={openRole ? "/icons/up-dark.png" : "/icons/down-dark.png"} alt="img"/>
                                        </button>
                                        {openRole && (
                                            <div className="users-tableOptions rolesOptions">
                                                <button value="All roles" onClick={()=>setRoleFilter("All roles")}>All Roles</button>
                                                {[...new Set(users.map(user=>user.role))].map((type, index)=>(
                                                    <button value={type} key={index} onClick={()=>setRoleFilter(type)}>{type}</button>
                                                ))}
                                            </div>
                                        )}
                                    </th>
                                    <th>
                                        <button onClick={openVerificationList} className="users-selectionButton">
                                            {verificationFilter==="all" ? "All Verifications" : verificationFilter==="verified" ? "Verified" : "Not Verified"}
                                            <img src={openVerification ? "/icons/up-dark.png" : "/icons/down-dark.png"} alt="img"/>
                                        </button>
                                        {openVerification && (
                                            <div className="users-tableOptions verificationOptions">
                                                <button onClick={() => setVerificationFilter("all")}>All Verifications</button>
                                                <button onClick={() => setVerificationFilter("verified")}>Verified</button>
                                                <button onClick={() => setVerificationFilter("not verified")}>Not Verified</button>
                                            </div>
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.username}</td>
                                        <td>{user.role}</td>
                                        <td>{user.verified ? "Verified" : "Not Verified"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="users-empty">
                    <p>No Users</p>
                </div>
            )}
        </div>
    );
};
