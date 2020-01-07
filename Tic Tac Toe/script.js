let originBoard;
const player = 'O';
const computer = 'X';
let winCheck = false;
const winCombinations = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [3, 4, 5],
    [6, 7, 8],
    [2, 4, 6],
    [1, 4, 7],
    [2, 5, 8],
 ]

 const cells = document.querySelectorAll(".cell");
 startGame();
 
 function startGame(){
    winCheck = false;
    document.querySelector(".endgame").style.display = "none";
    originBoard = Array.from(Array(9).keys());
    for(var i = 0; i < cells.length; i++){
        cells[i].innerText = "";
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }  
 }

 function turnClick(event){     
     if(typeof originBoard[event.target.id] === 'number'){
        turn(event.target.id, player);
        if(!checkTie())
          turn(bestSpot(), computer);
     }    
 }

 function turn(cellId, playerId){
     originBoard[cellId] = playerId;
     document.getElementById(cellId).innerText = playerId;
     let gameWon = checkWinner(originBoard, playerId);
     if(gameWon){
         gameOver(gameWon);
         winCheck = true;
     }

 }

 function checkWinner(originBoard, playerId){
    let gameWon = null; 
    let plays = originBoard.reduce((acc, elem, index) => (elem === playerId) ? acc.concat(index) : acc, []);
    
    for(let[index, win] of winCombinations.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {
                index : index,
                player : playerId,
            }
            break;
        }
    }

    return gameWon;     
 }

 function gameOver(gameWon){
     for(let index of winCombinations[gameWon.index]){
         document.getElementById(index).style.backgroundColor = ( gameWon.player == player ? "green" : "red" );         
     }

     for(let i = 0; i < cells.length; i++){
         cells[i].removeEventListener('click', turnClick, false);
     }
     
     declareWinner(gameWon.player === player ? "You Win!!!" : "You lose.");
 }

 function bestSpot(){
    return minimax(originBoard, computer).index;
 }

 function set2EmptySquares(){
     return originBoard.filter(s => typeof s === 'number');
 }

function checkTie(){
    if(set2EmptySquares().length === 0  && !winCheck){
        for(let i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("This is Tie Dude!");
        return true;
    }
    return false;
}

function declareWinner(winner){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame", ".text").innerText = winner;
}

function minimax(newBoard, playerID) {
	var availSpots = set2EmptySquares();

	if (checkWinner(newBoard, player)) {
		return {score: -10};
	} else if (checkWinner(newBoard, computer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = playerID;

		if (playerID == computer) {
			var result = minimax(newBoard, player);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, computer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(playerID === computer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}