// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Users.css";
import { trefoil } from "ldrs";

export const Users=()=>{
    const [users, setUsers]=useState([]);
    const [loading, setLoading]=useState(true);
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    trefoil.register();

    useEffect(()=>{
        const fetchUsers=async()=>{
            try{
                const response=await fetch(`${apiUrl}/admin/fetchUsers`, {
                    method: "GET",
                    credentials: "include",
                });
                const result=await response.json();
                if (response.ok) {
                    setLoading(false);
                    setUsers(result.users);
                }
            }
            catch(error){
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

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
                                    <th>Role</th>
                                    <th>Verified</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
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
