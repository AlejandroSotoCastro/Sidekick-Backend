//import { myCOOLfunction } from "../config/helperfunctions";

const myCOOLfunction = require("../config/helperfunctions");
const authMiddleware = require("../auth/middleware");

const express = require("express");
const axios = require("axios");

const Sidekick = require("../models/sidekick");
const sidekick = require("../models/sidekick");

const router = express.Router();

// Get list of monsters
router.get("/monsters-list/:cr?", async (req, res) => {
  try {
    const cr = myCOOLfunction(req.params.cr);

    // const users = await User.find();

    const response = await axios.get(
      `https://www.dnd5eapi.co/api/monsters?challenge_rating=${cr}`
    );

    const listOfMonsters = response.data.results.map((monster) => {
      return { value: monster.index, label: monster.name };
    });

    res.send(listOfMonsters);
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/:monsterIndex", async (req, res) => {
  const convert = {
    Athletics: "strength",
    STR: "strength",

    Acrobatics: "dexterity",
    Sleight_of_Hand: "dexterity",
    Stealth: "dexterity",
    DEX: "dexterity",

    CON: "constitution",

    Arcana: "intelligence",
    History: "intelligence",
    Investigation: "intelligence",
    Nature: "intelligence",
    Religion: "intelligence",
    INT: "intelligence",

    Animal_Handling: "wisdom",
    Insight: "wisdom",
    Medicine: "wisdom",
    Perception: "wisdom",
    Survival: "wisdom",
    WIS: "wisdom",

    Deception: "charisma",
    Intimidation: "charisma",
    Performance: "charisma",
    Persuasion: "charisma",
    CHA: "charisma",
  };
  function profBonus(cr) {
    if (cr === 0) return 2;
    else return 1 + Math.ceil(cr / 4);
  }
  try {
    // const users = await User.find();
    const response = await axios.get(
      `https://www.dnd5eapi.co/api/monsters/${req.params.monsterIndex}`
    );

    const proficiencies = response.data.proficiencies.map((proficiency) => {
      //   console.log("RESPONSE FROM SERVER", proficiency);

      /**Need to change this
       * First split and s  ave in an array
       * check if array[0] === Saving
       * if not continue with the normal code
       * if true split by " :"  or maybe take array[2]
       * add a third property to proficiency called type: ( can be saving throws or skills)
       * add a fourth property called expertise
       * create a function to calculate if a skill has expertise
       */

      const skillName = proficiency.proficiency.name.split(" ")[1]; // skill (Ex: Deception)

      const skillStat = convert[skillName]; // => Stat (Ex: charisma)
      //console.log(skillName, skillStat);

      return (proficiency = {
        name: skillName,
        stat: skillStat,
      });
    });

    //delete passive perception from senses as it's value it's calculated in the frontend

    const { passive_perception, ...newSenses } = response.data.senses;

    //add things that might or might not exist

    const special_abilities = response.data.special_abilities
      ? [...response.data.special_abilities]
      : [];
    const actions = response.data.actions ? [...response.data.actions] : [];

    // Refactor hit_dice object
    const hitDie = response.data.hit_dice.split("d")[1];
    const hitDice = response.data.hit_dice.split("d")[0];

    monster = {
      ...response.data,
      proficiencies: proficiencies,
      senses: newSenses,
      special_abilities: special_abilities,
      actions: actions,
      hit_dice: { type: `d${hitDie}`, amount: hitDice },
      sidekickName: "",
      cclass: "",
      level: 1,
      proficiency_bonus: profBonus(response.data.challenge_rating),
    };
    // console.log(monster);
    res.send(monster);
  } catch (e) {
    res.send(e.message);
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("req", req.user.id, req.body);
    const newSidekick = await Sidekick.create({
      ...req.body,
      user: req.user.id,
    });

    return res.status(200).send({
      message: "Sidekick saved",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userSidekicks = await Sidekick.find({ user: req.user.id }).populate(
      "user",
      "name -_id"
    );

    res.send(userSidekicks);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
