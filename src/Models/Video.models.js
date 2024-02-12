import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new mongoose.Schema({
    videoFile:{
        type: String, //cloudinary url
        required: true
    },
    thumbnail:{
        type: String, //cloudinary url
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    duration:{
        type: Number, //cloudinary se hi 
        required: true
    },
    views:{
        type: Number, //cloudinary se hi 
        default: 0
    },
    isPublish:{
        type: Boolean, //cloudinary se hi 
        default: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true});

// adding own plugin
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema);