// @ts-nocheck
import React, { useMemo, useState } from "react";
import "./Login.css"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Login(){
    const [userData, setUserData]=useState({
        credential: "",
        password: "",
        role: "deliveryAgent"
    });
    const [visible, setVisible]=useState(false);
    const images=useMemo(()=>[
        "/images/bose.jpg",
        "/images/apple-watch.jpg",
        "/images/dji.jpg",
        "/images/pocket-camera.jpg",
        "/images/logi-mouse.jpg",
        "/images/i-phone.jpg"
    ], []);
    const navigate=useNavigate();
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    function toggleVisible(){
        setVisible(!visible);
    }
    
    async function loginUser(e){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/admin/loginUser`, {
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

    function handleInputChange(e){
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    return(
        <div className="login">
            <div className="login-form">
                <form onSubmit={loginUser}>
                    <h1>Login to account</h1>
                    <span>
                        <p>Don't have an account?</p>
                        <Link to="/register">Register</Link>
                    </span>
                    <input type="text" name="credential" placeholder="Username or Email" onChange={handleInputChange}/>
                    <div className="login-password">
                        <input type={visible ? "text" : "password"} name="password" placeholder="Password" onChange={handleInputChange}/>
                        <img src={visible ? "/icons/show.png" : "/icons/hide.png"} alt="img" onClick={toggleVisible}/>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
            <div className="login-images">
                {images.map((image, index)=>(
                    <img key={index} src={image} alt="img"/>
                ))}
                <div className="login-logo">
                    <h3>Shope.</h3>
                    <hr/>
                </div>
            </div>
        </div>
    )
}