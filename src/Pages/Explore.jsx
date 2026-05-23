import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContextProvider'
import DisplayCategory from '../Component/DisplayCategory';
import DisplayItems from '../Component/DisplayItems';
import CustomerForm from '../Component/CustomerForm';
import CartItems from '../Component/CartItems';
import CartSummary from '../Component/CartSummary';
import SearchBox from '../Component/SearchBox';

const Explore = () => {
  const { categories, loadItemsfunction, loadCategories } = useContext(AppContext);
  const { items } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")


  useEffect(()=>{
    loadItemsfunction()
    loadCategories()
  }, [])

  return (
    <div className='w-full lg:h-[calc(100vh-80px)] h-full  text-white bg-black/90 p-3 flex md:flex-row flex-col gap-2'>
      <div className='left border p-3 border-white rounded-md lg:w-[70%] md:w-[60%] w-full h-full'>
        <div className='first-row overflow-y-auto lg:h-[40%] h-100 w-full py-3'>
          <DisplayCategory categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>
        <hr className='text-white/40' />
        <div className='second-row lg:h-[60%] h-100 py-2 mt-2'>
          <DisplayItems items={items} selectedCategory={selectedCategory} />
        </div>
      </div>
      <div className='right lg:w-[30%] md:w-[40%] w-full p-2 border border-white rounded-md'>
        <div className='md:h-[22%] h-35'><CustomerForm customerName={customerName} setCustomerName={setCustomerName} mobileNumber={mobileNumber} setMobileNumber={setMobileNumber} /></div>
        <hr className='text-white/40' />
        <div className='md:h-[50%] h-70 overflow-y-auto cartItems'><CartItems /></div>
        <hr className='text-white/40' />
        <div className='h-[28%]'><CartSummary customerName={customerName} setCustomerName={setCustomerName} mobileNumber={mobileNumber} setMobileNumber={setMobileNumber} /></div>
      </div>
    </div>
  )
}

export default Explore