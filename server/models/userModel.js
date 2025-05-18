import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
       

    },
    password:{
        type: String,
        required:true,
       
    },
   role:{
        type:String,
        required:true,
       enum:["Admin", "manager","user"]
    },
    isActive:{
        type:Boolean,
        default:true
    },
    ActivationCode: String,

},

{
    timestamps:true
}
);

const User = mongoose.model("User", UserSchema);
export default User;