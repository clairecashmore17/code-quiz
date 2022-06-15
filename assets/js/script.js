// GLOBALS
//Counter to distinguish which quiz questions we are on.
var answerIdCounter = 0;
var quizIdCounter = 0;

//These help with progressing through our arrays of answers
var rightAnsInd = 0;
var wrongAnsIndex = 0;

// To determine if we have completed the quiz to stop creating buttons
var finish = false;

var currentScores = JSON.parse(localStorage.getItem("score"));
var finished = false;
// Variable for the event listener in main
var pageContentEl = document.querySelector("#page-content");
//Start button on homepage
var startBtnEl = window.document.querySelector("#start-quiz");

//variable to listen to events in header
var headerButtonEl = document.querySelector("#scoreBtn");
//Elements to manipulate while taking the quiz
var resultSectionEl = document.querySelector("#result-section");
var resultTextEl = document.querySelector("#result-text");
var questionEl = document.querySelector("#prompt");
var quizQuestionsEl = document.querySelector("#questions-list");

//Object in which our information is stored while playing
var scoreObj = {
    timeFunct: 0,
    percentage: 0,
    time: 30,
    name: ""

};
//Question object to store all questions
//FOR FUTURE REFERENCE***** Try to do this reversed--> an array of objects
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
    //If the choice we want to create is the right answer, do this
    if (rightOrWrong) {
        //create a unique ID to identify when we press it later
        listButtonEl.id = "question-right";
        
        //THIS IS NOT IN FULL FUNCTIONALITY YET I would have to work on implementing this later
        //Randomly alter flex order.
        if (randomIteration == 1) {
            listChoiceEl.className = "question question-order-1";
        }
        else if (randomIteration == 2) {
            listChoiceEl.className = "question question-order-2";

        }
        else if (randomIteration == 3) {
            listChoiceEl.className = "question question-order-3";
        }
    }
    //If we are creating the wrong answers, do this
    else if (!rightOrWrong) {
        //create a unique ID to identify when we press it later
        listButtonEl.id = "question-wrong";
        // our specific class for the button
        listChoiceEl.className = "question question-order-2";
        //Create a specific ans-id so that we can identify which wrong answer is which
        listButtonEl.setAttribute("ans-id", answerIdCounter);
        //This counter helps us only print out the 3 wrong quetsions we are pulling from our quetsion object
        answerIdCounter++;
    }
    //Append our buttons to the parent elements
    listChoiceEl.appendChild(listButtonEl);
    quizQuestionsEl.appendChild(listChoiceEl);


}

//Function that replaces the answers we have already created(See createMultipleButtons())
function replaceAnswers(index, array, rightOrWrong, buttonId) {
    //If the choice we want to alter is the right answer, do this
    if (rightOrWrong) {
        //create an element that accesses the right answer button content
        var listButtonEl = document.querySelector("#question-right");
        //replace it's text content with the next right answer string from object
        listButtonEl.textContent = array[index];
    }
    //If the choice we want to alter is a wrong answer, do this
    else if (!rightOrWrong) {
        //create an element that accesses the wrong answer button content witht the specified id created earlier
        var listButtonEl = document.querySelector(".btn[ans-id='" + buttonId + "']");
        //replace it's text content with the next wrong answer string from object
        listButtonEl.textContent = array[index];
    }

}
//function to create a new question on element
function createNewQuestion(index) {

    //replace the content of the question with the next prompt in the array of questionObj
    questionEl.textContent = questionObj.questions[index];
    //Create individual Id's for reach question
    questionEl.setAttribute("question-id", quizIdCounter);

    quizIdCounter++;
}

