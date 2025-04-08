/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Topbar } from "./topbar/Topbar";
import { useAuth } from "../../hooks/useAuth";
import "./Dashboard.css";

export function DeliveryDashboard(){
    useAuth();
    const location=useLocation();
    const [verified, setVerified]=useState(null);
    const apiUrl=import.meta.env.VITE_APP_DEV_URL;
    const excludedPage=["/delivery/dashboard/account"];
    const isVerified=useCallback(async()=>{
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
        if(excludedPage.includes(location.pathname)){
            setVerified(true)
        } 
        else{
            isVerified();
        }
    }, [location.pathname, isVerified])

    return(
        <div>
            <Topbar/>
            {verified ? 
                <Outlet/> : (
                    <div className="not-verified">
                        <p>{`You are not verified yet, wait for some times :)`}</p>
                    </div>
                )
            }
        </div>
    )
}