var ClozeCard = require("./ClozeCard.js");
var BasicCard = require("./BasicCard.js");
var inquirer = require("inquirer");
var cards;
var placeHolder;
var shuffledCards;
var basic;
var cloze;
var shuffledBasic;
var shuffledCloze;
var prettyLines = "===============================================================================================\n";
var score = 0;
var playCount;

function cardPush() {
    cards = [];
    basic = [];
    cloze = [];
    shuffledCards = [];
    shuffledBasic = [];
    shuffledCloze = [];

    cloze.push(ClozeCard("Vitis Vinifera is the species of grape used for making wine.", "Vitis Vinifera"));
    cloze.push(ClozeCard("Mutage fermentation is when fermentation is stopped early by the addition of alcohol before the must has fermented out all the sugar.", "Mutage fermentation"));
    cloze.push(ClozeCard("Pinot Grigio is a dry, crisp, white wine, comes from Venezia, Italy.", "Pinot Grigio"));
    cloze.push(ClozeCard("Sauvignon Blanc is one of the most popular white wines grown worldwide, originated in Bordeaux, France", "Sauvignon Blanc"));
    cloze.push(ClozeCard("Chardonnay is a dry, citrus flavored, wide-bodied white wine, originated in Burgundy, France.", "Chardonnay"));
    basic.push(BasicCard("A sweet dessert wine that comes from Piedmont, Italy", "Moscato"));
    cloze.push(ClozeCard("Syrah is a type of black grape that produces full-bodied wines with lots of tannins, and an abundance of fruit flavors.", "Syrah"));
    cloze.push(ClozeCard("Merlot is a wine that originates from Bordeaux in France. It produces a variety of middle bodied flavors, most typically black cherry.", "Bordeaux"));
    cloze.push(ClozeCard("Cabernet Sauvignon is a blend of Merlot and Cabernet Franc that is full bodied, typically aged in oak. Although it originates in France, it is now grown worldwide.", "Cabernet Sauvignon"));
    cloze.push(ClozeCard("Pinot Noir is a red wine grape that is difficult to grow. It has a fresh, delicate flavor of earth, dark fruits, leather, and light tannins. It originated in Burgundy, France, but grows well in the Pacific Northwest.", "Pinot Noir"));

}

function shuffle(array) {
    // placeHolder = cards;
    while (placeHolder.length > 0) {
        var randomIndex = placeHolder[Math.floor(Math.random() * placeHolder.length)];
        shuffledCards.push(randomIndex);
        placeHolder.splice(placeHolder.indexOf(randomIndex), 1);
    }
}

function gameStart() {
    console.log(prettyLines);
    inquirer.prompt([{
        type: "list",
        message: "Welcome to the Sommelier Study game. Would you like to play with basic cards or cloze cards?",
        choices: ["Basic", "Cloze", "Both"],
        name: "gameType"
    }]).then(function(response) {
        var switchCase = response.gameType;
        switch (switchCase) {
            case "Basic":
                console.log(`${prettyLines}You've chosen ${response.gameType}.\n${prettyLines}`);
                cardPush();
                placeHolder = basic;
                shuffle(basic);
                playCount = shuffledCards.length - 1;
                nextQuestion();
                break;
            case "Cloze":
                console.log(`${prettyLines}You've chosen ${response.gameType}.\n${prettyLines}`);
                cardPush();
                placeHolder = cloze;
                shuffle(cloze);
                playCount = shuffledCards.length - 1;
                nextQuestion();
                break;
            case "Both":
                console.log(`${prettyLines}You've chosen ${response.gameType}.\n${prettyLines}`);
                cardPush();
                cards = cloze.concat(basic);
                placeHolder = cards;
                shuffle(cards);
                playCount = shuffledCards.length - 1;
                nextQuestion();
                break;
        }
    })
}
function nextQuestion() {
    // console.log("Play count: " + playCount)
    // console.log(`${prettyLines}Next Question:\n${prettyLines}`);
    if (playCount > -1) {
        if (shuffledCards[playCount].partial == null) {
            // console.log(shuffledCards[playCount].back)
            inquirer.prompt([{
                type: "input",
                message: "'" + shuffledCards[playCount].front + "'",
                name: "question",
            }]).then(function(response) {
                if (response.question === shuffledCards[playCount].back) {
                    console.log(`${prettyLines}Correct!`);
                    playCount--;
                    score++;
                    nextQuestion();
                } else {
                    console.log(`${prettyLines}Incorrect.\nThe correct answer was ${shuffledCards[playCount].back}`);
                    playCount--;
                    nextQuestion();
                }
            })
        } else {
            // console.log(shuffledCards[playCount].cloze)
            inquirer.prompt([{
                type: "input",
                message: shuffledCards[playCount].partial,
                name: "question",
            }]).then(function(response) {
                if (response.question === shuffledCards[playCount].cloze) {
                    console.log(`${prettyLines}Correct!`);
                    playCount--;
                    score++;
                    nextQuestion();
                } else {
                    console.log(`${prettyLines}Incorrect.\nThe correct answer was ${shuffledCards[playCount].cloze}`);
                    playCount--;
                    nextQuestion();
                }
            })
        }
    } else if (playCount === -1) {
        inquirer.prompt([{
            type: "confirm",
            message: `You scored ${score} of ${shuffledCards.length} correct. Play Again?`,
            name: "playAgain"
        }]).then(function(response) {
            if (response.playAgain === true) {
                score = 0;
                playCount = 0;
                gameStart();
            } else {
                console.log(`${prettyLines}Well get the fuck outta here then.\n${prettyLines}`)
            }
        })
    }
}
gameStart()
