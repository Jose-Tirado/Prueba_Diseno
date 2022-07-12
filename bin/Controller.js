const mongoose = require("mongoose");
const User = require("./models/User");
const List = require("./models/List");
const Song = require("./models/Song");
const Artist = require("./models/Artist");

class Controller {
    constructor() {
        //al crearse el objeto se establece la conexion
        this.connect();
    }

    async connect() {
        try {
            //se intenta establecer una conexion con los datos de conexion
            await mongoose.connect(
                "mongodb+srv://kikret:17DYcr6Zow5TYCSu@cluster0-9ek42.mongodb.net/test?retryWrites=true&w=majority",
                //"mongodb://localhost:27017/my_music_collection_db",
                { useNewUrlParser: true }
            );
            //en caso de esablecer la conexion, se muestra en consola este mensaje
            console.log("Connected databases.");
        } catch (e) {
            //en caso de haber un error se muestra en consola el error
            console.error(e);
        }
    }
    //CRUD https://coursework.vschool.io/mongoose-crud/
    //CRUD https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/

    //CRUD user
    setUser(user, res) {
        // Se recibe el nuevo usuario en la variable user y se crea a partir del modelo
        User.create(user, function(err, newUser) {
            // sihay error se reporta
            if (err) throw err;
            // se retorna la informacion con el nuevo usuario creado
            res.send({ status: 200, nU: newUser });
        });
    }

    //metodo para buscar todos los usuarios
    getUsers(req, res) {
        //en el modelo User se ejecuta el find sin ninguna condicion...
        User.find({}, (err, users) => {
            //en caso de haberse presentado un error se ejecuta el error
            if (err) throw err;
            //de lo contrario se retorna un objeto con todos los resultados
            res.send({ allUsers: users });
        });
    }

    getUser(id, res) {
        //en el modelo User se ejecuta el find sin ninguna condicion...
        User.find({ _id: id }, (err, user) => {
            //en caso de haberse presentado un error se ejecuta el error
            if (err) throw err;
            //de lo contrario se retorna un objeto con todos los resultados
            res.send({ User: user });
        });
    }

    updateUser(user, res) {
        //optenemos los campos que queremos actualizar
        let { id, picture, password } = user;
        //actualizamos teniendo en cuenta una condicion con el operador $set
        //https://docs.mongodb.com/manual/reference/operator/update/set/
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
    } // remove, findByIdAndRemove, findOneAndRemove

    //CRUD list
    setUserList(user_id, list, res) {
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

    //CRUD song
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
        //actualizamos teniendo en cuenta una condicion con el operador $push
        // https://docs.mongodb.com/manual/reference/operator/update/push/
        List.updateOne({ _id: id_list }, { $push: { song_id: song_id } })
            .then(rawResponse => {
                res.send({ message: "List updated", raw: rawResponse });
            })
            .catch(err => {
                if (err) throw err;
            });
    }

    //CRUD artist
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
        //actualizamos teniendo en cuenta una condicion con el operador $push
        // https://docs.mongodb.com/manual/reference/operator/update/push/
        Song.updateOne({ _id: song_id }, { $push: { artists: artists } })
            .then(rawResponse => {
                res.send({ message: "Song updated", raw: rawResponse });
            })
            .catch(err => {
                if (err) throw err;
            });
    }
}
// se exporta elobjeto controlador crado a partir de la clase Controller
exports.controller = new Controller();