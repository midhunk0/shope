import React from "react";
import { Outlet } from "react-router-dom";
import { Topbar } from "../topbar/Topbar";
import { useAuth } from "../../hooks/useAuth";


export function Dashboard(){
    useAuth();
    return(
        <div>
            <Topbar/>
            <Outlet/>
        </div>
    )
}