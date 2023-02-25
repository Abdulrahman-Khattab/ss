const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide a review'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide title'],
      maxLength: 100,
    },
    comment: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please there is a user '],
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please there should be a product'],
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.statics.CalculateAverageRating = async function (id) {
  console.log(id);
};

reviewSchema.post('save', async function () {
  await this.constructor.CalculateAverageRating(this.product);
  console.log('Update ID ');
});

reviewSchema.post('remove', async function () {
  await this.constructor.CalculateAverageRating(this.product);
  console.log('REMOVE ID ');
});

module.exports = mongoose.model('Review', reviewSchema);
