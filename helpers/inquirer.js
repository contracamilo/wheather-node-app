require("colors");
const inquirer = require("inquirer");

const questions = [
  {
    type: "list",
    name: "option",
    message: "What do you want to do?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Find a city`,
      },
      {
        value: 2,
        name: `${"2.".green} City record`,
      },
      {
        value: 0,
        name: `${"0.".green} Exit`,
      },
    ],
  },
];

const iqMenu = async () => {
  console.clear();
  console.log("=========================================".green);
  console.log("======= Please select an option =========".white);
  console.log("=========================================\n".green);

  const { option } = await inquirer.prompt(questions);

  return option;
};

const iqPause = async () => {
  const { action } = await inquirer.prompt([
    {
      type: "input",
      name: "action",
      message: `\n Press ${"ENTER".green} to continue \n`,
    },
  ]);

  console.log("\n");
  return action;
};

const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "description",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Pleaser insert a value";
        }
        return true;
      },
    },
  ];

  const { description } = await inquirer.prompt(question);
  return description;
};

const listPlaces = async (places = []) => {
  const choices = places.map((place, idx) => {
    const index = `${++idx}`.green;

    return {
      value: place.id,
      name: `${index} ${place.name}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0.".green + "Cancel",
  });

  const questions = [
    {
      type: "list",
      name: "id",
      message: "Select a place: ",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(questions);

  return id;
};

const confirm = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const { ok } = await inquirer.prompt(question);
  return ok;
};

const showListChecklist = async (tasks = []) => {
  const choices = tasks.map((task, idx) => {
    const index = `${++idx}`.green;

    return {
      value: task.id,
      name: `${index} ${task.description}`,
      checked: task.completedDate ? true : false,
    };
  });

  const question = [
    {
      type: "checkbox",
      name: "ids",
      message: "Select",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(question);

  return ids;
};

module.exports = {
  iqMenu,
  iqPause,
  readInput,
  listPlaces,
  confirm,
  showListChecklist,
};
