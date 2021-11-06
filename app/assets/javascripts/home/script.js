
var playerOneMove = 1;
var playingWithComputer = 0;
var computerGoesFirst = 0;
var TotalDone = 0;


var sz = 9;
var dp = new Array(1 << sz);
var bestMove = new Array(1 << sz);

for (let i = 0; i < (1 << sz); ++i) {
	dp[i] = new Array(1 << sz);
	bestMove[i] = new Array(1 << sz);
	for (let j = 0; j < (1 << sz); ++j) {
		dp[i][j] = new Array(2);
		bestMove[i][j] = new Array(2);
		for (let k = 0; k < 2; ++k) {
			dp[i][j][k] = -1;
			bestMove[i][j][k] = new Array(2);
			for (let d = 0; d < 2; ++d) {
				bestMove[i][j][k][d] = -1;
			}
		}
	}
}

var gameState = new Array(3);
for (let i = 0; i < 3; ++i) {
	gameState[i] = new Array(3);
	for (let j = 0; j < 3; ++j) {
		gameState[i][j] = -1;
	}
}

var ids = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8]
];

var friendBtn = document.getElementById('friendBtn');
var computerBtn = document.getElementById('computerBtn');
var offlineBtn = document.getElementById('offlineBtn');
var currentMoveNoti = document.getElementById('currentMoveNoti');
var restart = document.getElementById('restart');



function disableAllButton(c) {
	for (let i = 0; i < 9; ++i) {
		document.getElementById(String(i)).style.pointerEvents = c;
	}
}

window.onload = function () {
	//computerMove();
	for (let i = 0; i < 9; ++i) {
		document.getElementById(String(i)).style.pointerEvents = "none";
	}
}

restart.addEventListener('click', function () {
	disableAllButton("none");
	for (let i = 0; i < 9; ++i) {
		document.getElementById(String(i)).innerHTML = '';
	}
	playerOneMove = 1;
	playingWithComputer = 0;
	computerGoesFirst = 0;
	TotalDone = 0;
	currentMoveNoti.innerHTML = 'Start New Game';
	computerBtn.disabled = false;
	offlineBtn.disabled = false;
});


function getCookie(cookieName) {
	cookieName += "="; 
	cookies = document.cookie.split(';');
	let res;
	cookies.forEach((c) => {
		console.log(c);
		if (c.indexOf(cookieName) === 0) {
			res = c.substring(cookieName.length); 
		}
	});
	return res;
}

function setCookie(cName, value) {
	cName += "="; 
	let cookies = document.cookie.split(';');
	let res;
	cookies.forEach((c) => {
		let index = c.indexOf(cName);
		if (index === 0) {
			cookieUpdate(cName, "", 0);
			cookieUpdate(cName, value);
		}
	});
}


function cookieUpdate(cname, cvalue, exdays = 1) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + cvalue + ";" + expires + ";path=/";
}


function clearAllCookie() {
	let cookies = document.cookie.split(";");
	cookies.forEach((c) => {
		let index = c.indexOf("=");
		let cookieName = c.substring(0, index + 1);
		//console.log(cookieName);
		cookieUpdate(c, "", 0);
	});
}

//disable all button
function diableAll() {
	friendBtn.disabled = true;
	computerBtn.disabled = true;
	offlineBtn.disabled = true;
}

//offline play
offlineBtn.addEventListener('click', function () {
	//console.log('offlineBtn is clicked');
	diableAll();
	for (let i = 0; i < 9; ++i) {
		document.getElementById(String(i)).style.pointerEvents = "auto";
	}
  currentMoveNoti.innerHTML = 'Player 1 to move...';
  //currentMoveNoti.style.visibility = 'visible';
  setCookie("move", 1);
  console.log(document.cookie);
  playerOneMove = 1;
}); 

//computer play
computerBtn.addEventListener('click', function () {
	if (!confirm(`Do you want to go first?\n(You can try, but the best you can do is not lose.)`)) {
		computerGoesFirst = 1;
		//currentMoveNoti.style.visibility = 'visible';
		currentMoveNoti.innerHTML = 'You are O';
	}else {
		//currentMoveNoti.style.visibility = 'visible';
		currentMoveNoti.innerHTML = 'You are X';
	}
	playingWithComputer = 1;
	diableAll();
	for (let i = 0; i < 9; ++i) {
		document.getElementById(String(i)).style.pointerEvents = "auto";
	}
	if (computerGoesFirst) {
		rec(0, 0, computerGoesFirst);
		let x = bestMove[0][0][1][0];
		let y = bestMove[0][0][1][1];
		let index = getId(x, y);
    TotalDone += 1;
    document.getElementById(String(index)).style.pointerEvents = "none";
		document.getElementById(index).innerHTML = 'X';
	}
});


for (let cellId = 0; cellId < 9; ++cellId) {

	document.getElementById(cellId).addEventListener('click', function () {

		const currCell = document.getElementById(cellId);


		if (playingWithComputer) {
			computerPlay(cellId);
			return ;
		}

		document.getElementById(String(cellId)).style.pointerEvents = "none";


		if (playerOneMove) {
			currCell.innerHTML = 'X';
		}else {
			currCell.innerHTML = 'O';
		}


		//did someone win 
		if (didSomeoneWin(playerOneMove)) {
			return gameOverFun();
		}else {
			playerOneMove = (playerOneMove == 1) ? 0 : 1;
		}
		if (playerOneMove) {
			currentMoveNoti.innerHTML = 'Player 1 to move...';
		}else {
			currentMoveNoti.innerHTML = 'Player 2 to move...';
		}
		TotalDone += 1;
		currCell.disabled = true;
    if (TotalDone === sz) {
      gameTie();
    }
	});
}

