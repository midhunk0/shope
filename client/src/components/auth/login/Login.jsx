// @ts-nocheck
import React, { useMemo, useState } from "react";
import "./Login.css"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Login({ role }){
    const navigate=useNavigate();
    const apiUrl=import.meta.env.VITE_APP_API_URL;

    const [loginData, setLoginData]=useState({
        credential: "",
        password: "",
        role: role
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
    
    async function loginUser(e){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/loginUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                navigate(`/${role}/home`);
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
        setLoginData({ 
            ...loginData, 
            [e.target.name]: e.target.value 
        });
    }

    return(
        <div className="login">
            <div className="login-form">
                <form onSubmit={loginUser}>
                    <h1>Login to {role} account</h1>
                    <span>
                        <p>Don't have an account?</p>
                        <Link to={`/${role}/register`}>Register</Link>
                    </span> 
                    <input type="text" name="credential" placeholder="Username or Email" onChange={handleInputChange}/>
                    <div className="login-password">
                        <input type={visible ? "text" : "password"} name="password" placeholder="Password" onChange={handleInputChange}/>
                        <img src={visible ? "/icons/show.png" : "/icons/hide.png"} alt="img" onClick={()=>setVisible(prev=>!prev)}/>
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