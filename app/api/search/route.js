import { NextResponse } from "next/server";
import connectDb from "@/db/connectDB";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = String(searchParams.get("q") || "").trim();

    if (!query) {
      return NextResponse.json({ creators: [] }, { status: 200 });
    }

    await connectDb();

    const creators = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    })
      .select("name username profilepic")
      .limit(8)
      .lean();

    const safeCreators = creators.map((creator) => ({
      name: creator.name || creator.username,
      username: creator.username,
      profilepic: creator.profilepic || null,
    }));

    return NextResponse.json({ creators: safeCreators }, { status: 200 });
  } catch (error) {
    console.error("Creator search error:", error);
    return NextResponse.json(
      { creators: [], error: "Unable to search creators right now" },
      { status: 500 }
    );
  }
}