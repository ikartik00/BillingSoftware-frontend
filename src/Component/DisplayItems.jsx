import React, { useState } from 'react'
import Items from './Items'
import SearchBox from '../Component/SearchBox';

const DisplayItems = ({ items, selectedCategory }) => {
  const [searchValue, setSearchValue] = useState("")

  const handleChange = (e) => {
    setSearchValue(e.target.value)
  }

  let filteredItems = items.filter(item => {
    if (!selectedCategory) return true;
    return selectedCategory === item.categoryId;
  }).filter(item => item && item.name.toLowerCase().includes(searchValue.toLowerCase()))

  return (
    <div className='flex flex-col gap-3 h-full'>
      <div className='flex justify-end'>
        <SearchBox searchValue={searchValue} handleChange={handleChange} />
      </div>
      <div className='flex gap-2 flex-wrap overflow-y-auto h-full'>
        {filteredItems.map(item => (
          // <div key={item.itemId} className='sm:w-65 w-full hover:scale-102 duration-300'>
            <Items key={item.itemId} itemId = {item.itemId} name={item.name} price={item.price} imgUrl={item.imgUrl} stock = {item.availableStock} />
          // </div>
        ))}
      </div>
    </div>
  )
}

export default DisplayItems