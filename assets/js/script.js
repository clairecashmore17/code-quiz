// GLOBALS
//Counter to distinguish which quiz questions we are on.
var quizIdCounter = 0;
var rightAnsInd = 0;
// Variable for the event listener in main
var pageContentEl = document.querySelector("#page-content");

var startBtnEl = window.document.querySelector("#start-quiz");
//variable to listen to events in header

var headerEl = document.querySelector("header");

var quizQuestionsEl = document.querySelector("#questions-list");

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
function rightAns(index){
   //Change questions
   document.querySelector("#prompt").textContent = questionObj.questions[index];


   var listChoiceEl = document.createElement("li");
   var listButtonEl = document.createElement("button");
 
   listButtonEl.textContent = questionObj.correctAns[index]; 
   listButtonEl.className = "btn";
   listChoiceEl.className = "question";
   listChoiceEl.id = "question";

   listChoiceEl.appendChild(listButtonEl);
   quizQuestionsEl.appendChild(listChoiceEl);
   
   

  }
function wrongAns(index) {
    
 
    
    //mutliple choice
    
    
    var listChoiceEl = document.createElement("li");
    var listButtonEl = document.createElement("button");
  
    listButtonEl.textContent = questionObj.wrongAns[index]; 
    listButtonEl.className = "btn";
    listChoiceEl.className = "question";
    listChoiceEl.id = "question";
    // listChoiceEl.setAttribute("data-question-id", quizIdCounter);

    listChoiceEl.appendChild(listButtonEl);
    quizQuestionsEl.appendChild(listChoiceEl);

    //

}

// function to deal with buttons in main
function quizButtonHandler(event){
  var targetEl = event.target; 
  if(targetEl.matches("#start-quiz")){

   

    // remove start prompt
    document.querySelector("#startExcerpt").remove();

    //remove start button
    startBtnEl.remove();
    
    rightAns(rightAnsInd);
    rightAnsInd++;
    for(var i = 0; i < questionObj.questions.length-2; i++){
        wrongAns(i,);
    }
    }
    //If it isnt a start button...
    else if(target.matches("#question")){
        console.log("have clicked a multiple choice answer");
    }
};


//function to deal with buttons in header
function headerButtonHandler(event){
    alert("high score button clicked");
};

pageContentEl.addEventListener("click",quizButtonHandler);
headerEl.addEventListener("click",headerButtonHandler);
console.dir(startBtnEl);

