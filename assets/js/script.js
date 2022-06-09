// GLOBALS
//Counter to distinguish which quiz questions we are on.
var quizIdCounter = 0;
var rightAnsInd = 0;
var wrongAnsIndex = 0;

var time = 0;
// Variable for the event listener in main
var pageContentEl = document.querySelector("#page-content");

var startBtnEl = window.document.querySelector("#start-quiz");
//variable to listen to events in header

var headerEl = document.querySelector("header");
var resultSectionEl = document.querySelector("#result-section");
var resultTextEl = document.querySelector("#result-text");


var quizQuestionsEl = document.querySelector("#questions-list");
//object to store into localStorage at the end of each quiz
var scoreObj = {
    time : 0,
    percentage: 0
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
        listButtonEl.setAttribute("ans-id",quizIdCounter);
        quizIdCounter++;
    }
   console.log(listButtonEl);
 
    listChoiceEl.appendChild(listButtonEl);
    quizQuestionsEl.appendChild(listChoiceEl);
    
    
}
function replaceAnswers(index, array,rightOrWrong,buttonId){

    
    if(rightOrWrong){
        console.log("Replacing right button texts...");
        var listButtonEl = document.querySelector("#question-right");
        listButtonEl.textContent = array[index]; 
        console.log(listButtonEl);
    }
    else if (!rightOrWrong){
        console.log("Replacing wrong button at id: " + buttonId);
        var listButtonEl = document.querySelector(".btn[ans-id='" + buttonId + "']");
        console.log(listButtonEl);
        listButtonEl.textContent = array[index]; 
    }

}

function createNewQuestion(index,resultTextEl) {
       //Change questions
   document.querySelector("#prompt").textContent = questionObj.questions[index];
    
}

function removeText(textToRemove) {
    textToRemove.remove();
}

// function to deal with buttons in main
function quizButtonHandler(event){
  var targetEl = event.target; 
  var right = true;
  var wrong = false;
  
  console.log(rightAnsInd);
  if(targetEl.matches("#start-quiz")){

   //**********start timer here*************
   //every one second, increase our time to act as a timer.
    // setInterval(function() {
    //     time++;
    //     console.log(time);
    // }, 1000);
    // remove start prompt
    document.querySelector("#startExcerpt").remove();

    //remove start button
    startBtnEl.remove();
     
    createNewQuestion(rightAnsInd,resultTextEl);
    createMutlipleButtons(rightAnsInd, questionObj.correctAns,right);
    rightAnsInd++;
    //use a for loop to create 3 wrong answers
   
    for(wrongAnsIndex; wrongAnsIndex < questionObj.questions.length-2; wrongAnsIndex++){
        createMutlipleButtons(wrongAnsIndex, questionObj.wrongAns,wrong);
     
    }
    console.log(wrongAnsIndex);
    
    }
    else if(targetEl.matches("#question-right")){
       

        resultTextEl.textContent = "Correct!";

        resultSectionEl.appendChild(resultTextEl);

        console.log("have clicked a right answer");
        
      
        //Next Question
        replaceAnswers(rightAnsInd, questionObj.correctAns,right);
        rightAnsInd++;
        var newLimit = wrongAnsIndex+3;
        var buttonId = 0;
        console.log(wrongAnsIndex);
        for( wrongAnsIndex; wrongAnsIndex < newLimit; wrongAnsIndex++) {
            console.log("entering replace wrong answers for loop...");
            replaceAnswers(wrongAnsIndex, questionObj.wrongAns,wrong,buttonId);  
            console.log(questionObj.wrongAns[wrongAnsIndex]);
            buttonId++;
        }
        

    }
    else if(targetEl.matches("#question-wrong")){
        console.log(targetEl)
     
        resultTextEl.textContent = "Incorrect!"
       
        resultSectionEl.appendChild(resultTextEl);
        console.log("have clicked a wrong answer");

        //Next Question
    }
};

//function to deal with buttons in header
function headerButtonHandler(event){
    alert("high score button clicked");
};

pageContentEl.addEventListener("click",quizButtonHandler);
headerEl.addEventListener("click",headerButtonHandler);
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