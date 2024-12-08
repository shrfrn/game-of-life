'use strict'

const ROWS = 5
const COLS = 5

const SMALLEST_NUMBER = 1
const LARGEST_NUMBER = 100

const gPlayers = [
	{ name: 'Mebahem', card: createCard(ROWS, COLS) },
	{ name: 'Alberg' , card: createCard(ROWS, COLS) },
	{ name: 'Zilber' , card: createCard(ROWS, COLS) },
	{ name: 'Shaul', card: createCard(ROWS, COLS) },
	{ name: 'Leybovich' , card: createCard(ROWS, COLS) },
	{ name: 'Abram' , card: createCard(ROWS, COLS) },
]

var gListNumbersInRange = initArray(SMALLEST_NUMBER, LARGEST_NUMBER)

var gGameInterval = null

function onToggleGame() {
	// if there is a winning table, remove red border
	const elTables = document.querySelectorAll(`.bingo-table`)
	elTables.forEach(table => table.classList.remove('table-winner'))
	
	// if there is a winner empy the winners div
	const elWinnersDiv = document.querySelector('div.winners')
	elWinnersDiv.innerHTML = ''

    const elBtn = document.querySelector('button')
    
    if (gGameInterval) {
        clearInterval(gGameInterval)
        gGameInterval = null
        elBtn.innerText = 'Resume Game'
    } else {
        gGameInterval = setInterval(startBingo, 300)
        elBtn.innerText = 'Pause Game'
    }
}

function shuffle(array) {
	let currentIndex = array.length

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		let randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--

		// And swap it with the current element.
		;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
	}
	return array
}

function initArray(from, to) {
	var nums = []

	for (var i = from; i <= to; i++) {
		nums.push(i)
	}
	return shuffle(nums)
}

function createCard(rows, cols) {
	var card = []
	var numbers = initArray(SMALLEST_NUMBER, LARGEST_NUMBER)

	for (var i = 0; i < rows; i++) {
        card[i] = []
		for (var j = 0; j < cols; j++) {
			card[i][j] = { value: numbers.pop(), isHit: false }
		}
	}
	return card
}

function getUniqueRandom(preDefinedList) {
	return preDefinedList.pop()
}

function createTableWithHeader(name) {
	// Create the table element
	const elTableContainer = document.querySelector(`.tbl-container`)
	const elTitle = document.createElement('div')
	const elTable = document.createElement('table')
	elTitle.innerText = name
	elTitle.classList.add('table-title')
	elTableContainer.appendChild(elTitle)
	elTableContainer.appendChild(elTable)
	elTable.id = name
	elTable.classList.add('bingo-table')

	// Create and insert the header row
	// const elTableHeader = elTable.createTHead()
	// const elHeaderRow = elTableHeader.insertRow(0)
	// const elHeaderCell = elHeaderRow.insertCell(0)
	// elHeaderCell.textContent = name
	
	return elTable
}
	
function renderCard(card, playerName) {
	var elTable = document.querySelector(`.bingo-table#${playerName}`)
	if (!elTable) elTable = createTableWithHeader(playerName)
    var strHtml = ''

	for (var i = 0; i < card.length; i++) {
		strHtml += '\n<tr>'
		for (var j = 0; j < card[i].length; j++) {
			const classStr = card[i][j].isHit ? 'number-hit' : ''
			strHtml += `\n\t<td class="${classStr}">${card[i][j].value}</td>`
		}
		strHtml += '\n</tr>'
	}
	elTable.innerHTML = strHtml				
}

function markCard(card, number) {
	var currentNumber = null

	for (var i = 0; i < card.length; i++) {
		const row = card[i]
		for (var j = 0; j < row.length; j++) {
			currentNumber = row[j].value
			if (currentNumber === number) return (row[j].isHit = true)
		}
	}
}

function isBingo(card, i, j) {
	if (checkRows(card, i) || checkCols(card, j) || checkDiag(card)) return true

	return false
}

function checkRows(card) {
	for (var i = 0; i < card.length; i++) {
		var row = card[i]
		if (row.every(cell => cell.isHit)) {
			console.log(`Bingo found on row ${i}`)
			return true
		}
	}
	return false
}

function checkCols(card) {
	for (var i = 0; i < card.length; i++) {
		var col = []
		for (var j = 0; j < card.length; j++) {
			const row = card[j]
			col.push(row[i])
		}
		if (col.every(cell => cell.isHit)) {
			console.log(`Bingo found on col ${i}`)
			return true
		}
	}
	return false
}

function checkDiag(card) {
	for (var i = 0; i < card.length; i++) {
		if (!card[i][i].isHit) return false
	}
	return true
}

function startBingo() {
	var isStopGame = playTurn()
    
    if (isStopGame) {
        clearInterval(gGameInterval)
        gGameInterval = null
	}
}

function resetGame(isStopGame){
	if (!isStopGame) return	
	// reset text on button
	const elBtn = document.querySelector('button')
	elBtn.innerText = 'Re-Start Game'
	
	// re-initialize card for all players
	for (var i=0; i<gPlayers.length;i++){
		gPlayers[i].card = createCard(ROWS, COLS)
	}

	// reinitialize the number draw list
	gListNumbersInRange = initArray(SMALLEST_NUMBER, LARGEST_NUMBER)

	// reset interval
	clearInterval(gGameInterval)
    gGameInterval = null
}

function playTurn() {
	var currentNumber = getUniqueRandom(gListNumbersInRange)
	var isCurrentPlayerWinning = false
	var isStopGame = false
	
	for (var i = 0; i < gPlayers.length; i++) {
		const currentPlayer = gPlayers[i]
		const card = currentPlayer.card

		markCard(currentPlayer.card, currentNumber)
		isCurrentPlayerWinning = isBingo(card)
		renderAllChanges(currentNumber, currentPlayer, isCurrentPlayerWinning)
		if (isCurrentPlayerWinning) isStopGame = isCurrentPlayerWinning
	}
	if (isStopGame) resetGame(isStopGame)
	return isStopGame
}

function renderAllChanges(number, player, isWinner){
	// render drawn number
	renderDrawnNumber(number)
	// render card
	// ! renderCard can just take player
	renderCard(player.card, player.name)
	// render winner
	appendWinner(player, isWinner)
	markWinnerTable(player.name, isWinner)
}

function markWinnerTable(name, isWinner){
	if (!isWinner) return
	const elTable = document.querySelector(`.bingo-table#${name}`)
	elTable.classList.add('table-winner')
}

function appendWinner(winner, isWinner) {
	if (!isWinner) return
	const elWinnersDiv = document.querySelector('div.winners')
	const elCurrentWinner = document.createElement('div')
	elCurrentWinner.innerText = `Player ${winner.name} is a winner !!!`
	elWinnersDiv.appendChild(elCurrentWinner)
}

function renderDrawnNumber(number){
	const elCalledNumber = document.querySelector('div.called-number')
	elCalledNumber.innerText = number
}