'use strict';

/*
  CYBER RESCUE
  Browser version of the Python learning game
*/

// ------------------------------
// Game data and state
// ------------------------------

const state = {
  level: 0,
  score: 0,
  username: '',
  passwordAttempts: 3,
  quizQuestion: 0,
  quizCorrect: 0,
  virusHealth: 3,
  gameFinished: false
};

const quizQuestions = [
  {
    question: 'What command displays text on the screen?',
    answer: 'print'
  },
  {
    question: 'What command collects user input?',
    answer: 'input'
  },
  {
    question: 'What keyword starts a decision statement?',
    answer: 'if'
  }
];

const levelInformation = [
  {
    label: 'Mission briefing',
    title: 'The network needs your help',
    badge: '!',
    badgeClass: 'badge--orange'
  },
  {
    label: 'Level 1',
    title: 'Log in to the network',
    badge: '1',
    badgeClass: 'badge--orange'
  },
  {
    label: 'Level 2',
    title: 'Respond to the virus alert',
    badge: '2',
    badgeClass: 'badge--cyan'
  },
  {
    label: 'Level 3',
    title: 'Recover the password',
    badge: '3',
    badgeClass: 'badge--lime'
  },
  {
    label: 'Level 4',
    title: 'Find the malware',
    badge: '4',
    badgeClass: 'badge--magenta'
  },
  {
    label: 'Level 5',
    title: 'Complete the security quiz',
    badge: '5',
    badgeClass: 'badge--purple'
  },
  {
    label: 'Final challenge',
    title: 'Restore the network',
    badge: '6',
    badgeClass: 'badge--orange'
  }
];

// ------------------------------
// Page elements
// ------------------------------

const elements = {
  levelDisplay: document.querySelector('#level-display'),
  scoreDisplay: document.querySelector('#score-display'),
  progressDisplay: document.querySelector('#progress-display'),
  progressBar: document.querySelector('#progress-bar'),
  levelBadge: document.querySelector('#level-badge'),
  levelLabel: document.querySelector('#level-label'),
  heading: document.querySelector('#game-heading'),
  output: document.querySelector('#game-output'),
  inputArea: document.querySelector('#input-area'),
  feedback: document.querySelector('#feedback'),
  form: document.querySelector('#answer-form'),
  startButton: document.querySelector('#start-button')
};

// ------------------------------
// Utility functions
// ------------------------------

function normaliseAnswer(answer) {
  return answer.trim().toLowerCase();
}

function updateStatus() {
  const information = levelInformation[state.level];

  elements.levelDisplay.textContent = information.label;
  elements.scoreDisplay.textContent = state.score;
  elements.progressDisplay.textContent =
    `${Math.min(state.level, 6)} of 6`;

  const progress = (Math.min(state.level, 6) / 6) * 100;
  elements.progressBar.style.width = `${progress}%`;

  elements.levelLabel.textContent = information.label;
  elements.heading.textContent = information.title;
  elements.levelBadge.textContent = information.badge;

  elements.levelBadge.className =
    `badge ${information.badgeClass}`;
}

function setOutput(paragraphs) {
  elements.output.replaceChildren();

  paragraphs.forEach((text) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    elements.output.appendChild(paragraph);
  });
}

function clearInputArea() {
  elements.inputArea.replaceChildren();
}

function clearFeedback() {
  elements.feedback.textContent = '';
  elements.feedback.className = 'feedback';
}

function showFeedback(message, type) {
  elements.feedback.textContent = message;
  elements.feedback.className = `feedback feedback--${type}`;
}

function addScore(points) {
  state.score += points;
  elements.scoreDisplay.textContent = state.score;
  showFeedback(`Correct! +${points} points`, 'correct');
}

function createTextQuestion({
  label,
  buttonText,
  onSubmit,
  hint = '',
  inputType = 'text',
  autocomplete = 'off'
}) {
  clearInputArea();

  const group = document.createElement('div');
  group.className = 'form-group';

  const inputLabel = document.createElement('label');
  inputLabel.className = 'form-label';
  inputLabel.htmlFor = 'game-answer';
  inputLabel.textContent = label;

  const input = document.createElement('input');
  input.className = 'text-input';
  input.id = 'game-answer';
  input.name = 'game-answer';
  input.type = inputType;
  input.autocomplete = autocomplete;
  input.required = true;

  group.append(inputLabel, input);

  if (hint) {
    const hintElement = document.createElement('p');
    hintElement.className = 'form-hint';
    hintElement.id = 'answer-hint';
    hintElement.textContent = hint;
    input.setAttribute('aria-describedby', 'answer-hint');
    group.appendChild(hintElement);
  }

  const button = document.createElement('button');
  button.className = 'btn btn--primary';
  button.type = 'submit';
  button.textContent = buttonText;

  elements.inputArea.append(group, button);

  elements.form.onsubmit = (event) => {
    event.preventDefault();

    const answer = input.value;
    onSubmit(answer);
  };

  input.focus();
}

