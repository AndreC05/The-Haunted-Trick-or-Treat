const gameContainer = document.getElementById("game-container");
const statsContainer = document.getElementById("stats-container");
const storyContainer = document.getElementById("story-container");
const storyText = document.getElementById("story-text");
const choicesContainer = document.getElementById("choices-container");
const healthElement = document.getElementById("health");
const candiesElement = document.getElementById("candies");
const costumeElement = document.getElementById("costume");
const nameElement = document.getElementById("name");
const startBtn = document.getElementById("startBtn");

let costume = "";
let characterName = "";
let storyArray = [];
let choicesArray = [];
let currentCharacter = "";
let loadedCharacter = false;

//Character creation function
function characterCreation() {
  alert("Boo");
  characterName = prompt("What is your name?");
  costume = prompt("What is your costume?");
  newCharacter(characterName, costume);
}

//upload character to the database
async function newCharacter(newName, costumeType) {
  const character = {
    name: newName,
    costume: costumeType,
    candies: 0,
    health: 100,
  };
  const response = await fetch("http://localhost:8080/character", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(character),
  });
}

//function to fetch the story
async function fetchStory() {
  const response = await fetch("http://localhost:8080/story");
  const story = await response.json();

  for (let i = 0; i < story.length; i++) {
    const storyPart = story[i].content;
    storyArray.push(storyPart);
  }

  //display story in the story-text container
  storyText.innerHTML = ""; //clear the existing story
  storyText.innerHTML = story.content;
}

//Load character values
function loadCharacterValues(character) {
  //update stats
  nameElement.textContent = character.name;
  healthElement.textContent = character.health;
  candiesElement.textContent = character.candies;
  costumeElement.textContent = character.costume;
}

//function to fetch character
async function fetchCharacter() {
  let characterFound = false;
  characterName = prompt("Please Enter Your Character Name.");
  while (characterFound == false) {
    const response = await fetch("http://localhost:8080/character");
    const characters = await response.json();
    for (let i = 0; i < characters.length; i++) {
      if (characters[i].name === characterName) {
        currentCharacter = characters[i];
        characterFound = true;
        break;
      }
    }
    if (characterFound == false) {
      const newCharacterChoice = prompt(
        "character not found would you like to make a new character Y/N?"
      );
      if (newCharacterChoice === "Y") {
        await characterCreation();
        continue;
      } else {
        characterName = promt("please reenter your character name.");
      }
    }
  }
  loadCharacterValues(currentCharacter);
}

//function to load enemy
async function loadEnemy() {
  const response = await fetch("http://localhost:8080/enemy");
  const enemy = await response.json();
}

//function to load choices
async function loadChoices() {
  const response = await fetch("http://localhost:8080/choices");
  const choices = await response.json();

  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    choicesArray.push(choice);
  }
}

//update candy value on the database
async function handleUpdate() {
  let characterId = currentCharacter.id;
  let characterCandies = currentCharacter.candies;
  let characterHealth = currentCharacter.health;

  const body = {
    id: characterId,
    candies: characterCandies,
    health: characterHealth,
  };

  //make put request
  const response = await fetch("http://localhost:8080/character", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  loadCharacterValues(currentCharacter);
}

loadChoices();
loadEnemy();
fetchStory();

startBtn.addEventListener("click", fetchCharacter);
