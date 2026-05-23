import React from 'react'

const CustomerForm = ({customerName, setCustomerName, mobileNumber, setMobileNumber}) => {
  return (
    <div className='flex lg:gap-3 flex-col gap-1'>
        <div className='flex lg:gap-2 lg:flex-row flex-col'>
          <label htmlFor="customerName">Customer name</label>
          <input type="text" className='bg-white px-2 py-1 w-2/3 text-black outline-none rounded-md' value={customerName} onChange={(e)=>setCustomerName(e.target.value)}  />
        </div>
        <div className='flex lg:gap-3 lg:flex-row flex-col'>
          <label htmlFor="customerName">Mobile Number </label>
          <input type="tel" className='bg-white px-2 py-1 w-2/3 text-black outline-none rounded-md' maxLength={10} value={mobileNumber} onChange={(e)=>setMobileNumber(e.target.value)} />
        </div>
    </div>
  )
}


export default CustomerForm