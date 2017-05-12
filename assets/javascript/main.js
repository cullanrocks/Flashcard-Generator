var ClozeCard = require("./ClozeCard.js");
var BasicCard = require("./BasicCard.js");
var inquirer = require("inquirer");
// var $ = require("jquery")(require("jsdom").jsdom().parentWindow);
// $("#header").HTML("What is crackin");
var switchCase;
var cards = [];
var basic = [];
var cloze =[];
var placeHolder = [];
var shuffledCards = [];
var score = 0;
var playCount;
var prettyLines = "===============================================================================";

function gameStart() {
    console.log(prettyLines);
    inquirer.prompt([{
        type: "list",
        message: `Welcome to the Sommelier Study game. Would you like to play with basic cards or cloze cards?\n${prettyLines}\n`,
        choices: ["Basic", "Cloze", "Both"],
        name: "gameType"
    }]).then(function(response) {
        switchCase = response.gameType;
        switch (switchCase) {
            case "Basic":
                cardPush();
                placeHolder = basic;
                shuffle(basic);
                nextQuestion();
                break;
            case "Cloze":
                cardPush();
                placeHolder = cloze;
                shuffle(cloze);
                nextQuestion();
                break;
            case "Both":
                cardPush();
                cards = cloze.concat(basic);
                placeHolder = cards;
                shuffle(cards);
                nextQuestion();
                break;
        }
    })
}

function cardPush() {
    console.log(`${prettyLines}\nYou've chosen ${switchCase}.\n${prettyLines}`);
    cloze.push(ClozeCard(`Vitis Vinifera is the species of grape used for making wine.\n.${prettyLines}\n`, "Vitis Vinifera"));
    cloze.push(ClozeCard(`Mutage fermentation is when fermentation is stopped early by the addition of alcohol before the must has fermented out all the sugar.\n${prettyLines}\n`, "Mutage fermentation"));
    cloze.push(ClozeCard(`Pinot Grigio is a dry, crisp, white wine, comes from Venezia, Italy.\n${prettyLines}\n`, "Pinot Grigio"));
    cloze.push(ClozeCard(`Sauvignon Blanc is one of the most popular white wines grown worldwide, originated in Bordeaux, France\n${prettyLines}\n`, "Sauvignon Blanc"));
    cloze.push(ClozeCard(`Chardonnay is a dry, citrus flavored, wide-bodied white wine, originated in Burgundy, France.\n${prettyLines}\n`, "Chardonnay"));
    basic.push(BasicCard(`A sweet dessert wine that comes from Piedmont, Italy`, "Moscato"));
    cloze.push(ClozeCard(`Syrah is a type of black grape that produces full-bodied wines with lots of tannins, and an abundance of fruit flavors.\n${prettyLines}\n`, "Syrah"));
    cloze.push(ClozeCard(`Merlot is a wine that originates from Bordeaux in France. It produces a variety of middle bodied flavors, most typically black cherry.\n${prettyLines}\n`, "Bordeaux"));
    cloze.push(ClozeCard(`Cabernet Sauvignon is a blend of Merlot and Cabernet Franc that is full bodied, typically aged in oak. \nAlthough it originates in France, it is now grown worldwide.\n${prettyLines}\n`, "Cabernet Sauvignon"));
    cloze.push(ClozeCard(`Pinot Noir is a red wine grape that is difficult to grow. It has a fresh, delicate flavor of earth, dark fruits, leather, and light tannins. \nIt originated in Burgundy, France, but grows well in the Pacific Northwest.\n${prettyLines}\n`, "Pinot Noir"));
}

function shuffle(array) {
    while (placeHolder.length > 0) {
        var randomIndex = placeHolder[Math.floor(Math.random() * placeHolder.length)];
        shuffledCards.push(randomIndex);
        placeHolder.splice(placeHolder.indexOf(randomIndex), 1);
        playCount = shuffledCards.length - 1;
    }
}

function nextQuestion() {
    if (playCount > -1) {
        if (shuffledCards[playCount].partial == null) {
            inquirer.prompt([{
                type: "input",
                message: "'" + shuffledCards[playCount].front + "'",
                name: "question",
            }]).then(function(response) {
                if (response.question.toLowerCase() === shuffledCards[playCount].back.toLowerCase()) {
                    console.log(`${prettyLines}\nCorrect!\n${prettyLines}\n`);
                    playCount--;
                    score++;
                    nextQuestion();
                } else {
                    console.log(`${prettyLines}\nIncorrect.\nThe correct answer was ${shuffledCards[playCount].back}\n${prettyLines}\n`);
                    playCount--;
                    nextQuestion();
                }
            })
        } else {
            inquirer.prompt([{
                type: "input",
                message: shuffledCards[playCount].partial,
                name: "question",
            }]).then(function(response) {
                if (response.question.toLowerCase() === shuffledCards[playCount].cloze.toLowerCase()) {
                    console.log(`${prettyLines}\nCorrect!\n${prettyLines}\n`);
                    playCount--;
                    score++;
                    nextQuestion();
                } else {
                    console.log(`${prettyLines}\nIncorrect.\nThe correct answer was ${shuffledCards[playCount].cloze}\n${prettyLines}\n`);
                    playCount--;
                    nextQuestion();
                }
            })
        }
    } else if (playCount === -1) {
        inquirer.prompt([{
            type: "confirm",
            message: `You scored ${score} of ${shuffledCards.length} correct. Play Again?\n${prettyLines}\n`,
            name: "playAgain"
        }]).then(function(response) {
            if (response.playAgain === true) {
                score = 0;
                playCount = 0;
                gameStart();
            } else {
                console.log(`${prettyLines}\nWell get the fuck outta here then.\n${prettyLines}\n`)
            }
        })
    }
}

gameStart()