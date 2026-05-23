import React, { useContext, useState } from 'react'
import billingImage from "../assets/billingImage.jpg"
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AppContext } from '../Context/AppContextProvider'
import {PulseLoader} from 'react-spinners'

const Login = () => {
    const navigate = useNavigate("")
    const { setAuthData, getLoggedInUser } = useContext(AppContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({})
    const [loginform, setloginform] = useState({
        email: "",
        password: ""
    })

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setloginform({ ...loginform, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {};
        if (!loginform.email || !loginform.email.includes("@") || loginform.email.includes(" ")) {
            errors.email = "Email Invalid"
        }
        if (!loginform.password || loginform.password.trim().length < 6 || loginform.password.includes(" ")) {
            errors.password = "Password length should be minimum 6"
        }
        setError(errors)
        if (Object.keys(errors).length > 0) {
            return;
        }

        setLoading(true)
        try {
            let response = await fetch("https://billingsoftware-backend-production.up.railway.app/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginform)
            })
            let data = await response.json()
            if (response.status == 200) {
                toast.success("Login Successfull")
                console.log(data);
                localStorage.setItem("token", data.token)
                localStorage.setItem("role", data.role);
                setAuthData(data.token, data.role);
                await getLoggedInUser();
                navigate("/dashboard");
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Email Password Invalid")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full h-screen flex justify-center items-center bg-cover bg-center' style={{
            backgroundImage: `
      linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
      url(${billingImage})
    `}}>
            <form onSubmit={handleSubmit}>
                <div className='bg-white rounded-md shadow-lg p-4 w-100 flex gap-3 flex-col'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-3xl text-center font-bold'>Sign In</h1>
                        <p className='text-md text-center'>Sign in below to access your account</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="email" className='font-semibold text-lg'>Email Address</label>
                        <input
                            type="email"
                            placeholder='yourname@example.com'
                            className='border outline-none px-2 py-1 rounded-md placeholder-black/85'
                            value={loginform.email}
                            name='email'
                            onChange={onChangeHandler}
                        />
                        {error.email && <p className='text-red-600'>{error.email}</p>}
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="password" className='font-semibold text-lg'>Password</label>
                        <input type="password"
                            placeholder='***********'
                            className='border outline-none px-2 py-1 rounded-md placeholder-black/85'
                            value={loginform.password}
                            name='password'
                            onChange={onChangeHandler}
                        />
                        {error.password && <p className='text-red-600'>{error.password}</p>}
                    </div>
                    <button className='text-white bg-black py-1 rounded-md w-full cursor-pointer' disabled={loading}>{loading? <PulseLoader loading={true} size={17} color='#ffffff' /> : "Sign in"}</button>
                    <p>Don't Have an account ? <span className='cursor-pointer text-blue-500 font-semibold' onClick={()=>navigate("/register")}>Register</span></p>
                </div>
            </form>
        </div>
    )
}

export default Login