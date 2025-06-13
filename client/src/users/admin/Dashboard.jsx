import { Outlet } from "react-router-dom";
import { Topbar } from "./topbar/Topbar";

export function AdminDashboard(){
    return(
        <div>
            <Topbar/>
            <Outlet/>
        </div>
    )
}