import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from './components/auth/login/Login';
import { Register } from './components/auth/register/Register';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dashboard } from './components/dashboard/Dashboard';
import { ItemsPage } from './components/dashboard/items/itemsPage/ItemsPage';
import { ItemPage } from './components/dashboard/items/itemPage/ItemPage';
import { Wishlist } from './components/dashboard/wishlist/Wishlist';
import { Cart } from './components/dashboard/cart/Cart';
import { Settings } from './components/dashboard/settings/Settings';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/dashboard" element={<Dashboard/>}>
                    <Route path="" element={<Navigate to="items"/>}/>
                    <Route path="items" element={<ItemsPage/>}/>
                    <Route path="item" element={<ItemPage/>}/>
                    <Route path="wishlist" element={<Wishlist/>}/>
                    <Route path="cart" element={<Cart/>}/>
                    <Route path="settings" element={<Settings/>}/>
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