function gameTie() {
  alert('Game has ended in a tie');
  currentMoveNoti.innerHTML = 'Tie';
  TotalDone = 0;
}



//what to do when game is over
function gameOverFun() {
	if (playerOneMove) {
		currentMoveNoti.innerHTML = 'Player 1 Wins'
		alert('game is over 1 won');
	}else {
		currentMoveNoti.innerHTML = 'Player 2 Wins'
		alert('game is over 2 won');
	}
	playerOneMove = 1;
	disableAllButton("none");
}

//getting the text in the div
function getText(id) {
	return String(document.getElementById(id).innerHTML).toLowerCase();
}


//checking if someone won
function didSomeoneWin(move) {
	let win = false;

	//left to right

	for (let i = 0; i < 3; ++i) {
		win = win | checkingWin(i, 0, 0, 1, move);
	}

	//top to bottom
	for (let j = 0; j < 3; ++j) {
		win = win | checkingWin(0, 1, j, 0, move);
	}

	//diagonals
	win = win | checkingWin(0, 1, 0, 1, move);
	win = win | checkingWin(2, -1, 0, 1, move);

	return win;
}

//getting the id
function getId(i, j) {
	return ids[i][j];
}


//logic for checking win
function checkingWin(a, addA, b, addB, move) {
	let cCheck = (move === 1)?'x':'o';
	let i = a;
	let j = b;
	let cnt = 0;


	while (i >= 0 && i < 3 && j >= 0 && j < 3) {
		let cellId = getId(i, j);
		if (getText(cellId) === cCheck || gameState[i][j] === move) {
			cnt++;
		}
		i += addA;
		j += addB;
	}

	return (cnt === 3); 
}



function computerPlay(Id) {
	let playerGoesFirst = (computerGoesFirst === 1) ? 0 : 1;
	if (playerGoesFirst) {
		document.getElementById(Id).innerHTML = 'X';
	}else {
		document.getElementById(Id).innerHTML = 'O';
	}
  TotalDone += 1;
  if (TotalDone === sz) {
    gameTie();
    return ;
  }
	if (didSomeoneWin(playerGoesFirst)) {
		currentMoveNoti.innerHTML = 'You Won';
		disableAllButton("none");
		return alert('game is over you won');
	}
  
  document.getElementById(String(Id)).style.pointerEvents = "none";

	let a = 0;
	let b = 0;

	for (let i = 0; i < 3; ++i) {
		for (let j = 0; j < 3; ++j) {
			let index = getId(i, j);
			if (getText(index) === 'x') {
				a += (1 << index);
				gameState[i][j] = 1;
			}else if (getText(index) === 'o') {
				gameState[i][j] = 0;
				b += (1 << index);
			}else {
				gameState[i][j] = -1;
			}
		}
	}



	rec(a, b, computerGoesFirst);

	let x = bestMove[a][b][computerGoesFirst][0];
	let y = bestMove[a][b][computerGoesFirst][1];

	if (x === -1) {
		if (gameState[1][1] == -1) {
			x = 1;
			y = 1;
		}else {
			for (let i = 0; i < 3; ++i) {
				for (let j = 0; j < 3; ++j) {
					if (gameState[i][j] == -1) {
						x = i;
						y = j;
					}
				}
			}
		}
	}

	let index = getId(x, y);

  document.getElementById(String(index)).style.pointerEvents = "none";
	if (computerGoesFirst) {
		document.getElementById(index).innerHTML = 'X';
	}else {
		document.getElementById(index).innerHTML = 'O';
	}
	TotalDone += 1;
  //console.log(TotalDone);
  if (TotalDone === sz) {
    gameTie();
    return ;
  }

	if (didSomeoneWin(computerGoesFirst)) {
		currentMoveNoti.innerHTML = 'Computer Won';
		disableAllButton("none");
		return alert('game is over computer won');
	}

}

function rec(a, b, move) {
	let notMove = (move == 1)?0:1;

	if ((a | b) === ((1 << sz) - 1)) {
		return 2;
	}

	if (didSomeoneWin	(notMove)) {
		dp[a][b][move] = notMove;
		return dp[a][b][move];
	}

	if (dp[a][b][move] !== -1) {
		return dp[a][b][move];
	}

	let res = notMove;
	let x_pos;
	let y_pos;
	let x_pos_2 = -1;
	let y_pos_2 = -1;

	for (let i = 0; i < 3; ++i) {
		for (let j = 0; j < 3; ++j) {
			if (gameState[i][j] === -1) {

				gameState[i][j] = move;

				let index = getId(i, j);
				let w;

				if (move === 1) {
					w = rec(a + (1 << index), b, notMove); 
				}else {
					w = rec(a, b + (1 << index), notMove);
				}

				gameState[i][j] = -1;

				if (move === w) {
					x_pos = i;
					y_pos = j;
					res = move;
				}
				if (w == 2) {
					x_pos_2 = i;
					y_pos_2 = j;
				}
			}
		}
	}
	if (res !== move && x_pos_2 != -1) {
		res = 2;
	}
	dp[a][b][move] = res;
	if (move === res) {
		bestMove[a][b][move] = [x_pos, y_pos];
	}else {
		if (x_pos_2 !== -1) {
			bestMove[a][b][move] = [x_pos_2, y_pos_2];
		}
	}
	return res;
}
