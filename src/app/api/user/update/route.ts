import { NextResponse, NextRequest } from "next/server";

export async function POST(req: Request) {
    // TODO: Add update user info logic
    const { title } = await req.json();

    return NextResponse.json({ title: { title } }, { status: 201 });
}
