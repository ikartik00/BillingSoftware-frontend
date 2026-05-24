import React, { useEffect, useState } from 'react'
import { createContext } from "react";
import { useNavigate } from 'react-router-dom';
export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
    const [categories, setCategories] = useState([])
    const [auth, setAuth] = useState({ token: localStorage.getItem("token"), role: localStorage.getItem("role") })
    const [userData, setUserData] = useState(null)
    const [loadingUser, setLoadingUser] = useState(false)
    const [items, setItems] = useState([])
    const [loadItems, setLoadItems] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [loadCategory, setLoadCategory] = useState(false)
    const navigate = useNavigate()

    const setAuthData = (token, role) => {
        setAuth({ token, role })
    }

    async function getLoggedInUser() {
        try {
            setUserData(null)
            setLoadingUser(true)
            let response = await fetch("https://billingsoftware-backend-production.up.railway.app/profile", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            let data = await response.json()
            if (response.ok) {
                setUserData(data)
                console.log(data);
            }else if(response.status == 401){
                localStorage.removeItem("token")
                localStorage.removeItem("auth")
                navigate("/login")
            }
             else {
                console.log("Some Error Occured");
                setUserData(null)
            }
        } catch (error) {
            console.log("Error in api", error);
            setUserData(null)
        } finally {
            setLoadingUser(false)
        }
    }


    async function loadCategories() {
        try {
            setLoadCategory(true)
            let response = await fetch("https://billingsoftware-backend-production.up.railway.app/categories/all", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.ok) {
                response = await response.json();
                setCategories(response)
            }
        } catch (error) {
            console.log("Error in api", error);
            setCategories([])
        }finally{
            setLoadCategory(false)
        }
    }

    async function loadItemsfunction() {
        try {
            setLoadItems(true)
            let response = await fetch("https://billingsoftware-backend-production.up.railway.app/items", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response) {
                response = await response.json();
                setItems(response)
            }
        } catch (error) {
            console.log("Error in api", error);
            setItems([])
        } finally {
            setLoadItems(false)
        }
    }

    const addToCart = (item) => {
        let existingItem = cartItems.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            setCartItems(cartItems.map(cartItem => (cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)))
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1 }])
        }
    }

    const removeFromCart = (item) => {
        let filteredCart = cartItems.filter((cartItem) => {
            return cartItem.name != item.name
        })
        setCartItems(filteredCart)
    }

    const updateQuantity = (itemId, newQuantity) => {
        let updatedItems = cartItems.map(cartItem => (cartItem.itemId === itemId ? { ...cartItem, quantity: newQuantity } : cartItem))
        setCartItems(updatedItems)
    }

    const clearCart = () => {
        setCartItems([])
    }


    useEffect(() => {
         if(localStorage.getItem("token") && localStorage.getItem("role")){
            setAuthData(localStorage.getItem("token") , localStorage.getItem("role"))
        }
        getLoggedInUser()
        loadCategories()
        loadItemsfunction()
    }, [])


    return (
        <AppContext.Provider value={{ categories, setCategories, setAuthData, auth, setAuth, getLoggedInUser, loadingUser, loadCategories, userData, loadItems, setLoadItems, loadItemsfunction, items, setItems, addToCart, cartItems, removeFromCart, updateQuantity, clearCart, setCartItems, setUserData, loadCategory, setLoadCategory }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider