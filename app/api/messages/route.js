// app/api/messages/route.js
import { NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Message from '@/app/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// POST: Public route for users to submit messages
export async function POST(request) {
  try {
    await connectMongo();
    const body = await request.json();
    
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const newMessage = await Message.create({ name, email, subject, message });

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}

// GET: Protected route for Admin to fetch messages
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    const messages = await Message.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// PATCH: Mark a message as read (Protected)
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Message ID is required' }, { status: 400 });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedMessage }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update message' }, { status: 500 });
  }
}