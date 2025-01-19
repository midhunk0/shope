import React from "react";
import { Topbar } from "../topbar/Topbar";
import { Outlet } from "react-router-dom";

export const Dashboard=()=>{
    return(
        <div>
            <Topbar/>
            <Outlet/>
        </div>
    )
}