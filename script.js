let humanPlayer = 'humanPlayer';
let AiPlayer = 'AiPlayer';
let bossStartingHealth;
let bossCurrentHealthSoFar;
let humanHealing;
let AIHealing;
let humanAttackingValues = [0, 0, 0];
let AiAttackingValues = [0, 0, 0];
let humanHealingValues = [0, 0];
let AiHealingValues = [0, 0];
let startTurn;
let difficulty;
let memo = {};


function showTurnSelection(){
  document.querySelector('.selectWhoStarts').style.display = "block";
}


function selectTurn(who){
  startTurn = who;
  document.querySelector('.selectWhoStarts').style.display = "none";
  startGame();
}


// Choose difficulty
function chooseDiff(choice){
  difficulty = choice;
  document.querySelector('.selectDifficulty').style.display = "none";
  showTurnSelection();
}

function startNewGame(){
    // show difficulty selection window
    document.querySelector('.selectDifficulty').style.display = "block";
    // reset AI buttons color
    document.querySelectorAll('.ai-healing-btn').forEach(btn => {
      btn.style.backgroundColor = "#fbeee0";
    });
    document.querySelectorAll('.ai-attacking-btn').forEach(btn => {
        btn.style.backgroundColor = "#fbeee0";
    });
    //remove winner window
    document.querySelector(".endgame").style.display = "none";
    document.querySelector(".endgame .text").innerText = "";
    document.querySelectorAll('.human-healing-btn').forEach(element => {
      element.style.pointerEvents = "none";
    })
    document.querySelectorAll('.human-attacking-btn').forEach(element => {
      element.style.pointerEvents = "none";
    })
}



function botStart(){
    checkValidate();
    // Get the best move for the AI bot
    bestToPlay = bestMove();
    turn(bestToPlay.type, AiPlayer, bestToPlay.amount);
    // Turn on buttons so user can play next move
    if(!checkWin(bossCurrentHealthSoFar, AiPlayer))
    document.querySelectorAll(".to-disable").forEach(element =>{
      if(element.classList.contains("human-turn-btn")){
        if(element.classList.contains("human-healing-btn")){
          if(humanHealing > 0)
            element.style.pointerEvents = "auto";
        }else{
          element.style.pointerEvents = "auto";
        }
      }
      })
}

function startGame() {
  // reset DP
  memo = {};
  // reset AI buttons color
  document.querySelectorAll('.ai-healing-btn').forEach(btn => {
    btn.style.backgroundColor = "#fbeee0";
  });
  document.querySelectorAll('.ai-attacking-btn').forEach(btn => {
      btn.style.backgroundColor = "#fbeee0";
  });
  //remove winner window
  document.querySelector(".endgame").style.display = "none";
  document.querySelector(".endgame .text").innerText = "";
  document.querySelectorAll(".to-disable").forEach(element =>{
    if(element.classList.contains("human-turn-btn"))
      element.style.pointerEvents = "auto";
  })
  // random-numbers for healing Buttons;
  let idx = 0;
  for(var i=0; i<2; i++){
    humanHealingValues[i] = (Math.floor(Math.random() * 20 + 1));
  }
  document.querySelectorAll('.human-healing-btn').forEach( element => {
    element.textContent = humanHealingValues[idx++];
  })
  idx = 0;
  for(var i=0; i<3; i++){
    let num = (Math.floor(Math.random() * 20 + 1));
    humanAttackingValues[i] = num;
  }
  document.querySelectorAll('.human-attacking-btn').forEach( element => {
    element.textContent = humanAttackingValues[idx++];
  })
  idx = 0;
  for(var i=0; i<2; i++){
    AiHealingValues[i] = humanHealingValues[i];
  }
  document.querySelectorAll('.ai-healing-btn').forEach( element => {
    element.textContent = AiHealingValues[idx++];
  })
  idx = 0;
  for(var i=0; i<3; i++){
    AiAttackingValues[i] = humanAttackingValues[i];
  }
  document.querySelectorAll('.ai-attacking-btn').forEach( element => {
    element.textContent = humanAttackingValues[idx++];
  })
  // random Boss health
  bossStartingHealth = Math.floor(Math.random() * 76 + 76);
  bossCurrentHealthSoFar = bossStartingHealth;
  document.getElementById('Boss-Health').textContent = bossStartingHealth;
  document.getElementById("green-health").style.width = "50%";
  // reset Healing Attemps
  let humanElement = document.getElementById("Human-Healing-Times");
  let aiElement = document.getElementById("AI-Healing-Times");
  let randomAttemps = Math.floor(Math.random() * 6 + 1);
  humanElement.textContent = `${randomAttemps} Healing remaining`
  aiElement.textContent = `${randomAttemps} Healing remaining`
  AIHealing = randomAttemps;
  humanHealing = randomAttemps;
  // rest Human Healing Opacity
  document.querySelectorAll('.human-healing-btn').forEach(element => {
    element.style.pointerEvents = "auto";
    element.style.opacity = "100%";
  })
  if(startTurn === "B")
      botStart();
}

