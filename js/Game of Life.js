'use strict'

const ROWS = 12
const COLS = 12

const EMPTY = ' '
const LIFE = '😀'
const SUPER_LIFE = '🍕'

// var gNumOfGeneretions = 30

var gGrid = createGrid(ROWS, COLS)
var gGameInterval = null

function onToggleGame() {
    const elBtn = document.querySelector('button')
    
    if (gGameInterval) {
        clearInterval(gGameInterval)
        gGameInterval = null
        elBtn.innerText = 'Resume Game'
    } else {
        gGameInterval = setInterval(playTurn, 2000)
        elBtn.innerText = 'Pause Game'
    }
}

function createGrid(rows, cols) {
	var grid = []

	for (var i = 0; i < rows; i++) {
		grid[i] = []
		for (var j = 0; j < cols; j++) {
			grid[i][j] = Math.random() > .5 ? EMPTY : LIFE
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
            strHtml += `\n\t<td 
                onclick="onCellClicked(this, ${i}, ${j})" 
                class="${classStr}" data-row="${i}" data-col="${j}">${gGrid[i][j]}</td>`
        }
        strHtml += `\n</tr>`
	}
    elTable.innerHTML = strHtml
	console.table(gGrid)
}

function onCellClicked(elCell, row, col) {
    
    if (gGrid[row][col] === LIFE) {

        // Model
        gGrid[row][col] = SUPER_LIFE
        
        // DOM
        elCell.innerText = SUPER_LIFE
        
        // Both Model and DOM
        blowupNegs(elCell, row, col)
    }
}

function blowupNegs(elCell, row, col) {
    
    for(var i = row - 1; i <= row + 1; i++){
        if (i < 0 || i >= gGrid.length) continue
        for(var j = col - 1; j <= col + 1; j++){
            if (j < 0 || j >= gGrid.length) continue
            if (i === row && j === col) continue

            // Model
            gGrid[i][j] = EMPTY

            // DOM
            const elCell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`)
            elCell.innerText = EMPTY
        }
    }
}

function getNextState(grid) {
	var nextState = []

	for (var i = 0; i < grid.length; i++) {
		nextState[i] = []
		for (var j = 0; j < grid[i].length; j++) {
			var negs = countNeighbors(grid, i, j)
            if (grid[i][j] === SUPER_LIFE) {
                nextState[i][j] = SUPER_LIFE
                continue
            }
			if (negs === 3 || (grid[i][j] === LIFE && negs === 2)) {
				nextState[i][j] = LIFE
			} else {
                nextState[i][j] = EMPTY
			}
		}
	}
	return nextState
}

function playTurn() {
	// var newGrid = []
	// newGrid = getNextState(gGrid)
	gGrid = getNextState(gGrid)
	renderGrid()
	// gGrid = newGrid
}

function countNeighbors(grid, x, y) {
    var negCount = 0

	for (var i = x - 1; i <= x + 1; i++) {
        if (i < 0 || i >= grid.length) continue
		for (var j = y - 1; j <= y + 1; j++) {
            if (j < 0 || j >= grid[i].length) continue
			if (i === x && j === y) continue
			if (grid[i][j] === LIFE || grid[i][j] === SUPER_LIFE) negCount++
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

