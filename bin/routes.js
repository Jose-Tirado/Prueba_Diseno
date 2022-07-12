
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
const { controller } =
    require("./Controller");

app.get("/version", (req, res) => {
    res.send({ version: "1.0.0" });
});

app.post("/users", function(req, res) {
    let { user } = req.body;
    controller.setUser(user, res);
});
app.get("/users", (req, res) => {
    controller.getUsers(req, res);
});

app.get("/users/:id", function(req, res) {
    let { id } = req.params;
    controller.getUser(id, res);
});

app.put("/users/:id", function(req, res) {
    let user = req.body.user;
    user.id = req.params.id;
    controller.updateUser(user, res);
});

app.delete("/users/:id", function(req, res) {
    let { id } = req.params;
    controller.deleteUser(id, res);
});

app.post("/users/:user_id/lists", (req, res) => {
    let { user_id } = req.params;
    let { list } = req.body;
    controller.setUserList(user_id, list, res);
});

app.get("/users/:id/lists", function(req, res) {
    let { id } = req.params;
    controller.getUserLists(id, res);
});

app.get("/users/:user_id/lists/:list_id", (req, res) => {
    let { user_id, list_id } = req.params;
    controller.getUserList(user_id, list_id, res);
});

app.post("/songs", (req, res) => {
    let { song } = req.body;
    controller.setSong(song, res);
});

app.get("/songs", (req, res) => {
    controller.getSongs(res);
});

app.get("/songs/:id", (req, res) => {
    let { id } = req.params;
    controller.getSong(id, res);
});

app.put("/users/:id_user/lists/:id_list/", function(req, res) {
    let { song_id } = req.body;
    let { id_user, id_list } = req.params;
    controller.updateList(song_id, id_user, id_list, res);
});

app.post("/artists/", (req, res) => {
    let { artist } = req.body;
    controller.setArtist(artist, res);
});

app.get("/artists/", (req, res) => {
    controller.getArtists(res);
});

app.get("/artists/:id", (req, res) => {
    let { id } = req.params;
    controller.getArtist(id, res);
});

app.put("/songs/:id_song/", function(req, res) {
    let { id_song } = req.params;
    let { artists } = req.body;
    controller.updateSong(id_song, artists, res);
});
exports.app = app;
