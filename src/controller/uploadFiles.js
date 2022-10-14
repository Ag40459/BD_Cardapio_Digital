require('dotenv').config();
const s3 = require('../utils/aws');

const sendAvatar = async (req, res) => {
    const { file } = req
    try {
        if (!file) {
            return res.status(400).json({ message: "Nenhuma imagem selecionada" });
        }
        const { usuario } = req;
        const sendFile = await s3.upload({
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: `imageAvatar/${usuario.email}/${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }).promise()

        return res.json({
            url: sendFile.Location,
            path: sendFile.Key
        })

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const listAvatar = async (req, res) => {
    try {
        const listFiles = await s3.listObjects({
            Bucket: process.env.BACKBLAZE_BUCKET
        }).promise();

        const formatFile = listFiles.Contents.map((file) => {
            return {
                url: `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3}/${file.key}`,
                path: file.Key
            }
        })
        return res.json(formatFile)
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const deleteAvatar = async (req, res) => {
    const { file } = req.query
    try {
        await s3.deleteObject({
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: file
        }).promise()
        return res.status(204).send()
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = { sendAvatar, listAvatar, deleteAvatar };