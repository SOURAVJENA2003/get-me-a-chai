"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { fetchCurrentProfile, updateProfile } from '@/actions/userActions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';


const emptyForm = {
  name: "",
  email: "",
  username: "",
  profilepic: "",
  coverpic: "",
  razorpayid: "",
};

const normalizeForm = (value) => ({ ...emptyForm, ...(value || {}) });

const Dashboard = () => {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    document.title = "Dashboard - Get Me A Chai";
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status !== "authenticated") {
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      try {
        const data = await fetchCurrentProfile();

        if (isMounted && data) {
          setForm(normalizeForm(data));
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [router, status])

  const handleChange = (e) => {
    setForm((prev) => ({ ...normalizeForm(prev), [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (status !== "authenticated") {
      return;
    }

    const result = await updateProfile(form);
    if (result?.error) {
      toast.error(result.error, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    } else if (result?.success) {
      if (result.updatedUsername) {
        await update({ name: result.updatedUsername });
      }

      toast.success("Profile updated successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setTimeout(() => {
        router.replace(`/${result.updatedUsername}`);
      }, 1200);
    }
    
  }

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

    <div className='container mx-auto my-10 px-4 sm:px-6'  >
      <h1 className='my-5 text-center text-xl font-bold sm:text-2xl'>Welcome to your Dashboard</h1>

      <form className="mx-auto w-full max-w-xl" action={handleSubmit}  >

        <div className='my-2'>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
          <input value={form?.name || ""}  onChange={handleChange} type="text" name='name' id="name" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        {/* input for email */}
        <div className="my-2">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
          <input value={form?.email || ""} type="email" name='email' id="email" className="block w-full  p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-100 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        {/* input forusername */}
        <div className='my-2'>
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
          <input value={form?.username || ""}  onChange={handleChange} type="text" name='username' id="username" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        {/* input for profile picture of input type text */}
        <div className="my-2">
          <label htmlFor="profilepic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Picture</label>
          <input value={form?.profilepic || ""}  onChange={handleChange} type="text" name='profilepic' id="profilepic" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>

        {/* input for cover pic  */}
        <div className="my-2">
          <label htmlFor="coverpic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cover Picture</label>
          <input value={form?.coverpic || ""}  onChange={handleChange} type="text" name='coverpic' id="coverpic" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        {/* input razorpay id */}
        <div className="my-2">
          <label htmlFor="razorpayid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razorpay Id</label>
          <input value={form?.razorpayid || ""}  onChange={handleChange} type="text" name='razorpayid' id="razorpayid" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        {/* input razorpay secret */}
        <div className="my-2">
          <label htmlFor="razorpaysecret" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razorpay Secret</label>
          <input value={form?.razorpaysecret || ""} onChange={handleChange} type="password" name='razorpaysecret' id="razorpaysecret" placeholder="Leave blank to keep your current secret" autoComplete="new-password" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>

        {/* Submit Button  */}
        <div className="my-6">
          <button type="submit" className="block w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-blue-500 focus:ring-4 focus:outline-none   dark:focus:ring-blue-800 font-medium text-sm">Save</button>
        </div>
      </form>

    </div>
    </>
  )
}

export default Dashboard

