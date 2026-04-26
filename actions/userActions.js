"use server"

import { getServerSession } from "next-auth/next";
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDB"
import User from "@/models/User"
import { authOptions } from "@/lib/authOptions";

const PUBLIC_USER_FIELDS = "name username profilepic coverpic razorpayid";
const DASHBOARD_USER_FIELDS = "name email username profilepic coverpic razorpayid";
const toSerializable = (value) => value == null ? value : JSON.parse(JSON.stringify(value));

const normalizeProfileInput = (input) => {
    if (!input) {
        return {};
    }

    if (typeof input.entries === "function") {
        return Object.fromEntries(input.entries());
    }

    return { ...input };
};

const getAuthenticatedEmail = async () => {
    const session = await getServerSession(authOptions);
    const email = String(session?.user?.email || "").trim();
    return email || null;
}

export const fetchPublicUser = async (username) => {
    const safeUsername = String(username || "").trim();

    if (!safeUsername) {
        return null;
    }

    await connectDb();
    const user = await User.findOne({ username: safeUsername }).select(PUBLIC_USER_FIELDS).lean();
    return toSerializable(user);
}

export const fetchCurrentProfile = async () => {
    const email = await getAuthenticatedEmail();

    if (!email) {
        return null;
    }

    await connectDb();
    const user = await User.findOne({ email }).select(DASHBOARD_USER_FIELDS).lean();
    return toSerializable(user);
}

export const fetchPayments = async (username) => {
    const safeUsername = String(username || "").trim();

    if (!safeUsername) {
        return [];
    }

    await connectDb();
    const payments = await Payment.find({ to_user: safeUsername, done: true }).sort({ amount: -1 }).limit(10).lean();
    return toSerializable(payments);
}

export const updateProfile = async (Formdata) => {
    const email = await getAuthenticatedEmail();

    if (!email) {
        return { error: "Unauthorized" };
    }

    await connectDb();
    const currentUser = await User.findOne({ email });

    if (!currentUser) {
        return { error: "User not found" };
    }

    const ndata = normalizeProfileInput(Formdata);
    const nextUsername = String(ndata.username || "").trim();

    if (!nextUsername) {
        return { error: "Username is required" };
    }

    if (currentUser.username !== nextUsername) {
        const existingUser = await User.findOne({
            username: nextUsername,
            _id: { $ne: currentUser._id }
        });

        if (existingUser) {
            return { error: "Username already exists" };
        }
    }

    const nextSecret = String(ndata.razorpaysecret || "").trim();
    const updateData = {
        name: String(ndata.name || "").trim(),
        username: nextUsername,
        profilepic: String(ndata.profilepic || "").trim(),
        coverpic: String(ndata.coverpic || "").trim(),
        razorpayid: String(ndata.razorpayid || "").trim(),
        updatedAt: new Date(),
    };

    if (nextSecret) {
        updateData.razorpaysecret = nextSecret;
    }

    await User.updateOne({ _id: currentUser._id }, { $set: updateData });

    if (currentUser.username !== nextUsername) {
        await Payment.updateMany(
            { to_user: currentUser.username },
            { $set: { to_user: nextUsername } }
        );
    }

    return { success: true, updatedUsername: nextUsername };
}
