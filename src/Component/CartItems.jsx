import React, { useContext } from 'react'
import { AppContext } from '../Context/AppContextProvider'
import { Trash } from 'lucide-react';

const CartItems = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(AppContext);

  return (
    <div className='flex flex-col gap-2 p-2' >
      {cartItems.length === 0 && <p>Your Cart is Empty</p>}
      {cartItems.length > 0 && cartItems.map((item, index) => (
        <div key={index} className='w-full bg-black px-3 py-1 rounded-md flex flex-col gap-2 text-md'>
          <div className='flex justify-between'>
            <p>{item.name}</p>
            <p>₹{(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <div className='flex justify-between items-center'>
            <div className='flex gap-3 justify-center items-center'>
              <button className='bg-red-500 px-3 py-1 rounded-md flex justify-center items-center text-xl' disabled={item.quantity == 1} onClick={()=>updateQuantity(item.itemId, item.quantity-1)}>-</button>
              <span>{item.quantity}</span>
              <button className='bg-blue-600 px-3 py-1 rounded-md flex justify-center items-center text-xl' onClick={()=>updateQuantity(item.itemId, item.quantity+1)}>+</button>
            </div>
            <button className='bg-red-500 rounded-md flex justify-center items-center text-xl p-2 cursor-pointer' onClick={()=>removeFromCart(item)}><Trash /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CartItems