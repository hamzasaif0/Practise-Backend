import mongoose,{Types} from "mongoose";
import {Playlist}  from "../models/Playlist.models.js";
import { Video } from "../models/Vedios.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/APiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler( async(req, res) => {

const  {name,description} = req.body;
if(!name || !description) {
    throw new ApiError(400, "Name and description are required");
}
const playlist = await Playlist.create({
    name: name,
    description: description,
    owner: req.user._id,
    vedios: [],
});
res.status(200).json( new ApiResponse(200, playlist,"Playlist created successfully" ));
});
const getuserplaylists = asyncHandler( async(req, res) => { 
    if(!req.user?._id){
        throw new ApiError(401, "Unauthorized User");
    }
  const playlists = await Playlist.aggregate([
    {
        $match: { owner: new mongoose.Types.ObjectId(req.user._id) }
    },
    {
        $lookup: {
            from: "videos",
            localField: "video",
            foreignField: "_id",
            as: "VideosCollection"
        }

    },
    {
        $project: {
            _id: 1,
            name: 1,
            description: 1,
            "VideosCollection._id":0 }
    }
  

 ]);
 return res.status(200).json( new ApiResponse(200, playlists, "User playlists fetched successfully" ));
});
const getplaylistbyid = asyncHandler( async(req, res) => {
 
    const {playlistId} = req.params;
    if(!playlistId){
        throw new ApiError(400, "Playlist ID is required");
    }
  const populatedPlaylist = await Playlist.findById(playlistId).populate("video");
   if(!populatedPlaylist){
        throw new ApiError(404, "Playlist not found");
    }
    if (populatedPlaylist .owner.toString() !== req.user._id.toString() ){
    throw new ApiError(403, "You are not authorized to access this playlist"); 
    }
   
    
  return res.status(200).json(new ApiResponse(200, populatedPlaylist, "Playlist fetched successfully"));




});
const addvediotoplaylist = asyncHandler(async(req , res)=>{
   const {playlistId , videoid} = req.params;
   if(!playlistId || !videoid ){
    throw new ApiError(400 , " playlist or videoid is Required");
   }
   const playlist = await Playlist.findById(playlistId);
   if(!playlist){
    throw new ApiError(400 , "Incorrect PlayList ID");
   }
   const newvideo = await Video.findById(videoid);

if(!newvideo){
    throw new ApiError(400 , "Incorrect vedio ID");
   }

 const updatedplaylist = await Playlist.findByIdAndUpdate(playlist._id,
    {$addToSet:{
        video: new mongoose.Types.ObjectId(videoid)
    }},
    {
        new:true
    }
)
return res.status(200).json(new ApiResponse(200,updatedplaylist , "Vedio is added in the playlist successfully"));
     


});
const removeVediofromPlaylist = asyncHandler(async(req,res)=>{
      const {playlistId , videoid} = req.params;
   if(!playlistId || !videoid ){
    throw new ApiError(400 , " playlist or videoid is Required");
   }
   const playlist = await Playlist.findById(playlistId);
   if(!playlist){
    throw new ApiError(404 , "Playlist not Found");
   }
   const newvideo = await Video.findById(videoid);

if(!newvideo){
    throw new ApiError(400 , "Incorrect vedio ID");
   }

 const updatedplaylist = await Playlist.findByIdAndUpdate(playlist._id,
    { $pull:{
        video: new mongoose.Types.ObjectId(videoid)
    }},
    {
        new:true
    }
)
return res.status(200).json(new ApiResponse(200,updatedplaylist , "Vedio is deleted from the playlist successfully"));
});
const deletePlaylist = asyncHandler(async(req, res) => {
 const {playlistId} = req.params;
    if(!playlistId){
      throw  new ApiError(400, "Playlist ID is required");
    }
    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
    throw new ApiError(404, "Playlist not found");

    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this playlist");
    }

    await Playlist.findByIdAndDelete(playlistId);
    return res.status(200).json(new ApiResponse(200, null, "Playlist deleted successfully"));



});
const updatedplaylist = asyncHandler(async(req, res) => {

const {playlistId} = req.params;
const  {name} = req.body;
if(!playlistId || !name) {
    throw new ApiError(400, "Playlist ID and name are required");
}
const playlist = await Playlist.findById(playlistId);
if(!playlist){
    throw new ApiError(404, "Playlist not found");
}
 if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist");
    }
const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
{
   $set: { 
    name: name
 },
}
,
{ new: true }
);
if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found");
}
return res.status(200).json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"));
});

export{createPlaylist ,getuserplaylists ,getplaylistbyid , addvediotoplaylist , removeVediofromPlaylist , deletePlaylist , updatedplaylist};


