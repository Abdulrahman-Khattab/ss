const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      trim: true,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      default: 0,
    },

    description: {
      type: String,
      required: [true, 'Please provide description'],
      trim: true,
      maxLength: 1000,
    },

    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },

    category: {
      type: String,
      enum: ['kitchen', 'bedroom', 'office'],
      required: [true, 'Please provide category'],
    },
    company: {
      type: String,
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
      required: [true, 'Please provide company'],
    },
    colors: {
      type: [String],
      required: true,
      default: ['#222'],
    },
    featured: {
      type: Boolean,
      default: false,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    inventory: {
      type: Number,
      default: 15,
      required: [true, 'Please provide inventory value'],
    },
    averageRating: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user ID '],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
  /*match:{rating:5}*/
});

productSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ product: this._id });
});

module.exports = mongoose.model('Product', productSchema);
