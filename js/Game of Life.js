'use strict'

const ROWS = 12
const COLS = 12

const LIFE = '😀'

var gNumOfGeneretions = 30

var gGrid = createGrid(ROWS, COLS)
var gGameInterval = null

function onToggleGame() {
    const elBtn = document.querySelector('button')
    
    if (gGameInterval) {
        clearInterval(gGameInterval)
        gGameInterval = null
        elBtn.innerText = 'Resume Game'
    } else {
        gGameInterval = setInterval(playTurn, 1000)
        elBtn.innerText = 'Pause Game'
    }
}

function createGrid(rows, cols) {
	var grid = []

	for (var i = 0; i < rows; i++) {
		grid[i] = []
		for (var j = 0; j < cols; j++) {
			grid[i][j] = Math.random() > .5 ? ' ' : LIFE
		}
	}
	return grid
}

function renderGrid() {
    const elTable = document.querySelector('table')
    var strHtml = ''

	for (var i = 0; i < gGrid.length; i++) {
        strHtml += `\n<tr>`
		for (var j = 0; j < gGrid[i].length; j++) {
            const classStr = gGrid[i][j] === LIFE ? 'occupied' : ''
            strHtml += `\n\t<td class="${classStr}">${gGrid[i][j]}</td>`
        }
        strHtml += `\n</tr>`
	}
    elTable.innerHTML = strHtml
	console.table(gGrid)
}

function getNextState(grid) {
	var nextState = []

	for (var i = 0; i < grid.length; i++) {
		nextState[i] = []
		for (var j = 0; j < grid[i].length; j++) {
			var negs = countNeighbors(grid, i, j)
			if (negs === 3 || (grid[i][j] && negs === 2)) {
				nextState[i][j] = LIFE
			} else {
                nextState[i][j] = ' '
			}
		}
	}
	return nextState
}

function playTurn() {
	var newGrid = []
	newGrid = getNextState(gGrid)
	renderGrid(newGrid)
	gGrid = newGrid
}

function countNeighbors(grid, x, y) {
    var negCount = 0

	for (var i = x - 1; i <= x + 1; i++) {
        if (i < 0 || i >= grid.length) continue
		for (var j = y - 1; j <= y + 1; j++) {
            if (j < 0 || j >= grid[i].length) continue
			if (i === x && j === y) continue
			if (grid[i][j] === LIFE) negCount++
		}
	}
	return negCount
}


// function isDead(grid) {
//     for (let i = 0; i < grid.length; i++) {
//         for (let j = 0; j < grid[i].length; j++) {
//             if (grid[i][j]) return false
// 		}
// 	}
// 	return true
// }

// function stopGame(grid) {
// 	gNumOfGeneretions--
// 	if (gNumOfGeneretions === 0 || isDead(grid)) clearInterval(gGameInterval)
// }
// function getRandomInt(min, max) {
// 	if (min === max) return min
// 	const minCeiled = Math.ceil(min)
// 	const maxFloored = Math.floor(max)
// 	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
// }

