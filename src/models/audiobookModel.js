import mongoose from "mongoose";

const audiobookSchema = mongoose.Schema(
  {
    // category
    category: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId, // Store the ObjectId of the author
      required: true,
      ref: "Author", // Reference to the Author collection
    },
    authorName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    audioFile: {
      // Add this field
      type: String,
      required: true, // Or false, depending on your requirements
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: false, // Optional field for description of the audiobook
    },
    genre: {
      type: String,
      required: false, // Optional field for genre of the audiobook
    },
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: Number,
        review: String,
        ratingSource: String, // New field
        ratingDate: Date, // New field
      },
    ],
    total_ratings: {
      type: Number,
      default: 0,
    },
    total_count: {
      type: Number,
      default: 0,
    },
    average_rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

audiobookSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) return 0;

  // Calculate the total of all ratings
  const total = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);

  // Calculate the average rating
  const average = total / this.ratings.length;

  // Update the average rating in the schema
  this.average_rating = average;

  // Update the total ratings and total count
  this.total_count = this.ratings.length; // The total count is the length of the ratings array
  this.total_ratings = total; // Sum of all ratings

  // Save the changes
  return this.save();
};

const Audiobook = mongoose.model("Audiobook", audiobookSchema);

export default Audiobook;
