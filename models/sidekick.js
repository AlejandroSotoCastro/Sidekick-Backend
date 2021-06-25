const mongoose = require("mongoose");
const schema = mongoose.Schema({
  index: String,
  name: String,
  sidekickName: String,
  cclass: String,
  level: Number,
  size: String,
  type: String,
  subtype: String,
  alignment: String,
  armor_class: Number,
  hit_points: Number,
  hit_dice: Object,
  speed: { walk: String },
  strength: Number,
  dexterity: Number,
  constitution: Number,
  intelligence: Number,
  wisdom: Number,
  charisma: Number,
  proficiencies: Array,
  damage_vulnerabilities: Array,
  damage_resistances: [String],
  damage_immunities: [String],
  condition_immunities: [{ index: String, name: String }],
  senses: Object,
  languages: String,
  challenge_rating: Number,
  xp: Number,
  special_abilities: [
    {
      name: String,
      desc: String,
    },
  ],
  actions: [{}],

  proficiency_bonus: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Sidekick", schema);
