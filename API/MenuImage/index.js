const express = require('express');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

// databaseof the image
const MenuImageModel = require('../../database/menuImage/menuImage');
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

        const { _id, category } = req.query;

        const ImageDoc = await MenuImageModel.findOneAndUpdate({ restaurant: _id }, {
            $push: {
                menus: {
                    $each: [{
                        category: category,
                        src: [UploadImage.Location]
                    }]
                }
            }
        });

        if (!ImageDoc) {

            const Menu = await MenuImageModel.create({
                restaurant: _id,
                menus: [{
                    category: category,
                    src: [UploadImage.Location]
                }]
            });

            return res.json({ message: "Successfully Added" });
        }
        
        return res.json({ message: "Successfully Added" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


Router.post('/insertMenu', upload.single("file"), async (req, res) => {

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

        const { _id, category } = req.query;

        const ImageDoc = await MenuImageModel.findOneAndUpdate(
            { restaurant: _id, "menus.category": category },
            {
                $push: {
                    "menus.$.src": UploadImage.Location
                }
            },
            { new: true }
        );

        if (!ImageDoc) {
            return res.status(404).json({ error: " Not found" });
        }

        return res.json({ message: "Successfully Added" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = Router