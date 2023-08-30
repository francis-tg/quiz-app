import './style.css'
import {questions} from "./data.json"
const questionShow = document.querySelector("#question-show");
import confetti from 'canvas-confetti';
let currentQuestion = 0;
let listQuestion = ""
let countCorrectAnswer = 0;
let countWrongAnswer = 0;
let countAnswer = 0;
// Set the countdown duration in seconds
let countdownDuration = 60; // 5 minutes

// Get the countdown element
const countdownElement = document.getElementById("countdown");

// Calculate the target time (current time + countdown duration)
const targetTime = new Date().getTime() + countdownDuration * 1000;
let countdownInterval; // Declare the interval variable

function checkAnswer(answer) {
  const getAnswer = questions[parseInt(answer[0])].answers[parseInt(answer[1])];
  countAnswer++
  if (getAnswer.correct) {
    confetti({})
    countCorrectAnswer ++
  } else {
    countWrongAnswer++
  }
  
}
questionShow.addEventListener("click", function (event) {
  if (event.target.type === "radio" && event.target.name === "answer") {
    const selectedAnswer = event.target.getAttribute("data-key").split("-");
    checkAnswer(selectedAnswer);
    const questions = questionShow.querySelectorAll("#questions")
    event.target.setAttribute("checked",true)
    questions[currentQuestion].querySelectorAll("input[type='radio']").forEach((i)=> i!==event.target&& i.setAttribute("disabled",true))
  }
});
questions.forEach((question,q) => {
  let listAnswer = ""
  question.answers.forEach((answers,i) => {
    listAnswer += `
    <label for="answer${i}" class="bg-slate-700 mb-3 text-white p-3 rounded-lg w-full">
              <input type="radio" name="answer" id="answer${i}" data-key="${q}-${i}">
              ${answers.answer}
            </label>
    `
  })
  listQuestion += `
  <div id="questions" class="p-3">
  <h3 class="text-xl mt-3 font-semibold mb-5">
            ${question.question}
          </h3>
          <div class="flex flex-col w-full">
            ${listAnswer}
          </div>
          </div>
  `
})

questionShow.innerHTML = listQuestion


document.addEventListener("DOMContentLoaded", () => {
  startCountdown()
  const questions = questionShow.querySelectorAll("#questions")
  questions.forEach(q => {
    q.style.display = "none"
  })
  showQuestion(currentQuestion, questions)
  document.querySelector("#next-btn").addEventListener("click", (e) => {
    e.preventDefault()
    
    if (currentQuestion===questions.length-1) {
      e.target.innerHTML = "Terminer"
      showResult();
      document.querySelector("#prev-btn").style.display = "none"
    }
    nextQuestion(questions)
    if (currentQuestion > 0) {
      document.querySelector("#prev-btn").style.display ="block"
    }
  })
  if (currentQuestion===0) {
      document.querySelector("#prev-btn").style.display = "none"
  }
  document.querySelector("#prev-btn").addEventListener("click", (e) => {
    e.preventDefault()
    prevQuestion(questions)
    if (currentQuestion===0) {
      e.target.style.display = "none"
  }
  })
})

function showQuestion(current, questions) {
  questions[current].style.display = "block"
}

function nextQuestion(questions) {
  if (currentQuestion < questions.length - 1) {
    questions[currentQuestion].style.display = "none"
    currentQuestion++
    countdownDuration = 60;
    startCountdown()
    return questions[currentQuestion].style.display = "block"
  }
  
}
function prevQuestion(questions) {
  if (currentQuestion <= questions.length - 1) {
    questions[currentQuestion].style.display = "none"
    currentQuestion--
    return questions[currentQuestion].style.display = "block"
  }
  
}

function showResult() {
  const result = `
  <div class="my-6 mb-5">
  <h3 class="text-2xl  font-semibold">Vous avez répondu à ${countAnswer} / ${questions.length}</h3>
  <h3 class="text-2xl  font-semibold">Votre score est de ${Math.round(countCorrectAnswer*100/questions.length)} % </h3>
  </div>
  `
  confetti({
     particleCount: 100,
  startVelocity: 30,
  spread: 360,
  origin: {
    x: Math.random(),
    // since they fall down, start a bit higher than random
    y: Math.random() - 0.2
  }
  })
  questionShow.innerHTML = result
  setTimeout(() => {
    window.location.reload()
  },6000)
}



// Function to start the countdown timer
function startCountdown() {
  // Calculate the target time (current time + countdown duration)
  const targetTime = new Date().getTime() + countdownDuration * 1000;

  // Clear any existing interval
  clearInterval(countdownInterval);

  countdownInterval = setInterval(updateCountdown, 1000);
  // Function to update the countdown timer
  function updateCountdown() {
    const currentTime = new Date().getTime();
    const timeLeft = Math.max(0, targetTime - currentTime);

    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Display the remaining time in the countdown element
    countdownElement.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;

    // Check if the countdown has reached zero
    if (timeLeft === 0) {
      clearInterval(countdownInterval);
      // Call a function to handle quiz submission or time's up
      handleQuizSubmission();
    }
    
  }
  // Update the countdown every second
  

  // Initial call to updateCountdown to avoid delay
  updateCountdown();

}

// Helper function to format time values (add leading zeros)
function formatTime(value) {
  return value < 10 ? `0${value}` : value;
}

function handleQuizSubmission() {
   const questions = questionShow.querySelectorAll("#questions")
  nextQuestion(questions)
}
