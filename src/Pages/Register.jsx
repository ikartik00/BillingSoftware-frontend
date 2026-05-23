import { useNavigate } from 'react-router-dom'
import React, { useContext, useState } from 'react'
// import { toast } from 'react-toastify'
// import { AppContext } from '../Components/Context/AppContextProvider'
import { ClipLoader, PulseLoader } from 'react-spinners'
import { State, City } from 'country-state-city'
import billingImage from "../assets/billingImage.jpg"
import toast from 'react-hot-toast'


const Register = () => {
    const states = State.getStatesOfCountry("IN");
    const [formData, setFormData] = useState({
        ownerName: "",
        email: "",
        password: "",
        shopName: "",
        city: "Select City",
        shopAddress: "",
        state: "Select State",
        pincode: "",
        GSTNumber: ""
    })

    const [stateSelected, setStateSelected] = useState("")
    const cities = City.getCitiesOfState("IN", stateSelected)

    const [error, setError] = useState({})
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {}
        if (!formData.ownerName) {
            errors.name = "Name is Required"
        }
        if (!formData.email) {
            errors.email = "Email Required"
        }
        if (!formData.email.includes("@") || formData.email.includes(" ")) {
            errors.email = "Invalid Email"
        }
        if (!formData.password || formData.password.trim().length < 6) {
            errors.password = "Password should not be empty and it must be of 6 characters"
        }
        if (formData.shopAddress.trim() == "") {
            errors.shopAddress = "Address is Required"
        }
         if (formData.shopName.trim() == "") {
            errors.shopName = "Shop Name is Required"
        }
        if (formData.city == "Select City") {
            errors.city = "City is Required"
        }
        if (formData.state == "Select State") {
            errors.state = "State is Required"
        }
        if (formData.pincode.trim() == "") {
            errors.pincode = "pincode is Required"
        }else if(formData.pincode.length != 6){
            errors.pincode = "pincode must be of 6 digits"
        }

        if(formData.GSTNumber && formData.GSTNumber.length != 15){
             errors.GSTNumber = "Invalid GST Number"
        }

        console.log(formData.ownerName, formData.GSTNumber, formData.email, formData.password, formData.city, formData.state);
        
        setError(errors)
        if (Object.keys(errors).length > 0) {
            return;
        }
        try {
            setLoading(true)
            let response = await fetch("https://billingsoftware-backend-production.up.railway.app/register", {
                method: "Post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    GSTNumber : formData.GSTNumber || null
                })
            });
            const data =  await response.json();
            if (response.status == 201) {
                navigate("/login")
                console.log(data);
                toast.success("Registered Successfully Please Login")
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Some error occured " + error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='lg:h-screen flex justify-center items-center bg-cover bg-center' style={{
                    backgroundImage: `
              linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
              url(${billingImage})`
              }}>
            <div className='flex justify-center items-center w-full'>
                <div className='flex bg-white rounded-lg px-5 pt-7 pb-3 flex-col lg:w-250 md:w-170 mx-10 max-[450px]:w-90 max-[390px]:w-80 lg:my-1 my-2'>
                    <h1 className='text-3xl text-center font-bold mb-6'>Create Account</h1>
                    <div>
                        <form className='flex gap-3 flex-col' onSubmit={handleSubmit}>
                            <div className='flex md:flex-row flex-col justify-between gap-5 w-full'>
                                <div className='flex flex-col gap-1 md:w-1/2 w-full'>
                                    <label htmlFor="name" className='font-semibold text-lg'>Owner Name</label>
                                    <input type="text"
                                        placeholder='alice bob'
                                        className='border border-zinc-400 px-3 py-1 rounded-md placeholder-black/85'
                                        name='ownerName'
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                    />
                                    {error.name && <p className='text-red-500'>{error.name}</p>}
                                </div>
                                <div className='flex flex-col gap-1 md:w-1/2 w-full'>
                                    <label htmlFor="email" className='font-semibold text-lg'>Email Id</label>
                                    <input type="email"
                                        placeholder='yourname@example.com'
                                        className='border border-zinc-400 px-3 py-1 rounded-md placeholder-black/85'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {error.email && <p className='text-red-500'>{error.email}</p>}
                                </div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="password" className='font-semibold text-lg'>Password</label>
                                <input
                                    type="password"
                                    placeholder='***********'
                                    className='border border-zinc-400 px-3 py-1 rounded-md placeholder-black/85'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {error.password && <p className='text-red-500'>{error.password}</p>}
                            </div>
                            <div className='flex gap-3 w-full md:flex-row flex-col'>
                                <div className='flex flex-col gap-1 md:w-1/2 w-full'>
                                    <label htmlFor="shopName" className='font-semibold text-lg'>Shop Name</label>
                                    <input
                                        type="text"
                                        placeholder='eg Aditya Traders'
                                        className='border border-zinc-400 px-3 py-1 rounded-md placeholder-black/85'
                                        name='shopName'
                                        value={formData.shopName}
                                        onChange={handleChange}
                                    />
                                    {error.shopName && <p className='text-red-500'>{error.shopName}</p>}
                                </div>
                                <div className='flex flex-col gap-1 md:w-1/2 w-full'>
                                    <label htmlFor="GSTIN" className='font-semibold text-lg'>GSTIN</label>
                                    <input
                                        type="text"
                                        placeholder='eg 23xxxxxxxxxxxD1ZD'
                                        className='border border-zinc-400 px-3 py-1 rounded-md placeholder-black/85'
                                        name='GSTNumber'
                                        value={formData.GSTNumber}
                                        onChange={handleChange}
                                    />
                                    {error.GSTNumber && <p className='text-red-500'>{error.GSTNumber}</p>}
                                </div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="shopAddress" className='font-semibold text-lg'>Shop Address</label>
                                <input
                                    type="text"
                                    placeholder='eg Esagarh'
                                    className='border border-zinc-400 px-3 py-1 rounded-md placeholder-black/85'
                                    name='shopAddress'
                                    value={formData.shopAddress}
                                    onChange={handleChange}
                                />
                                {error.shopAddress && <p className='text-red-500'>{error.shopAddress}</p>}
                            </div>

                            <div className='flex justify-between gap-5 lg:flex-row flex-col w-full'>
                                <div className='flex flex-col gap-1 lg:w-1/3 w-full'>
                                    <label htmlFor="state" className='font-semibold text-lg'>Select State</label>
                                    <select name="state" value={formData.state} onChange={(e) =>{ setStateSelected(e.target.value), handleChange(e)}} className='border border-zinc-400 px-3 py-1 rounded-md placeholder-black/85'>
                                        <option>Select State</option>
                                        {states.map((state, idx) => (
                                            <option key={idx} value={state.isoCode}>{state.name}</option>
                                        ))}
                                    </select>
                                    {error.state && <p className='text-red-500'>{error.state}</p>}
                                </div>
                                <div className='flex flex-col gap-1 lg:w-1/3 w-full'>
                                    <label htmlFor="city" className='font-semibold text-lg'>Select City</label>
                                    <select name="city" value={formData.city} onChange={handleChange} className='border border-zinc-400 px-3 py-1 rounded-md placeholder-black/85'>
                                        <option>Select City</option>
                                        {cities.map((city, idx) => (
                                            <option key={idx} value={city.name}>{city.name}</option>
                                        ))}
                                    </select>
                                    {error.city && <p className='text-red-500'>{error.city}</p>}
                                </div>
                                <div className='flex flex-col gap-1 lg:w-1/3 w-full'>
                                    <label htmlFor="pincode" className='font-semibold text-lg'>PinCode</label>
                                    <input type="pincode"
                                        placeholder='sg 473335'
                                        className='border border-zinc-400 px-3 py-1 rounded-md placeholder-black/85'
                                        name='pincode'
                                        value={formData.pincode}
                                        onChange={handleChange}
                                    />
                                    {error.pincode && <p className='text-red-500'>{error.pincode}</p>}
                                </div>
                            </div>
                            <button className='border bg-blue-700 text-white font-bold px-3 py-1 cursor-pointer rounded-md' disabled={loading}>{loading ? <ClipLoader loading={true} cssOverride={{ color: "white" }} size={17} color='#ffffff' /> : "Sign Up"}</button>
                            <p className='text-center'>Already have an account ? {" "} <span className='underline cursor-pointer' onClick={() => navigate("/login")}>Login</span> </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Register