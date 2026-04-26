//Code for verifying the payment signature sent by Razorpay after a payment is made. This is done to ensure that the payment was successful and was not tampered with.
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDb from '@/db/connectDB';
import Payment from '@/models/Payment';
import User from '@/models/User';

export const runtime = 'nodejs';

const generatedSignature = (razorpayOrderId, razorpayPaymentId, keySecret) => {
  if (!keySecret) {
    throw new Error('Razorpay key secret is not defined for this user.');
  }

  const sig = crypto
    .createHmac('sha256', keySecret)
    .update(razorpayOrderId + '|' + razorpayPaymentId)
    .digest('hex');

  return sig;
};

const safeSignatureEqual = (a, b) => {
  const aBuffer = Buffer.from(a, 'utf8');
  const bBuffer = Buffer.from(b, 'utf8');

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
};

export async function POST(request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await request.json();

    await connectDb();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { message: 'Missing payment verification payload', isOk: false },
        { status: 400 }
      );
    }

    const payment = await Payment.findOne({ oid: razorpayOrderId }).lean();

    if (!payment) {
      return NextResponse.json(
        { message: 'Payment record not found', isOk: false },
        { status: 404 }
      );
    }

    const user = await User.findOne({ username: payment.to_user })
      .select('razorpaysecret')
      .lean();

    if (!user?.razorpaysecret) {
      await Payment.findOneAndUpdate(
        { oid: razorpayOrderId },
        {
          status: 'failed',
          done: false,
          failure_reason: 'missing_user_razorpay_secret',
        }
      );

      return NextResponse.json(
        { message: 'Creator payment settings are incomplete', isOk: false },
        { status: 400 }
      );
    }

    const signature = generatedSignature(
      razorpayOrderId,
      razorpayPaymentId,
      user.razorpaysecret
    );
    const isValidSignature = safeSignatureEqual(signature, razorpaySignature);

    if (!isValidSignature) {
      await Payment.findOneAndUpdate(
        { oid: razorpayOrderId },
        {
          status: 'failed',
          done: false,
          failure_reason: 'signature_verification_failed',
        }
      );

      return NextResponse.json(
        { message: 'payment verification failed', isOk: false },
        { status: 400 }
      );
    }

    await Payment.findOneAndUpdate(
      { oid: razorpayOrderId },
      {
        payment_id: razorpayPaymentId,
        signature: razorpaySignature,
        status: 'paid',
        done: true,
        paidAt: new Date(),
        failure_reason: null,
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json(
      { message: 'payment verified successfully', isOk: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error', isOk: false },
      { status: 500 }
    );
  }
}
