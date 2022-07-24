const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      require: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      require: [true, 'Please provide review title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      require: [true, 'Please provide review text'],
      maxlength: 200,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      require: true,
    },
  },
  { timestamps: true }
);

// Only create one comment for each user
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Can call in model not instance
ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: '$rating',
        },
        numberOfReview: {
          $sum: 1,
        },
      },
    },
  ]);
  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numberOfReview: result[0]?.numberOfReview || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product);
});
ReviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);
