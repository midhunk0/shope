// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Users.css";
import { trefoil } from "ldrs";

export const Users=()=>{
    const [users, setUsers]=useState([]);
    const [user, setUser]=useState();
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState();
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
                if(response){
                    setLoading(false);
                }
                if(response.ok) {
                    setUsers(result.users);
                }
                else{
                    setError(result.message);
                }
            }
            catch(error){
                console.log("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [apiUrl]);

    const toggleVerifyUser=async(userId)=>{
        try{
            const response=await fetch(`${apiUrl}/admin/toggleVerifyUser/${userId}`, {
                method: "PUT",
                credentials: "include"
            });
            if(response.ok){
                setUsers((prevUsers)=>
                    prevUsers.map((user)=>
                        user._id===userId ? {
                            ...user, 
                            verified: !user.verified
                        } : user
                    )
                );
                setUser({...user, verified: !user.verified});
            }
        }
        catch(error){
            console.log("Error while toggle verification: ", error);
        }
    }

    const fetchUser=async(userId)=>{
        try{
            const response=await fetch(`${apiUrl}/admin/fetchUser/${userId}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setUser(result.user);
            }
        }
        catch(error){
            console.log("Error while fetching the user: ", error);
        }
    }

    if(loading){
        return(
            <div className="loading">
                <l-trefoil
                    size="50"
                    stroke="5"
                    stroke-length="0.15"
                    bg-opacity="0.1"
                    speed="1.4"
                    color="var(--red)"
                ></l-trefoil>
            </div>
        ) 
    }

    if(users.length===0){
        return(
            <div className="users-empty">
                <p>{error}</p>
            </div>
        )
    }

    return(
        <div className="users">
            <h1>Users</h1>
            <div className="users-details">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Verified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user=>(
                            <tr key={user._id} onClick={()=>fetchUser(user._id)}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td><button className={user.verified ? "remove" : "verify"} onClick={()=>toggleVerifyUser(user._id)}>
                                    {user.verified ? "Remove" : "Verify"}
                                </button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {user ? (
                    <div className="user-details">
                        <img src="/images/profile.png" alt=""/>
                        <p>{user.username}</p>
                        <p>{user.email}</p>
                        <p>{user.role}</p>
                        <button className={user.verified ? "remove" : "verify"} onClick={()=>toggleVerifyUser(user._id)}>
                            {user.verified ? "Remove" : "Verify"}
                        </button>
                    </div>
                ):(
                    <div className="user-empty">
                        <p>Nothing selected</p>
                    </div>
                )}
            </div>
        </div>
    );
};
