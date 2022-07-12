const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  name: String,
  duraction: String,
  artists: [
    {
      type: Schema.Types.ObjectId,
      ref: "Artist"
    }
  ],
  list_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "List"
    }
  ]
});

var Song = mongoose.model("Song", SongSchema);
module.exports = Song;
