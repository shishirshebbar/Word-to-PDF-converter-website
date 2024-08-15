import React, { useState } from 'react'
import { FaRegFileWord } from "react-icons/fa6";
import axios from "axios";


function Home() {
    const [selectedfile,setselectedfile] = useState(null);
    const [convert,setconvert] = useState("");
    const[downloaderror,setdownloaderror] = useState("");
    const handleFileChange = (e)=>{
        setselectedfile(e.target.files[0])
    };
    const handleSubmit =async (event)=>{
        event.preventDefault();
        if(!selectedfile){
            setconvert("No file is selected");
            return;
        }
        const formdata = new FormData()
        formdata.append("file",selectedfile)
        try{
            const response = await axios.post("http://localhost:3000/convertfile",formdata,{
            responseType:"blob",
        });
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response.data]));
        console.log(url);
        const link = document.createElement("a");//anchor tag
        console.log(link)
        link.href=url;
        console.log(link);
        link.setAttribute("download",selectedfile.name.replace(/\.[^/.]+$/,"")+".pdf");///\.[^/.]+$/ is used to match the file extension of a filename
        console.log(link);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setselectedfile(null);
        setdownloaderror("");
        setconvert("File converted to pdf format");
        }catch(error){
            console.group(error);
            if(error.response&&error.response.status==400){
            setdownloaderror("File failed to download.Error occured.",error.response.data.message);
            }else{setconvert("");
            }}

    }
    
  return (
    <>

    <div className='max-w-screen-2xl mx-auto container px-6 py-3 md:px-40 bg-slate-400 '>
        <div className='flex h-screen items-center justify-center '>
            <div className='border-2 border-dotted px-4 py-2 md:py-6 border-indigo-400 rounded-lg shadow-lg'>
                <h1 className='text-3xl font-bold text-center mb-1'>Convert Word to PDF for FREE!!</h1>
           
            <div className='flex flex-col items-center space-y-4'>
                <input onChange = {handleFileChange} type="file" accept='.doc,.docx' className='hidden' id='FileInput'/>
                <label htmlFor ="FileInput" className='hover:text-white w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-purple-300 hover:bg-blue-700 duration-300'>
                <FaRegFileWord className='text-3xl mr-3'/>
                <span className='text-3xl mr-2 hover:text-white'>{selectedfile?selectedfile.name:"Choose file"}</span>
                </label>
                <button onClick={handleSubmit} disabled ={!selectedfile} className='disabled:bg-purpule-400 disabled:pointer-events-none text-white bg-blue-500 hover:bg-blue-700 duration-200 font-bold px-4 py-2 rounded-lg'>Convert File</button>
            {convert&&(<div className='text-green-900 text-center'>{convert}</div>)}
            {downloaderror&&(<div className='text-red-900 text-center'>{downloaderror}</div>)}
            
            </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Home