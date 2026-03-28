// app/api/articles/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectMongo from '@/app/lib/mongodb';
import Article from '@/app/models/Article';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch all articles
export async function GET(request) {
  try {
    await connectMongo();
    const articles = await Article.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: articles }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// POST: Create a new article
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectMongo();
    const data = await request.formData();
    
    const file = data.get('image');
    const title = data.get('title');
    const excerpt = data.get('excerpt');
    const content = data.get('content');
    const category = data.get('category');
    const featured = data.get('featured') === 'true';

    if (!file || !title || !content) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: 'gubernatorial/news',
      resource_type: 'auto',
    });

    const newArticle = await Article.create({
      title, excerpt, content, category, featured,
      imageUrl: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    });

    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error) {
    console.error("ARTICLE_UPLOAD_ERROR:", error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}

// PUT: Edit an existing article
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectMongo();
    const data = await request.formData();
    
    const id = data.get('id');
    const title = data.get('title');
    const excerpt = data.get('excerpt');
    const content = data.get('content');
    const category = data.get('category');
    const featured = data.get('featured') === 'true';
    const file = data.get('image'); // Might be null if they didn't upload a new image

    if (!id) return NextResponse.json({ success: false, error: 'Missing Article ID' }, { status: 400 });

    const existingArticle = await Article.findById(id);
    if (!existingArticle) return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });

    let updateData = { title, excerpt, content, category, featured };

    // If they uploaded a new cover image, process it and delete the old one
    if (file && file !== 'null' && typeof file !== 'string') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
        folder: 'gubernatorial/news',
        resource_type: 'auto',
      });

      // Destroy old image to save space
      if (existingArticle.publicId) {
        await cloudinary.uploader.destroy(existingArticle.publicId);
      }

      updateData.imageUrl = uploadResponse.secure_url;
      updateData.publicId = uploadResponse.public_id;
    }

    const updatedArticle = await Article.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, data: updatedArticle }, { status: 200 });
  } catch (error) {
    console.error("ARTICLE_UPDATE_ERROR:", error);
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}

// DELETE: Remove an article
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectMongo();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });

    const article = await Article.findById(id);
    if (!article) return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });

    // Delete image from Cloudinary
    if (article.publicId) {
      await cloudinary.uploader.destroy(article.publicId);
    }
    
    // Delete from DB
    await Article.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Article deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("ARTICLE_DELETE_ERROR:", error);
    return NextResponse.json({ success: false, error: 'Deletion failed' }, { status: 500 });
  }
}