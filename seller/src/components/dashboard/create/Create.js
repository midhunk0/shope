// @ts-nocheck
import React, { useState } from "react";
import "./Create.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Create() {
    const [itemData, setItemData]=useState({
        name: "",
        type: "",
        description: "",
        price: "",
        pieceLeft: ""
    });
    const [imageList, setImageList]=useState([]);
    const [loading, setLoading]=useState(false);
    const navigate=useNavigate();
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    function goBack(){
        navigate(-1);
    }

    function drop(e){
        e.preventDefault();
        const newImages=[];
        for (let i=0;i<e.dataTransfer.files.length;i++){
            var image=e.dataTransfer.files[i].name;
            newImages.push(image);
        }
        setImageList((prevImages)=>[...prevImages, ...newImages]);
    }

    function drag(e){
        e.preventDefault();
    }

    function fileInput(e){
        const newImages=[];
        for (let i=0;i<e.target.files.length;i++) {
            var image=e.target.files[i].name;
            newImages.push(image);
        }
        setImageList((prevImages)=>[...prevImages, ...newImages]);
    }

    function remove(index){
        const updatedList=imageList.filter((_, i)=>i!==index);
        setImageList(updatedList);
    }

    async function createSellItem(e){
        e.preventDefault();

        try{
            setLoading(true);
            const formData=new FormData();
            for(const key in itemData){
                formData.append(key, itemData[key]);
            }
            const images=document.getElementById("images");
            if(images.files?.length){
                Array.from(images.files).forEach((image)=>{
                    formData.append("images", image);
                });
            }

            const response=await fetch(`${apiUrl}/createSellItem`, {
                method: "POST",
                body: formData,
                credentials: "include",
            })

            const result=await response.json();
            if(response.ok){
                setLoading(false);
                toast.success(result.message);
                navigate("/dashboard");
            } 
            else{
                toast.error(result.message);
            }
        } 
        catch(error){
            console.log(error);
        } 
    }

    return (
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
            <div className="create">
                <form onSubmit={createSellItem}>
                    <div className="createButtons">
                        <button type="submit">Create</button>
                        <button type="button" onClick={goBack}>Back</button>
                    </div>
                    <div className="createInputs">
                        <div className="inputBlock">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" onChange={(e) => setItemData({ ...itemData, name: e.target.value })} />
                        </div>
                        <div className="uploads">
                            <p>Upload the Images</p>
                            <div className="dropArea" onDrop={drop} onDragOver={drag}>
                                <p>Drag and drop images here</p>
                                <input type="file" id="images" onChange={fileInput} multiple />
                                <label htmlFor="images">Browse Files</label>
                            </div>
                            {imageList.length > 0 && (
                                <div className="fileList">
                                    {imageList.map((file, index) => (
                                        <div className="fileItem" key={index}>
                                            <p>{file}</p>
                                            <img src="/icons/close.png" alt="img" onClick={() => remove(index)} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="inputBlock">
                            <label htmlFor="typetype">Type</label>
                            <input type="text" id="type" onChange={(e) => setItemData({ ...itemData, type: e.target.value })} />
                        </div>
                        <div className="inputBlock">
                            <label htmlFor="description">Description</label>
                            <input type="text" id="description" onChange={(e) => setItemData({ ...itemData, description: e.target.value })} />
                        </div>
                        <div className="inputBlock">
                            <label htmlFor="price">Price</label>
                            <input type="text" id="price" onChange={(e) => setItemData({ ...itemData, price: e.target.value })} />
                        </div>
                        <div className="inputBlock">
                            <label htmlFor="pieceLeft">Piece Left</label>
                            <input type="text" id="pieceLeft" onChange={(e) => setItemData({ ...itemData, pieceLeft: e.target.value })} />
                        </div>
                    </div>
                </form>
            </div>
        )
    )
}
