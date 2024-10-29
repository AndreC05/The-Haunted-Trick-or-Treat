const gameContainer = document.getElementById("game-container");
const statsContainer = document.getElementById("stats-container");
const storyContainer = document.getElementById("story-container");
const storyText = document.getElementById("story-text");
const choicesContainer = document.getElementById("choices-container");
const healthElement = document.getElementById("health");
const candiesElement = document.getElementById("candies");
const costumeElement = document.getElementById("costume");



//function to load the story
async function loadStory() {
  const response = await fetch('http://localhost:8080/story');
  const story = await response.json();
  console.log(story);

  //display story in the story-text container
  storyText.innerHTML = ''; //clear the existing story
  storyText.innerHTML = story.content;
}

//function to load character
async function loadCharacter() {
  const response = await fetch('http://localhost:8080/character');
  const character = await response.json();

  //update stats
  healthElement.textContent = character.health;
  candiesElement.textContent = character.candies;
  costumeElement.textContent = character.costume;
}

//function to load enemy
async function loadEnemy() {
  const response = await fetch('http://localhost:8080/enemy');
  const enemy = await response.json();
  console.log(enemy);
}

//function to load stories
async function loadChoices() {
  const response = await fetch('http://localhost:8080/choices');
  const choices = await response.json();
  console.log(choices);
}





