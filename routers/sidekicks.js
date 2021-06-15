const express = require("express");
const axios = require("axios");

//const User = require("../models/user"); // new
const router = express.Router();

// Get list of monsters
router.get("/monsters-list/:cr?", async (req, res) => {
  try {
    // const users = await User.find();
    const response = await axios.get(
      `https://www.dnd5eapi.co/api/monsters?challenge_rating=0,0.125,0.25,0.5`
    );

    const listOfMonsters = response.data.results.map((monster) => monster.name);
    // console.log("RESPONSE FROM SERVER", response.data);
    res.send(listOfMonsters);
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/:monsterIndex", async (req, res) => {
  const convert = {
    Athletics: "Strength",

    Acrobatics: "Dexterity",
    Sleight_of_Hand: "Dexterity",
    Stealth: "Dexterity",

    Arcana: "Intelligence",
    History: "Intelligence",
    Investigation: "Intelligence",
    Nature: "Intelligence",
    Religion: "Intelligence",

    Animal_Handling: "Wisdom",
    Insight: "Wisdom",
    Medicine: "Wisdom",
    Perception: "Wisdom",
    Survival: "Wisdom",

    Deception: "Charisma",
    Intimidation: "Charisma",
    Performance: "Charisma",
    Persuasion: "Charisma",
  };
  try {
    // const users = await User.find();
    const response = await axios.get(
      `https://www.dnd5eapi.co/api/monsters/${req.params.monsterIndex}`
    );

    const proficiencies = response.data.proficiencies.map((proficiency) => {
      //   console.log("RESPONSE FROM SERVER", proficiency);
      const skillName = proficiency.proficiency.name.split(" ")[1]; // Deception
      const skillStat = convert[skillName]; // =>  Charisma

      return (proficiency = { name: skillName, stat: skillStat });
    });
    monster = { ...response.data, proficiencies: proficiencies };
    console.log(response.data.proficiencies);
    res.send(monster);
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;
