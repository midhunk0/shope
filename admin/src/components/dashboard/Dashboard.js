import React from "react";
import { Outlet } from "react-router-dom";
import { Topbar } from "../topbar/Topbar";


export function Dashboard(){
    return(
        <div>
            <Topbar/>
            <Outlet/>
        </div>
    )
}