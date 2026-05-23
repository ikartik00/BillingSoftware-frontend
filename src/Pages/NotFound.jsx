import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()
  return (
    <div className='h-[calc(100vh-80px)] w-full flex justify-center items-center'>
        <div className='w-115 px-3 py-7 rounded-md shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col gap-3 justify-center items-center'>
            <h1 className='text-8xl font-bold text-red-700'>404</h1>
            <h3 className='text-3xl font-semibold text-black'>Oops! Page not found</h3>
            <p className='text-md'>The Page you are looking for does'nt exist or has been moved</p>
            <button className='bg-blue-800 text-white font-semibold px-3 py-2 rounded-md w-fit' onClick={()=>navigate("/")}>Go to HomePage</button>
        </div>
    </div>
  )
}

export default NotFound