function attack(player, dmg){
  let prevHealth = parseInt(document.getElementById("Boss-Health").innerHTML);
  let prevPercentage = document.getElementById("green-health").style.width;
  if(prevHealth != bossCurrentHealthSoFar)
      prevHealth = bossCurrentHealthSoFar;
  prevPercentage = parseInt(prevPercentage.substring(0, prevPercentage.length - 1));
  let newHealth = Math.max(prevHealth - dmg, 0);
  let ratio = newHealth / prevHealth;
  document.getElementById("green-health").style.width = `${ratio * prevPercentage}%`;
  // console.log(document.getElementById("green-health").style.width);
  document.getElementById('Boss-Health').textContent = newHealth;
  bossCurrentHealthSoFar = newHealth;
  if(player === AiPlayer){
    // reset AI buttons color
    document.querySelectorAll('.ai-healing-btn').forEach(btn => {
        btn.style.backgroundColor = "#fbeee0";
    });
    document.querySelectorAll('.ai-attacking-btn').forEach(btn => {
        btn.style.backgroundColor = "#fbeee0";
    });
    // Coloring the new button
    let found = 0;
    document.querySelectorAll('.ai-attacking-btn').forEach(btn => {
      let amount = parseInt(btn.textContent);
      if(dmg === amount && !found){
        btn.style.backgroundColor = "orange";
        found = 1;
      }
    });
  }
}

function heal(player, healing){
  if(player === humanPlayer){
    // decreasing attemtps;
    let element = document.getElementById("Human-Healing-Times");
    let attempts = parseInt(element.textContent.match(/\d+/)[0]) - 1;
    // console.log(`Can Heal ${attempts}`)
    if(attempts < 0){
      return;
    }
    humanHealing--;
    // console.log(attempts);
    element.textContent = `${attempts} Healing remaining`;
    if(attempts === 0){
      document.querySelectorAll('.human-healing-btn').forEach(element => {
        element.style.pointerEvents = "none";
        element.style.opacity = "50%";
      })
    }
  }else{
    // reset AI buttons color
    document.querySelectorAll('.ai-healing-btn').forEach(btn => {
        btn.style.backgroundColor = "#fbeee0";
    });
    document.querySelectorAll('.ai-attacking-btn').forEach(btn => {
        btn.style.backgroundColor = "#fbeee0";
    });
    // decreasing attemtps;
    let element = document.getElementById("AI-Healing-Times");
    let attempts = parseInt(element.textContent.match(/\d+/)[0]) - 1;
    if(attempts < 0){
      return;
    }
    AIHealing--;
    // console.log(attempts);
    element.textContent = `${attempts} Healing remaining`;
    // Coloring the new Button
    let found = 0;
    document.querySelectorAll('.ai-healing-btn').forEach(btn => {
      let amount = parseInt(btn.textContent);
      if(healing === amount && !found){
        btn.style.backgroundColor = "orange";
        found = 1;
      }
    });
  }
  // Healing Process
  let prevHealth = parseInt(document.getElementById("Boss-Health").innerHTML);
  if(prevHealth != bossCurrentHealthSoFar)
      prevHealth = bossCurrentHealthSoFar;
  let prevPercentage = "50%"
  prevPercentage = parseInt(prevPercentage.substring(0, prevPercentage.length - 1));
  let newHealth = Math.max(prevHealth + healing, 0);
  let ratio = newHealth / bossStartingHealth;
  let newWidth = Math.min(50, ratio * prevPercentage);
  // console.log(`NewWidth = ${newWidth}`)
  document.getElementById("green-health").style.width = `${Math.min(50, ratio * Math.max(1, prevPercentage))}%`;
  // console.log(`${Math.min(50, ratio * prevPercentage)}%`);
  document.getElementById('Boss-Health').textContent = newHealth;
  bossCurrentHealthSoFar = newHealth;
  // console.log(prevHealth);
  bossStartingHealth = Math.max(bossStartingHealth, newHealth)
}


