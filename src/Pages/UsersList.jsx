import React, { useState } from 'react'
import { AppContext } from '../Context/AppContextProvider'
import { Heading2, Trash2 } from 'lucide-react';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';


const UsersList = ({ users, setUsers, loadingUsers, setLoadingUsers }) => {
    const [searchValue, setSearchValue] = useState("")

    const handleDelete = async (userId) => {
        try {
            let response = await fetch(`https://billingsoftware-backend-production.up.railway.app/admin/users/delete/${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
            if (response.status == 204) {
                const updatedUsers = users.filter((user) => {
                    return user.userId != userId;
                })
                setUsers(updatedUsers)
                response = await response.text()
                toast.success(response + 'Successfully Deleted!')
            } else {
                toast.error('Product Not deleted due to some error')
            }
        } catch (error) {
            console.log(error);
        }
    }

    let filteredUsers = users.filter((user) => {
        return user.name.toLowerCase().includes(searchValue.toLowerCase())
    })

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
            <div className='overflow-y-auto h-full flex gap-3 flex-col usersScroll'>
                {loadingUsers && <h1 className='text-white font-bold text-center'>Loading....</h1>}
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                    <div key={user.userId}>
                        <div className='flex justify-between bg-gray-400 items-center rounded-md px-3 py-4'>
                            <div className='flex justify-between'>
                                <div className='text-white'>
                                    <h2 className='text-lg font-bold'>{user.name}</h2>
                                    <h3 className='text-md font-semibold'>{user.email}</h3>
                                </div>
                            </div>
                            <button className='bg-red-500 cursor-pointer text-white p-2 rounded-md' onClick={() => handleDelete(user.userId)}><Trash2 /></button>
                        </div>
                    </div>
                )) : <h2 className='text-white font-bold text-center'>No Users Found</h2>}
            </div>
        </div>
    )
}

export default UsersList