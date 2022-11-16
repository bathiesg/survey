const Data = [
  {
    id: 1,
    title: "1) ¿Eres propietario de tu vivienda?",
    refName: "q1",
    isComplete: false,
    options: [
      {
        id: "q1opt1",
        value: "Sí",
        isSelected: false
      },
      {
        id: "q1opt2",
        value: "No",
        isSelected: false
      }
    ]
  },
  {
    id: 2,
    title: "2) ¿Cuál es tu tipo de vivienda?",
    refName: "q2",
    isComplete: false,
    options: [
      {
        id: "q2opt1",
        value: "Casa unifamiliar",
        isSelected: false
      },
      {
        id: "q2opt2",
        value: "Piso",
        isSelected: false
      }
    ]
  },
  {
    id: 3,
    title:
      "3) ¿Cuánto es aproximadamente tu gasto promedio mensual de la factura de la luz?",
    refName: "q3",
    isComplete: false,
    options: [
      {
        id: "q3opt1",
        value: "30€",
        isSelected: false
      },
      {
        id: "q3opt2",
        value: "50€",
        isSelected: false
      },
      {
        id: "q3opt3",
        value: "80€",
        isSelected: false
      },
      {
        id: "q3opt4",
        value: "100€",
        isSelected: false
      },
      {
        id: "q3opt4",
        value: "+100€",
        isSelected: false
      }
    ]
  }
];

const getDataFromLocalStorage = (key, initialValue) => {
  if (typeof window === "undefined") {
    return initialValue;
  }

  try {
    // Get from local storage by key
    const item = window.localStorage.getItem(key);
    // Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    // If error also return initialValue
    console.log(error);
    return initialValue;
  }
};

const storeDataToLocalStorage = (key, initialValue) => {
  try {
    // Save to local storage
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(initialValue));
    }
  } catch (error) {
    // A more advanced implementation would handle the error case
    console.log(error);
  }
};

const questionList = getDataFromLocalStorage("survey", Data);

const handleResponse = ({ optionId, questionId }) => {
  let updatedQuestionList = questionList.map((currentQuestion) => {
    if (currentQuestion.id === questionId) {
      currentQuestion = {
        ...currentQuestion,
        isComplete: !currentQuestion.isComplete
      };
      if (optionId) {
        currentQuestion.options = currentQuestion.options.map((option) => {
          option.isSelected = false;
          if (option.id === optionId) {
            option.isSelected = true;
          }
          return option;
        });
      }
    }
    return currentQuestion;
  });

  storeDataToLocalStorage("survey", updatedQuestionList);
  window.location.reload();
};

let selectedOption = null;

const submitAnswer = (e, questionId) => {
  e.preventDefault();
  console.log(selectedOption);

  handleResponse({
    questionId: questionId,
    ...selectedOption
  });
};
const goToPreviousQuestion = (e, prevQuestionId) => {
  console.log(prevQuestionId);
  let toggleCompleteQuestion = questionList.map((currentQuestion) => {
    if (currentQuestion.id === prevQuestionId) {
      currentQuestion = {
        ...currentQuestion,
        isComplete: !currentQuestion.isComplete
      };
    }
    return currentQuestion;
  });
  storeDataToLocalStorage("survey", toggleCompleteQuestion);
  window.location.reload();
};

const onValueChange = (event, questionId) => {
  console.log(event.target.id);
  // selectedOption = {
  //   optionId: event.target.id
  // };
  handleResponse({
    questionId: questionId,
    optionId: event.target.id
  });
};

const createOptionElement = (option, name, questionId) => {
  const container = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.name = name;
  input.type = "radio";
  input.id = option.id;
  input.value = option.value;
  input.checked = option.isSelected ? "checked" : "";
  input.addEventListener("change", (e) => onValueChange(e, questionId));
  label.htmlFor = option.id;
  label.textContent = option.value;
  container.appendChild(input);
  container.appendChild(label);

  return container;
};

const optionsBuilder = (question) => {
  const optionsFragment = document.createDocumentFragment();
  question.options.forEach((optionInput) =>
    optionsFragment.appendChild(
      createOptionElement(optionInput, question.refName, question.id)
    )
  );

  return optionsFragment;
};

const formBuilder = (question) => {
  const questionBlock = document.createElement("div");
  const form = document.createElement("form");
  const fieldset = document.createElement("fieldset");
  const legend = document.createElement("legend");
  // const button = document.createElement("button");

  legend.textContent = question.title;
  // button.className = "btn btn-default Submit-button";
  // button.textContent = "submit";
  // button.type = "submit";
  fieldset.append(legend);
  fieldset.appendChild(optionsBuilder(question));
  // fieldset.appendChild(button);

  form.addEventListener("submit", (e) => submitAnswer(e, question.id));
  form.appendChild(fieldset);
  questionBlock.className = "question-block";
  questionBlock.appendChild(form);

  return questionBlock;
};

const fragment = document.createDocumentFragment();

const totalQuestions = questionList.length;
const completedQuestions = questionList.filter((e) => e.isComplete);
const nomberOfCompletedQuestions = completedQuestions.length;
const isAllCompleted = nomberOfCompletedQuestions === totalQuestions;
const nextQuestion = questionList.find((e) => e.isComplete === false);
const prevQuestion = completedQuestions[nomberOfCompletedQuestions - 1];
console.log(prevQuestion);

const buttonToGoToPrevoiusQuestion = (prevQuestionId) => {
  const prevButtonContainer = document.createElement("div");
  const prevButtonElement = document.createElement("button");
  prevButtonElement.className = "prev-button";
  prevButtonElement.textContent = "< Pregunta anterior";
  prevButtonElement.addEventListener("click", (e) =>
    goToPreviousQuestion(e, prevQuestionId)
  );
  prevButtonContainer.className = "question-block horizontal-rule";
  prevButtonContainer.appendChild(prevButtonElement);

  return prevButtonContainer;
};

if (isAllCompleted) {
  questionList.forEach((currentQuestion, index) => {
    fragment.appendChild(formBuilder(currentQuestion));
  });
} else {
  fragment.appendChild(formBuilder(nextQuestion));
  if (nomberOfCompletedQuestions >= 1) {
    console.log("entro aqui", nomberOfCompletedQuestions);
    fragment.appendChild(buttonToGoToPrevoiusQuestion(prevQuestion.id));
  }
}

// questionList.forEach((currentQuestion) => {
//   fragment.appendChild(formBuilder(currentQuestion));
// });

document.getElementById("form-wrapper").appendChild(fragment);
