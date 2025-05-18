import mongoose from "mongoose";

const PatrolStatSchema = new mongoose.Schema({

   

},{timestamps:true}
);

const PatrolStat = mongoose.model("PatrolStat", PatrolStatSchema );
export default PatrolStat;