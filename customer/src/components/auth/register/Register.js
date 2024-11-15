// @ts-nocheck
import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Register(){
    const [userData, setUserData]=useState({
        username: "", 
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "customer"

    })
    const [visible, setVisible]=useState(false);
    const images=[
        "/images/dji.jpg",
        "/images/apple-watch.jpg",
        "/images/i-phone.jpg",
        "/images/bose.jpg",
        "/images/logi-mouse.jpg",
        "/images/pocket-camera.jpg",
    ];
    const navigate=useNavigate();
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    function toggleVisible(){
        setVisible(!visible);
    }

    async function registerUser(e){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/registerUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                navigate("/dashboard");
            }
            else{
                toast.error(result.messsage);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    return(
        <div className="registerPage">
            <div className="registerForm">
                <form onSubmit={registerUser}>
                    <h1>Create an account</h1>
                    <span>
                        <p>Already have an account?</p>
                        <Link to="/login">Login</Link>
                    </span>
                    <input type="text" placeholder="Username" onChange={(e)=>setUserData({...userData, username: e.target.value})}/>
                    <input type="text" placeholder="Name" onChange={(e)=>setUserData({...userData, name: e.target.value})}/>
                    <input type="email" placeholder="Email" onChange={(e)=>setUserData({...userData, email: e.target.value})}/>
                    <input type="text" placeholder="Phone Number" onChange={(e)=>setUserData({...userData, phone: e.target.value})}/>
                    <div className="registerPassword">
                        <input type={visible ? "text" : "password"} placeholder="Password" onChange={(e)=>setUserData({...userData, password: e.target.value})}/>
                        <img src={visible ? "/icons/show.png" : "/icons/hide.png"} alt="img" onClick={toggleVisible}/>
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
            <div className="registerImages">
                {images.map((image, index)=>(
                    <img key={index} src={image} alt="img"/>
                ))}
                <div className="registerLogo">
                    <h3>Shope.</h3>
                    <hr/>
                </div>
            </div>
        </div>
    )
}