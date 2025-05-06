import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Login } from "./components/auth/login/Login";
import { Register } from "./components/auth/register/Register";

import { AdminDashboard } from "./users/admin/Dashboard";
import { Home as AdminHome } from "./users/admin/home/Home";
import { Users as AdminUsers } from "./users/admin/users/Users";
import { Items as AdminItems } from "./users/admin/items/Items";
import { Orders as AdminOrders } from "./users/admin/orders/Orders";
import { Account as AdminAccount } from "./users/admin/account/Account";

import { CustomerDashboard } from "./users/customer/Dashboard";
import { Home as CustomerHome } from "./users/customer/home/Home";
import { ItemsPage as CustomerItemsPage } from "./users/customer/items/itemsPage/ItemsPage";
import { ItemPage as CustomerItemPage } from "./users/customer/items/itemPage/ItemPage";
import { Review as CustomerReview } from "./users/customer/items/review/Review";
import { Wishlist as CustomerWishlist } from "./users/customer/wishlist/Wishlist";
import { Cart as CustomerCart } from "./users/customer/cart/Cart";
import { Orders as CustomerOrders } from "./users/customer/orders/Orders";
import { Order as CustomerOrder } from "./users/customer/orders/order/Order";
import { Account as CustomerAccount } from "./users/customer/account/Account";

import { SellerDashboard } from "./users/seller/Dashboard";
import { Home as SellerHome } from "./users/seller/home/Home";
import { ItemsPage as SellerItemsPage } from "./users/seller/items/itemsPage/ItemsPage";
import { ItemPage as SellerItemPage } from "./users/seller/items/itemPage/ItemPage";
import { Create as SellerCreate } from "./users/seller/create/Create";
import { Update as SellerUpdate } from "./users/seller/update/Update";
import { Transactions as SellerTransactions } from "./users/seller/transactions/Transactions";
import { Account as SellerAccount } from "./users/seller/account/Account";

import { DeliveryDashboard } from "./users/delivery/Dashboard";
import { Home as DeliveryHome } from "./users/delivery/home/Home";
import { Orders as DeliveryOrders } from "./users/delivery/orders/Orders";
import { Account as DeliveryAccount } from "./users/delivery/account/Account";
import Landing from "./landing/Landing";

function CustomerLayout(){
    return(
        <Outlet/>
    )
}

function AdminLayout(){
    return(
        <Outlet/>
    )
}

function SellerLayout(){
    return(
        <Outlet/>
    )
}

function DeliveryLayout(){
    return(
        <Outlet/>
    )
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path="/customer" element={<CustomerLayout/>}>
                    <Route index element={<Navigate to="login"/>}/>
                    <Route path="login" element={<Login role="customer"/>}/>
                    <Route path="register" element={<Register role="customer"/>}/>
                    <Route path="" element={<CustomerDashboard/>}>
                        <Route index element={<Navigate to="home"/>}/>
                        <Route path="home" element={<CustomerHome/>}/>
                        <Route path="items" element={<CustomerItemsPage/>}/>
                        <Route path="item/:itemId" element={<CustomerItemPage/>}/>
                        <Route path="review/:orderId/:itemId" element={<CustomerReview/>}/>
                        <Route path="wishlist" element={<CustomerWishlist/>}/>
                        <Route path="cart" element={<CustomerCart/>}/>
                        <Route path="orders" element={<CustomerOrders/>}/>
                        <Route path="order/:orderId" element={<CustomerOrder/>}/>
                        <Route path="account" element={<CustomerAccount/>}/>
                    </Route>
                </Route>
                <Route path="/admin" element={<AdminLayout/>}>
                    <Route index element={<Navigate to="login"/>}/>
                    <Route path="login" element={<Login role="admin"/>}/>
                    <Route path="register" element={<Register role="admin"/>}/>
                    <Route path="" element={<AdminDashboard/>}>
                        <Route index element={<Navigate to="home"/>}/>
                        <Route path="home" element={<AdminHome/>}/>
                        <Route path="users" element={<AdminUsers/>}/>
                        <Route path="items" element={<AdminItems/>}/>
                        <Route path="orders" element={<AdminOrders/>}/>
                        <Route path="account" element={<AdminAccount/>}/>
                    </Route>
                </Route>
                <Route path="/seller" element={<SellerLayout/>}>
                    <Route index element={<Navigate to="login"/>}/>
                    <Route path="login" element={<Login role="seller"/>}/>
                    <Route path="register" element={<Register role="seller"/>}/>
                    <Route path="" element={<SellerDashboard/>}>
                        <Route index element={<Navigate to="home"/>}/>
                        <Route path="home" element={<SellerHome/>}/>
                        <Route path="items" element={<SellerItemsPage/>}/>
                        <Route path="item" element={<SellerItemPage/>}/>
                        <Route path="add" element={<SellerCreate/>}/>
                        <Route path="update/:itemId" element={<SellerUpdate/>}/>
                        <Route path="transactions" element={<SellerTransactions/>}/>
                        <Route path="account" element={<SellerAccount/>}/>
                    </Route>
                </Route>
                <Route path="/deliveryAgent" element={<DeliveryLayout/>}>
                    <Route index element={<Navigate to="login"/>}/>
                    <Route path="login" element={<Login role="deliveryAgent"/>}/>
                    <Route path="register" element={<Register role="deliveryAgent"/>}/>
                    <Route path="" element={<DeliveryDashboard/>}>
                        <Route index element={<Navigate to="home"/>}/>
                        <Route path="home" element={<DeliveryHome/>}/>
                        <Route path="orders" element={<DeliveryOrders/>}/>
                        <Route path="account" element={<DeliveryAccount/>}/>
                    </Route>
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
        </Router>
    )
}

export default App;
