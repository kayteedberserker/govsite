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
      default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', // Default placeholder text
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify the media category'],
      // Added 'upload' for general hosting and 'governor' for the main portrait
      enum: ['carousel', 'gallery', 'upload', 'governor'], 
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    publicId: {
      type: String,
      required: true, // Needed to delete the image from Cloudinary
    },
  },
  { timestamps: true }
);

export default mongoose.models.MediaItem || mongoose.model('MediaItem', MediaItemSchema);