// Check user didn't change numbers from
function checkValidate(){
  let idx = 0;
  document.querySelectorAll('.human-healing-btn').forEach( element => {
    element.textContent = humanHealingValues[idx++];
  })
  idx = 0;
  document.querySelectorAll('.human-attacking-btn').forEach( element => {
    element.textContent = humanAttackingValues[idx++];
  })
  idx = 0;
  document.querySelectorAll('.ai-healing-btn').forEach( element => {
    element.textContent = AiHealingValues[idx++];
  })
  idx = 0;
  document.querySelectorAll('.ai-attacking-btn').forEach( element => {
    element.textContent = AiAttackingValues[idx++];
  })
  //set healing attemps
  let element = document.getElementById("Human-Healing-Times");
  let element2 = document.getElementById("AI-Healing-Times");
  element.textContent = `${humanHealing} Healing remaining`;
  element2.textContent = `${AIHealing} Healing remaining`;
}

// User Click To do an action
function turnClick(player, element, type) {
  checkValidate();
  type = element.classList.contains("human-healing-btn") ? 'heal' : 'attack';
  player = element.classList.contains("human-turn-btn") ? 'humanPlayer' : 'AiPlayer';
  let isCorrectMove = type === 'attack' || (type === 'heal' && player === humanPlayer && humanHealing != 0) ? true : false;
  // isCorrectMove = isCorrectMove || (type === 'heal' && player === 'AiPlayer' && AIHealing != 0);

  // Disable buttons until finish checking the move
  document.querySelectorAll(".to-disable").forEach(element =>{
    element.style.pointerEvents = "none";
  })

  if (isCorrectMove) {
    turn(type, player, parseInt(element.textContent));
    if(!checkWin(bossCurrentHealthSoFar, humanPlayer)){
      checkValidate();
      bestToPlay = bestMove();
      // console.log(bestToPlay)
      turn(bestToPlay.type, AiPlayer, bestToPlay.amount);
      // Turn on buttons so user can play next move
      if(!checkWin(bossCurrentHealthSoFar, AiPlayer))
      document.querySelectorAll(".to-disable").forEach(element =>{
        if(element.classList.contains("human-turn-btn")){
          if(element.classList.contains("human-healing-btn")){
            if(humanHealing > 0)
              element.style.pointerEvents = "auto";
          }else{
            element.style.pointerEvents = "auto";
          }
        }
        })
    }
  }
}

// Do the turn process

function turn(type, player, amount) {
  if(type == 'attack'){
    attack(player, amount)
    let gameWon = checkWin(bossCurrentHealthSoFar, player);
    if (gameWon) gameOver(gameWon);
  }else{
    heal(player, amount)
  }
}

