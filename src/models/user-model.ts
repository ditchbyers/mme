import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkUserId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String
    },
    profilePicture: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    games: {
        type: [String],
        required: false
    },
    age: {
        type: Number,
        required: false
    },
    platforms: {
        type: String,
        required: false
    },
}
    , { timestamps: true });

if(mongoose.models && mongoose.models["users"]){
    mongoose.deleteModel("users")
}

const UserModel = mongoose.model("users", userSchema);
export default UserModel;