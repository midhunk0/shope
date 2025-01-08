// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Topbar } from "../topbar/Topbar";
import { useAuth } from "../../hooks/useAuth";


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

    if(verified===null){
        return <div>Loading...</div>
    }
    return(
        <div>
            <Topbar/>
            <p>{isVerified}</p>
            {verified ? 
                <Outlet/> : <h1>hello</h1>
            }
        </div>
    )
}