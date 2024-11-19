// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Account.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function Account(){
    const [updateDetails, setUpdateDetails]=useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        address: ""
    });
    const apiUrl=process.env.REACT_APP_BACKEND_URL;
    const navigate=useNavigate();

    useEffect(()=>{
        async function getProfile(){
            try{
                const response=await fetch(`${apiUrl}/getProfile`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setUpdateDetails({
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
                body: JSON.stringify(updateDetails),
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
                        <input type="text" value={updateDetails.name} onChange={(e)=>setUpdateDetails({...updateDetails, name: e.target.value})}/>
                    </div>
                    <div className="updateDiv">
                        <label>Username</label>
                        <input type="text" value={updateDetails.username} onChange={(e)=>setUpdateDetails({...updateDetails, username: e.target.value})}/>
                    </div>
                    <div className="updateDiv">
                        <label>Email</label>
                        <input type="email" value={updateDetails.email} onChange={(e)=>setUpdateDetails({...updateDetails, email: e.target.value})}/>
                    </div>
                    <div className="updateDiv">
                        <label>Phone</label>
                        <input type="text" value={updateDetails.phone} onChange={(e)=>setUpdateDetails({...updateDetails, phone: e.target.value})}/>
                    </div>
                    <div className="updateDiv">
                        <label>Address</label>
                        <input type="text" value={updateDetails.address} onChange={(e)=>setUpdateDetails({...updateDetails, address: e.target.value})}/>
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