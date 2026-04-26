//Creating an API route to handle order creation and sent orderId to the client
import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import connectDb from "@/db/connectDB";
import User from "@/models/User";
import Payment from "@/models/Payment";

export const runtime = "nodejs";

export async function POST(req) {
    try {
        const body = await req.json();
        const to_username = String(body?.to_username || "").trim();
        const amountInRupees = Number(body?.amount);
        const name = String(body?.paymentForm?.name || body?.name || "").trim();
        const message = String(body?.paymentForm?.message || body?.message || "").trim();

        if (!to_username || !name || !Number.isFinite(amountInRupees) || amountInRupees <= 0) {
            return NextResponse.json({ error: "Invalid payment payload" }, { status: 400 });
        }

        const MAX_AMOUNT_INR = 500000;
        if (amountInRupees > MAX_AMOUNT_INR) {
            return NextResponse.json({ error: `Amount cannot exceed Rs. ${MAX_AMOUNT_INR}` }, { status: 400 });
        }

        const amountInPaise = Math.round(amountInRupees * 100);

        await connectDb();
        const user = await User.findOne({ username: to_username }).lean();

        if (!user) {
            return NextResponse.json({ error: "Creator not found" }, { status: 404 });
        }

        if (!user.razorpayid || !user.razorpaysecret) {
            return NextResponse.json({ error: "Creator payment settings are incomplete" }, { status: 400 });
        }

        const razorpay = new Razorpay({
            key_id: user.razorpayid,
            key_secret: user.razorpaysecret
        });

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order?.id) {
            return NextResponse.json({ error: "Error creating order" }, { status: 500 });
        }

        await Payment.create({
            name,
            to_user: to_username,
            oid: order.id,
            message,
            amount: order.amount,
            currency: order.currency,
            status: "pending",
            done: false,
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: user.razorpayid,
        });
    } catch (error) {
        console.error("Order creation error:", error);
        const status = Number(error?.statusCode) || 500;
        const message = error?.error?.description || error?.message || "Internal server error";
        return NextResponse.json({ error: message }, { status });
    }
}



