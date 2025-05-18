import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
    visitorName: String,
    department: String,
    purpose: String,
    workPermit: Boolean,
    firePermit: Boolean,
    visitDate: Date,
    validatedByHSE: { type: Boolean, default: false },
    nonConformities: [String],
    pdfPath: String, });

const Visitor = mongoose.model("Visitor", VisitorSchema);
export default Visitor;
