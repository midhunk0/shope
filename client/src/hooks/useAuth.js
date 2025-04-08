/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth(){
    const navigate=useNavigate();
    const apiUrl=import.meta.env.VITE_APP_DEV_URL;

    useEffect(()=>{
        async function checkAuth(){
            try{
                const response=await fetch(`${apiUrl}/isAuth`, {
                    method: "GET",
                    credentials: "include"
                })
                const result=await response.json();
                if(!result.authenticated){
                    navigate("/");
                }
            }
            catch(error){
                console.log(error);
                navigate("/");
            }
        }
        checkAuth();
    }, [navigate]);
}