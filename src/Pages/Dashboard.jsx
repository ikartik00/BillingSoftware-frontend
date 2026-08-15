import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContextProvider'
import { ClockFading, IndianRupee, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { userData, setLoadingUser, LoadingUser } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    const loadDashBoardData = async () => {
      try {
        setLoading(false)
        let response = await fetch(`${API_URL}/dashboard/`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        })
        if (response.status == 200) {
          let data = await response.json()
          console.log(data);

          setData(data)
        } else {
          toast.error("Some Error Occured")
          setData([])
        }
      } catch (error) {
        toast.error(("Something went wrong"));
        setData([])
      } finally {
        setLoading(false)
      }
    }
    loadDashBoardData();
  }, [])

  if (loading) {
    return <div className='text-center text-3xl font-bold m-3'>Loading......</div>
  }
  if (!data) {
    return <div className='text-center text-3xl font-bold m-3'>No Data Available</div>
  }

  return (
    <div className='h-[calc(100vh-80px)] overflow-y-auto dashboardScroll bg-black/95 px-4 py-2'>
      <div className='flex justify-between items-center'>
      <h1 className='sm:text-4xl text-2xl font-bold text-emerald-500 mb-2 px-5 py-2'>Welcome, {!LoadingUser && userData && userData?.shopName}</h1>
      <p className=' font-md font-semibold text-emerald-500'>Login User Name : {userData?.name}</p>
      </div>
      <div className='flex min-[500px]:flex-row flex-col gap-6 w-full'>
        <div className='flex gap-5 items-center min-[500px]:w-1/2 w-full bg-black/35 px-5 py-4 rounded-md'>
          <span className='bg-green-200 px-2 py-2 rounded-[50%] text-green-600 font-bold'>
            <IndianRupee size={27} />
          </span>
          <div className='flex flex-col gap-1'>
            <p className='text-zinc-400 font-bold text-md'>Todays Sales</p>
            <h1 className='text-2xl font-bold text-white'>₹{data.todaySales}</h1>
          </div>
        </div>
        <div className='flex gap-5 items-center min-[500px]:w-1/2 w-full bg-black/35 px-5 py-4 rounded-md'>
          <span className='bg-green-200 px-2 py-2 rounded-[50%] text-green-600 font-bold'>
            <ShoppingCart size={27} />
          </span>
          <div className='flex flex-col gap-1'>
            <p className='text-zinc-400 font-bold text-md'>Todays Orders</p>
            <h1 className='text-2xl font-bold text-white'>{data.todayOrderCount}</h1>
          </div>
        </div>
      </div>
      <div className=' bg-black/35 rounded-md mt-3'>
        <h2 className='text-2xl font-bold text-white mb-2 flex gap-2 items-center px-6 py-3'><span><ClockFading /></span><span>Recent Orders</span></h2>
        <div className='rounded-md md:overflow-hidden overflow-x-auto DashboardneechekaScroll px-4'>
          <table className='min-w-full text-white'>
            <thead className='text-lg text-left'>
              <tr className='border-b bg-[#191a1c]'>
                <th className='px-2 py-3'>Order Id</th>
                <th className='px-2 py-3'>Customer</th>
                <th className='px-2 py-3'>Amount</th>
                <th className='px-2 py-3'>Payment</th>
                <th className='px-2 py-3'>Status</th>
                <th className='px-2 py-3'>Time</th>
              </tr>
            </thead>
            <tbody>
              {data && data.recentOrders && data.recentOrders.map((order, index) => (
                <tr key={index} className='border-b hover:bg-[#191a1c]'>
                  <td className='px-2 py-3'>{order.orderId}</td>
                  <td className='px-2 py-3'>{order.customerName}</td>
                  <td className='px-2 py-3'>₹{order.grandTotal}</td>
                  <td className='px-2 py-3'>{order.paymentMethod}</td>
                  <td className='px-2 py-3'>{order.paymentDetails.status}</td>
                  <td className='px-2 py-3'>{new Date(order.createdAt).toLocaleDateString('en-US',{
                    hour : '2-digit',
                    minute : '2-digit'
                  })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard