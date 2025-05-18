import mongoose from "mongoose";

const PersonSchema = new mongoose.Schema({
  name: String,
  position: String,
  cin: String,
  signature: String,
});

const WorkPermitSchema = new mongoose.Schema(
  {
    coordinatorName: String,
    coordinatorPosition: String,
    speakerName: String,
    speakerPosition: String,
    speakerCIN: String,
    speakerSignature: String,
    accompanyingNumber: String,
    persons: [PersonSchema],
    startDateTime: Date,
    endDateTime: Date,
    placeArea: String,
    natureOfWorks: String,
    toolsUsed: [String],
    otherTool: String,
    otherRequirements: String,
    engineerManager: String,
    hseOfficer: String,
    guardJob: String,
    inspectionDate: Date,
    inspectionPlace: String,
    coordinatorSignature: String,
    responsibleSignature: String,
  },
  { timestamps: true }
);

const WorkPermit = mongoose.model("WorkPermit", WorkPermitSchema);
export default WorkPermit;

/*


*/
