// GLOBALS
//Counter to distinguish which quiz questions we are on.
var answerIdCounter = 0;
var quizIdCounter = 0;
var rightAnsInd = 0;
var wrongAnsIndex = 0;
var finish = false;


// Variable for the event listener in main
var pageContentEl = document.querySelector("#page-content");

var startBtnEl = window.document.querySelector("#start-quiz");
//variable to listen to events in header

var headerButtonEl = document.querySelector("#scoreBtn");
var resultSectionEl = document.querySelector("#result-section");
var resultTextEl = document.querySelector("#result-text");


var quizQuestionsEl = document.querySelector("#questions-list");
//object to store into localStorage at the end of each quiz
var scoreObj = {
    timeFunct : 0,
    percentage: 0,
    time : 0
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
    wrongAns:[
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
var randomNumber = function(min, max) {
    var value = Math.floor(Math.random() * (max - min) + min);
  
    return value;
  };

// function to create multiple choice buttons
function createMutlipleButtons(index, array,rightOrWrong){
    var listChoiceEl = document.createElement("li");
    var listButtonEl = document.createElement("button");
  
    listButtonEl.textContent = array[index]; 
    listButtonEl.className = "btn";
    listChoiceEl.className = "question";
    if(rightOrWrong){
    listButtonEl.id = "question-right";
    }
    else if(!rightOrWrong){
        listButtonEl.id = "question-wrong";
        listButtonEl.setAttribute("ans-id",answerIdCounter);
        answerIdCounter++;
    }
 
    listChoiceEl.appendChild(listButtonEl);
    quizQuestionsEl.appendChild(listChoiceEl);
    
    
}
function replaceAnswers(index, array,rightOrWrong,buttonId){

    
    if(rightOrWrong){
       
        var listButtonEl = document.querySelector("#question-right");
        listButtonEl.textContent = array[index]; 
        
    }
    else if (!rightOrWrong){
        
        var listButtonEl = document.querySelector(".btn[ans-id='" + buttonId + "']");
        
        listButtonEl.textContent = array[index]; 
    }

}

function createNewQuestion(index) {

    //Change questions
  var questionEl = document.querySelector("#prompt");
  //replace the content of the question with the next prompt in the array of questionObj
  questionEl.textContent = questionObj.questions[index];
  //Create individual Id's for reach question
  questionEl.setAttribute("question-id",quizIdCounter);
  
  quizIdCounter++;
 
  

}

function removeAnswers(index,rightOrWrong, buttonId){

    if(rightOrWrong){
        
        var listButtonEl = document.querySelector("#question-right");
        listButtonEl.remove();
        
    }
    else if (!rightOrWrong){
        
        var listButtonEl = document.querySelector(".btn[ans-id='" + buttonId + "']");
        
        listButtonEl.remove();
    }

}
function timerCount() {
    scoreObj.time++;
    document.querySelector("#shown-timer").textContent = "Time: " + scoreObj.time;
};
function checkEnd(targetEl){
    if(quizIdCounter == 5){
        if(targetEl.matches("#question-right")){
            scoreObj.percentage++;
        }
        finish = true;
    }
}
// function to deal with buttons in main
function quizButtonHandler(event){
  var targetEl = event.target; 
  var right = true;
  var wrong = false;
  
  
  if(!finish){
  
    if(targetEl.matches("#start-quiz")){

        //**********start timer here*************
        //every one second, increase our time to act as a timer.
        scoreObj.timeFunct = setInterval(timerCount, 1000);
        // remove start prompt
        document.querySelector("#startExcerpt").remove();

        //remove start button
        startBtnEl.remove();
        
        createNewQuestion(rightAnsInd);
        createMutlipleButtons(rightAnsInd, questionObj.correctAns,right);
        rightAnsInd++;
        //use a for loop to create 3 wrong answers
    
        for(wrongAnsIndex; wrongAnsIndex < questionObj.questions.length-2; wrongAnsIndex++){
            createMutlipleButtons(wrongAnsIndex, questionObj.wrongAns,wrong);
        }        
    }
        else if(targetEl.matches("#question-right")){
        
            scoreObj.percentage++;
            console.log(scoreObj.percentage);
            resultTextEl.textContent = "Correct!";

            resultSectionEl.appendChild(resultTextEl);

            console.log("have clicked a right answer");
            
        
            //Next Question
            createNewQuestion(rightAnsInd);
            replaceAnswers(rightAnsInd, questionObj.correctAns,right);
            rightAnsInd++;
            var newLimit = wrongAnsIndex+3;
            var buttonId = 0;
           
            for( wrongAnsIndex; wrongAnsIndex < newLimit; wrongAnsIndex++) {
              
                replaceAnswers(wrongAnsIndex, questionObj.wrongAns,wrong,buttonId);  
                
                buttonId++;
            }
            checkEnd(targetEl);

        }
        else if(targetEl.matches("#question-wrong")){
            
            scoreObj.time--;
            resultTextEl.textContent = "Incorrect!"
        
            resultSectionEl.appendChild(resultTextEl);
            console.log("have clicked a wrong answer");

            //Next Question
                    //Next Question
                    createNewQuestion(rightAnsInd);
                    replaceAnswers(rightAnsInd, questionObj.correctAns,right);
                    rightAnsInd++;
                    var newLimit = wrongAnsIndex+3;
                    var buttonId = 0;
                  
                    for( wrongAnsIndex; wrongAnsIndex < newLimit; wrongAnsIndex++) {
                      
                        replaceAnswers(wrongAnsIndex, questionObj.wrongAns,wrong,buttonId);  
                        console.log(questionObj.wrongAns[wrongAnsIndex]);
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
        for( i = 0; i< 3; i++) {
           
            removeAnswers(wrongAnsIndex, wrong,i);           
        }
        var finalScoreEl = document.createElement("h2");
        var questionSectionEl = document.querySelector(".quiz-questions-wrapper");
        finalScoreEl.className = "finalScore";
        finalScoreEl.textContent = "You answered " + scoreObj.percentage + "/" +questionObj.questions.length + " correctly.";
        questionSectionEl.appendChild(finalScoreEl);
    }
};

//function to deal with buttons in header
function headerButtonHandler(event){
    alert("high score button clicked");
};
function saveScore() { 
    var highScoreLocal = localStorage.getItem("score");
    if(highScoreLocal < scoreObj.percentage){
        localStorage.setItem("score", (scoreObj.percentage));
        localStorage.setItem("time", scoreObj.time);
        window.alert("You beat the highscore!");
    }
    else if(highScoreLocal == 0){
        localStorage.setItem("score", (scoreObj.percentage));
        localStorage.setItem("time", scoreObj.time);
        
    }
    else {
        window.alert("You did not beat the high score!");
    }
    
};

pageContentEl.addEventListener("click",quizButtonHandler);
headerButtonEl.addEventListener("click",headerButtonHandler);
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