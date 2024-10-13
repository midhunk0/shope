// @ts-nocheck
import React, { useState } from "react";
import "./Login.css"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Login(){
    const [userData, setUserData]=useState({
        credential: "",
        password: "",
        role: "customer"
    });
    const [visible, setVisible]=useState(false);
    const images=[
        "/images/bose.jpg",
        "/images/apple-watch.jpg",
        "/images/dji.jpg",
        "/images/pocket-camera.jpg",
        "/images/logi-mouse.jpg",
        "/images/i-phone.jpg"
    ];
    const navigate=useNavigate();
    const apiUrl=process.env.REACT_APP_BACKEND_URL;
    
    function toggleVisible(){
        setVisible(!visible);
    }
    
    async function loginUser(e){
        e.preventDefault();
        try{
            console.log(apiUrl);
            const response=await fetch(`${apiUrl}/loginUser`, {
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
                toast.error(result.message);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    return(
        <div className="loginPage">
            <div className="loginForm">
                <form onSubmit={loginUser}>
                    <h1>Login to account</h1>
                    <span>
                        <p>Don't have an account?</p>
                        <Link to="/register">Register</Link>
                    </span>
                    <input type="text" placeholder="Username or Email" onChange={(e)=>setUserData({...userData, credential: e.target.value})}/>
                    <div className="loginPassword">
                        <input type={visible ? "text" : "password"} placeholder="Password" onChange={(e)=>setUserData({...userData, password: e.target.value})}/>
                        <img src={visible ? "/icons/show.png" : "/icons/hide.png"} alt="img" onClick={toggleVisible}/>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
            <div className="loginImages">
                {images.map((image, index)=>(
                    <img key={index} src={image} alt="img"/>
                ))}
                <div className="loginLogo">
                    <h3>Shope.</h3>
                    <hr/>
                </div>
            </div>
        </div>
    )
}