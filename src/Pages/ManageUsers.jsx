import React, { useEffect, useState } from 'react'
import UsersForm from './UsersForm'
import UsersList from './UsersList'
import toast from 'react-hot-toast'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const fetchAllUsers = async ()=>{
    try{
      setLoadingUsers(true)
      let response = await fetch("https://billingsoftware-backend-production.up.railway.app/admin/users", {
        headers : {
          "Authorization" : `Bearer ${localStorage.getItem("token")}`
        }
      })
      let data = await response.json()
      if(response.ok){
        setUsers(data)
      }else{
        toast.error("Some error occured" + data.message)
      }
    }catch(error){
      toast.error("Some error Occured")
    }finally{
      setLoadingUsers(false)
    }
  }
  useEffect(()=>{
    fetchAllUsers()
  }, [])

  return (
    <div className='w-full sm:h-[calc(100vh-80px)] h-full bg-black/90 p-3 flex sm:flex-row gap-5 flex-col'>
      <div className='left border p-3 border-white rounded-md md:w-[70%] sm:w-[50%] w-full h-full'>
        <UsersForm users = {users} setUsers = {setUsers} loadingUsers={loadingUsers} setLoadingUsers={setLoadingUsers}/>
      </div>
      <div className='right md:w-[30%] sm:w-[50%] border border-white rounded-md w-full sm:h-full h-100'>
        <UsersList users = {users} setUsers = {setUsers} loadingUsers={loadingUsers} setLoadingUsers={setLoadingUsers}/>
      </div>
    </div>
  )
}

export default ManageUsers