// Check if a player has already won

function checkWin(health, player) {
  let gameWon = null;
  if(health <= 0)
    gameWon = player;
  return gameWon;
}

// Game over process window

function gameOver(gameWon){
  document.querySelectorAll(".to-disable").forEach(element =>{
    element.style.pointerEvents = "none";
  })
  declareWinner(gameWon === humanPlayer ? "You Won!" : "You Lost");
}

function declareWinner(whoWon) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = whoWon;
}

function bestMove(){
  let RET = minimax(AiPlayer, bossCurrentHealthSoFar, AIHealing, humanHealing, 0);
  return RET;
}
  

function minimax(player, bossHealth, aiHealAttempts, humanHealAttempts, turnsPlayed) {
  // Check if the current state is already memoized
  let memoKey = `${player}-${bossHealth}-${aiHealAttempts}-${humanHealAttempts}-${turnsPlayed}`;
  if (memo[memoKey]) {
    return memo[memoKey];
  }

  const gameState = bossHealth <= 0 ? true : false;
  
  if (gameState === true && player === AiPlayer) {
    return { score: turnsPlayed - 1000 };
  } else if (gameState === true && player === humanPlayer) {
    return { score: 1000 - turnsPlayed};
  }
  
  var moves = [];
  
  if (player === AiPlayer) {
    if (aiHealAttempts > 0) {
      // AI try to use heal
      document.querySelectorAll('.ai-healing-btn').forEach(btn => {
        let amount = parseInt(btn.textContent);
        let score = minimax(humanPlayer, bossHealth + amount, aiHealAttempts - 1, humanHealAttempts, turnsPlayed + 1).score;
        moves.push({ score: score, type: 'heal', amount: amount });
      });
    }

    // AI try to attack
    document.querySelectorAll('.ai-attacking-btn').forEach(btn => {
      let amount = parseInt(btn.textContent);
      let score = minimax(humanPlayer, bossHealth - amount, aiHealAttempts, humanHealAttempts, turnsPlayed + 1).score;
      moves.push({ score: score, type: 'attack', amount: amount });
    });

  } 

  else {
    if (humanHealAttempts > 0) {
      // Human try to heal
      document.querySelectorAll('.human-healing-btn').forEach(btn => {
        let amount = parseInt(btn.textContent);
        let score = minimax(AiPlayer, bossHealth + amount, aiHealAttempts, humanHealAttempts - 1, turnsPlayed + 1).score;
        moves.push({ score: score, type: 'heal', amount: amount });
      });
    }

    document.querySelectorAll('.human-attacking-btn').forEach(btn => {
      let amount = parseInt(btn.textContent);
      let score = minimax(AiPlayer, bossHealth - amount, aiHealAttempts, humanHealAttempts, turnsPlayed + 1).score;
      moves.push({ score: score, type: 'attack', amount: amount });
    });

  }

  // sort moves array by score
  moves.sort((a, b) => {
    if (player === AiPlayer) {
      return b.score - a.score; // Sort in descending order for AI player
    } else {
      return a.score - b.score; // Sort in ascending order for human player
    }
  });


  let bestMove

  // If difficulty is medium play (Second or Third or forth) best move
  if(difficulty === 'E'){
    if(player === humanPlayer){
      bestMove = 0;
    }else{
      bestMove = moves[0].score === 999 ? 0 : Math.min(Math.floor(Math.random() * 3 + 1), moves.length - 1);
    }
  }else if(difficulty === 'M'){
    // If difficulty is medium play (First or Second) best move
    if(player === humanPlayer){
      bestMove = 0;
    }else{
      bestMove = moves[0].score === 999 ? 0 : Math.min(Math.floor(Math.random() * 2), moves.length - 1);
    }
  }else{
    // if difficulty is hart choose best move
    bestMove = 0;
  }
  
  // Memoize the result before returning
  memo[memoKey] = moves[bestMove];
  return moves[bestMove];
}
