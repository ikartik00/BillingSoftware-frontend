import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';

const OrderHistory = () => {
    const [loading, setloading] = useState(false)
    const [orders, setOrders] = useState([])
    const [page, setPage] = useState(0);
    const [last, setLast] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)

    useEffect(() => {
        const loadAllOrders = async () => {
            try {
                if (page == 0) {
                    setloading(true)
                }
                let response = await fetch(`https://billingsoftware-backend-production.up.railway.app/orders/all-orders?page=${page}&size=10`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                let data = await response.json();
                if (response.status === 200) {
                    console.log(data);
                    setOrders((prev) => ([...prev, ...data.content]))
                    setLast(data.last);
                } else {
                    setOrders([])
                }
            } catch (error) {
                toast.error("Unbale to load orders")
            } finally {
                setloading(false)
                setLoadingMore(false)
            }
        }
        loadAllOrders()
    }, [page])

    const formatItems = (items) => {
        return items && items.map(item => `${item.name} X ${item.quantity}`).join(',')
    }
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
        return new Date(dateString).toLocaleDateString('en-US', options)
    }
    if (loading) {
        return <div className='text-3xl text-center mt-5 font-bold'>Loading.......</div>
    }
    if (orders.length == 0) {
        return <div className='text-3xl text-center text-red-500 mt-5 font-bold'>No Orders Found</div>
    }

    return (
        <div>
            <h1 className='text-3xl font-bold p-2 text-center'>All Orders</h1>
            <div className='overflow-x-scroll'>
                <table className='md:overflow-hidden min-w-full'>
                    <thead>
                        <tr className='bg-black text-white'>
                            <th className='py-2 px-2'>Order Id</th>
                            <th className='py-2 px-2'>Customer</th>
                            <th className='py-2 px-2'>Items</th>
                            <th className='py-2 px-2'>Total</th>
                            <th className='py-2 px-2'>Payment</th>
                            <th className='py-2 px-2'>Status</th>
                            <th className='py-2 px-2'>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order.orderId} className={index % 2 == 0 ? "bg-gray-200" : "bg-white"}>
                                <td className='py-3 px-2'>{order.orderId}</td>
                                <td className='py-3 px-2'>{order.customerName} <br /> <small className='text-md'>{order.mobileNumber}</small></td>
                                <td className='py-3  px-2'>{formatItems(order.cartItems)}</td>
                                <td className='py-3  px-2'>₹{order && order.grandTotal && (order.grandTotal).toFixed(2)}</td>
                                <td className='py-3  px-2'>{order.paymentMethod}</td>
                                <td className='py-3  px-2'><span className={`rounded-md px-2 ${order && order.paymentDetails && order.paymentDetails.status == 'COMPLETED' ? "bg-green-700" : "bg-yellow-500"}`}>{order.paymentDetails && order.paymentDetails.status}</span></td>
                                <td className='py-3 px-2'>{formatDate(order.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex gap-2 justify-center items-center'>
                <button disabled={last} onClick={() => { setPage(page + 1); setLoadingMore(true) }} className={`bg-yellow-600 text-white font-bold text-md rounded-md px-3 py-2 cursor-pointer ${loadingMore && "hidden"} ${last && "hidden"}`}>Load More</button>
                {loadingMore && <ClipLoader/>}
            </div>
        </div>
    )
}

export default OrderHistory