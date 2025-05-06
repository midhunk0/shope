// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./AccountPage.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function AccountPage({ user }){
    const [updateDetails, setUpdateDetails]=useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        address: ""
    });
    const apiUrl=import.meta.env.VITE_APP_API_URL;
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
                navigate(`/${user}/login`);
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
                navigate(`/${user}/register`);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    function handleInputChange(e){
        setUpdateDetails({ ...updateDetails, [e.target.name]: e.target.value });
    }
    
    return(
        <div className="account">
            <h1>Profile</h1>
            <form className="account-form">
                <div className="account-form-image-div">
                    <img src="/images/bose.jpg" alt="img"/>
                </div>
                <div className="account-update-form">
                    <div className="account-update-form-div">
                        <label>Name</label>
                        <input type="text" value={updateDetails.name} name="name" onChange={handleInputChange}/>
                    </div>
                    <div className="account-update-form-div">
                        <label>Username</label>
                        <input type="text" value={updateDetails.username} name="username" onChange={handleInputChange}/>
                    </div>
                    <div className="account-update-form-div">
                        <label>Email</label>
                        <input type="email" value={updateDetails.email} name="email" onChange={handleInputChange}/>
                    </div>
                    <div className="account-update-form-div">
                        <label>Phone</label>
                        <input type="text" value={updateDetails.phone} name="phone" onChange={handleInputChange}/>
                    </div>
                    <div className="account-update-form-div">
                        <label>Address</label>
                        <input type="text" value={updateDetails.address} name="address" onChange={handleInputChange}/>
                    </div>
                    <div className="account-update-form-buttons">
                        <button type="button" className="account-update-form-update-button" onClick={updateUser}>Update</button>
                        <button type="button" className="account-update-form-logout-button" onClick={logoutUser}>Logout</button>
                        <button type="button" className="account-update-form-delete-button" onClick={deleteUser}>Delete</button>
                    </div>
                </div>
            </form>
        </div>
    )
}