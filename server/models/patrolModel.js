import mongoose from "mongoose";

const PatrolSchema = new mongoose.Schema({
  No: Number,
  Area: String,
  Where: String,
  Item: String,
  Solution: String,
  PersoneAction: String,
  Progress: String,
  Deadline: { type: Date }, 
  Picture: {
    data: Buffer,
    contentType: String,
  },
  PictureAfter: {
    data: Buffer,
    contentType: String,
  },
 isValidated: {
  type: Boolean,
  default: false,
},
Validator: {
  type: String,
  default: null,
},

});

const Patrol = mongoose.model("Patrol", PatrolSchema);
export default Patrol;
