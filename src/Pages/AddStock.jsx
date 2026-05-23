import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContextProvider'
import { PulseLoader } from 'react-spinners'
import toast from 'react-hot-toast'

const AddStock = () => {
    const { loadItemsfunction, items, setItems } = useContext(AppContext)
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState("")
    const [quantity, setQuantity] = useState("")
    const [error, setError] = useState([])


    useEffect(() => {
        loadItemsfunction()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(selectedItem);

        let errors = {}
        if (!selectedItem) {
            errors.itemName = "Please Select the item"
        }
        if (!quantity || quantity < 0) {
            errors.quantity = "Please Enter the valid Quantity"
        }
        setError(errors)
        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            setLoading(true)
            let response = await fetch("https://billingsoftware-backend-production.up.railway.app/admin/add-stock", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    itemId: selectedItem,
                    quantity: quantity
                })
            })
            if (response.ok) {
                let data = await response.json();
                setItems(items.map(item=>item.itemId === data.itemId ? {...item, availableStock : data.availableStock} : item))
                toast.success("Quantity Added Successfully")
                setSelectedItem("")
                setQuantity("")
            } else {
                toast.error("Quantity not Added")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='h-[calc(100vh-80px)] flex justify-center items-center bg-black/90'>
            <form onSubmit={handleSubmit}>
                <div className='w-100 px-3 py-6 border border-white flex gap-3 flex-col rounded-md bg-white'>
                    <h1 className='text-3xl font-bold text-center'>Add Stock</h1>
                    <div>
                        <label className='text-lg font-bold'>Select Item</label>
                        <select className='w-full border px-3 py-2 rounded-md bg-white text-black outline-none font-semibold' onChange={(e) => setSelectedItem(e.target.value)} name='itemId' value={selectedItem}>
                            <option value="">Select Item</option>
                            {items.length > 0 && items.map((item, idx) => (
                                <option key={idx} value={item.itemId}>{item.name + "   stock : " +  item.availableStock}</option>
                            ))}
                        </select>
                        {error && error.itemName && <p className='text-red-500'>{error.itemName}</p>}
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-lg font-bold'>Enter Quantity</label>
                        <input type="number" placeholder='eg.125' className='px-3 py-2 rounded-md border font-semibold bg-white text-black outline-none'
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                        {error && error.quantity && <p className='text-red-500'>{error.quantity}</p>}
                    </div>
                    <button className='bg-blue-600 px-3 py-2 rounded-md font-semibold text-white cursor-pointer hover:bg-blue-500'>{loading ? <PulseLoader color='#222222' /> : "Add Stock"}</button>
                </div>
            </form>
        </div>
    )
}

export default AddStock