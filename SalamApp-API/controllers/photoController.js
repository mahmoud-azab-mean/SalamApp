const cloudinary = require('cloudinary').v2;
const User = require('../models/userModel');
const HttpStatus = require('http-status-codes');

cloudinary.config({
    cloud_name: 'dxpxowuoc',
    api_key: '197789121424996',
    api_secret: 'QhwC-vNVS9W1svrkQav3C2PAo2c'
});
module.exports = {
    uploadPhoto(req, res) {
        cloudinary.uploader.upload(req.body.photo,
            {
                transformation: {
                    width: 500, height: 500, crop: "fill", gravity: "face"
                }
            }, async (error, result) => {
                await User.updateOne(
                    { _id: req.user._id }
                    ,
                    {
                        $push: {
                            photos: {
                                photoVersion: result.version,
                                photoId: result.public_id
                            }
                        }
                    }
                ).then(
                    () => {
                        res.status(HttpStatus.OK)
                            .json({ message: 'photo uploaded successfully' })
                    }
                ).catch(
                    (err) => {
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .json({ message: 'photo not uploaded' })
                    }
                )
            }
        )
    },
    async setDefaultPhoto(req, res) {
        const { photoVersion, photoId } = req.params;
        await User.updateOne(
            { _id: req.user._id }
            ,
            {
                photoVersion: photoVersion,
                photoId: photoId
            }
        ).then(
            () => {
                res.status(HttpStatus.OK)
                    .json({ message: 'profile photo set successfully' })
            }
        ).catch(
            (err) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'profile photo set failure' })
            }
        )
    },
    deletePhoto(req, res) {
        const { photoId } = req.params;
        cloudinary.uploader.destroy(photoId, async (error, result) => {
            if (result.result === 'ok') {
                await User.updateOne(
                    { _id: req.user._id }
                    ,
                    {
                        $pull: {
                            photos: {
                                photoId: photoId
                            }
                        }
                    }
                ).then(
                    () => {
                        res.status(HttpStatus.OK)
                            .json({ message: 'photo deleted successfully' })
                    }
                ).catch(
                    (err) => {
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .json({ message: 'photo deleted failure' })
                    }
                )
            }
        })
    }
}