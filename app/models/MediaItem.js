// models/MediaItem.js
import mongoose from 'mongoose';

const MediaItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify the media category'],
      enum: ['carousel', 'gallery', 'governor', 'upload'], 
    },
    // The main cover image (or the only image if it's just a carousel/upload)
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    publicId: {
      type: String,
      required: true, 
    },
    // NEW: Array to hold multiple images for Gallery Albums
    albumImages: [
      {
        imageUrl: { type: String, required: true },
        publicId: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.MediaItem || mongoose.model('MediaItem', MediaItemSchema);