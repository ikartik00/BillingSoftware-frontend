import React, { useContext } from 'react'

import { useState } from "react";
import { AppContext } from '../Context/AppContextProvider';

function ShowPopup({orderDetails, setShowPopup, handlePrintReceipt}) {
    const {userData} = useContext(AppContext)
    
    
    return (
        <div className='fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.7)] flex justify-center items-center'>
            <div className='bg-white text-black px-3 py-5 rounded-md flex flex-col gap-2 w-90'>
                <div className='mb-3 flex flex-col justify-center items-center'>
                    <h1 className=' text-2xl font-bold '>M/S.{userData && userData.shopName}</h1>
                    <p className=' text-xl font-semibold '>{userData && userData.shopAddress}</p>
                    <h1 className='text-center text-xl font-bold '>Order Receipt</h1>
                </div>
                <div>
                    <div className='flex gap-2 items-center'>
                        <span className='font-bold text-md'>OrderID : </span>
                        <span className='text-sm font-semibold'>{orderDetails.orderId}</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <span className='font-bold text-md'>Name : </span>
                        <span className='text-sm font-semibold'>{orderDetails.customerName}</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <span className='font-bold text-md'>Phone : </span>
                        <span className='text-sm font-semibold'>{orderDetails.mobileNumber}</span>
                    </div>
                </div>
                <hr />
                <div>
                    <h2 className='font-bold text-md mb-1'>Items Ordered</h2>
                    {orderDetails.cartItems.map((item, index)=>(
                        <div key={index} className='flex justify-between items-center'>
                        <span>{item.name}</span>
                        <span>{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    ))}
                </div>
                <hr />
                <div>
                    <div className='flex justify-between items-center'>
                        <span className='font-bold text-md'>Subtotal</span>
                        <span className='text-sm font-semibold'>{(orderDetails.subtotal).toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='font-bold text-md'>Tax(1%)</span>
                        <span className='text-sm font-semibold'>{(orderDetails.tax).toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='font-bold text-md'>Grand Total</span>
                        <span className='text-sm font-semibold'>{(orderDetails.grandTotal).toFixed(2)}</span>
                    </div>
                     <div className='flex justify-between items-center'>
                        <span className='font-bold text-md'>Payment Method</span>
                        <span className='text-sm font-semibold'>{orderDetails.paymentMethod}</span>
                    </div>
                </div>
                <div className='flex gap-1 flex-col mt-1'>
                    <p className='text-sm'><span className='font-bold'>RazorPay Order Id : </span> <span>{orderDetails.paymentDetails && orderDetails.paymentDetails.razorpayOrderId }</span></p>
                     <p className='text-sm'><span className='font-bold'>RazorPay Payment Id : </span><span>{orderDetails.paymentDetails && orderDetails.paymentDetails.razorpayPaymentId }</span></p>
                </div>
                <div className='flex gap-2 justify-end mt-3'>
                    <button className='bg-yellow-500 text-black font-semibold px-3 py-2 rounded-md cursor-pointer' onClick={handlePrintReceipt}>Print Receipt</button>
                    <button className='bg-red-600 text-white font-semibold px-3 py-2 rounded-md cursor-pointer' onClick={()=>setShowPopup(false)}>Close</button>
                </div>
            </div>
        </div>

    );
}

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

const receiptStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    color: "Black"
};

export default ShowPopup