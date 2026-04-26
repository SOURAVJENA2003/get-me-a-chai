import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PaymentSchema = new Schema({
    name: { type: String, required: true },
    to_user: { type: String, required: true },
    oid: { type: String, required: true, index: true },
    payment_id: { type: String, default: null, index: true },
    signature: { type: String, default: null },
    message: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    failure_reason: { type: String, default: null },
    paidAt: { type: Date, default: null },
    done: { type: Boolean, default: false },
    }, { timestamps: true });

 
export default mongoose.models.Payment || model("Payment", PaymentSchema);;
