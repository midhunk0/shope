// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Users.css";
import { trefoil } from "ldrs";

export const Users=()=>{
    const [users, setUsers]=useState([]);
    const [user, setUser]=useState();
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState();
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const [width, setWidth]=useState(window.innerWidth);
    const [showDetails, setShowDetails]=useState(false);
   
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                    prevUsers.map((user)=>user._id===userId ? {
                        ...user, 
                        verified: !user.verified
                    } : user
                ));
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
                if (width < 992) setShowDetails(true);
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
            <div className="admin-users-empty">
                <p>{error}</p>
            </div>
        )
    }

    return(
        <div className="admin-users">
            <h1>Users</h1>
            <div className="admin-users-details">
                {(width>=1080 || !showDetails) && (
                    <table className="admin-users-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Registered On</th>
                                <th>Verified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user=>(
                                <tr key={user._id} onClick={()=>fetchUser(user._id)}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role==="deliveryAgent" ? "delivery agent" : user.role}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString("en-IN", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </td>
                                    <td className="admin-user-verify">
                                        {user.verified ? <img src="/icons/check.png"/> : <img src="/icons/close.png"/>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {(width>=1080 || showDetails) && (
                    user ? (
                        <div className="admin-user-details">
                            {width<1080 && (
                                <button onClick={() => setShowDetails(false)}>Back</button>
                            )}
                            <img src="/images/profile.png" alt=""/>
                            <p>{user.username}</p>
                            <p>{user.email}</p>
                            <p>{user.role === "deliveryAgent" ? "delivery agent" : user.role}</p>
                            <button className={user.verified ? "remove" : "verify"} onClick={(e) => { e.stopPropagation(); toggleVerifyUser(user._id)}}>
                                {user.verified ? "Remove" : "Verify"}
                            </button>
                        </div>
                    ) : (
                        <div className="admin-user-empty">
                            <p>Nothing selected</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};
