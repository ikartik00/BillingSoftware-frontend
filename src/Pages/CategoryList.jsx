import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContextProvider'
import { Heading2, Trash2 } from 'lucide-react';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CategoryList = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { categories, setCategories, loadCategories, loadCategory } = useContext(AppContext);
    const [searchValue, setSearchValue] = useState("")
    const [filtered, setFiltered] = useState([])

    useEffect(() => {
        loadCategories();
    }, [])

    let filteredCategories = categories.filter(category => {
        return category.name.toLowerCase().includes(searchValue.toLowerCase());
    })
    const handleDelete = async (categoryId) => {
        try {
            let response = await fetch(`${API_URL}/admin/categories/delete/${categoryId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
            if (response.ok) {
                const updatedCategories = categories.filter((category) => {
                    return category.categoryId != categoryId;
                })
                setCategories(updatedCategories)
                response = await response.text()
                toast.success('Successfully Deleted!')
            } else {
                toast.error('Product Not deleted due to some error')
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='p-3 flex gap-3 flex-col relative h-full w-full'>
            <div className='flex justify-center gap-2 items-center bg-white rounded-md w-full'>
                <input type="text"
                    placeholder='Search By Keyword'
                    className='px-3 py-2 outline-none w-full'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <span className='px-3 py-2 bg-yellow-600 text-black rounded-r-md'><Search /></span>
            </div>
            <div className='overflow-y-auto h-full flex gap-3 flex-col categoryScroll'>
                {loadCategory && <h1 className='text-white font-bold text-center'>Loading .......</h1>}
                {!loadCategory && filteredCategories.length > 0 ? filteredCategories.map((category) => (
                    <div key={category.categoryId}>
                        <div style={{ backgroundColor: category.bgColor }} className='flex justify-between items-center rounded-md px-3 py-4'>
                            <div className='flex gap-3'>
                                <div className='w-15 h-15 overflow-hidden'>
                                    <img className='w-15 h-15 object-cover rounded-md' src={category.imageUrl} alt={category.name} />
                                </div>
                                <div className='text-white'>
                                    <h2 className='text-lg font-bold'>{category.name}</h2>
                                    <h3 className='text-md font-semibold'>Items :{category.items} </h3>
                                </div>
                            </div>
                            <button className='bg-red-500 cursor-pointer text-white p-2 rounded-md' onClick={() => handleDelete(category.categoryId)}><Trash2 /></button>
                        </div>
                    </div>
                )) : (!loadCategory && <h2 className='text-white font-bold text-center'>No Product Found</h2>)}
            </div>
        </div>
    )
}

export default CategoryList