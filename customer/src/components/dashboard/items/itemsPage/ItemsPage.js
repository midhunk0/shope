// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./ItemsPage.css"
import { toast } from "react-toastify";
import { Item } from "../Item";
import { trefoil } from 'ldrs';
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export function ItemsPage(){
    trefoil.register()

    const [loading, setLoading]=useState(true);
    const [items, setItems]=useState([]);
    const [searchItem, setSearchItem]=useState("");
    const [filteredItems, setFilteredItems]=useState([]);
    const [selectedCategory, setSelectedCategory]=useState("All items");
    const [selectedBrand, setSelectedBrand]=useState("All brands");
    const [sortOrder, setSortOrder]=useState("price");
    const [open, setOpen]=useState(false);
    const [openBrand, setOpenBrand]=useState(false);
    const [openSort, setOpenSort]=useState(false);
    const [openAll, setOpenAll]=useState(false);
    const [priceRange, setPriceRange]=useState([0, 10000]);
    const [priceLimits, setPriceLimits]=useState(null);
    const [order, setOrder]=useState("increase");
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    
    async function fetchSellItems(){
        try{
            const response=await fetch(`${apiUrl}/fetchItems`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                const minAvailPrice = Math.min(...result.map(item => item.price));
                const maxAvailPrice = Math.max(...result.map(item => item.price));
                setLoading(false);
                setItems(result);
                setFilteredItems(result);
                toast.success(result.message);
                setPriceRange([minAvailPrice, maxAvailPrice]);
                setPriceLimits([minAvailPrice, maxAvailPrice]);
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
        if(selectedBrand){
            if(selectedBrand!=="All brands"){
                updatedItems=updatedItems.filter(item=>
                    item.brand===selectedBrand
                )
            }
        }
        updatedItems=updatedItems.filter(item=>item.price>=priceRange[0] && item.price<=priceRange[1]);
        updatedItems.sort((a, b)=>{
            if(sortOrder==="name" && order==="increase"){
                return a.name.localeCompare(b.name);
            }
            else if(sortOrder==="name" && order==="decrease"){
                return b.name.localeCompare(a.name);
            }
            else if(sortOrder==="price" && order==="increase"){
                return a.price - b.price;
            }
            else if(sortOrder==="price" && order==="decrease"){
                return b.price - a.price;
            }
            else if(sortOrder==="rating" && order==="increase"){
                return a.rating - b.rating;
            }
            else if(sortOrder==="rating" && order==="decrease"){
                return b.rating - a.rating;
            }
            return 0;
        })
        setFilteredItems(updatedItems);
    }, [searchItem, selectedCategory, selectedBrand, sortOrder, priceRange, items, order]);

    function openList(){
        setOpen(!open);
    }

    function openBrandList(){
        setOpenBrand(!openBrand);
    }

    function openSortList(){
        setOpenSort(!openSort);
    }

    function handleCategory(type){
        setSelectedCategory(type);
        setOpen(!open);
    }

    function handleBrand(brand){
        setSelectedBrand(brand);
        setOpenBrand(!openBrand);
    }

    function openFiltersDropdown(){
        setOpenAll(!openAll);
    }

    function handlePriceChange(range){
        setPriceRange(range);
    }

    function changeSort(sort, order){
        setSortOrder(sort);
        setOrder(order);
        // setOpenSort(!openSort);
    }

    const ItemsPageSort = () => {
        return (
            <div className="itemsPage-sort">
                <button onClick={openSortList}>
                    {sortOrder}
                    <img src={openSort ? "/icons/up-dark.png" : "/icons/down-dark.png"} alt="sort icon" />
                </button>
                {openSort && (
                    <div className="itemsPage-sort-types">
                        {["name", "price", "rating"].map(option=>(
                            <button key={option} onClick={()=>changeSort(option, order==="increase" ? "decrease" : "increase")}>
                                {option}
                                <img src={sortOrder===option && order==="increase" ? "/icons/increase.png" : "/icons/decrease.png"} alt="img"/>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };
    
    const ItemsPageFilters=()=>{
        return(
            <>
                <div className="itemsPage-filter-category">
                    <button onClick={openList}>
                        {selectedCategory}
                        <img src={open ? "/icons/up-dark.png" : "/icons/down-dark.png"} alt="img"/>
                    </button>
                    {open && (
                        <div className="itemsPage-item-types">
                            <button value="All items" onClick={()=>handleCategory("All items")}>All items</button>
                            {[...new Set(items.map(item=>item.type))].map((type, index)=>(
                                <button value={type} key={index} onClick={()=>handleCategory(type)}>{type}</button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="itemsPage-filter-category">
                    <button onClick={openBrandList}>
                        {selectedBrand}
                        <img src={open ? "/icons/up-dark.png" : "/icons/down-dark.png"} alt="img"/>
                    </button>
                    {openBrand && (
                        <div className="itemsPage-item-types">
                            <button value="All brands" onClick={()=>handleBrand("All brands")}>All Brands</button>
                            {[...new Set(items.map(item=>item.brand))].map((brand, index)=>(
                                <button value={brand} key={index} onClick={()=>handleBrand(brand)}>{brand}</button>
                            ))}
                        </div>
                    )}
                </div>
            </>
        )
    }

    const ItemsRatingFilter=()=>{
        return(
            <div className="itemsPage-filter-category">
                
            </div>
        )
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
                <div className="itemsPage-all">
                    <div className="itemsPage-options">
                        <div className="itemsPage-search">
                            <img src="/icons/search.png" alt="img"/>
                            <input type="text" placeholder="Search" onChange={(e)=>setSearchItem(e.target.value)}/>
                        </div>
                        <div className="itemsPage-expand">
                            <img src={openAll ? "/icons/up.png" : "/icons/down.png"} alt="" onClick={openFiltersDropdown}/>
                        </div>
                    </div>

                    <div className="itemsPage-filter-dropdown">
                        {openAll ? (
                            <div className="itemsPage-filter-and-sort-dropdown">
                                <ItemsPageSort/>
                                <ItemsPageFilters/>
                                <div className="itemsPage-price-slider">
                                    <p>Price Range: ${priceRange[0]} - ${priceRange[1]}</p>
                                    <Slider
                                        range
                                        min={priceLimits[0]}
                                        max={priceLimits[1]}                                
                                        step={50}
                                        value={priceRange}
                                        onChange={handlePriceChange}
                                    />
                                </div>   
                            </div>
                        ) : (<div></div>)}
                    </div>

                    <div className="itemsPage-filter-and-sort">
                        <div className="itemsPage-filter-and-sort-only">
                            <ItemsPageSort/>
                            <ItemsPageFilters/>
                        </div>
                        <div className="itemsPage-price-slider">
                            <p>Price : ${priceRange[0]} - ${priceRange[1]}</p>
                            <Slider
                                range
                                min={priceLimits[0]}
                                max={priceLimits[1]}                                
                                step={50}
                                value={priceRange}
                                onChange={handlePriceChange}
                            />
                        </div>                    
                    </div>
                </div>

                <div className="itemsPage-items">
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