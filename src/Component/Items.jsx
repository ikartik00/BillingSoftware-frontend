import React, { useContext } from 'react'
import { ShoppingCart } from 'lucide-react'
import { AppContext } from '../Context/AppContextProvider'

const Items = ({ name, price, itemId, imgUrl, stock }) => {
    const { addToCart } = useContext(AppContext)

    const handleAddToCart = () => {
        addToCart({
            name: name,
            price: price,
            itemId: itemId,
            quantity: 1
        })
    }

    return (
        <div className={`bg-black text-white flex justify-between items-center rounded-md px-3 py-4 h-fit select-none ${stock === 0 ? "pointer-events-none opacity-50" : ""}`}>
            <div className='flex gap-3'>
                <div className='w-15 h-15 overflow-hidden'>
                    <img className='w-15 h-15 object-cover rounded-md' src={imgUrl} alt={name} />
                </div>
                <div className='text-white flex flex-col justify-between'>
                    <h2 className='text-md font-semibold'>{name}</h2>
                    <p className=' font-bold text-sm rounded-full w-fi text-white'>₹{price}</p>
                    <p className=' font-bold text-sm rounded-full w-fi text-white'>Stock : {stock}</p>
                </div>
            </div>
            <div className='bg-green-700 text-white px-3 py-1 rounded-md cursor-pointer' onClick={handleAddToCart}>+</div>
        </div>
    )
}

export default Items