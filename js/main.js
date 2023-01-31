let flipUnmatchedGameBlockDuration = 800;
let gameDuration = 60;
let gameContainer = document.querySelector(".memory-game-container");
let gameBlocks = Array.from(gameContainer.children);
let resultOverlay = document.createElement("div");
resultOverlay.className = "win-overlay";

document.querySelector(".control-buttons span").onclick = function () {
  let yourName = prompt("What is your name?");
  document.querySelector(".name span").innerHTML =
    yourName === "" || yourName === null ? "unknown" : yourName;
  this.parentElement.remove();
  gameBlocks.forEach((block) => block.classList.add("flipped"));
  tempShowCardsAndStartTime();
};
async function tempShowCardsAndStartTime() {
  await new Promise((resolve) => {
    setTimeout(() => {
      gameBlocks.forEach((block) => block.classList.remove("flipped"));
      resolve();
    }, 2000);
  });
  timeCountDown();
}
// Add Order Css Property To Game Blocks + Event Listener
gameBlocks.forEach((block) => {
  block.style.order = `${Math.floor(Math.random() * gameBlocks.length)}`;
  block.addEventListener("click", (e) => flipGameBlock(e.currentTarget));
});

function timeCountDown() {
  let countDownInterval = setInterval(timeCountdownHandler, 1000);

  function timeCountdownHandler() {
    gameDuration--;
    console.log(gameDuration);
    document.querySelector(".time span").innerHTML = gameDuration;
    console.log(!gameDuration);
    console.log(
      !gameBlocks.every((block) => block.classList.contains("match"))
    );
    //lose condition
    if (
      !gameDuration &&
      !gameBlocks.every((block) => block.classList.contains("match"))
    ) {
      resultOverlay.style.color = "red";
      showResultMsg("لقد هلكت");
      clearInterval(countDownInterval);
      return;
    }
    // win condition
    if (gameBlocks.every((block) => block.classList.contains("match"))) {
      showResultMsg("احسنت");
      clearInterval(countDownInterval);
    }
  }
}

function showResultMsg(resultText) {
  resultOverlay.appendChild(document.createTextNode(resultText));
  document.body.prepend(resultOverlay);
}

function flipGameBlock(selectedBlock) {
  selectedBlock.classList.add("flipped");
  let flippedBlocks = gameBlocks.filter((block) =>
    block.classList.contains("flipped")
  );
  if (flippedBlocks.length === 2) {
    stopInteraction();
    checkIdenticalBlocks(flippedBlocks[0], flippedBlocks[1]);
  }
}

function stopInteraction() {
  gameContainer.classList.add("no-click");
}

function continueInteraction() {
  setTimeout(() => {
    gameContainer.classList.remove("no-click");
  }, flipUnmatchedGameBlockDuration);
}

function checkIdenticalBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.tech === secondBlock.dataset.tech) {
    firstBlock.classList.remove("flipped");
    secondBlock.classList.remove("flipped");
    firstBlock.classList.add("match");
    secondBlock.classList.add("match");
    playSoundFx("success");
    //interact
    continueInteraction();
    return;
  }
  // gameBlocks aren't identical
  document.querySelector(".tries span").innerHTML =
    parseInt(document.querySelector(".tries span").innerHTML) + 1;
  playSoundFx("failure");
  setTimeout(() => {
    firstBlock.classList.remove("flipped");
    secondBlock.classList.remove("flipped");
  }, flipUnmatchedGameBlockDuration);
  continueInteraction();
}

function playSoundFx(soundTypeId) {
  document.getElementById(soundTypeId).currentTime = 0;
  document.getElementById(soundTypeId).play();
}