//Function to remove the answer elements on the page
function removeAnswers(index, rightOrWrong, buttonId) {
    //remove the right answer button
    if (rightOrWrong) {

        var listButtonEl = document.querySelector("#question-right");
        listButtonEl.remove();

    }
    //remove the wrong answer button
    else if (!rightOrWrong) {

        var listButtonEl = document.querySelector(".btn[ans-id='" + buttonId + "']");

        listButtonEl.remove();
    }

}
//Function to add time to our counter
function timerCount() {
    scoreObj.time--;
    //updates our time on page with every iteration
    if( scoreObj.time >= 0){
        document.querySelector("#shown-timer").textContent = "Time: " + scoreObj.time;
    }
    else if (scoreObj.time < 0){
        clearInterval(scoreObj.timeFunct);
        document.querySelector("#shown-timer").textContent = "Time: " + scoreObj.time + " You ran out of time!";
    }
    checkEnd();
}
//Function to check if we have reached the end of our questions
function checkEnd(targetEl) {
    if(scoreObj.time == 0){
        finish = true;
    }
    if (quizIdCounter == 5) {
        //if the last thing the user put in was a right answer, add to the score
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

    // continue until we have finished the quiz
    if (!finish || scoreObj.time > 0) {
        // if our click matches the start button...
        if (targetEl.matches("#start-quiz")) {

            //**********start timer here*************
            //every one second, increase our time to act as a timer.
            scoreObj.timeFunct = setInterval(timerCount, 1000);
            // remove start prompt
            document.querySelector("#startExcerpt").remove();

            //remove start button
            startBtnEl.remove();
            //create new question and choices
            createNewQuestion(rightAnsInd);
            createMutlipleButtons(rightAnsInd, questionObj.correctAns, right);
            rightAnsInd++;
            //use a for loop to create 3 wrong answers
            for (wrongAnsIndex; wrongAnsIndex < questionObj.questions.length - 2; wrongAnsIndex++) {
                createMutlipleButtons(wrongAnsIndex, questionObj.wrongAns, wrong);
            }
        }
        //Checks right answer input
        else if (targetEl.matches("#question-right")) {
            //add to score and report to user they were right
            scoreObj.percentage++;
            console.log(scoreObj.percentage);
            resultTextEl.textContent = "Correct!";

            resultSectionEl.appendChild(resultTextEl);

            console.log("have clicked a right answer");


            //Next Question replacement
            createNewQuestion(rightAnsInd);
            replaceAnswers(rightAnsInd, questionObj.correctAns, right);
            rightAnsInd++;
            var newLimit = wrongAnsIndex + 3;
            var buttonId = 0;
            //for loop in order to create the next set of wrong answers
            for (wrongAnsIndex; wrongAnsIndex < newLimit; wrongAnsIndex++) {

                replaceAnswers(wrongAnsIndex, questionObj.wrongAns, wrong, buttonId);

                buttonId++;
            }
            checkEnd(targetEl);

        }
        //evaluate if the answer clicked was wrong
        else if (targetEl.matches("#question-wrong")) {
            //take away a second and let user know they were wrong
            scoreObj.time-= 5;
            resultTextEl.textContent = "Incorrect!"

            resultSectionEl.appendChild(resultTextEl);
            console.log("have clicked a wrong answer");

           
            //Next Question replacement
            createNewQuestion(rightAnsInd);
            replaceAnswers(rightAnsInd, questionObj.correctAns, right);
            rightAnsInd++;
            var newLimit = wrongAnsIndex + 3;
            var buttonId = 0;
            //for loop in order to create the next set of wrong answers
            for (wrongAnsIndex; wrongAnsIndex < newLimit; wrongAnsIndex++) {
                replaceAnswers(wrongAnsIndex, questionObj.wrongAns, wrong, buttonId);
                console.log(questionObj.wrongAns[wrongAnsIndex]);
                buttonId++;
            }
            checkEnd(targetEl);
        }
    }
    else {
        //Finished game, remove our buttons and questions, display score.
        clearInterval(scoreObj.timeFunct);
        //save our score to local storage
        saveScore();
        // replaced the prompt with this finish text
        document.querySelector("#prompt").textContent = "You finished! Here are your stats:";
        //remove the result section
        resultSectionEl.remove();
        //remove all of our answers on the page
        removeAnswers(rightAnsInd, right);
        for (i = 0; i < 3; i++) {

            removeAnswers(wrongAnsIndex, wrong, i);
        }
        //create an element to showcase the users score
        var finalScoreEl = document.createElement("h2");
        var questionSectionEl = document.querySelector(".quiz-questions-wrapper");
        finalScoreEl.className = "finalScore";
        finalScoreEl.textContent = "You answered " + scoreObj.percentage + "/" + questionObj.questions.length + " correctly.";
        //Ask for users initials
        createSubmitName(questionSectionEl);
        // append the final score showcase to the question section
        questionSectionEl.appendChild(finalScoreEl);
        
    }
};
//Function to create the submit button for name
function createSubmitName(parentNode, ) {
    //create both a type and submit element
    var nameInput = document.createElement("input");
    var nameSubmit = document.createElement("input");
    // create the attribute and id and put placeholder for our input
    nameInput.setAttribute('type', 'text');
    nameInput.id = "name";
    nameInput.placeholder = "Enter your initials";

    //create attribute and add event listener for the submit button
    nameSubmit.setAttribute('type', 'submit');
    nameSubmit.addEventListener("click", saveName);

    //append to parent nodes
    parentNode.appendChild(nameInput);
    parentNode.appendChild(nameSubmit);
    
}
//After submit button has been pressed, save name
function saveName() {
    var inputVal = document.getElementById("name").value;
    scoreObj.name = inputVal;
    
}
//Add our new score object to the local storage
function addToStorage(){
    var newAddition = JSON.parse(localStorage.getItem("score"));

    newAddition.push(scoreObj);
    localStorage.setItem("score", JSON.stringify(newAddition));
}
//Function to save score to localStorage
function saveScore() {

    // if the score is null, add to the storage
    if (currentScores === null) {  
        localStorage.setItem("score", JSON.stringify([scoreObj]));
    }
    //if we already have scores, store this new score with them
    else {
       addToStorage();
    }

};

//function to deal with buttons in header
function headerButtonHandler(event) {
    //remove the page contents
    pageContentEl.remove();
    
    //create the new main element element
    var bodyEl = document.querySelector("body");
    var scoresPageContentEl = document.createElement("div");
    scoresPageContentEl.className = "page-content";
    var scoreTitle = document.createElement("h2");
    scoreTitle.className = "prompt";
    scoreTitle.textContent = "Highscores: ";
    var scoreList = document.createElement("ul");
    scoreList.className = "scoreList";

    //append to itself and body
    bodyEl.appendChild(scoresPageContentEl);
    scoresPageContentEl.appendChild(scoreTitle);
    scoresPageContentEl.appendChild(scoreList);

    // if the score is empty, tell user there are not scores to place
    if (currentScores === null) {
        console.log("There are no scores yet");
        window.alert("No scores yet!");
    }
    //otherwise if you have scores,print them out
    else {
        for (i = 0; i < currentScores.length; i++) {
            // if there is no name stored, do not print it out
            if(currentScores[i].name == ""){
                console.log("No name. no score");
            }
            else{
                var scoreEl = document.createElement("li");
                console.log(" entering information for " + JSON.stringify(currentScores[i]));
                scoreEl.textContent = currentScores[i].name + " : " + currentScores[i].percentage + "/5 in " + currentScores[i].time + " seconds"; 
                scoreEl.className = "score";
                scoreList.appendChild(scoreEl);
            }
        }
        
    }
};

//Our event listeners
pageContentEl.addEventListener("click", quizButtonHandler);
headerButtonEl.addEventListener("click", headerButtonHandler);


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
