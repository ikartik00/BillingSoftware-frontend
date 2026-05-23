import React, { useContext } from 'react'
import { useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { AppContext } from '../Context/AppContextProvider'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Setting = () => {
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { userData, setUserData, setAuth, auth } = useContext(AppContext)
  const [formData, setFormData] = useState(auth.role == "ADMIN" ? {
    shopName: userData.shopName,
    name: userData.name,
    shopAddress: userData.shopAddress,
    email: userData.email
  } : { name: userData.name, })

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData({ ...formData, [name]: value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData);

    let error = {}
    if (!formData.name) {
      error.name = "Name is Required"
    }

    if (auth.role == "ADMIN") {
      if (!formData.shopName) {
        error.shopName = "Shop Name is Required"
      }
      if (!formData.email) {
        error.email = "Email Required"
      }
      else if (!formData.email.includes("@") || !formData.email.includes(".") || formData.email.includes(" ")) {
        error.email = "Invalid Email"
      }
      if (!formData.shopAddress) {
        error.address = "Address is Required"
      }
    }
    setErrors(error)
    if (Object.keys(error).length > 0) {
      return;
    }

    if (auth.role == "ADMIN") {
      try {
        setLoading(true)
        let response = await fetch("https://billingsoftware-backend-production.up.railway.app/admin/update", {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (response.status == 200) {
          if (userData.email !== formData.email) {
            navigate("/login")
            localStorage.removeItem("token")
            localStorage.removeItem("auth")
            setAuth(null, null)
            toast.success("Details Updated Successfully Please Login Again")
          } else {
            setUserData(data)
            toast.success("Details Updated Successfully")
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Some error occured " + error)
      } finally {
        setLoading(false)
      }
    } else {
      try {
        setLoading(true)
        let response = await fetch("https://billingsoftware-backend-production.up.railway.app/user/update", {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
        if (response.status == 200) {
          let data = await response.json();
          setUserData(data)
          toast.success("Details Updated Successfully")
        } else {
          toast.error("Some Error");
        }
      } catch (error) {
        toast.error("Some error occured " + error)
      } finally {
        setLoading(false)
      }
    }
  }


  return (
    <div className='w-full h-[calc(100vh-80px)] flex justify-center items-center'>
      <form className='w-full lg:w-170 px-3 mx-2 py-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-md ' onSubmit={handleSubmit}>
        <div className='w-full px-5 py-4 bg-white rounded-md flex flex-col gap-3'>
          <h1 className='text-4xl mb-2 text-center font-bold'>Edit Profile</h1>
          {auth.role == "ADMIN" && <div className='flex flex-col gap-2'>
            <label htmlFor="name" className='font-bold text-lg' >Shop Name</label>
            <input type="text" placeholder='alice bob' id='shopName' name='shopName' className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold' value={formData.shopName} onChange={handleChange} />
            {errors && errors.shopName && <p className='text-red-500'>{errors.shopName}</p>}
          </div>}
          <div className='flex flex-col gap-2'>
            <label htmlFor="name" className='font-bold text-lg' >{auth.role == "ADMIN" ? "Owner Name" : "Name"}</label>
            <input type="text" placeholder='alice bob' id='name' name='name' className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold' value={formData.name} onChange={handleChange} />
            {errors && errors.name && <p className='text-red-500'>{errors.name}</p>}
          </div>

          {auth.role == "ADMIN" && <>
            <div className='flex flex-col gap-2'>
              <label htmlFor="email" className='font-bold text-lg' >Email</label>
              <input type="email" placeholder='yourname@example.com' id='email' name='email' className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold' value={formData.email} onChange={handleChange} />
              {errors && errors.email && <p className='text-red-500'>{errors.email}</p>}
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="address" className='font-bold text-lg' >Address</label>
              <input type="text" placeholder='alice bob' id='shopAddress' name='shopAddress' className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold' value={formData.shopAddress} onChange={handleChange} />
              {errors && errors.address && <p className='text-red-500'>{errors.address}</p>}
            </div>
          </>}

          <button className='bg-yellow-600 text-black font-bold py-2 text-center rounded-md cursor-pointer' disabled={loading}>{loading ? <PulseLoader color='#ffffff' size={12} /> : "Update Details"}</button>
        </div>
      </form>
    </div>
  )
}


export default Setting
