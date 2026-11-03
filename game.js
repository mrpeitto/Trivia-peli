const CATEGORIES = [
    { id: "maantieto", name: "Maantieto" },
    { id: "yleistieto", name: "Yleistieto" },
    { id: "historia", name: "Historia" },
    { id: "taide ja kulttuuri", name: "Taide ja kulttuuri" },
    { id: "tiede", name: "Tiede" },
    {id: "urheilu", name: "Urheilu"}
]

const gameState = {
    player: {
        name: "Player",
        position: 0,
        collectedCategories: new Set()
    },
    computer: {
        name: "Chatgpt",
        position: 0,
        collectedCategories: new Set()
    },
    currentTurn: "player"
};

var API_URL = "https://oma-trivia-api-0f8ffa1eed2e.herokuapp.com/api/questions";

const BOARD_SIZE = 18
const boardElement = document.querySelector("#board")
const rollButtonElement = document.querySelector("#rollButton")
const dieboxElement = document.querySelector("#diebox")
var playerQuestionText = document.querySelector("#question-text")

rollButtonElement.addEventListener("click", RollDie)
CreateBoard();

function CreateBoardCoordinates() {
    const coordinates = [];

    for (let column = 1; column <= 7; column += 1 ) {
        coordinates.push( { row: 1, column})
    }
    for (let row = 2; row <= 4; row += 1) {
        coordinates.push( { row, column: 7})
    }
    for (let column = 6; column >= 1; column -= 1) {
        coordinates.push( { row: 4, column})
    }
    for (let row = 3; row >= 2; row -= 1) {
        coordinates.push( { row, column: 1})
    }

    return coordinates;
}


function CreateBoard() {
    const coordinates = CreateBoardCoordinates();
    boardElement.innerHTML = ""

    for (let index = 0; index < BOARD_SIZE; index += 1)
    {
        const category = CATEGORIES[index % CATEGORIES.length] 
        const coordinate = coordinates[index]

        const newSpace = document.createElement("div");

        newSpace.className = "Space";

        newSpace.style.gridColumn = coordinate.column;
        newSpace.style.gridRow = coordinate.row;

        newSpace.dataset.category = category.id;

        newSpace.textContent = category.name;
        newSpace.dataset.spaceIndex = index;
        boardElement.append(newSpace);
    }
}

function RollDie() {
    let diceResult = Math.floor( Math.random() * 6)+1; 

    dieboxElement.textContent = diceResult;

    gameState.player.position = (gameState.player.position + diceResult) % BOARD_SIZE;

    updateTokens();

    var currentCategory = CATEGORIES[gameState.player.position % CATEGORIES.length];

    getQuestion(currentCategory.id);
}

function updateTokens(){
    document.querySelectorAll(".token").forEach( (token) =>{
        token.remove();
    } );
    var currentSpace = document.querySelector(`[data-space-index="${gameState.player.position}"]`)
    var token = document.createElement("token");
    token.textContent = "p";
    token.className = "token";
    currentSpace.append(token);
}

async function getQuestion(targetCategory) {
    var response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "category": targetCategory,
            "difficulty": "keskitaso",
            "ageGroup": "13-15",
            "count": 1,
            "language": "suomi"
        })

    });

    var data = await response.json();
    console.log(data)
    console.log(data[0])

}