// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Account(){
    const [userDetails, setUserDetails]=useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        address: ""
    });
    const navigate=useNavigate();
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    useEffect(()=>{
        async function getProfile(){
            try{
                const response=await fetch(`${apiUrl}/getProfile`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setUserDetails({
                        name: result.user?.name || "", 
                        username: result.user?.username || "",
                        email: result.user?.email || "",
                        phone: result.user?.phone || "",
                        address: result.user?.address || ""
                    });
                }
                else{
                    navigate("/");
                }
            }
            catch(error){
                console.log(error);
            }
        }
        getProfile();
    }, [ apiUrl, navigate]);

    async function updateUser(e){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/updateUser`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userDetails),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    async function logoutUser(){
        try{
            const response=await fetch(`${apiUrl}/logoutUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                navigate("/login");
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    async function deleteUser(){
        try{
            const response=await fetch(`${apiUrl}/deleteUser`, {
                method: "DELETE",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                navigate("/register");
            }
        }
        catch(error){
            console.log(error);
        }
    }

    return(
        <div className="account">
            <h1>Profile</h1>
            <form>
                <div className="imgDiv">
                    <img src="/images/bose.jpg" alt="img"/>
                </div>
                <div className="updateForm">
                    <div className="updateDiv">
                        <label>Name</label>
                        <input type="text" value={userDetails.name} onChange={(e)=>setUserDetails({...userDetails, name: e.target.value})}/>
                    </div>
                    <div className="updateDiv">
                        <label>username</label>
                        <input type="text" value={userDetails.username} onChange={(e)=>setUserDetails({...userDetails, username: e.target.value})}/>
                    </div>
                    <div className="updateDiv">
                        <label>Email</label>
                        <input type="email" value={userDetails.email} onChange={(e)=>setUserDetails({...userDetails, email: e.target.value})}/>
                    </div>
                    <div className="updateDiv">
                        <label>Phone</label>
                        <input type="text" value={userDetails.phone} onChange={(e)=>setUserDetails({...userDetails, phone: e.target.value})}/>
                    </div>
                    <div className="updateDiv">
                        <label>Address</label>
                        <input type="text" value={userDetails.address} onChange={(e)=>setUserDetails({...userDetails, address: e.target.value})}/>
                    </div>
                    <div className="profileButtons">
                        <button type="button" className="updateButton" onClick={updateUser}>Update</button>                                
                        <button type="button" className="logoutButton" onClick={logoutUser}>Logout</button>            
                        <button type="button" className="deleteButton" onClick={deleteUser}>Delete</button>                                
                    </div>
                </div>
            </form>
        </div>
    )
}