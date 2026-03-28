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

// POST: Upload new media, including optional Album arrays (Protected)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });

    await connectMongo();
    const data = await request.formData();
    
    const file = data.get('image'); // Main Cover File
    const title = data.get('title');
    const description = data.get('description');
    const category = data.get('category'); 
    const additionalImages = data.getAll('additionalImages'); // Array of extra album files

    if (!file || !title || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Upload Main Cover File
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: `gubernatorial/${category}`, 
      resource_type: "auto",
    });

    // 2. Upload Additional Album Images (If any)
    let albumImages = [];
    if (additionalImages && additionalImages.length > 0) {
      const uploadPromises = additionalImages.map(async (albumFile) => {
        const aBytes = await albumFile.arrayBuffer();
        const aBuffer = Buffer.from(aBytes);
        const aBase64 = `data:${albumFile.type};base64,${aBuffer.toString('base64')}`;
        
        return cloudinary.uploader.upload(aBase64, {
          folder: `gubernatorial/${category}/album`,
          resource_type: "auto",
        });
      });

      // Wait for all album images to upload concurrently
      const results = await Promise.all(uploadPromises);
      albumImages = results.map(res => ({
        imageUrl: res.secure_url,
        publicId: res.public_id
      }));
    }

    // 3. Save to Database
    const newItem = await MediaItem.create({
      title,
      description,
      category,
      imageUrl: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      albumImages: albumImages // Add the new array!
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error("CLOUDINARY_UPLOAD_ERROR:", error); 
    return NextResponse.json({ success: false, error: error.message || 'Upload failed' }, { status: 500 });
  }
}

// PUT: Update Media Details (Protected)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });

    await connectMongo();
    const { id, title, description, category } = await request.json();

    if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });

    const updatedItem = await MediaItem.findByIdAndUpdate(
      id, 
      { title, description, category }, 
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedItem }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}

// DELETE: Remove media AND all its attached album images (Protected)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });

    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });

    const item = await MediaItem.findById(id);
    if (!item) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });

    // 1. Destroy the main cover image
    const isVideo = item.imageUrl.includes('/video/');
    await cloudinary.uploader.destroy(item.publicId, {
       resource_type: isVideo ? "video" : "image"
    });

    // 2. Destroy all connected Album Images in Cloudinary
    if (item.albumImages && item.albumImages.length > 0) {
      const deletePromises = item.albumImages.map(img => {
        const isAlbumVideo = img.imageUrl.includes('/video/');
        return cloudinary.uploader.destroy(img.publicId, { resource_type: isAlbumVideo ? "video" : "image" });
      });
      await Promise.all(deletePromises);
    }
    
    // 3. Delete from database
    await MediaItem.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("MEDIA_DELETE_ERROR:", error);
    return NextResponse.json({ success: false, error: 'Deletion failed' }, { status: 500 });
  }
}