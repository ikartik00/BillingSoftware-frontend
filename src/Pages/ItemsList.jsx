import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContextProvider'
import { Heading2, Trash2 } from 'lucide-react';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ItemsList = () => {
  const { items, setItems, loadItems, setLoadItems, loadItemsfunction } = useContext(AppContext)

  const [searchValue, setSearchValue] = useState("")

  let filteredItems = items.filter(item => {
    return item.name.toLowerCase().includes(searchValue.toLowerCase());
  })
  useEffect(() => {
    loadItemsfunction()
  }, [])

  const handleDelete = async (itemId) => {
    try {
      let response = await fetch(`https://billingsoftware-backend-production.up.railway.app/admin/items/delete/${itemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      let data = await response.text()
      if (response.status == 204) {
        const updatedItems = items.filter((item) => {
          return item.itemId != itemId;
        })
        setItems(updatedItems)
        toast.success('Successfully Deleted!')
      } else {
        toast.error(data.message + 'Product Not deleted due to some error')
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='p-3 flex gap-3 flex-col relative h-full w-full'>
      <div className='flex justify-between items-center bg-white rounded-md w-full'>
        <input type="text"
          placeholder='Search By Keyword'
          className='px-3 py-2 
                outline-none w-full'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <span className='px-3 py-2 bg-yellow-600 text-black rounded-r-md'><Search /></span>
      </div>
      <div className='overflow-y-auto h-full flex gap-3 flex-col itemsScroll'>
        {filteredItems.length > 0 ? filteredItems.map((item) => (
          <div key={item.itemId}>
            <div className='bg-black text-white flex justify-between items-center rounded-md px-3 py-4'>
              <div className='flex gap-3'>
                <div className='w-15 h-15 overflow-hidden'>
                  <img className='w-15 h-15 object-cover rounded-md' src={item.imgUrl} alt={item.name} />
                </div>
                <div className='text-white'>
                  <h2 className='text-md font-semibold'>{item.name}</h2>
                  <h3 className='text-sm'>Category :{item.categoryName} </h3>
                  <p className='bg-yellow-600 text-black ffont-bold text-sm px-2 rounded-full w-fit font-bold'>₹{item.price}</p>
                </div>
              </div>
              <button className='bg-red-500 cursor-pointer text-white p-2 rounded-md' onClick={() => handleDelete(item.itemId)}><Trash2 /></button>
            </div>
          </div>
        )) : <h2 className='text-white font-bold text-center'>No Items Found</h2>}
      </div>
    </div>
  )
}

export default ItemsList