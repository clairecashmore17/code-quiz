// GLOBALS
//Counter to distinguish which quiz questions we are on.
var answerIdCounter = 0;
var quizIdCounter = 0;
var rightAnsInd = 0;
var wrongAnsIndex = 0;
var finish = false;
var scores = [];
var currentScores = localStorage.getItem("score");

// Variable for the event listener in main
var pageContentEl = document.querySelector("#page-content");

var startBtnEl = window.document.querySelector("#start-quiz");
//variable to listen to events in header

var headerButtonEl = document.querySelector("#scoreBtn");
var resultSectionEl = document.querySelector("#result-section");
var resultTextEl = document.querySelector("#result-text");
var questionEl = document.querySelector("#prompt");

var quizQuestionsEl = document.querySelector("#questions-list");
//object to store into localStorage at the end of each quiz
var scoreObj = {
    timeFunct: 0,
    percentage: 0,
    time: 0,
    name: ""

};
var questionObj = {
    questions: [
        "What HTML element do we put javascript into?",
        "What is the correct JavaScript syntax to write 'Hello World'?",
        "Where is the correct place to insert a JavaScript?",
        "How do you create a function?",
        "How do you call a function?"
    ],
    correctAns: [
        "<script>",
        "document.write('Hello World')",
        "Both the <head> section and the <body> section are correct",
        "function functionName() or var functioName = function()",
        "functionName(parameter);"

    ],
    wrongAns: [
        "<javascript>",
        "<js>",
        "<scripting>",
        "'Hello World'",
        "response.write('Hello World')",
        "write.('helloWorld)",
        "the <head> section",
        "the <body> section",
        "anywhere?",
        "function functionName()",
        "function = functionName();",
        "create.functionElement;",
        "call function",
        "function.invoke",
        "function.open"
    ]
};
// function to generate a random numeric value
var randomNumber = function (min, max) {
    var value = Math.floor(Math.random() * (max - min) + min);

    return value;
};

// function to create multiple choice buttons
function createMutlipleButtons(index, array, rightOrWrong) {
    var parentUlEl = document.querySelector("ul");
    var listChoiceEl = document.createElement("li");
    var listButtonEl = document.createElement("button");
    var randomIteration = randomNumber(0, 4);
    listButtonEl.textContent = array[index];
    listButtonEl.className = "btn";
    listChoiceEl.className = "question";
    //create singular right answer
    if (rightOrWrong) {
        listButtonEl.id = "question-right";
        //Randomly alter flex order.
        if (randomIteration === 1) {
            console.log("entered first if to set right answer at order 1");
            listChoiceEl.className = "question question-order-1";
        }
        else if (randomIteration === 2) {
            console.log("entered second if to set right answer at order 2");
            listChoiceEl.className = "question question-order-1";

        }
        else if (randomIteration === 3) {
            console.log("entered third if to set right answer at order 3");
            listChoiceEl.className = "question question-order-3";
        }
        console.dir(listButtonEl);
    }
    else if (!rightOrWrong) {
        listButtonEl.id = "question-wrong";
        listChoiceEl.className = "question";
        listButtonEl.setAttribute("ans-id", answerIdCounter);
        answerIdCounter++;
    }

    listChoiceEl.appendChild(listButtonEl);
    quizQuestionsEl.appendChild(listChoiceEl);


}
function replaceAnswers(index, array, rightOrWrong, buttonId) {

    var randomIteration = randomNumber(0, 4)
    //create singular right answer
    if (rightOrWrong) {

        var listButtonEl = document.querySelector("#question-right");
        listButtonEl.textContent = array[index];

    }


    else if (!rightOrWrong) {

        var listButtonEl = document.querySelector(".btn[ans-id='" + buttonId + "']");

        listButtonEl.textContent = array[index];
    }

}

function createNewQuestion(index) {

    //Change questions

    //replace the content of the question with the next prompt in the array of questionObj
    questionEl.textContent = questionObj.questions[index];
    //Create individual Id's for reach question
    questionEl.setAttribute("question-id", quizIdCounter);

    quizIdCounter++;



}

