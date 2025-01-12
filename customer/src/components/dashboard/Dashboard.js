// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Topbar } from "../topbar/Topbar";
import { useAuth } from "../../hooks/useAuth";
import "./Dashboard.css";

export function Dashboard(){
    useAuth();
    const [verified, setVerified]=useState(null);
    const apiUrl=process.env.REACT_APP_BACKEND_URL;
    const isVerified=useCallback(async ()=>{
        try{
            const response=await fetch(`${apiUrl}/isVerified`, {
                method: "GET",
                credentials: "include"
            })
            const result=await response.json();
            setVerified(result.verified);
        }
        catch(error){
            console.log(error);
            setVerified(false);
        }
    }, [apiUrl]);

    useEffect(()=>{
        isVerified();
    }, isVerified)

    return(
        <div>
            <Topbar/>
            {verified ? 
                <Outlet/> : (
                    <div className="not-verified">
                        <h2>{`You are not verified yet, wait for some times :)`}</h2>
                    </div>
                )
            }
        </div>
    )
}