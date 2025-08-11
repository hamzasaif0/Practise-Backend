import { Comment } from "../models/Comment.models.js";
import { Video } from "../models/Vedios.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/APiresponse.js";
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    // Pagination logic
    const Page = parseInt(page);
    const Limit = parseInt(limit);
    const Skip = (Page - 1) * Limit;
    const comments = await Comment.find({vedio: videoId}).limit(Limit).skip(Skip).populate("owner", "username profilePicture").sort({createdAt: -1});
    const totalComments = await Comment.countDocuments({vedio: videoId});
    const totalPages = Math.ceil(totalComments / Limit);
    const response = {
        comments,
        totalComments,
        totalPages,
        currentPage: Page,
        hasNextPage: Page < totalPages,
        hasPreviousPage: Page > 1
    };
    res.status(200).json(new ApiResponse(200,response, "Comments fetched successfully"));   


});
const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params;
    const {Content } = req.body;
    if(!videoId || !Content){
       throw new ApiError(400 , "VedioID and Content For Comment Required");
    }
    const video = await Video.findById(videoId);
    if(!video){
    throw new ApiError(400 , " Video not Found ");
    }
    await Comment.create(
        {
            vedio : videoId,
            content : Content,
            owner: req.user._id
        }
    )
     return   res.status(200).json( new ApiResponse(200 , "Comment added Succesfully"));
});
const updateComment = asyncHandler(async (req, res) => {

const {commentId} = req.params;
const {Content} = req.body;
if (!commentId || !Content) {
    throw new ApiError(400, "Comment ID and Content are required");
}
const comment = await Comment.findById(commentId);
if(!comment) {
    throw new ApiError(404, "Comment not found");
}
if(comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
}
   const updatedcomment = await Comment.findByIdAndUpdate(comment._id , {
    content: Content
   }
   , {new: true, runValidators: true});
    return res.status(200).json(new ApiResponse(200,updatedcomment, "Comment updated successfully"));
});
const deleteComment = asyncHandler(async (req, res) => {
const {commentId} = req.params;
if (!commentId) {
throw new ApiError(400, "Comment ID is required");
}
const comment = await Comment.findById(commentId);
if (!comment) {
    throw new ApiError(404, "Comment not found");
}
if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");

}
await Comment.findByIdAndDelete(commentId);
return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
});
export { getVideoComments, addComment, updateComment, deleteComment };