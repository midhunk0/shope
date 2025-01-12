// @ts-nocheck
import React, { useMemo, useState } from "react";
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
        role: "deliveryAgent"

    })
    const [visible, setVisible]=useState(false);
    const images=useMemo(()=>[
        "/images/dji.jpg",
        "/images/apple-watch.jpg",
        "/images/i-phone.jpg",
        "/images/bose.jpg",
        "/images/logi-mouse.jpg",
        "/images/pocket-camera.jpg",
    ], []);
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

    function handleInputChange(e){
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }
    return(
        <div className="register">
            <div className="register-form">
                <form onSubmit={registerUser}>
                    <h1>Create an account</h1>
                    <span>
                        <p>Already have an account?</p>
                        <Link to="/login">Login</Link>
                    </span>
                    <input type="text" name="username" placeholder="Username" onChange={handleInputChange}/>
                    <input type="text" name="name" placeholder="Name" onChange={handleInputChange}/>
                    <input type="email" name="email" placeholder="Email" onChange={handleInputChange}/>
                    <input type="text" name="phone" placeholder="Phone Number" onChange={handleInputChange}/>
                    <div className="register-password">
                        <input type={visible ? "text" : "password"} name="password" placeholder="Password" onChange={handleInputChange}/>
                        <img src={visible ? "/icons/show.png" : "/icons/hide.png"} alt="img" onClick={toggleVisible}/>
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