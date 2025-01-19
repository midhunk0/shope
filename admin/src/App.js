import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from './components/auth/login/Login';
import { Register } from './components/auth/register/Register';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Dashboard } from './components/dashboard/Dashboard';
import { Users } from './components/dashboard/users/Users';
import { Home } from './components/dashboard/home/Home';
import { Orders } from './components/dashboard/orders/Orders';
import { Account } from './components/dashboard/account/Account';
import { Items } from './components/dashboard/items/Items';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/dashboard" element={<Dashboard/>}>
                    <Route path="" element={<Home/>}/>
                    <Route path="users" element={<Users/>}/>
                    <Route path="items" element={<Items/>}/>
                    <Route path="orders" element={<Orders/>}/>
                    <Route path="account" element={<Account/>}/>
                </Route>
            </Routes>
            <ToastContainer
				toastStyle={{background: "#00D7FF"}}
                position="bottom-right" 
                autoClose={2000} 
                hideProgressBar={true} 
                newestOnTop={false} 
                closeOnClick={true} 
                rtl={false}
                pauseOnFocusLoss={true} 
                draggable={true} 
                theme="colored"
                pauseOnHover={true}
            />
        </BrowserRouter>
    );
}

export default App;
