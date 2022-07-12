const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  name1: String,
  name2: String,
  last_name1: String,
  last_name2: String,
  songs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Song"
    }
  ]
});

var Artist = mongoose.model("Artist", ArtistSchema);
module.exports = Artist;
