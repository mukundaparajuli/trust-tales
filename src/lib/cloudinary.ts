const cloudinary = require("cloudinary").v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadToCloudinary = async (localFilePath: string) => {
    try {

        console.log("inside cloudinary");
        if (!localFilePath) return null;

        console.log("got the local path");

        // else upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // now the file has been uploaded successfully
        console.log("File has been uploaded successfully.", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        // remove the locally saved temporary file since the file was not uploaded
        fs.unlinkSync(localFilePath);
        return null;
    }
}

module.exports = { uploadToCloudinary };