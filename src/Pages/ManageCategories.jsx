import React from 'react'
import CategoryForm from './CategoryForm'
import CategoryList from './CategoryList'

const ManageCategories = () => {
  return (
    <div className='w-full sm:h-[calc(100vh-80px)] h-full bg-black/90 p-3 flex sm:flex-row flex-col sm:gap-2 gap-5'>
      <div className='left border p-3 border-white rounded-md md:w-[70%] sm:w-[50%] w-full h-full'>
        <CategoryForm />
      </div>
      <div className='right md:w-[30%] sm:w-[50%] w-full border sm:h-full h-140 border-white relative rounded-md'>
        <CategoryList/>
      </div>
    </div>
  )
}

export default ManageCategories