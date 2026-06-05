const allQuestions = [
  {
    category: "javascript",
    difficulty: "easy",
    question: "Which method turns a JavaScript array into one joined string?",
    options: ["map()", "join()", "filter()", "slice()"],
    correctAnswerIndex: 1,
  },
  {
    category: "javascript",
    difficulty: "easy",
    question: "What is the result of Boolean(0) in JavaScript?",
    options: ["true", "false", "undefined", "TypeError"],
    correctAnswerIndex: 1,
  },
  {
    category: "javascript",
    difficulty: "easy",
    question: "Which event is commonly used to react to a button press?",
    options: ["submit", "hover", "click", "changeText"],
    correctAnswerIndex: 2,
  },
  {
    category: "javascript",
    difficulty: "medium",
    question: "Which operator checks both value and type equality?",
    options: ["==", "===", "=", "!="],
    correctAnswerIndex: 1,
  },
  {
    category: "javascript",
    difficulty: "medium",
    question: "Which array method creates a new array from matching items?",
    options: ["filter()", "push()", "join()", "sort()"],
    correctAnswerIndex: 0,
  },
  {
    category: "javascript",
    difficulty: "medium",
    question: "Which keyword declares a block-scoped variable?",
    options: ["var", "let", "static", "define"],
    correctAnswerIndex: 1,
  },
  {
    category: "html-css",
    difficulty: "easy",
    question: "What does CSS stand for?",
    options: [
      "Creative Style Sheets",
      "Computer Style Syntax",
      "Cascading Style Sheets",
      "Colorful Sheet System",
    ],
    correctAnswerIndex: 2,
  },
  {
    category: "html-css",
    difficulty: "easy",
    question: "Which HTML element is used for the largest heading?",
    options: ["<heading>", "<h6>", "<head>", "<h1>"],
    correctAnswerIndex: 3,
  },
  {
    category: "html-css",
    difficulty: "easy",
    question: "Which HTML element loads a JavaScript file?",
    options: ["<style>", "<script>", "<link>", "<main>"],
    correctAnswerIndex: 1,
  },
  {
    category: "html-css",
    difficulty: "medium",
    question: "Which value lets a flex container place children in a row by default?",
    options: ["flex-direction: row", "align-items: row", "display: row", "gap: row"],
    correctAnswerIndex: 0,
  },
  {
    category: "html-css",
    difficulty: "medium",
    question: "Which CSS property controls space between grid or flex items?",
    options: ["space", "gap", "margin-all", "between"],
    correctAnswerIndex: 1,
  },
  {
    category: "html-css",
    difficulty: "medium",
    question: "Which viewport meta tag helps mobile responsiveness?",
    options: [
      "content='device-only'",
      "name='responsive'",
      "name='viewport'",
      "media='mobile'",
    ],
    correctAnswerIndex: 2,
  },
  {
    category: "web",
    difficulty: "easy",
    question: "Which browser storage API keeps data after the tab is closed?",
    options: ["sessionStorage", "localStorage", "historyStorage", "cacheState"],
    correctAnswerIndex: 1,
  },
  {
    category: "web",
    difficulty: "easy",
    question: "Which file usually contains the page structure?",
    options: ["index.html", "styles.css", "script.js", "package.json"],
    correctAnswerIndex: 0,
  },
  {
    category: "web",
    difficulty: "easy",
    question: "Which file usually contains the page styling?",
    options: ["script.js", "styles.css", "index.html", "server.js"],
    correctAnswerIndex: 1,
  },
  {
    category: "web",
    difficulty: "medium",
    question: "Which DOM method selects the first matching CSS selector?",
    options: ["findElement()", "querySelector()", "getStyle()", "selectFirst()"],
    correctAnswerIndex: 1,
  },
  {
    category: "web",
    difficulty: "medium",
    question: "Which method adds a click handler to a button?",
    options: ["button.listen()", "button.onclicked()", "button.addEventListener()", "button.watch()"],
    correctAnswerIndex: 2,
  },
  {
    category: "web",
    difficulty: "medium",
    question: "Which property changes an element's generated HTML content?",
    options: ["innerHTML", "className", "dataset", "styleMap"],
    correctAnswerIndex: 0,
  },
];

const categories = [
  { value: "javascript", label: "JavaScript" },
  { value: "html-css", label: "HTML & CSS" },
  { value: "web", label: "Web Basics" },
];

const apiCategories = [
  { value: "any", label: "Any Category" },
  { value: "9", label: "General Knowledge" },
  { value: "18", label: "Science: Computers" },
  { value: "19", label: "Science: Mathematics" },
  { value: "21", label: "Sports" },
  { value: "22", label: "Geography" },
  { value: "23", label: "History" },
];

