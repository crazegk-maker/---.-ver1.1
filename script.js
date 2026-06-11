let currentQuestionIndex = 0;
let questions = [];
let userAnswers = []; // Tracks answers to calculate the score properly

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress');
const quizContainer = document.getElementById('quiz-container');
const resultSection = document.getElementById('result-section');
const finalScoreText = document.getElementById('final-score');
const questionSection = document.getElementById('question-section');

// Navigation and Action Buttons
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        // Initialize an array with nulls to match the number of questions
        userAnswers = new Array(questions.length).fill(null);
        startQuiz();
    } catch (error) {
        console.error("Ошибка загрузки вопросов:", error);
        questionText.innerText = "Ошибка загрузки вопросов. Запустите через локальный сервер.";
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(null);
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Update Progress
    progressText.innerText = `Вопрос ${currentQuestionIndex + 1} из ${questions.length}`;
    progressFill.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;

    questionText.innerText = currentQuestion.question;
    optionsContainer.innerHTML = '';

    // Handle 'Back' button visibility
    if (currentQuestionIndex === 0) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }

    // Hide 'Next' button until the user makes a selection
    nextBtn.classList.add('hidden');

    // Check if user has already answered this question
    const previousAnswer = userAnswers[currentQuestionIndex];

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');

        if (previousAnswer) {
            // Restore previous state if navigating backwards
            button.disabled = true;
            if (option === currentQuestion.answer) {
                button.classList.add('correct');
            } else if (option === previousAnswer) {
                button.classList.add('wrong');
            }
            // Allow them to move forward since it's already answered
            nextBtn.classList.remove('hidden');
        } else {
            // Bind click event for unanswered questions
            button.onclick = () => selectAnswer(option, button, currentQuestion.answer);
        }

        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selectedOption, clickedButton, correctAnswer) {
    // Save the answer to prevent score manipulation
    userAnswers[currentQuestionIndex] = selectedOption;

    const allButtons = optionsContainer.querySelectorAll('button');
    allButtons.forEach(btn => btn.disabled = true);

    if (selectedOption === correctAnswer) {
        clickedButton.classList.add('correct');
    } else {
        clickedButton.classList.add('wrong');
        allButtons.forEach(btn => {
            if (btn.innerText === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }

    // Unhide the 'Next' button
    nextBtn.classList.remove('hidden');
}

// Event Listeners for Navigation
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
});

// Event Listener for Restart with Warning
restartBtn.addEventListener('click', () => {
    const confirmRestart = confirm("Вы уверены, что хотите начать заново? Весь прогресс будет потерян.");
    if (confirmRestart) {
        location.reload();
    }
});

function showResults() {
    questionSection.classList.add('hidden');
    document.querySelector('.header').classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    // Calculate final score purely based on the saved answers state
    let score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].answer) {
            score++;
        }
    });

    finalScoreText.innerText = `Вы набрали ${score} из ${questions.length}`;
}

loadQuestions();