// app/models/Article.js
import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true }, // The main body of the news
    category: { type: String, required: true },
    readTime: { type: String, default: '5 min read' },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);