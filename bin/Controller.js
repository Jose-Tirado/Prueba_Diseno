const mongoose = require("mongoose");
const User = require("./models/User");
const List = require("./models/List");
const Song = require("./models/Song");
const Artist = require("./models/Artist");

class Controller {
    constructor() {
        
        this.connect();
    }

    async connect() {
        try {
            await mongoose.connect(
                "mongodb+srv://admin:admin@cluster0.kxsse.mongodb.net/?retryWrites=true&w=majority",
            { useNewUrlParser: true }
            );
                        console.log("Connected databases.");
        } catch (e) {
                        console.error(e);
        }
    }

    setUser(user, res) {
                User.create(user, function(err, newUser) {
                    if (err) throw err;
                    res.send({ status: 200, nU: newUser });
        });
    }
    getUsers(req, res) {
        User.find({}, (err, users) => {
            if (err) throw err;
            res.send({ allUsers: users });
        });
    }

    getUser(id, res) {
        User.find({ _id: id }, (err, user) => {
            if (err) throw err;
            res.send({ User: user });
        });
    }

    updateUser(user, res) {
        let { id, picture, password } = user;
        User.updateOne(
            { _id: id },
            { $set: { picture: picture, password: password } }
        )
            .then(rawResponse => {
                res.send({ message: "User updated", raw: rawResponse });
            })
            .catch(err => {
                if (err) throw err;
            });
    }

    deleteUser(id, res) {
        User.deleteOne({ _id: id }, function(err) {
            if (err) throw err;
            res.send({ message: "User has been deleted" });
        });
    }     setUserList(user_id, list, res) {
        list.user_id = user_id;
        List.create(list, function(err, newList) {
            if (err) return handleError(err);
            res.send({ status: 200, id_list: newList._id });
        });
    }

    getUserLists(id, res) {
        List.find({ user_id: id }, function(err, userList) {
            if (err) throw err;
            res.send({ status: 200, user_list: userList });
        });
    }

    getUserList(user_id, list_id, res) {
        List.find({ _id: list_id, user_id: user_id })
            .populate({
                path: "song_id",
                select: "name artists duraction",
                populate: {
                    path: "artists",
                    select: "name1 name2 last_name1 last_name2"
                }
            })
            .exec(function(err, userListSong) {
                if (err) throw err;
                res.send({ status: 200, user_list_song: userListSong });
            });
    }

    setSong(song, res) {
        Song.create(song, function(err, newSong) {
            if (err) throw err;
            res.send({ status: 200, id_song: newSong._id });
        });
    }
    getSongs(res) {
        Song.find().exec(function(err, songs) {
            if (err) throw err;
            res.send({ status: 200, artists: songs });
        });
    }
    getSong(id, res) {
        Song.find({ _id: id }).exec(function(err, song) {
            if (err) throw err;
            res.send({ status: 200, artists: song });
        });
    }

    updateList(song_id, id_user, id_list, res) {
        List.updateOne({ _id: id_list }, { $push: { song_id: song_id } })
            .then(rawResponse => {
                res.send({ message: "List updated", raw: rawResponse });
            })
            .catch(err => {
                if (err) throw err;
            });
    }

    setArtist(artist, res) {
        Artist.create(artist, function(err, newArtist) {
            if (err) throw err;
            res.send({ status: 200, id_artist: newArtist._id });
        });
    }

    getArtists(res) {
        Artist.find().exec(function(err, artist) {
            if (err) throw err;
            res.send({ status: 200, artists: artist });
        });
    }

    getArtist(id, res) {
        Artist.find({ _id: id }).exec(function(err, artist) {
            if (err) throw err;
            res.send({ status: 200, artists: artist });
        });
    }

    updateSong(song_id, artists, res) {
        Song.updateOne({ _id: song_id }, { $push: { artists: artists } })
            .then(rawResponse => {
                res.send({ message: "Song updated", raw: rawResponse });
            })
            .catch(err => {
                if (err) throw err;
            });
    }
}
exports.controller = new Controller();
