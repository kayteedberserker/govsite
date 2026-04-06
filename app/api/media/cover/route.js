// app/api/media/cover/route.js
import connectMongo from '@/app/lib/mongodb';
import MediaItem from '@/app/models/MediaItem';
import { NextResponse } from 'next/server';

export async function PUT(req) {
    try {
        await connectMongo();

        const body = await req.json();
        const { mediaId, newCoverUrl, newCoverPublicId } = body;

        // 1. Validate inputs
        if (!mediaId || !newCoverUrl || !newCoverPublicId) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: mediaId, newCoverUrl, or newCoverPublicId' },
                { status: 400 }
            );
        }

        // 2. Find the album
        const mediaItem = await MediaItem.findById(mediaId);
        if (!mediaItem) {
            return NextResponse.json(
                { success: false, error: 'Album not found' },
                { status: 404 }
            );
        }

        // 3. Save the details of the CURRENT (old) cover so we don't lose it
        const oldCoverUrl = mediaItem.imageUrl;
        const oldCoverPublicId = mediaItem.publicId;

        // 4. Set the new cover image
        mediaItem.imageUrl = newCoverUrl;
        mediaItem.publicId = newCoverPublicId;

        // 5. Swap the array contents: 
        // - Remove the chosen image from the album grid (since it's now the cover)
        mediaItem.albumImages = mediaItem.albumImages.filter(
            (img) => img.publicId !== newCoverPublicId
        );

        // - Push the old cover into the album grid
        mediaItem.albumImages.push({
            imageUrl: oldCoverUrl,
            publicId: oldCoverPublicId
        });

        // 6. Save changes to the database
        await mediaItem.save();

        return NextResponse.json({ success: true, data: mediaItem }, { status: 200 });

    } catch (error) {
        console.error("Error setting new cover image:", error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}