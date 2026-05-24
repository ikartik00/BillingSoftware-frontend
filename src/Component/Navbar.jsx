import React, { useContext, useState } from 'react'
import billinglogo from "../assets/billinglogo.png"
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react';
import userImage from '../assets/userImage.png'
import { ChevronDown } from 'lucide-react';
import { AppContext } from '../Context/AppContextProvider';

const Navbar = () => {
    const { setAuth, auth, setCartItems, setUserData } = useContext(AppContext)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [showDropDown, setShowDropDown] = useState(false)
    const navigate = useNavigate()

    const logoutHandler = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role")
        setAuth(null, null)
        setCartItems([])
        setUserData(null)
        navigate("/login")
    }

    return (
        <div className='relative'>
            <nav className='bg-black flex gap-15 items-center justify-between'>
                <div className='flex items-center gap-10'>
                    <div className="h-20 select-none">
                        <img className='h-full' src={billinglogo} alt="" />
                    </div>
                    <div>
                        <ul className='lg:flex gap-10 hidden'>
                            <li><NavLink to={"/dashboard"} className={({ isActive }) => isActive ? "text-yellow-600  font-bold text-md" : "text-gray-400 font-semibold text-md"}>DASHBOARD</NavLink></li>
                            <li><NavLink to={"/explore"} className={({ isActive }) => isActive ? "text-yellow-600 font-bold text-md" : "text-gray-400 font-semibold text-md"}>EXPLORE</NavLink></li>
                            {auth && auth.role === "ADMIN" && (
                                <>
                                    <li><NavLink to={"/items"} className={({ isActive }) => isActive ? "text-yellow-600 font-bold text-md" : "text-gray-400 font-semibold text-md"}>MANAGE ITEMS</NavLink></li>
                                    <li><NavLink to={"/categories"} className={({ isActive }) => isActive ? "text-yellow-600 font-bold text-md" : "text-gray-400 font-semibold text-md"}>MANAGE CATEGORIES</NavLink></li>
                                    <li><NavLink to={"/users"} className={({ isActive }) => isActive ? "text-yellow-600 font-bold text-md" : "text-gray-400 font-semibold text-md"}>MANAGE USERS</NavLink></li>
                                    <li><NavLink to={"/add-stock"} className={({ isActive }) => isActive ? "text-yellow-600 font-bold text-md" : "text-gray-400 font-semibold text-md"}>Add Stock</NavLink></li>
                                </>
                            )}
                            <li><NavLink to={"/order-history"} className={({ isActive }) => isActive ? "text-yellow-600 font-bold text-md" : "text-gray-400 font-semibold text-md"}>Order History</NavLink></li>

                        </ul>
                    </div>
                </div>
                <div className='flex gap-3 items-center select-none'>
                    <Menu className='lg:hidden flex text-white cursor-pointer' size={32} onClick={() => setIsMenuOpen(!isMenuOpen)} />
                    <div className='flex text-white  justify-center items-center cursor-pointer' onClick={() => setShowDropDown(!showDropDown)}>
                        <span><img src={userImage} alt="" className='w-12' /></span>
                        <span><ChevronDown size={20} /></span>
                    </div>
                </div>
            </nav>
            {showDropDown && <div className='flex flex-col gap-2 bg-white w-70 rounded-xl text-black font-semibold px-4 py-2 absolute top-18 right-3 z-10 select-none'>
                <p className='cursor-pointer' onClick={()=>{navigate("/setting"); setShowDropDown(false)}}>Settings</p>
                <p className='cursor-pointer'>Activity log</p>
                <hr />
                <p className='cursor-pointer' onClick={logoutHandler}>Logout</p>
            </div>}
            {isMenuOpen && (
                <div className='lg:hidden flex flex-col gap-2 bg-black px-2 py-1 absolute top-20 w-full z-2'>
                    <ul className='flex gap-3 flex-col select-none'>
                        <li onClick={() => setIsMenuOpen(false)}><NavLink to={"/dashboard"} className={({ isActive }) => isActive ? "text-white font-bold text-lg" : "text-gray-400 font-semibold select-none text-lg"}>DASHBOARD</NavLink></li>
                        <li onClick={() => setIsMenuOpen(false)}><NavLink to={"/explore"} className={({ isActive }) => isActive ? "text-white font-bold text-lg" : "text-gray-400 font-semibold text-lg"}>EXPLORE</NavLink></li>

                        {auth.role === "ADMIN" && (
                            <>
                                <li onClick={() => setIsMenuOpen(false)}><NavLink to={"/items"} className={({ isActive }) => isActive ? "text-white font-bold text-lg" : "text-gray-400 font-semibold text-lg"}>MANAGE ITEMS</NavLink></li>
                                <li onClick={() => setIsMenuOpen(false)}><NavLink to={"/categories"} className={({ isActive }) => isActive ? "text-white font-bold text-lg" : "text-gray-400 font-semibold text-lg"}>MANAGE CATEGORIES</NavLink></li>
                                <li onClick={() => setIsMenuOpen(false)}><NavLink to={"/users"} className={({ isActive }) => isActive ? "text-white font-bold text-lg" : "text-gray-400 font-semibold text-lg"}>MANAGE USERS</NavLink></li>
                                 <li onClick={() => setIsMenuOpen(false)}><NavLink to={"/add-stock"} className={({ isActive }) => isActive ? "text-white font-bold text-lg" : "text-gray-400 font-semibold text-lg"}>Add Stock</NavLink></li>
                            </>
                        )}
                        <li><NavLink to={"/order-history"} onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? "text-white font-bold text-lg" : "text-gray-400 font-semibold text-lg"}>Order History</NavLink></li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Navbar