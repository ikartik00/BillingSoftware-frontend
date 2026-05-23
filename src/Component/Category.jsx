import React from 'react'

const Category = ({ name, bgColor, imageUrl, items, onClick, isSelected }) => {
    return (
        <div className='flex gap-3 relative cursor-pointer items-center rounded-md px-3 py-4 sm:w-50 w-full flex-wrap hover:scale-102 shadow-md duration-300' style={{ backgroundColor: bgColor }} onClick={onClick}>
            <div className='w-15 h-15 overflow-hidden'>
                <img className='w-15 h-15 object-cover rounded-md' src={imageUrl} alt={name} />
            </div>
            <div className='text-white'>
                <h2 className='text-lg font-bold'>{name}</h2>
                <h3 className='text-md font-semibold'>Items :{items} </h3>
            </div>
            {isSelected && <div className='w-2 h-2 rounded-[50%] bg-white absolute top-2 right-2'></div>}
        </div>
    )
}

export default Category