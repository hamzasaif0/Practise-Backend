import { User } from "../models/User.models.js";
import { Video } from "../models/Vedios.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/APiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadfile from "../utils/cloudinary.js";


const publishVideo = asyncHandler(async (req, res) => {

    const { title, description} = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "Unauthorized  User");
    }


    if (!title || !description ) {
        throw new ApiError(400,"All fields are required" );
    }
    const videolocalpath = req.files?.videofile[0]?.path;
    const thumbnaillocalpath = req.files?.thumbnail[0]?.path;
    if(!videolocalpath || !thumbnaillocalpath) {
        throw new ApiError(400, "Video and thumbnail files are required" );
    }
    const videofile = await uploadfile(videolocalpath);
    console.log(videofile);

    const thumbnail = await uploadfile(thumbnaillocalpath);
    if (!videofile || !thumbnail) {
        throw new ApiError( 400, "Failed to upload video or thumbnail" );
    }
    const videoData = await Video.create({
        videofile: videofile?.url,
        thumbnail: thumbnail?.url,
        title: title,
        description: description,
        duration: videofile?.duration || 0,
        owner: req.user._id,
    });
    if(!videoData) {
        throw new ApiError(500, "Failed to publish video");
    }

return res.status(201).json(new ApiResponse(201, videoData, "Video published successfully"));
});
const getVideoById = asyncHandler(async (req, res) => {

const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    video.views += 1; 
    await video.save(); // 
    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));


});
const updateVideo = asyncHandler(async (req, res) => {

const{videoId} = req.params;
const { title, description } = req.body;
const thumbnaillocalpath = req.file?.path;

if (!videoId) {
    throw new ApiError(400, "Video ID is required");
}
if (!title && !description && !thumbnaillocalpath) {
    throw new ApiError(400, "At least one field (title or description) is required to update");
}
const video = await Video.findById(videoId);
if (!video) {
    throw new ApiError(404, "Video not found");
}
if(video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
}
if (thumbnaillocalpath) {
    const thumbnail = await uploadfile(thumbnaillocalpath);
    if(thumbnail?.url) {
     video.thumbnail = thumbnail.url;
    }
}

if (title) {
    video.title = title;
}
if (description) {
    video.description = description;
}


await video.save();
return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});
const deleteVideo = asyncHandler(async (req, res) => {

const { videoId } = req.params;
if (!videoId) {
    throw new ApiError(400, "Video ID is required");
}
const video = await Video.findById(videoId);
if (!video) {
    throw new ApiError(404, "Video not found");
}
if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
}
await Video.findByIdAndDelete(videoId);
return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
});
const toggleVideoPublishStatus = asyncHandler(async (req, res) => {
const { videoId } = req.params;
if (!videoId) {
    throw new ApiError(400, "Video ID is required");

}
const video = await Video.findById(videoId);
if (!video) {
    throw new ApiError(404, "Video not found");
}
if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to change the publish status of this video");
}
video.ispublished = !video.ispublished; // Toggle the publish status
await video.save();
return res.status(200).json(new ApiResponse(200, video, `Video publish status :${video.ispublished ? 'published' : 'unpublished'} successfully`));

});
const getAllVideos = asyncHandler(async (req, res) => {
const { page = 1, limit = 10,query, sortBy = 'createdAt', sortType = 'desc' ,userId} = req.query;
const filter={};
if(query){
    filter.$or = [ {title : { $regex: query, $options: 'i' } // Case-insensitive search
    }, { description: { $regex: query, $options: 'i' } }

    ];

}
if(userId){
    filter.owner = userId;
}
const sort = {};
sort[sortBy] = sortType === 'asc' ? 1 : -1; // Ascending or descending sort
const Page = Number(page);
const Limit = Number(limit);
const skip = (Page - 1) * Limit;

const videos = await Video.find(filter).sort(sort).limit(Limit).skip(skip);
const count = await Video.countDocuments(filter);
return res.status(200).json(new ApiResponse(200, {
    videos,
    total: count,
    page: Page,
    totalPages: Math.ceil(count / Limit)
}, "Videos fetched successfully"));


});
export { publishVideo , getVideoById, updateVideo, deleteVideo, toggleVideoPublishStatus, getAllVideos };