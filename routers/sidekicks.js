const express = require("express");
const axios = require("axios");

//const User = require("../models/user"); // new
const router = express.Router();

// Get list of monsters
router.get("/monsters-list/:cr?", async (req, res) => {
  try {
    function myCOOLfunction(CR) {
      CR = parseFloat(CR); // In case the input is a string
      /**CASE 0 */
      if (CR === 0) {
        return 0;
      } else if (CR >= 1) {
        /**CASE INTEGER (>=1) */
        let lowerCRs = "0, 0.125, 0.25, 0.5";

        for (i = 1; i <= CR; i++) {
          lowerCRs += `,${i}`;
        }
        return lowerCRs;
      } else {
        /**CASE DECIMAL (>0|<1) */
        let aux = CR;
        let CRsList = "0";

        do {
          CRsList += `,${aux}`;
          aux /= 2;
        } while (aux >= 0.125);

        return CRsList;
      }
    }

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
       * First split and save in an array
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

    // Refactor hit_dice object
    const hitDie = response.data.hit_dice.split("d")[1];
    const hitDice = response.data.hit_dice.split("d")[0];

    //

    monster = {
      ...response.data,
      proficiencies: proficiencies,
      senses: newSenses,
      hit_dice: { type: `d${hitDie}`, amount: hitDice },

      proficiency_bonus: profBonus(response.data.challenge_rating),
    };
    // console.log(monster);
    res.send(monster);
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;