function removeAnswers(index, rightOrWrong, buttonId) {

    if (rightOrWrong) {

        var listButtonEl = document.querySelector("#question-right");
        listButtonEl.remove();

    }
    else if (!rightOrWrong) {

        var listButtonEl = document.querySelector(".btn[ans-id='" + buttonId + "']");

        listButtonEl.remove();
    }

}
function timerCount() {
    scoreObj.time++;
    document.querySelector("#shown-timer").textContent = "Time: " + scoreObj.time;
};
function checkEnd(targetEl) {
    if (quizIdCounter == 5) {
        if (targetEl.matches("#question-right")) {
            scoreObj.percentage++;
        }
        finish = true;
    }
}
// function to deal with buttons in main
function quizButtonHandler(event) {
    var targetEl = event.target;
    var right = true;
    var wrong = false;


    if (!finish) {

        if (targetEl.matches("#start-quiz")) {

            //**********start timer here*************
            //every one second, increase our time to act as a timer.
            scoreObj.timeFunct = setInterval(timerCount, 1000);
            // remove start prompt
            document.querySelector("#startExcerpt").remove();

            //remove start button
            startBtnEl.remove();

            createNewQuestion(rightAnsInd);
            createMutlipleButtons(rightAnsInd, questionObj.correctAns, right);
            rightAnsInd++;
            //use a for loop to create 3 wrong answers

            for (wrongAnsIndex; wrongAnsIndex < questionObj.questions.length - 2; wrongAnsIndex++) {
                createMutlipleButtons(wrongAnsIndex, questionObj.wrongAns, wrong);
            }
        }
        else if (targetEl.matches("#question-right")) {

            scoreObj.percentage++;

            resultTextEl.textContent = "Correct!";

            resultSectionEl.appendChild(resultTextEl);

            console.log("have clicked a right answer");

            // ********NEED TO ADD PAUSE HERE**********/

            //Next Question
            createNewQuestion(rightAnsInd);
            replaceAnswers(rightAnsInd, questionObj.correctAns, right);
            rightAnsInd++;
            var newLimit = wrongAnsIndex + 3;
            var buttonId = 0;

            for (wrongAnsIndex; wrongAnsIndex < newLimit; wrongAnsIndex++) {

                replaceAnswers(wrongAnsIndex, questionObj.wrongAns, wrong, buttonId);

                buttonId++;
            }
            checkEnd(targetEl);

        }
        else if (targetEl.matches("#question-wrong")) {

            scoreObj.time--;
            resultTextEl.textContent = "Incorrect!"

            resultSectionEl.appendChild(resultTextEl);
            console.log("have clicked a wrong answer");

            //Next Question
            //Next Question
            createNewQuestion(rightAnsInd);
            replaceAnswers(rightAnsInd, questionObj.correctAns, right);
            rightAnsInd++;
            var newLimit = wrongAnsIndex + 3;
            var buttonId = 0;

            for (wrongAnsIndex; wrongAnsIndex < newLimit; wrongAnsIndex++) {

                replaceAnswers(wrongAnsIndex, questionObj.wrongAns, wrong, buttonId);
                // console.log(questionObj.wrongAns[wrongAnsIndex]);
                buttonId++;
            }
            checkEnd(targetEl);
        }
    }
    else {
        //Finished game, remove our buttons and questions, display score.
        clearInterval(scoreObj.timeFunct);
        saveScore();
        console.log("You finished in " + scoreObj.time + " seconds");
        document.querySelector("#prompt").textContent = "You finished! Here are your stats:";
        resultSectionEl.remove();
        removeAnswers(rightAnsInd, right);
        for (i = 0; i < 3; i++) {

            removeAnswers(wrongAnsIndex, wrong, i);
        }
        var finalScoreEl = document.createElement("h2");



        var questionSectionEl = document.querySelector(".quiz-questions-wrapper");
        finalScoreEl.className = "finalScore";
        finalScoreEl.textContent = "You answered " + scoreObj.percentage + "/" + questionObj.questions.length + " correctly.";
        //Ask for users initials
        createSubmitName(questionSectionEl);

        questionSectionEl.appendChild(finalScoreEl);
    }
};
//Function to create the submit button for name
function createSubmitName(parentNode) {
    var nameInput = document.createElement("input");
    var nameSubmit = document.createElement("input");
    nameInput.setAttribute('type', 'text');
    nameInput.id = "name";
    nameInput.placeholder = "Enter your initials";
    nameSubmit.setAttribute('type', 'submit');

    nameSubmit.addEventListener("click", saveName);

    parentNode.appendChild(nameInput);
    parentNode.appendChild(nameSubmit);
}
//After submit button has been pressed, save name
function saveName() {
    var inputVal = document.getElementById("name").value;
    scoreObj.name = inputVal;

}

//Function to save score to localStorage
function saveScore() {
    //Score array score
    //scoreobj with a name. time. and percentage
    //store the scoreobj into a new array each time.



    // if(currentScores === null){
    //     window.alert("You are the first to score!");
    localStorage.setItem("score", JSON.stringify(scores[0] = scoreObj));
    // }
    // else {
    //     var currentHighScore = currentScores[0];
    //     var listLength = currentScores.length;
    //     console.log(listLength);
    // }

};

//function to deal with buttons in header
function headerButtonHandler(event) {

    pageContentEl.remove();
    var bodyEl = document.querySelector("body");
    var scoresPageContentEl = document.createElement("div");
    scoresPageContentEl.className = "page-content";
    var scoreTitle = document.createElement("h2");
    scoreTitle.className = "prompt";
    scoreTitle.textContent = "Highscores: ";
    var scoreList = document.createElement("ul");
    scoreList.className = "scoreList";

    bodyEl.appendChild(scoresPageContentEl);
    scoresPageContentEl.appendChild(scoreTitle);
    scoresPageContentEl.appendChild(scoreList);

    if (currentScores === null) {
        console.log("There are no scores yet");
    }
    else {
        for (i = 0; i < currentScores.length; i++) {
            var scoreEl = document.createElement("li")
            scoreEl.textContent = score.name + " : " + score.percentage;
        }
        scoreList.appendChild(scoreEl);
    }






};

pageContentEl.addEventListener("click", quizButtonHandler);
headerButtonEl.addEventListener("click", headerButtonHandler);
console.dir(startBtnEl);


//PSEUDO CODE
// create HTML
// Start quiz
    // Show first question
// Evaluate button press
    //Is it right or wrong
        // tell them it's right or wrong, add to score, take away time if wrong
        //display new questions
            //replace old questions text.Content
            //Repeat righ or wrog
// Finish quiz
    //show final score
        // timer and q's right
//Choose to view HighScores
    // display local storage highscores.
