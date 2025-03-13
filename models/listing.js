const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true, // Add this line to make description required
  },
  image: {
    url:String,
    filename:String,
  },
  price: Number,
  location: String,
  country: String,

  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});

listingSchema.post("findOneAndDelete", async (Listing) => {
  if (Listing) {
    await review.deleteMany({ _id: { $in: Listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
