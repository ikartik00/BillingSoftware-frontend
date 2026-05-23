import React, { useContext, useState } from 'react'
import { AppContext } from '../Context/AppContextProvider'
import toast from 'react-hot-toast'
import { AppConstants } from '../util/Constants'
import ShowPopup from '../Pages/ShowPopup'

const CartSummary = ({ customerName, setCustomerName, mobileNumber, setMobileNumber }) => {
  const { cartItems, clearCart, items, setItems } = useContext(AppContext)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const totalAmount = cartItems.length > 0 ? cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;
  const tax = totalAmount * 0.01
  const grandTotal = totalAmount + tax;

  const clearAll = () => {
    setCustomerName("")
    setMobileNumber("")
    clearCart();
  }
  const placeOrder = () => {
    setShowPopup(true)
    clearAll();
  }
  const handlePrintReceipt = () => {
    window.print();
  }

  const loadRazorPayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const deleteOrderOnFailure = async (orderId) => {
    try {
      let response = await fetch(`https://billingsoftware-backend-production.up.railway.app/orders/delete/${orderId}`, {
        method: "Delete",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (response.status == 204) {
        console.log("Successfuly Deleted");
      }
    } catch (error) {
      toast.error("Some Error Occured");
    }
  }

  const completePayment = async (paymentMode) => {
    console.log(mobileNumber, customerName);

    if (!mobileNumber || !customerName) {
      toast.error("Please Enter Customer Details");
      return;
    }
    if (mobileNumber.length != 10) {
      toast.error("Please Enter Valid Mobile Number")
      return;
    }

    if (cartItems.length == 0) {
      toast.error("Your Cart is Empty")
      return;
    }
    const orderData = {
      customerName,
      mobileNumber,
      cartItems,
      subtotal: totalAmount,
      tax,
      grandTotal,
      paymentMethod: paymentMode.toUpperCase()
    }

    let hasError = false;
    let hasInvalidStock = cartItems.some((cartItem) => {
      const item = items.find(item => item.itemId === cartItem.itemId)
      if (item) {
        if (item.availableStock < cartItem.quantity) {
          hasError = true;
          toast.error(`${item.name} stock not available Available stock is ${item.availableStock}`)
          return true;
        }
        return false;
      }
    })
    if (hasInvalidStock) {
      return;
    }

    setIsProcessing(true)
    try {
      let response = await fetch("https://billingsoftware-backend-production.up.railway.app/orders/create-order", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      })
      let data = await response.json()
      if (response.status == 201 && paymentMode == "cash") {
        toast.success("Cash Received Order Successfull")
        setOrderDetails(data)
        console.log(data);

        const updatedItems = items.map(item => {
          const cartItem = data.cartItems.find(cartItem => cartItem.itemId === item.itemId)
          if (cartItem) {
            return {
              ...item,
              availableStock: item.availableStock - cartItem.quantity
            }
          }
          return item;
        })
        setItems(updatedItems)

        placeOrder();
      } else if (response.status == 201 && paymentMode == "upi") {
        const razorpayLoaded = await loadRazorPayScript();
        if (!razorpayLoaded) {
          toast.error("Unable to load Razorpay");
          deleteOrderOnFailure(data.orderId);
          return;
        }
        //Create RazorPay Order
        let razorPayOrder = await fetch("https://billingsoftware-backend-production.up.railway.app/payments/create-order", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ amount: grandTotal, currency: "INR" })
        })
        let razorpayResponse = await razorPayOrder.json();
        if (razorpayResponse.status == 201) {
          toast.success("Razorpay order created successfully")
        }
        const options = {
          key: AppConstants.RAZORPAY_KEY_ID,
          amount: razorpayResponse.amount,
          currency: razorpayResponse.currency,
          order_id: razorpayResponse.id,
          name: "My Retail Shop",
          description: "Order Payment",
          //Jab paymemnt success ho jata hai tab handlerfunctioon mai ek response aata hai wahi response parameter mai automatic chala jata hai
          handler: async function (response) {
            await verifyPayment(response, data)
          },
          prefill: {
            name: customerName,
            contact: mobileNumber
          },
          theme: {
            color: "#3399CC"
          },
          modal: {
            ondismiss: async () => {
              await deleteOrderOnFailure(data.orderId)
              toast.error("Payment Cancelled")
            }
          }
        }
        const rzp = new window.Razorpay(options);
        rzp.on("payment failed", async (response) => {
          await deleteOrderOnFailure(data.orderId);
          toast.error("Payment Failed")
          console.error("response.error.description")
        });
        rzp.open();
      }
    } catch (error) {
      console.error(error)
      toast.error("Payment Processing failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const verifyPayment = async (response, savedOrder) => {
    const paymentData = {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
      orderId: savedOrder.orderId
    };
    try {
      let paymentResponse = await fetch("https://billingsoftware-backend-production.up.railway.app/payments/verify", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentData)
      })
      if (paymentResponse.status == 200) {
        toast.success("Payment Successfull")
        setOrderDetails({
          ...savedOrder,
          paymentDetails: {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }
        })
        placeOrder()

        const updatedItems = items.map(item => {
          const cartItem = savedOrder.cartItems.find(cartItem => cartItem.itemId === item.itemId)
          if (cartItem) {
            return {
              ...item,
              availableStock: item.availableStock - cartItem.quantity
            }
          }
          return item;
        })
        setItems(updatedItems)

      } else {
        toast.error("Paymeent Verification Failed");
      }
    } catch (error) {
      toast.error("Payment Failed");
      console.error(error);
    }
  }

  return (
    <div>
      <div className='flex justify-between'>
        <span>Item</span>
        <span>₹{totalAmount.toFixed(2)}</span>
      </div>
      <div className='flex justify-between '>
        <span>Tax (1%)</span>
        <span>₹{tax.toFixed(2)}</span>
      </div>
      <div className='flex justify-between '>
        <span>Total</span>
        <span>₹{grandTotal.toFixed(2)}</span>
      </div>
      <div className='flex justify-between w-full gap-3'>
        <button className='bg-green-700 rounded-md w-1/2 py-1 text-white font-semibold cursor-pointer' onClick={() => completePayment("cash")} disabled={isProcessing}>{isProcessing ? "Processing" : "Cash"}</button>
        <button className='bg-blue-700 rounded-md w-1/2 py-1 text-white font-semibold cursor-pointer' onClick={() => completePayment("upi")} disabled={isProcessing}>{isProcessing ? "Processing" : "Upi"}</button>
      </div>
      <div className='mt-2'>
        <button
          className='bg-yellow-400 rounded-md w-full py-1 text-black font-semibold cursor-pointer' onClick={placeOrder} disabled={isProcessing || !orderDetails}>Place Order
        </button>
      </div>
      {showPopup && orderDetails && <ShowPopup orderDetails={orderDetails} setShowPopup={setShowPopup} handlePrintReceipt={handlePrintReceipt} />}
    </div>
  )
}

export default CartSummary