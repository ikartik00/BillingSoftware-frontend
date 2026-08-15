import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { PulseLoader } from 'react-spinners'


const UsersForm = ({users, setUsers}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setFormData({ ...formData, [name]: value });
    }
    const handleSubmit = async (e)=>{
        e.preventDefault()
        let error = {}
        if (!formData.name) {
            error.name = "Name is Required"
        }
        if (!formData.email) {
            error.email = "Email Required"
        }
        else if (!formData.email.includes("@") || !formData.email.includes(".") || formData.email.includes(" ")) {
            error.email = "Invalid Email"
        }
        if (!formData.password || formData.password.trim().length < 6) {
            error.password = "Password should not be empty and it must be of 6 characters"
        }
        setErrors(error)
        if(Object.keys(error).length > 0){
            return ;
        }
        try{
            setLoading(true)
            let response = await fetch(`${API_URL}/admin/register`, {
                method  : "POST",
                headers : {
                    "Authorization" : `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(formData)
            })
            let data = await response.json();
            if(response.status == 201){
                console.log(data);
                setUsers([...users, data])
                toast.success("Employee Registered Successfully")
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error("Some Error Occured")
        }finally{
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='w-full px-5 py-3 bg-white rounded-md flex flex-col gap-3'>
                <h1 className='text-4xl mb-2 text-center font-bold'>Add New Employee</h1>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="name" className='font-bold text-lg' >Name</label>
                    <input type="text" placeholder='alice bob' id='name' name='name' className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold' value={formData.name} onChange={handleChange} />
                    {errors && errors.name && <p className='text-red-500'>{errors.name}</p> }
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="email" className='font-bold text-lg' >Email</label>
                    <input type="email" placeholder='yourname@example.com' id='email' name='email' className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold' value={formData.email} onChange={handleChange} />
                    {errors && errors.email && <p className='text-red-500'>{errors.email}</p> }
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="password" className='font-bold text-lg' >Password</label>
                    <input type="password" placeholder='**************' id='password' name='password' className='border-zinc-500 border px-3 py-1 outline-none rounded-md font-semibold' value={formData.password} onChange={handleChange} />
                    {errors && errors.password && <p className='text-red-500'>{errors.password}</p> }
                </div>
                <button className='bg-yellow-600 text-black font-bold py-2 text-center rounded-md cursor-pointer' disabled={loading}>{loading ? <PulseLoader color='#ffffff' size={12}/> : "Add new Employee"}</button>
            </div>
        </form>
    )
}

export default UsersForm