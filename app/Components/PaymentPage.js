"use client"
import { useState, useEffect, useTransition } from 'react'
import React from 'react'
import Script from 'next/script'
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { fetchPublicUser, fetchPayments } from '@/actions/userActions';



const PaymentPage = ({ username }) => {
    const { data: session } = useSession()
    const [form, setForm] = useState({
        name: "",
        message: "",
        amount: ""
    })
    const [currentUser, setCurrentUser] = useState({});
    const [dbPayments, setDbPayments] = useState([]);
    const [, startTransition] = useTransition();

    const loadPageData = async (creatorUsername) => {
        try {
            const safeUsername = String(creatorUsername || "").trim();
            const u = await fetchPublicUser(safeUsername);
            const payments = await fetchPayments(safeUsername);
            return {
                user: u || {},
                payments: payments || [],
            };
        } catch (error) {
            console.error('Error loading page data:', error);
            return {
                user: {},
                payments: [],
            };
        }
    }

    useEffect(() => {
        if (username) {
            startTransition(async () => {
                const data = await loadPageData(username);
                setCurrentUser(data.user);
                setDbPayments(data.payments);
            });
        }
    }, [startTransition, username]);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    //Function to place an order
    const createOrder = async () => {
        try {
            const res = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: form.amount,
                    to_username: username,
                    paymentForm: form,
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data?.error || 'Failed to create order');
            }

            return data
        } catch (error) {
            console.error('Error creating order:', error)
            throw error
        }
    }

    //Function for Payment Chekout
    const processPayment = async (e) => {
        e.preventDefault();

        const amountInRupees = Number(form.amount)
        if (!form.name.trim() || !Number.isFinite(amountInRupees) || amountInRupees <= 0) {
            toast.error('Please enter a valid name and amount', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }

        if (!currentUser?.razorpayid) {
            toast('Creator has not set up Razorpay!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }

        try {
            const order = await createOrder();

            if (!order?.orderId) {
                throw new Error('Could not create Razorpay order');
            }

            const options = {
                key: currentUser?.razorpayid,
                amount: order.amount,
                currency: order.currency || "INR",
                name: 'GetMeAChai',
                description: 'Support the creator by making a payment',
                order_id: order.orderId,

                handler: async function (response) {
                    const data = {
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                    };

                    const result = await fetch('/api/verify', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const res = await result.json();

                    if (res.isOk) {
                        toast('Thanks for your donation!', {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                            transition: Bounce,
                        });
                        // Refresh payments list
                        setTimeout(() => {
                            startTransition(async () => {
                                const data = await loadPageData(username);
                                setCurrentUser(data.user);
                                setDbPayments(data.payments);
                            });
                        }, 500);
                    }
                    else {
                        toast.error(res.message || 'Payment verification failed', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                            transition: Bounce,
                        });
                    }
                },

                prefill: {
                    name: form.name,
                    email: session?.user?.email || '',
                },

                theme: {
                    color: '#3399cc',
                },
            };

            if (!window.Razorpay) {
                alert('Razorpay SDK failed to load. Please refresh and try again.');
                return;
            }

            const paymentObject = new window.Razorpay(options);

            paymentObject.on('payment.failed', function (response) {
                toast.error(response.error.description, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            });

            paymentObject.open();

        } catch (error) {
            console.log(error);
            toast.error(error?.message || 'Payment could not be initiated', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" />

            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <div className="cover relative w-full">
                <img src={currentUser?.coverpic || "/coverpic.jpg"} alt="cover page" className='h-52 w-full object-fill sm:h-64 md:h-90' />
            </div>
            <div className="profile mx-auto -mt-14 flex w-fit justify-center sm:-mt-16">
                <img src={currentUser?.profilepic || "/avatar.gif"} alt="Profile picture" className='h-24 w-24 z-20 rounded-full border-4 border-slate-900 object-cover sm:h-28 sm:w-28 md:h-32 md:w-32' />
            </div>

            <div className="info mb-10 mt-8 flex flex-col items-center justify-center gap-3 px-4 text-center sm:px-6">
                <h1 className="text-2xl font-bold text-gray-200 sm:text-3xl">@{username}</h1>
                <div className="description w-full max-w-2xl text-center text-sm text-slate-400 sm:text-base">
                    Let Help {username} get a chai!
                </div>
                <div className="stats flex flex-wrap items-center justify-center gap-2 text-center text-sm font-bold text-slate-300 sm:gap-4">
                    Total Supporters: {dbPayments.length} <span className="mx-1">|</span> Amount Raised: ₹{dbPayments.reduce((total, payment) => total + payment.amount, 0) / 100}
                </div>
            </div>

            <hr className="my-12 h-px border-t-0 bg-transparent bg-linear-to-r from-transparent via-neutral-500 to-transparent opacity-40 dark:via-neutral-400" />

            <div className="payment mx-auto mb-20 flex w-full max-w-6xl flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-stretch">

                <div className="supporter w-full rounded-lg bg-slate-800 p-4 sm:p-5 lg:w-1/2">
                    {/* show a leaderboard of supporters with their contribution amounts and messages */}
                    <h2 className="text-xl font-bold text-gray-200 mb-4">Top 10 Supporters</h2>
                    <ul className="max-h-96 space-y-3 overflow-y-auto pr-1
                         [&::-webkit-scrollbar]:w-2
                         [&::-webkit-scrollbar-track]:bg-gray-100
                         [&::-webkit-scrollbar-thumb]:bg-gray-300
                         dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                        {
                            dbPayments && dbPayments.length > 0 ? (
                                dbPayments.map((payment, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <img src={"/avatar.gif"} alt="Supporter" className='object-cover w-10 h-10 rounded-full' />
                                        <div className="min-w-0">
                                            <p className="wrap-break-word font-medium text-gray-200">{payment.name} with message: {payment.message}</p>
                                            <p className="text-sm text-slate-400">₹{payment.amount / 100}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="text-slate-400">No payments yet.</li>
                            )
                        }
                    </ul>
                </div>


                <div className="makePayment w-full rounded-lg bg-slate-800 p-4 sm:p-5 lg:w-1/2">
                    {/* Make a Payment */}
                    <h2 className="text-xl font-bold text-gray-200 mb-3">Make a Payment</h2>
                    <div className="flex flex-col gap-3">
                        <input name="name" type="text" placeholder="Your Name" className="p-2 rounded bg-slate-700 text-white focus:outline-none " value={form.name} onChange={handleChange} />
                        <input name="message" type="text" placeholder="Your Message" className="p-2 rounded bg-slate-700 text-white focus:outline-none" value={form.message} onChange={handleChange} />
                        <input name="amount" type="number" min="1" step="1" placeholder="Amount (INR)" className="no-spinner p-2 rounded bg-slate-700 text-white focus:outline-none" value={form.amount} onChange={handleChange} />
                        <button onClick={processPayment} type="button" className="text-white cursor-pointer bg-linear-to-br from-purple-600 to-blue-500 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 rounded-lg mx-1">Make Payment</button>
                    </div>
                    {/* or choose from predefined amounts */}
                    <div className="predefinedAmounts mt-5">
                        <h3 className="text-sm text-gray-400 mb-2">Or choose an amount</h3>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={() => setForm({ ...form, amount: '5' })} type="button" className="bg-slate-700 cursor-pointer hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">₹5</button>
                            <button onClick={() => setForm({ ...form, amount: '10' })} type="button" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">₹10</button>
                            <button onClick={() => setForm({ ...form, amount: '20' })} type="button" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">₹20</button>
                            <button onClick={() => setForm({ ...form, amount: '50' })} type="button" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">₹50</button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default PaymentPage


