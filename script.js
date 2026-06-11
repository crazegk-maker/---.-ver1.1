let currentQuestionIndex = 0;
let questions = [];
let userAnswers = []; 

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress');
const resultSection = document.getElementById('result-section');
const finalScoreText = document.getElementById('final-score');
const questionSection = document.getElementById('question-section');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.querySelector('.restart-btn');

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        userAnswers = new Array(questions.length).fill(null);
        showQuestion();
    } catch (error) {
        questionText.innerText = "Ошибка загрузки вопросов.";
    }
}

function showQuestion() {
    const q = questions[currentQuestionIndex];
    progressText.innerText = `Вопрос ${currentQuestionIndex + 1} из ${questions.length}`;
    progressFill.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
    questionText.innerText = q.question;
    optionsContainer.innerHTML = '';

    prevBtn.classList.toggle('hidden', currentQuestionIndex === 0);
    nextBtn.classList.add('hidden');

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.classList.add('option-btn');
        if (userAnswers[currentQuestionIndex] !== null) {
            btn.disabled = true;
            if (opt === q.answer) btn.classList.add('correct');
            else if (opt === userAnswers[currentQuestionIndex]) btn.classList.add('wrong');
            nextBtn.classList.remove('hidden');
        } else {
            btn.onclick = () => selectAnswer(opt, btn, q.answer);
        }
        optionsContainer.appendChild(btn);
    });
}

function selectAnswer(opt, btn, correct) {
    userAnswers[currentQuestionIndex] = opt;
    optionsContainer.querySelectorAll('button').forEach(b => b.disabled = true);
    if (opt === correct) btn.classList.add('correct');
    else {
        btn.classList.add('wrong');
        optionsContainer.querySelectorAll('button').forEach(b => { if (b.innerText === correct) b.classList.add('correct'); });
    }
    nextBtn.classList.remove('hidden');
}

nextBtn.onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) showQuestion();
    else showResults();
};

prevBtn.onclick = () => { currentQuestionIndex--; showQuestion(); };

restartBtn.onclick = () => {
    if (confirm("Вы уверены, что хотите начать заново?")) location.reload();
};

function showResults() {
    questionSection.classList.add('hidden');
    document.querySelector('.header').classList.add('hidden');
    resultSection.classList.remove('hidden');
    const score = userAnswers.filter((ans, i) => ans === questions[i].answer).length;
    finalScoreText.innerText = `Вы набрали ${score} из ${questions.length}`;
}

loadQuestions();