import React from 'react'
import PaymentPage from '../Components/PaymentPage'
import connectDb from "@/db/connectDB"
import User from "@/models/User"
import { notFound } from 'next/navigation'

const Username = async ({ params }) => {
  const resolvedParams = await params;
  const username = decodeURIComponent(String(resolvedParams?.username || "")).trim();

  if (!username) {
    return notFound();
  }

  // If the username is not present in the database, show a 404 page.
  await connectDb();
  const userExists = await User.exists({ username });

  if (!userExists) {
    return notFound();
  }
  
  return (
    <>
      <PaymentPage username={username} />
    </>
  )
}

export default Username

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const username = decodeURIComponent(String(resolvedParams?.username || "")).trim();

  return {
    title: `Support ${username} - Get Me A Chai`,
  };
}
