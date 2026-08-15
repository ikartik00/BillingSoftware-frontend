import React, { useContext, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { AppContext } from '../Context/AppContextProvider';

const CategoryForm = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const imageRef = useRef();
    const [loading, setLoading] = useState(false)
    const { categories, setCategories, loadCategories } = useContext(AppContext)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        bgColor: "#008000"
    })
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        setFormData({ ...formData, [name]: value });
    }

    const handleForm = (e) => {
        e.preventDefault();
        if (!image) {
            toast.error("Please Upload the image")
            return;
        }
        setLoading(true);
        const formmData = new FormData();
        formmData.append("category", JSON.stringify(formData))
        formmData.append("file", image)
        const addCategory = async () => {
            try {
                let response = await fetch(`${API_URL}/admin/categories/add_category`, {
                    method: "POST",
                    body: formmData,
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                if (response.status == 201) {
                    response = await response.json();
                    loadCategories();
                    // const updatedCategory = [...categories, response]
                    // setCategories(updatedCategory);
                    toast.success("Category Successfully Added")
                    setFormData({
                        name: "",
                        description: "",
                        bgColor: "#008000"
                    })
                    setImage(null)
                }
            } catch (error) {
                toast.error("Error While Addding the category")
            } finally {
                setLoading(false)
            }
        }
        addCategory();
    }
    return (
        <form onSubmit={handleForm}>
            <div className='w-full px-5 py-3 bg-white rounded-md flex flex-col gap-3'>
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
                <div className='flex flex-col gap-2'>
                    <label htmlFor="name" className='font-bold text-lg'>Name</label>
                    <input
                        type="text"
                        placeholder='Category Name'
                        id='name' name='name'
                        className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold'
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="description" className='font-bold text-lg'>Description</label>
                    <textarea type="text"
                        placeholder='Write Content Here'
                        id='description' name='description'
                        className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold'
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="bgColor" className='font-bold text-lg'>Background Color</label>
                    <input type="color"
                        placeholder='#ffffff'
                        id='bgColor' name='bgColor'
                        className='w-18 h-8 outline-none'
                        value={formData.bgColor}
                        onChange={handleChange}
                    />
                </div>
                <button className='bg-blue-600 text-white font-bold py-2 text-center rounded-md cursor-pointer' disabled={loading}>{loading ? "Submitting...." : "Save"}</button>
            </div>
        </form>
    )
}


export default CategoryForm