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
const aBtn = document.getElementById("aBtn");
const bBtn = document.getElementById("bBtn");
const storyTelling = document.getElementById("storyTelling");

let storyindex = 0;
let storyId = storyindex + 1;
let costume = "";
let characterName = "";
let storyArray = [];
let choicesArray = [];
let currentCharacter = "";

//Play click sound
function playClickSound() {
  const click = new Audio("/assets/sounds/btn-click.mp3");
  click.volume = 0.15;
  click.play();
}

//Play background music
function playMusic() {
  const music = new Audio("/assets/sounds/background-music.mp3");
  music.loop = true;
  music.volume = 0.5;
  music.play();
}

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
function storyDisplay() {
  let storyContent = storyArray[storyindex];
  storyTelling.textContent = storyContent;
  console.log(storyArray, storyindex);
}
//function to fetch the story
async function fetchStory() {
  const response = await fetch("http://localhost:8080/story");
  const story = await response.json();

  for (let i = 0; i < story.length; i++) {
    const storyPart = story[i].content;
    storyArray.push(storyPart);
  }
  await loadChoices();
  await storyDisplay();

  displayChoices();
}

//display choices
function displayChoices() {
  for (let i = 0; i < choicesArray.length; i++) {
    if (choicesArray[i].story_id == storyindex + 1) {
      if (choicesArray[i].ab === "A") {
        aBtn.textContent = choicesArray[i].options;
      } else {
        bBtn.textContent = choicesArray[i].options;
      }
    }
  }
}

//function to load choices
async function loadChoices() {
  const response = await fetch("http://localhost:8080/choices");
  const choices = await response.json();

  for (let i = 0; i < choices.length; i++) {
    const choice = await choices[i];
    choicesArray.push(choice);
  }
}

function handleaBtn() {
  playClickSound();
  //make sure start button is pressed
  if (currentCharacter != "") {
    for (let i = 0; i < choicesArray.length; i++) {
      if (choicesArray[i].story_id == storyindex + 1) {
        if (choicesArray[i].ab == "A") {
          console.log(choicesArray[i].next_story_id);
          storyindex = choicesArray[i].next_story_id - 1;
          storyDisplay();
          displayChoices();
          if (choicesArray[i].danger == "Y") {
            loseHealth();
            break;
          } else if (choicesArray[i].candy == "Y") {
            gainCandies(3);
            break;
          }
          break;
        }
      }
    }
  } else {
    alert("Please press the start button to start your haunted adventure!!");
  }
}

function handlebBtn() {
  playClickSound();
  //make sure start button is pressed
  if (currentCharacter != "") {
    for (let i = 0; i < choicesArray.length; i++) {
      if (choicesArray[i].story_id == storyindex + 1) {
        if (choicesArray[i].ab == "B") {
          console.log(choicesArray[i].next_story_id);
          storyindex = choicesArray[i].next_story_id - 1;
          storyDisplay();
          displayChoices();
          if (choicesArray[i].danger == "Y") {
            loseHealth();
            break;
          } else if (choicesArray[i].candy == "Y") {
            gainCandies(3);
            break;
          }
          break;
        }
      }
    }
  } else {
    alert("Please press the start button to start your haunted adventure!!");
  }
}

//Load character values
function loadCharacterValues(character) {
  //update stats
  nameElement.textContent = character.name;
  healthElement.textContent = character.health;
  candiesElement.textContent = character.candies;
  costumeElement.textContent = character.costume;
}

//Reset character values
function resetCharacterDisplay() {
  nameElement.textContent = "";
  healthElement.textContent = "";
  candiesElement.textContent = "";
  costumeElement.textContent = "";
}

//lose health
function loseHealth() {
  currentCharacter.health = currentCharacter.health - 30;
  handleUpdate();
  loadCharacterValues(currentCharacter);
}

//gain Candies
function gainCandies(candies) {
  currentCharacter.candies = currentCharacter.candies + candies;
  handleUpdate();
  loadCharacterValues(currentCharacter);
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

//Start functions and event listeners
fetchStory();
resetCharacterDisplay();
startBtn.addEventListener("click", fetchCharacter);
startBtn.addEventListener("click", playMusic);
aBtn.addEventListener("click", handleaBtn);
bBtn.addEventListener("click", handlebBtn);
