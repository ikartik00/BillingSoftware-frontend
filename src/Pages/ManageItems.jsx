import React, { useContext, useEffect } from 'react'
import ItemsForm from './ItemsForm'
import ItemsList from './ItemsList'
import { AppContext } from '../Context/AppContextProvider'

const ManageItems = () => {
  const {loadCategories} = useContext(AppContext)
  useEffect(()=>{
    loadCategories()
  }, [])
  return (
    <div className='w-full sm:h-[calc(100vh-80px)] h-full bg-black/90 p-3 flex sm:flex-row flex-col sm:gap-2 gap-5'>
      <div className='left border p-3 border-white rounded-md md:w-[70%] sm:w-[50%] w-full h-full'>
          <ItemsForm loadCategories={loadCategories}/>
      </div>
      <div className='right md:w-[30%] sm:w-[50%] w-full sm:h-full h-100 border border-white rounded-md'>
        <ItemsList loadCategories = {loadCategories}/>
      </div>
    </div>
  )
}

export default ManageItems