// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./ItemsPage.css"
import { toast } from "react-toastify";
import { Item } from "../Item";
import { trefoil } from 'ldrs'

export function ItemsPage(){
    trefoil.register()

    const [loading, setLoading]=useState(true);
    const [items, setItems]=useState([]);
    const [searchItem, setSearchItem]=useState("");
    const [filteredItems, setFilteredItems]=useState([]);
    const [selectedCategory, setSelectedCategory]=useState("All items");
    const [sortOrder, setSortOrder]=useState("Price low to high");
    const [open, setOpen]=useState(false);
    const [openSort, setOpenSort]=useState(false);
    const [openAll, setOpenAll]=useState(false);
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    async function fetchSellItems(){
        try{
            const response=await fetch(`${apiUrl}/fetchItems`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setLoading(false);
                setItems(result);
                setFilteredItems(result);
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchSellItems();
    }, []);

    useEffect(()=>{
        let updatedItems=[...items];
        if(searchItem!==""){
            updatedItems=updatedItems.filter(item=>item.name.toLowerCase().includes(searchItem.toLowerCase()))
        }
        if(selectedCategory){
            if(selectedCategory!=="All items"){
                updatedItems=updatedItems.filter(item=>
                    item.type===selectedCategory
                )
            }
        }
        updatedItems.sort((a, b)=>{
            if(sortOrder==="Price low to high"){
                return a.price - b.price;
            }
            else if(sortOrder==="Price high to low"){
                return b.price - a.price;
            }
            return 0;
        })
        setFilteredItems(updatedItems);
    }, [searchItem, selectedCategory, sortOrder, items]);

    function openList(){
        setOpen(!open);
    }

    function openSortList(){
        setOpenSort(!openSort);
    }

    function handleCategory(type){
        setSelectedCategory(type);
        setOpen(!open);
    }

    function handleSort(sort){
        setSortOrder(sort);
        setOpenSort(!openSort);
    }

    function openFiltersDropdown(){
        setOpenAll(!openAll);
    }

    return(
        loading ? (
            <div className="loading">
                <l-trefoil
                    size="50"
                    stroke="5"
                    stroke-length="0.15"
                    bg-opacity="0.1"
                    speed="1.4" 
                    color="var(--red)"
                ></l-trefoil>
            </div>
        ) : (
            <div className="itemsPage">
                <div className="allOptions">
                    <div className="itemsOptions">
                        <div className="itemsSearch">
                            <img src="/icons/search.png" alt="img"/>
                            <input type="text" placeholder="Search" onChange={(e)=>setSearchItem(e.target.value)}/>
                        </div>
                        <div className="filterDropdownIcon">
                            <img src={openAll ? "/icons/up.png" : "/icons/down.png"} alt="" onClick={openFiltersDropdown}/>
                        </div>
                    </div>

                    <div className="filterDropdown">
                        {openAll ? (
                            <div className="filterAndSortDropdown">
                                <div className="itemsSort">
                                    <button onClick={openSortList}>
                                        {sortOrder}
                                        <img src={openSort ? "/icons/up.png" : "/icons/down.png"} alt="img"/>
                                    </button>
                                    {openSort && (
                                        <div className="sortTypes">
                                            <button value="Price low to high" onClick={()=>handleSort("Price low to high")}>Price low to high</button>
                                            <button value="Price high to low" onClick={()=>handleSort("Price high to low")}>Price high to low</button>
                                        </div>
                                    )}
                                </div>
                                <div className="itemsFilters">
                                    <button onClick={openList}>
                                        {selectedCategory}
                                        <img src={open ? "/icons/up.png" : "/icons/down.png"} alt="img"/>
                                    </button>
                                    {open && (
                                        <div className="itemTypes">
                                            <button value="All items" onClick={()=>handleCategory("All items")}>All items</button>
                                            {[...new Set(items.map(item=>item.type))].map((type, index)=>(
                                                <button value={type} key={index} onClick={()=>handleCategory(type)}>{type}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (<div></div>)}
                    </div>

                    <div className="filterAndSort">
                        <div className="itemsSort">
                            <button onClick={openSortList}>
                                {sortOrder}
                                <img src={openSort ? "/icons/up.png" : "/icons/down.png"} alt="img"/>
                            </button>
                            {openSort && (
                                <div className="sortTypes">
                                    <button value="Price low to high" onClick={()=>handleSort("Price low to high")}>Price low to high</button>
                                    <button value="Price high to low" onClick={()=>handleSort("Price high to low")}>Price high to low</button>
                                </div>
                            )}
                        </div>
                        <div className="itemsFilters">
                            <button onClick={openList}>
                                {selectedCategory}
                                <img src={open ? "/icons/up.png" : "/icons/down.png"} alt="img"/>
                            </button>
                            {open && (
                                <div className="itemTypes">
                                    <button value="All items" onClick={()=>handleCategory("All items")}>All items</button>
                                    {[...new Set(items.map(item=>item.type))].map((type, index)=>(
                                        <button value={type} key={index} onClick={()=>handleCategory(type)}>{type}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="items">
                    {filteredItems.length>0 ? (
                        filteredItems.map((item, index)=>(
                            item ? (
                                <Item item={item} key={index}/>
                            ):(
                                null
                            )
                        ))
                    ):(
                        <p>No items</p>
                    )}
                </div>
            </div>
        )
    )
}