const hardcodedDifficulties = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
];

const apiDifficulties = [
  { value: "any", label: "Any Difficulty" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const QUESTION_TIME = 15;
const QUIZ_QUESTION_AMOUNT = 10;
const API_URL = "https://opentdb.com/api.php";
const app = document.querySelector("#quiz-app");

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswerIndex = null;
let answered = false;
let timeLeft = QUESTION_TIME;
let timerId = null;
let quizStarted = false;
let selectedSource = "hardcoded";
let selectedCategory = "javascript";
let selectedApiCategory = "18";
let selectedDifficulty = "easy";
let loading = false;
let errorMessage = "";
let questions = [];

function getHighScoreKey() {
  const category = selectedSource === "api" ? selectedApiCategory : selectedCategory;
  return `quizSprintHighScore:${selectedSource}:${category}:${selectedDifficulty}`;
}

function getHighScore() {
  return Number(localStorage.getItem(getHighScoreKey())) || 0;
}

function setHighScore(value) {
  localStorage.setItem(getHighScoreKey(), String(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSelectedLabel(items, value) {
  return items.find((item) => item.value === value)?.label || value;
}

function getActiveCategoryLabel() {
  if (selectedSource === "api") {
    return getSelectedLabel(apiCategories, selectedApiCategory);
  }

  return getSelectedLabel(categories, selectedCategory);
}

function getActiveDifficultyLabel() {
  const difficultyList = selectedSource === "api" ? apiDifficulties : hardcodedDifficulties;
  return getSelectedLabel(difficultyList, selectedDifficulty);
}

function getAvailableQuestions() {
  const exactMatches = allQuestions.filter(
    (question) =>
      question.category === selectedCategory &&
      question.difficulty === selectedDifficulty,
  );
  const sameCategory = allQuestions.filter(
    (question) =>
      question.category === selectedCategory && !exactMatches.includes(question),
  );
  const remainingQuestions = allQuestions.filter(
    (question) =>
      !exactMatches.includes(question) && !sameCategory.includes(question),
  );

  return [...exactMatches, ...sameCategory, ...remainingQuestions].slice(
    0,
    QUIZ_QUESTION_AMOUNT,
  );
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildApiUrl() {
  const params = new URLSearchParams({
    amount: String(QUIZ_QUESTION_AMOUNT),
    type: "multiple",
    encode: "url3986",
  });

  if (selectedApiCategory !== "any") {
    params.set("category", selectedApiCategory);
  }

  if (selectedDifficulty !== "any") {
    params.set("difficulty", selectedDifficulty);
  }

  return `${API_URL}?${params.toString()}`;
}

function getApiErrorMessage(responseCode) {
  const messages = {
    1: "No questions found for this category and difficulty. Try another option.",
    2: "The quiz API received an invalid setting.",
    5: "Open Trivia DB rate limit reached. Please wait a few seconds and try again.",
  };

  return messages[responseCode] || "Could not load questions from Open Trivia DB.";
}

async function fetchApiQuestions() {
  const response = await fetch(buildApiUrl());

  if (!response.ok) {
    throw new Error("Network error while loading quiz questions.");
  }

  const data = await response.json();

  if (data.response_code !== 0) {
    throw new Error(getApiErrorMessage(data.response_code));
  }

  return data.results.map((item) => {
    const correctAnswer = safeDecode(item.correct_answer);
    const options = shuffle([
      correctAnswer,
      ...item.incorrect_answers.map((answer) => safeDecode(answer)),
    ]);

    return {
      category: safeDecode(item.category),
      difficulty: safeDecode(item.difficulty),
      question: safeDecode(item.question),
      options,
      correctAnswerIndex: options.indexOf(correctAnswer),
    };
  });
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = QUESTION_TIME;
  timerId = setInterval(() => {
    timeLeft -= 1;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleAnswer(null);
      return;
    }

    renderQuiz();
  }, 1000);
}

async function startQuiz() {
  loading = true;
  errorMessage = "";
  renderStartScreen();

  try {
    questions =
      selectedSource === "api" ? await fetchApiQuestions() : getAvailableQuestions();
  } catch (error) {
    loading = false;
    errorMessage = error.message;
    renderStartScreen();
    return;
  }

  loading = false;

  if (questions.length === 0) {
    errorMessage = "No questions available for this selection.";
    renderStartScreen();
    return;
  }

  currentQuestionIndex = 0;
  score = 0;
  selectedAnswerIndex = null;
  answered = false;
  quizStarted = true;
  startTimer();
  renderQuiz();
}

function resetQuiz() {
  clearInterval(timerId);
  quizStarted = false;
  currentQuestionIndex = 0;
  score = 0;
  selectedAnswerIndex = null;
  answered = false;
  timeLeft = QUESTION_TIME;
  loading = false;
  errorMessage = "";
  renderStartScreen();
}

function handleAnswer(answerIndex) {
  if (answered) return;

  const currentQuestion = questions[currentQuestionIndex];
  selectedAnswerIndex = answerIndex;
  answered = true;
  clearInterval(timerId);

  if (answerIndex === currentQuestion.correctAnswerIndex) {
    score += 1;
  }

  renderQuiz();
}

function handleNextQuestion() {
  currentQuestionIndex += 1;
  selectedAnswerIndex = null;
  answered = false;

  if (currentQuestionIndex >= questions.length) {
    clearInterval(timerId);
    if (score > getHighScore()) {
      setHighScore(score);
    }
    renderResults();
    return;
  }

  startTimer();
  renderQuiz();
}

function getFeedbackText(question) {
  if (!answered) return "Choose the best answer.";
  if (selectedAnswerIndex === null) {
    return `Time is up. The correct answer was ${question.options[question.correctAnswerIndex]}.`;
  }
  if (selectedAnswerIndex === question.correctAnswerIndex) {
    return "Correct. Nice work.";
  }
  return `Not quite. The correct answer was ${question.options[question.correctAnswerIndex]}.`;
}

function getOptionClass(question, optionIndex) {
  if (!answered) return "option-button";
  if (optionIndex === question.correctAnswerIndex) return "option-button is-correct";
  if (optionIndex === selectedAnswerIndex) return "option-button is-wrong";
  return "option-button";
}

function renderStartScreen() {
  const categoryList = selectedSource === "api" ? apiCategories : categories;
  const difficultyList =
    selectedSource === "api" ? apiDifficulties : hardcodedDifficulties;
  const selectedCategoryValue =
    selectedSource === "api" ? selectedApiCategory : selectedCategory;
  const availableQuestionCount =
    selectedSource === "api" ? QUIZ_QUESTION_AMOUNT : getAvailableQuestions().length;
  const sourceLabel =
    selectedSource === "api" ? "Open Trivia DB API" : "Hardcoded Questions";

  app.innerHTML = `
    <div class="setup">
      <p class="eyebrow">Quiz setup</p>
      <h1 class="setup-title">Choose your quiz</h1>
      <p class="setup-copy">Select a question source, category, and difficulty before starting.</p>

      <div class="setup-grid">
        <label class="field">
          <span>Question Source</span>
          <select id="source-select" ${loading ? "disabled" : ""}>
            <option value="hardcoded" ${selectedSource === "hardcoded" ? "selected" : ""}>
              Hardcoded Questions
            </option>
            <option value="api" ${selectedSource === "api" ? "selected" : ""}>
              Open Trivia DB API
            </option>
          </select>
        </label>

        <label class="field">
          <span>Category</span>
          <select id="category-select" ${loading ? "disabled" : ""}>
            ${categoryList
              .map(
                (category) => `
                  <option value="${category.value}" ${category.value === selectedCategoryValue ? "selected" : ""}>
                    ${category.label}
                  </option>
                `,
              )
              .join("")}
          </select>
        </label>

        <label class="field">
          <span>Difficulty</span>
          <select id="difficulty-select" ${loading ? "disabled" : ""}>
            ${difficultyList
              .map(
                (difficulty) => `
                  <option value="${difficulty.value}" ${difficulty.value === selectedDifficulty ? "selected" : ""}>
                    ${difficulty.label}
                  </option>
                `,
              )
              .join("")}
          </select>
        </label>
      </div>

      <div class="setup-summary">
        <span>${sourceLabel}</span>
        <span>${availableQuestionCount} questions</span>
        <span>High score: ${getHighScore()}</span>
      </div>

      ${
        errorMessage
          ? `<p class="setup-message is-error">${escapeHtml(errorMessage)}</p>`
          : selectedSource === "api"
            ? `<p class="setup-message">Live questions will be fetched from Open Trivia DB.</p>`
            : `<p class="setup-message">Questions will come from the local hardcoded array.</p>`
      }

      <div class="actions">
        <button class="primary-button" type="button" id="start-button" ${loading ? "disabled" : ""}>
          ${loading ? "Loading..." : "Start Quiz"}
        </button>
      </div>
    </div>
  `;

  document.querySelector("#source-select").addEventListener("change", (event) => {
    selectedSource = event.target.value;
    selectedDifficulty = selectedSource === "api" ? "any" : "easy";
    errorMessage = "";
    renderStartScreen();
  });

  document.querySelector("#category-select").addEventListener("change", (event) => {
    if (selectedSource === "api") {
      selectedApiCategory = event.target.value;
    } else {
      selectedCategory = event.target.value;
    }
    errorMessage = "";
    renderStartScreen();
  });

  document.querySelector("#difficulty-select").addEventListener("change", (event) => {
    selectedDifficulty = event.target.value;
    errorMessage = "";
    renderStartScreen();
  });

  document.querySelector("#start-button").addEventListener("click", startQuiz);
}

function renderQuiz() {
  if (!quizStarted) {
    renderStartScreen();
    return;
  }

  if (currentQuestionIndex >= questions.length) {
    renderResults();
    return;
  }

  const question = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  const feedbackText = getFeedbackText(question);
  const feedbackClass =
    !answered || selectedAnswerIndex === null
      ? ""
      : selectedAnswerIndex === question.correctAnswerIndex
        ? "correct"
        : "wrong";

  app.innerHTML = `
    <div class="top-row">
      <p class="eyebrow">Question ${currentQuestionIndex + 1} of ${questions.length}</p>
      <p class="timer ${timeLeft <= 5 ? "is-low" : ""}" aria-label="Time remaining">${timeLeft}s</p>
    </div>

    <div class="progress-track" aria-hidden="true">
      <div class="progress-bar" style="--progress: ${progressPercent}%"></div>
    </div>

    <div class="score-row">
      <p class="score">Score: ${score}</p>
      <p class="high-score">${getActiveCategoryLabel()} · ${getActiveDifficultyLabel()} · Best: ${getHighScore()}</p>
    </div>

    <h1 class="question">${escapeHtml(question.question)}</h1>

    <div class="options-grid">
      ${question.options
        .map(
          (option, index) => `
            <button
              class="${getOptionClass(question, index)}"
              type="button"
              data-answer-index="${index}"
              ${answered ? "disabled" : ""}
            >
              ${escapeHtml(option)}
            </button>
          `,
        )
        .join("")}
    </div>

    <p class="feedback ${feedbackClass}">${escapeHtml(feedbackText)}</p>

    <div class="actions">
      ${
        answered
          ? `<button class="primary-button" type="button" id="next-button">
              ${currentQuestionIndex === questions.length - 1 ? "See Results" : "Next Question"}
            </button>`
          : `
            <button class="ghost-button" type="button" id="restart-button">Change Settings</button>
            <button class="primary-button" type="button" id="skip-button">Skip</button>
          `
      }
    </div>
  `;

  document.querySelectorAll("[data-answer-index]").forEach((button) => {
    button.addEventListener("click", () => {
      handleAnswer(Number(button.dataset.answerIndex));
    });
  });

  const nextButton = document.querySelector("#next-button");
  if (nextButton) {
    nextButton.addEventListener("click", handleNextQuestion);
  }

  const restartButton = document.querySelector("#restart-button");
  if (restartButton) {
    restartButton.addEventListener("click", resetQuiz);
  }

  const skipButton = document.querySelector("#skip-button");
  if (skipButton) {
    skipButton.addEventListener("click", () => handleAnswer(null));
  }
}

function renderResults() {
  clearInterval(timerId);
  const percentage = Math.round((score / questions.length) * 100);
  const highScore = getHighScore();

  app.innerHTML = `
    <div class="results">
      <p class="eyebrow">${selectedSource === "api" ? "Open Trivia DB API" : "Hardcoded"} · ${getActiveCategoryLabel()} · ${getActiveDifficultyLabel()}</p>
      <h1>${percentage}%</h1>
      <p class="results-copy">
        You scored ${score} out of ${questions.length}. ${
          score >= highScore
            ? "That is your best score so far."
            : `Your best score is ${highScore} out of ${questions.length}.`
        }
      </p>

      <div class="results-stats">
        <div class="stat">
          <strong>${score}</strong>
          <span>Correct</span>
        </div>
        <div class="stat">
          <strong>${questions.length - score}</strong>
          <span>Incorrect</span>
        </div>
        <div class="stat">
          <strong>${getHighScore()}</strong>
          <span>High Score</span>
        </div>
      </div>

      <div class="actions results-actions">
        <button class="ghost-button" type="button" id="settings-button">Change Settings</button>
        <button class="primary-button" type="button" id="restart-button">Restart Quiz</button>
      </div>
    </div>
  `;

  document.querySelector("#settings-button").addEventListener("click", resetQuiz);
  document.querySelector("#restart-button").addEventListener("click", startQuiz);
}

renderStartScreen();
