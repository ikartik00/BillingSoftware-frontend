import React from 'react'
import { Search } from 'lucide-react'

const SearchBox = ({searchValue, handleChange}) => {
  
  return (
    <div className='flex justify-between items-center bg-white rounded-md '>
        <input type="text" placeholder='Search Items' className='px-2 py-2 w-50 rounded-md bg-white text-black font-semibold outline-none ' value={searchValue} onChange={handleChange} />
         <span className='px-3 py-2 bg-yellow-600 text-black rounded-r-md'><Search /></span>
    </div>
  )
}

export default SearchBox