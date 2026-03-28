// app/api/media/album/route.js
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

// POST: Add new photos to an existing album
export async function POST(request) {
  try {
    // 1. Security Check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    await connectMongo();
    const data = await request.formData();
    
    const mediaId = data.get('mediaId');
    const additionalImages = data.getAll('additionalImages'); 

    if (!mediaId || !additionalImages || additionalImages.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing media ID or images' }, { status: 400 });
    }

    // Verify the media item exists
    const existingMedia = await MediaItem.findById(mediaId);
    if (!existingMedia) {
      return NextResponse.json({ success: false, error: 'Album not found' }, { status: 404 });
    }

    // 2. Upload all new images to Cloudinary concurrently
    const uploadPromises = additionalImages.map(async (albumFile) => {
      const bytes = await albumFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileBase64 = `data:${albumFile.type};base64,${buffer.toString('base64')}`;
      
      return cloudinary.uploader.upload(fileBase64, {
        folder: `gubernatorial/${existingMedia.category}/album`,
        resource_type: "auto",
      });
    });

    const results = await Promise.all(uploadPromises);
    
    const newAlbumImages = results.map(res => ({
      imageUrl: res.secure_url,
      publicId: res.public_id
    }));

    // 3. Update the database by pushing the new images into the array
    const updatedMedia = await MediaItem.findByIdAndUpdate(
      mediaId,
      { $push: { albumImages: { $each: newAlbumImages } } },
      { new: true } // Return the updated document
    );

    return NextResponse.json({ success: true, data: updatedMedia }, { status: 201 });
  } catch (error) {
    console.error("ALBUM_UPLOAD_ERROR:", error); 
    return NextResponse.json({ success: false, error: error.message || 'Upload failed' }, { status: 500 });
  }
}

// DELETE: Remove a specific photo from an album
export async function DELETE(request) {
  try {
    // 1. Security Check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    await connectMongo();
    const body = await request.json();
    const { mediaId, publicId } = body;

    if (!mediaId || !publicId) {
      return NextResponse.json({ success: false, error: 'Media ID and Image Public ID are required' }, { status: 400 });
    }

    const item = await MediaItem.findById(mediaId);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Album not found' }, { status: 404 });
    }

    // 2. Delete the specific image from Cloudinary
    const isVideo = publicId.includes('video'); // Basic fallback check, cloudinary auto-detects mostly
    try {
       await cloudinary.uploader.destroy(publicId, { resource_type: isVideo ? "video" : "image" });
    } catch (cloudinaryError) {
       console.error("Cloudinary Deletion Error:", cloudinaryError);
       // We still proceed to remove it from DB even if Cloudinary fails, to prevent a broken UI state
    }
    
    // 3. Remove the image from the MongoDB array using $pull
    const updatedMedia = await MediaItem.findByIdAndUpdate(
      mediaId,
      { $pull: { albumImages: { publicId: publicId } } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedMedia }, { status: 200 });
  } catch (error) {
    console.error("ALBUM_DELETE_ERROR:", error);
    return NextResponse.json({ success: false, error: 'Deletion failed' }, { status: 500 });
  }
}