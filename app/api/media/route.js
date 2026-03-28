// app/api/media/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectMongo from '@/app/lib/mongodb';
import MediaItem from '@/app/models/MediaItem';
import { getServerSession } from 'next-auth'; 
import { authOptions } from '@/app/lib/auth'; 

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch all media items (Public)
export async function GET(request) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const filter = category ? { category } : {};
    const items = await MediaItem.find(filter).sort({ createdAt: -1 }); 
    
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch media' }, { status: 500 });
  }
}

// POST: Upload a new image or video (Protected)
export async function POST(request) {
  try {
    // 1. SECURITY CHECK
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    await connectMongo();

    const data = await request.formData();
    const file = data.get('image'); // This is the 'file' from your admin panel
    const title = data.get('title');
    const description = data.get('description');
    const category = data.get('category'); 

    if (!file || !title || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 2. CONVERT FILE TO BASE64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // 3. CLOUDINARY UPLOAD (The Fix)
    // We add 'resource_type: "auto"' so Cloudinary automatically detects if it's a video or image.
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: `gubernatorial/${category}`, 
      resource_type: "auto", // CRITICAL: This allows videos to upload
    });

    // 4. SAVE TO DATABASE
    const newItem = await MediaItem.create({
      title,
      description,
      category,
      imageUrl: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error("CLOUDINARY_UPLOAD_ERROR:", error); // Log this to your terminal
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Upload failed' 
    }, { status: 500 });
  }
}

// DELETE: Remove an image/video (Protected)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
    }

    const item = await MediaItem.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    // 5. DELETE FROM CLOUDINARY (Safety check for videos)
    // For videos, destroy needs the resource_type as well.
    const isVideo = item.imageUrl.includes('/video/');
    await cloudinary.uploader.destroy(item.publicId, {
       resource_type: isVideo ? "video" : "image"
    });
    
    await MediaItem.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Deletion failed' }, { status: 500 });
  }
}