function createChoiceQuestion({
  question,
  choices,
  onSubmit
}) {
  clearInputArea();

  const group = document.createElement('div');
  group.className = 'form-group';

  const label = document.createElement('label');
  label.className = 'form-label';
  label.htmlFor = 'game-answer';
  label.textContent = question;

  const select = document.createElement('select');
  select.className = 'select-input';
  select.id = 'game-answer';
  select.name = 'game-answer';
  select.required = true;

  const promptOption = document.createElement('option');
  promptOption.value = '';
  promptOption.textContent = 'Select an answer';
  promptOption.disabled = true;
  promptOption.selected = true;

  select.appendChild(promptOption);

  choices.forEach((choice) => {
    const option = document.createElement('option');
    option.value = choice.value;
    option.textContent = choice.label;
    select.appendChild(option);
  });

  group.append(label, select);

  const button = document.createElement('button');
  button.className = 'btn btn--primary';
  button.type = 'submit';
  button.textContent = 'Submit answer';

  elements.inputArea.append(group, button);

  elements.form.onsubmit = (event) => {
    event.preventDefault();
    onSubmit(select.value);
  };

  select.focus();
}

function createContinueButton(text, action) {
  clearInputArea();

  const button = document.createElement('button');
  button.className = 'btn btn--primary';
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', action);

  elements.inputArea.appendChild(button);
  button.focus();
}

function createRestartButton() {
  clearInputArea();

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';

  const restartButton = document.createElement('button');
  restartButton.className = 'btn btn--accent';
  restartButton.type = 'button';
  restartButton.textContent = 'Play again';
  restartButton.addEventListener('click', restartGame);

  buttonGroup.appendChild(restartButton);
  elements.inputArea.appendChild(buttonGroup);

  restartButton.focus();
}

// ------------------------------
// Game flow
// ------------------------------

function startGame() {
  state.level = 1;
  clearFeedback();
  updateStatus();
  level1();
}

function level1() {
  setOutput([
    'Create an agent name to log in to the network.',
    'You will use this name throughout your mission.'
  ]);

  createTextQuestion({
    label: 'Enter your agent name',
    buttonText: 'Log in',
    autocomplete: 'nickname',
    onSubmit: (answer) => {
      const username = answer.trim();

      if (!username) {
        showFeedback('Enter an agent name to continue.', 'incorrect');
        return;
      }

      state.username = username;
      addScore(10);

      setOutput([
        `Welcome, Agent ${state.username}.`,
        'Your identity has been confirmed and the mission is ready.'
      ]);

      createContinueButton('Continue to level 2', () => {
        state.level = 2;
        clearFeedback();
        updateStatus();
        level2();
      });
    }
  });
}

function level2() {
  setOutput([
    'A virus has been detected on the network.',
    'Choose the safest response.'
  ]);

  createChoiceQuestion({
    question: 'What should you do?',
    choices: [
      {
        value: 'scan',
        label: 'Scan and isolate the threat'
      },
      {
        value: 'ignore',
        label: 'Ignore the warning'
      }
    ],
    onSubmit: (answer) => {
      if (answer === 'scan') {
        addScore(20);

        setOutput([
          'The scan has isolated the threat.',
          'The rest of the network remains protected.'
        ]);

        createContinueButton('Continue to level 3', () => {
          state.level = 3;
          clearFeedback();
          updateStatus();
          level3();
        });
      } else {
        gameOver(
          'The warning was ignored and the disruption spread across the network.'
        );
      }
    }
  });
}

function level3() {
  setOutput([
    'The security system is locked.',
    'You have three attempts to recover the password.'
  ]);

  askForPassword();
}

function askForPassword() {
  createTextQuestion({
    label: 'Guess the password',
    buttonText: 'Check password',
    hint: `Attempts remaining: ${state.passwordAttempts}`,
    onSubmit: (answer) => {
      const guess = normaliseAnswer(answer);

      if (guess === 'python') {
        addScore(30);

        setOutput([
          'Access granted.',
          'The security controls are available again.'
        ]);

        createContinueButton('Continue to level 4', () => {
          state.level = 4;
          clearFeedback();
          updateStatus();
          level4();
        });

        return;
      }

      state.passwordAttempts -= 1;

      if (state.passwordAttempts <= 0) {
        gameOver(
          'No password attempts remain, so the security system is still locked.'
        );
        return;
      }

      showFeedback(
        `That password is incorrect. ${state.passwordAttempts} attempts remain.`,
        'incorrect'
      );

      askForPassword();
    }
  });
}

function level4() {
  setOutput([
    'Threat list: trojan, worm, spyware and adware.',
    'Identify the threat that is designed to collect information about users.'
  ]);

  createChoiceQuestion({
    question: 'Which threat is designed to spy on users?',
    choices: [
      { value: 'trojan', label: 'Trojan' },
      { value: 'worm', label: 'Worm' },
      { value: 'spyware', label: 'Spyware' },
      { value: 'adware', label: 'Adware' }
    ],
    onSubmit: (answer) => {
      if (answer === 'spyware') {
        addScore(40);

        setOutput([
          'Correct. Spyware is designed to monitor users and collect information.',
          'The threat has been identified.'
        ]);

        createContinueButton('Continue to level 5', () => {
          state.level = 5;
          clearFeedback();
          updateStatus();
          level5();
        });
      } else {
        gameOver(
          'The incorrect threat was selected, so the monitoring software remained active.'
        );
      }
    }
  });
}

