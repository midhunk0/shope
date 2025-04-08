// @ts-nocheck
import React, { useState, useMemo } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"

export function Register({ role }){
    const navigate=useNavigate();
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    
    const [registerData, setRegisterData]=useState({
        username: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        role: role
    });
    const [visible, setVisible]=useState(false);
    const images=useMemo(()=>[
        "/images/dji.jpg",
        "/images/apple-watch.jpg",
        "/images/i-phone.jpg",
        "/images/bose.jpg",
        "/images/logi-mouse.jpg",
        "/images/pocket-camera.jpg",
    ], []);

    async function registerUser(e){
        e.preventDefault();
        try{
            const response=await fetch(`${apiUrl}/registerUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
                credentials: "include"
            });
            const result=await response.json();
            console.log(result);
            if(response.ok){
                toast.success(result.message);
                {role==="customer" ? navigate("/dashboard") : navigate(`/${role}/dashboard`) };
            }
            else{
                toast.error(result.messsage);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    function handleInputChange(e){
        setRegisterData({ 
            ...registerData, 
            [e.target.name]: e.target.value 
        });
    }

    return(
        <div className="register">
            <div className="register-form">
                <form onSubmit={registerUser}>
                    <h1>Create an {role} account</h1>
                    <span>
                        <p>Already have an account?</p>
                        {role==="customer" ? <Link to="/login">Login</Link> : <Link to={`/${role}/login`}>Login</Link>}
                        
                    </span>
                    <input type="text" name="username" placeholder="Username" onChange={handleInputChange}/>
                    <input type="text" name="name" placeholder="Name" onChange={handleInputChange}/>
                    <input type="email" name="email" placeholder="Email" onChange={handleInputChange}/>
                    <input type="text" name="phone" placeholder="Phone Number" onChange={handleInputChange}/>
                    <div className="register-password">
                        <input type={visible ? "text" : "password"} name="password" placeholder="Password" onChange={handleInputChange}/>
                        <img src={visible ? "/icons/show.png" : "/icons/hide.png"} alt="img" onClick={()=>setVisible(prev=>!prev)}/>
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
            <div className="register-images">
                {images.map((image, index)=>(
                    <img key={index} src={image} alt="img"/>
                ))}
                <div className="register-logo">
                    <h3>Shope.</h3>
                    <hr/>
                </div>
            </div>
        </div>
    )
}