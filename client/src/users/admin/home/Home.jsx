// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Home.css";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export const Home=()=>{
    const [rolesData, setRolesData]=useState({
        labels: [],
        datasets: [{
                label: "Number of users",
                data: [],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            },
        ],
    });
    const [ordersData, setOrdersData]=useState({
        labels: [],
        datasets: []
    })

    const apiUrl=import.meta.env.VITE_APP_DEV_URL;
    useEffect(()=>{
        const fetchRolesData=async()=>{
            try{
                const response=await fetch(`${apiUrl}/admin/usersCount`, {
                    method: "GET",
                    credentials: "include",
                });
                const result=await response.json();
                if(response.ok){
                    const labels=result.users.map((role) => role.role);
                    const data=result.users.map((role) => role.count);
                    setRolesData({
                        labels: labels,
                        datasets: [{
                            label: "Number of users",
                            data: data,
                            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                        }],
                    });
                } 
                else{
                    console.log("Error fetching data:", result.message);
                }
            } 
            catch(error){
                console.log("Error while fetching users role data: ", error);
            }
        };

        const fetchOrdersPerMonth=async()=>{
            try{
                const response=await fetch(`${apiUrl}/admin/ordersPerMonth`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    const labels=Object.keys(result.ordersPerMonth); 
                    const data=Object.values(result.ordersPerMonth); 
                    setOrdersData({
                        // labels: ["January", "February", "March", "April", "May", "June", "July"],
                        labels: labels,
                        datasets: [{
                            label: "Orders per month",
                            data: data,
                            borderColor: "#36A2EB",
                            // backgroundColor: "rgba(54, 162, 235, 0.5)",
                            pointBackgroundColor: "#FF6384",
                            tension: 0.3, 
                        }],
                    });
                }
            }
            catch(error){
                console.log("Error while fetching orders data: ", error);
            }
        }

        fetchRolesData();
        fetchOrdersPerMonth();
    }, [apiUrl]);

    return (
        <div className="admin-home">
            {rolesData.labels.length > 0 ? (
                <div className="admin-bar">
                    <h2>User Roles Distribution</h2>
                    {/* Bar Chart */}
                    <div style={{ width: "45%", marginBottom: "20px" }}>
                        <Bar
                            data={rolesData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "top",
                                        labels: {
                                            color: "#f8f9fa"
                                        }
                                    },
                                    title: {
                                        display: true,
                                        color: "#f8f9fa"
                                    },
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: "#f8f9fa",
                                        },
                                        grid: {
                                            color: "#6c757d", 
                                        },
                                    },
                                    y: {
                                        ticks: {
                                            color: "#f8f9fa", 
                                        },
                                        grid: {
                                            color: "#6c757d", 
                                        },
                                    },
                                },
                            }}
                        />
                    </div>

                    {/* Doughnut Chart */}
                    <div className="admin-doughnut">
                        <Doughnut
                            data={rolesData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "top",
                                        labels: {
                                            color: "#f8f9fa"
                                        }
                                    },
                                    title: {
                                        display: true,
                                        color: "#f8f9fa"
                                    },
                                },
                            }}
                        />
                    </div>

                    <div className="admin-line">
                        <Line
                            data={ordersData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "top",
                                        labels: {
                                            color: "#f8f9fa",
                                        },
                                    },
                                    title: {
                                        display: true,
                                        text: "Orders Per Month",
                                        color: "#f8f9fa",
                                    },
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: "#f8f9fa",
                                        },
                                        grid: {
                                            color: "#6c757d",
                                        },
                                    },
                                    y: {
                                        ticks: {
                                            color: "#f8f9fa",
                                        },
                                        grid: {
                                            color: "#6c757d",
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className="admin-home-empty">
                    <p>No Data</p>
                </div>
            )}
        </div>
    );
};