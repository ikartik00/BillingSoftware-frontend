import React from 'react'
import Category from './Category'

const DisplayCategory = ({ categories, setSelectedCategory, selectedCategory }) => {
  return (
    <div className='flex gap-5 flex-wrap md:justify-start justify-center w-full'>
      <div className='cursor-pointer items-center rounded-md px-3 py-4 sm:w-50 w-[calc(100%-20px)] hover:scale-102 shadow-md duration-300 flex justify-center relative' style={{ backgroundColor: "#222222"}} onClick={()=>setSelectedCategory("")}>
        <p className='text-center w-50'>All Items</p>
         {!selectedCategory && <div className='w-2 h-2 rounded-[50%] bg-white absolute top-2 right-2'></div>}
      </div>
      {categories.map(category => (
        <div key={category.categoryId} className='sm:w-50 w-[calc(100%-20px)]'>
          <Category
            imageUrl={category.imageUrl}
            name={category.name}
            items={category.items}
            bgColor={category.bgColor}
            onClick={() => setSelectedCategory(category.categoryId)}
            isSelected={selectedCategory === category.categoryId}
          />
        </div>
      ))}
    </div>
  )
}

export default DisplayCategory