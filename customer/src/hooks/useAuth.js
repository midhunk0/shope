// @ts-nocheck
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth(){
    const navigate=useNavigate();
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

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