function level5() {
  state.quizQuestion = 0;
  state.quizCorrect = 0;

  setOutput([
    'Complete three short Python questions.',
    'You need at least two correct answers to continue.'
  ]);

  askQuizQuestion();
}

function askQuizQuestion() {
  const currentQuestion = quizQuestions[state.quizQuestion];

  createTextQuestion({
    label: currentQuestion.question,
    buttonText: 'Submit answer',
    hint: `Question ${state.quizQuestion + 1} of ${quizQuestions.length}`,
    onSubmit: (answer) => {
      const userAnswer = normaliseAnswer(answer);
      const isCorrect = userAnswer === currentQuestion.answer;

      if (isCorrect) {
        state.quizCorrect += 1;
        showFeedback('Correct!', 'correct');
      } else {
        showFeedback(
          `The correct answer was “${currentQuestion.answer}”.`,
          'incorrect'
        );
      }

      state.quizQuestion += 1;

      if (state.quizQuestion < quizQuestions.length) {
        createContinueButton('Next question', () => {
          clearFeedback();
          askQuizQuestion();
        });
        return;
      }

      finishQuiz();
    }
  });
}

function finishQuiz() {
  if (state.quizCorrect >= 2) {
    addScore(50);

    setOutput([
      `You answered ${state.quizCorrect} of ${quizQuestions.length} questions correctly.`,
      'You have passed the security quiz.'
    ]);

    createContinueButton('Begin the final challenge', () => {
      state.level = 6;
      clearFeedback();
      updateStatus();
      finalChallenge();
    });
  } else {
    gameOver(
      `You answered ${state.quizCorrect} of ${quizQuestions.length} questions correctly. Two correct answers were required.`
    );
  }
}

function finalChallenge() {
  setOutput([
    'The AI virus is still disrupting the central system.',
    'Run the PYTHON recovery command three times to restore the network.',
    `System issues remaining: ${state.virusHealth}`
  ]);

  askForRecoveryCommand();
}

function askForRecoveryCommand() {
  createTextQuestion({
    label: 'Enter the recovery command',
    buttonText: 'Run command',
    hint: 'Type PYTHON to apply the recovery patch.',
    onSubmit: (answer) => {
      if (answer.trim().toUpperCase() === 'PYTHON') {
        state.virusHealth -= 1;

        if (state.virusHealth === 0) {
          addScore(100);
          completeGame();
          return;
        }

        showFeedback(
          `Patch successful. ${state.virusHealth} system issues remain.`,
          'correct'
        );

        setOutput([
          'The recovery command was successful.',
          `System issues remaining: ${state.virusHealth}`
        ]);

        askForRecoveryCommand();
      } else {
        showFeedback(
          'The command was not recognised. Type PYTHON and try again.',
          'incorrect'
        );
      }
    }
  });
}

function completeGame() {
  state.gameFinished = true;
  updateStatus();

  elements.progressBar.style.width = '100%';
  elements.progressDisplay.textContent = '6 of 6';

  elements.levelLabel.textContent = 'Mission complete';
  elements.heading.textContent = 'The network has been restored';
  elements.levelBadge.textContent = '✓';
  elements.levelBadge.className = 'badge badge--lime';

  setOutput([
    `Excellent work, Agent ${state.username}.`,
    'The network has been restored and all challenges are complete.',
    `Your final score is ${state.score} points.`
  ]);

  showFeedback('You are the Cyber Rescue champion!', 'correct');
  createRestartButton();
}

function gameOver(reason) {
  state.gameFinished = true;

  elements.levelLabel.textContent = 'Mission ended';
  elements.heading.textContent = 'Game over';
  elements.levelBadge.textContent = '!';
  elements.levelBadge.className = 'badge badge--magenta';

  setOutput([
    reason,
    `Your final score is ${state.score} points.`,
    'Restart the game to try the mission again.'
  ]);

  showFeedback('Mission incomplete. Try again when you are ready.', 'incorrect');
  createRestartButton();
}

function restartGame() {
  state.level = 0;
  state.score = 0;
  state.username = '';
  state.passwordAttempts = 3;
  state.quizQuestion = 0;
  state.quizCorrect = 0;
  state.virusHealth = 3;
  state.gameFinished = false;

  clearFeedback();
  updateStatus();

  setOutput([
    'A dangerous AI virus has disrupted the college network.',
    'Complete each challenge, collect points and restore the system.'
  ]);

  clearInputArea();

  const button = document.createElement('button');
  button.className = 'btn btn--accent';
  button.type = 'button';
  button.textContent = 'Begin your mission';
  button.addEventListener('click', startGame);

  elements.inputArea.appendChild(button);
  button.focus();
}

// ------------------------------
// Start-button event
// ------------------------------

elements.startButton.addEventListener('click', startGame);
updateStatus();

