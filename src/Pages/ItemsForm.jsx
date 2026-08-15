import React, { useContext, useRef, useState } from 'react'
import { AppContext } from '../Context/AppContextProvider'
import toast from 'react-hot-toast'
import { PulseLoader } from 'react-spinners'

const ItemsForm = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const {categories,items, setItems, setCategories } = useContext(AppContext)
    const [formData, setFormData] = useState({
        name : "",
        categoryId : "",
        price : "",
        description : ""
    })
    const [image, setImage] = useState(null)
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const imageRef = useRef()

    const handleChange = (e)=>{
        let name = e.target.name;
        let value = e.target.value;
        setFormData({...formData, [name] :value})
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        let error = {}
        if(!image){
            toast.error("Please Upload the Image")
            return;
        }
        if(formData.name.trim() == ""){
            error.name ="Name Requireed"
        }
        if(formData.price.trim() == ""){
            error.price = "Price Requireed"
        }else if(Number(formData.price) < 0){
            error.price = "Negative Price Not allowed"
        }

        if(formData.description.trim() == ""){
            error.description = "Description Required"
        }
        if(!formData.categoryId){
            error.category = "Please Select the category"
        }
        setErrors(error)
        if(Object.keys(error).length > 0){
            return ;
        }
        const newFormData = new FormData();
        newFormData.append("item", JSON.stringify(formData))
        newFormData.append("file", image)
        try{
            setLoading(true)
            let response = await fetch(`${API_URL}/admin/addItem`, {
                method : "POST",
                headers : {
                    "Authorization" : `Bearer ${localStorage.getItem("token")}`
                },
                body : newFormData
            })
            let data = await response.json();
            if(response.status == 201){
                console.log(data);
                
                setItems([...items, data])
                setCategories((prevCategories) => prevCategories.map(category => category.categoryId == data.categoryId ? {...category, items : category.items+1 } : category))
                toast.success("Item Added Successfully");
            }else{
                toast.error(data.message);
            }
        }catch(error){
            toast.error("Some error occured");
        }finally{
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
        <div className='w-full px-5 py-3 bg-white rounded-md flex flex-col gap-2'>
            <div className='w-15 h-15 cursor-pointer' onClick={() => imageRef.current.click()}>
                    <img src={image ? URL.createObjectURL(image) : "https://img.freepik.com/premium-vector/illustration-upload_498740-5719.jpg"} alt="" className='w-15 h-15'
                    />
                    <input type="file"
                        name='image'
                        ref={imageRef}
                        onChange={(e) => setImage(e.target.files[0])}
                        hidden
                    />

                </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="name" className='font-bold text-lg'>Name</label>
                <input type="text" placeholder='Item Name' id='name' name='name' className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold' value={formData.name} onChange={handleChange}/>
                {errors && errors.name && <p className='text-red-500'>{errors.name}</p> }
            </div>

            <div className='flex flex-col gap-1'>
                <label htmlFor="category" className='font-bold text-lg'>Category</label>
                <select name="categoryId" id="category" className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold' onChange={handleChange}>
                    <option value="">--SELECT CATEGORY--</option>
                   {categories.map((category)=>(
                    <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                   ))}
                </select>
                {errors && errors.category && <p className='text-red-500'>{errors.category}</p>}
            </div>

            <div className='flex flex-col gap-1'>
                <label htmlFor="email" className='font-bold text-lg'>Price</label>
                <input type="number" placeholder='₹200.00' id='price' name='price' className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold' onChange={handleChange} value={formData.price} />
                {errors && errors.price && <p className='text-red-500'>{errors.price}</p> }
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor="desc" className='font-bold text-lg'>Description</label>
                <textarea type="text" placeholder='Write Content Here' id='desc' name='description' className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold' onChange={handleChange} value={formData.description} rows={4}/>
                {errors && errors.description && <p className='text-red-500'>{errors.description}</p> }
            </div>
            <button className='bg-yellow-600 text-black font-bold py-2 text-center rounded-md cursor-pointer' disabled={loading}>{loading ? <PulseLoader color='#ffffff' size={12}/> : "Add New Item"}</button>
        </div>
        </form>
    )
}

export default ItemsForm