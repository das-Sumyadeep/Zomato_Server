const express = require('express');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');


// databaseof the image
const ImageModel = require('../../database/image/image')
const RestaurantModel = require('../../database/restaurant/restau')
// utility 
// import {s3Upload} from '../../Utility/AWS/s3';

const Router = express.Router();

// multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY
    }
});

Router.post('/', upload.single("file"), async (req, res) => {

    try {
        const file = req.file;

        const bucketOptions = {
            Bucket: process.env.s3_BUCKET,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read"
        };

        const s3Upload = new Upload({

            client: s3Client,
            params: bucketOptions
        });

        const UploadImage = await s3Upload.done();

        const { _id } = req.query;

        const ImageDoc = await ImageModel.findOneAndUpdate({ restaurant: _id }, { $push: { photos: { $each: [UploadImage.Location] } } });


        if (!ImageDoc) {

            await ImageModel.create({
                restaurant: _id,
                photos: UploadImage.Location
            });

            return res.json({ message: "Successfully Added" });
        }

        return res.json({ message: "Successfully Added" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = Router;