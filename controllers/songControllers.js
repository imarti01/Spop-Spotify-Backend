const fs = require("fs-extra")
const Song = require("../models/Song");
const { uploadSong, deleteSongCloud, uploadImgSong } = require("../utils/cloudinary");


const getSongs = async (req, res) => {
    try {
        const songs = await Song.find()
        return res.send(songs)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


const createSong = async (req, res) => {
    try {
        const { name, artist, genre } = req.body
        const resultSong = await uploadSong(req.files.song.tempFilePath)
        const resultImageSong = await uploadImgSong(req.files.image.tempFilePath)
        let image;
        image = {
            url: resultImageSong.secure_url,
            public_id: resultImageSong.public_id
        }
        let song;
        song = {
            url: resultSong.secure_url,
            public_id: resultSong.public_id
        }
        const newSong = new Song({ name, artist, genre, song, image })
        await newSong.save()
        await fs.remove(req.files.song.tempFilePath)
        await fs.remove(req.files.image.tempFilePath)
        return res.json(newSong)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const deleteSongs = async (req, res) => {
    try {
        const songRemoved = await Song.findByIdAndDelete(req.params.id)
        if (!songRemoved) return res.sendStatus(404)
        await deleteSongCloud(songRemoved.public_id)
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const updateSongs = async (req, res) => {
    try {
        await Song.findByIdAndUpdate(req.params._id, req.body, { new: true })
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getSongs,
    createSong,
    deleteSongs,
    updateSongs
};


