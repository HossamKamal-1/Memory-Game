let duration = 1000;
let gameContainer = document.querySelector(".memory-game-container");
let gameBlocks = Array.from(gameContainer.children);
let resultOverlay = document.createElement("div");
resultOverlay.className = "win-overlay";
resultOverlay.style.opacity = "1";
// Add Order Css Property To Game Blocks
gameBlocks.forEach((block) => {
  block.style.order = `${Math.floor(Math.random() * gameBlocks.length)}`;
  block.addEventListener("click", (e) => {
    flipGameBlock(e.currentTarget);
  });
});
document.querySelector(".control-buttons span").onclick = function () {
  let yourName = prompt("What is your name?");
  document.querySelector(".name span").innerHTML =
    yourName === "" || yourName === null ? "unknown" : yourName;
  this.parentElement.style.opacity = "0";
  setTimeout(() => {
    this.parentElement.remove();
  }, 500);
  gameBlocks.forEach((block) => {
    block.classList.add("flipped");
  });
  setTimeout(() => {
    gameBlocks.forEach((block) => {
      block.classList.remove("flipped");
    });
  }, 1000);
  setTimeout(() => {
    let timeInterval = setInterval(() => timeCountDown(timeInterval), 1000);
  }, 1000);
};

function timeCountDown(timeInterval) {
  document.querySelector(".time span").innerHTML =
    parseInt(document.querySelector(".time span").innerHTML) - 1;
  if (
    parseInt(document.querySelector(".time span").innerHTML) === 0 &&
    gameBlocks.every((block) => block.classList.contains("match")) === false
  ) {
    resultOverlay.style.color = "red";
    resultOverlay.appendChild(document.createTextNode("لقد هلكت"));
    document.body.prepend(resultOverlay);
    clearInterval(timeInterval);
  } else if (
    gameBlocks.every((block) => block.classList.contains("match")) === true
  ) {
    resultOverlay.appendChild(document.createTextNode("احسنت"));
    document.body.prepend(resultOverlay);
    clearInterval(timeInterval);
  }
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
  setTimeout(() => gameContainer.classList.remove("no-click"), duration);
}

function checkIdenticalBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.tech === secondBlock.dataset.tech) {
    firstBlock.classList.remove("flipped");
    secondBlock.classList.remove("flipped");
    firstBlock.classList.add("match");
    secondBlock.classList.add("match");
    document.getElementById("success").currentTime = 0;
    document.getElementById("success").play();
  } else {
    document.querySelector(".tries span").innerHTML =
      parseInt(document.querySelector(".tries span").innerHTML) + 1;
    document.getElementById("failure").currentTime = 0;
    document.getElementById("failure").play();
    setTimeout(() => {
      firstBlock.classList.remove("flipped");
      secondBlock.classList.remove("flipped");
    }, duration);
  }
}
