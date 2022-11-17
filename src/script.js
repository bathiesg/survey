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
        isSelected: false,
      },
      {
        id: "q1opt2",
        value: "No",
        isSelected: false,
      },
    ],
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
        isSelected: false,
      },
      {
        id: "q2opt2",
        value: "Piso",
        isSelected: false,
      },
    ],
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
        isSelected: false,
      },
      {
        id: "q3opt2",
        value: "50€",
        isSelected: false,
      },
      {
        id: "q3opt3",
        value: "80€",
        isSelected: false,
      },
      {
        id: "q3opt4",
        value: "100€",
        isSelected: false,
      },
      {
        id: "q3opt4",
        value: "+100€",
        isSelected: false,
      },
    ],
  },
  {
    id: 4,
    title: "Registro datos",
    refName: "register",
    isComplete: false,
    options: [
      {
        id: "q4opt1",
        value: "Nombre",
        answer: "",
        type: "text",
        name: "name",
      },
      {
        id: "q4opt2",
        value: "Apellidos",
        answer: "",
        type: "text",
        name: "lastname",
      },
      {
        id: "q4opt3",
        value: "Código postal",
        answer: "",
        type: "text",
        name: "zipcode",
      },
      {
        id: "q4opt4",
        value: "Email",
        answer: "",
        type: "email",
        name: "email",
      },
      {
        id: "q4opt4",
        value: "Número de Teléfono",
        answer: "",
        type: "tel",
        name: "phone",
      },
      {
        id: "q5opt4",
        value: "Acepto la política de privacidad y los términos y condiciones.",
        answer: false,
        type: "checkbox",
        name: "terms",
      },
      {
        id: "q6opt4",
        value: "Confirmar registro",
        answer: "",
        type: "submit",
        name: "submit",
      },
    ],
  },
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
        isComplete: !currentQuestion.isComplete,
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
    ...selectedOption,
  });
};

const goToPreviousQuestion = (e, prevQuestionId) => {
  console.log(prevQuestionId);
  let toggleCompleteQuestion = questionList.map((currentQuestion) => {
    if (currentQuestion.id === prevQuestionId) {
      currentQuestion = {
        ...currentQuestion,
        isComplete: !currentQuestion.isComplete,
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
    optionId: event.target.id,
  });
};

const validateRegister = (event, questionId) => {
  event.preventDefault();

  const inputs = [...document.querySelectorAll(".register")].map((input) => {
    return {
      id: input.id,
      value: input.type === "checkbox" ? input.checked : input.value,
    };
  });
  const targetQuestionIndex = questionList.findIndex(
    (question) => question.id === questionId
  );

  questionList[targetQuestionIndex].isComplete =
    !questionList[targetQuestionIndex].isComplete;
  questionList[targetQuestionIndex].options = questionList[
    targetQuestionIndex
  ].options.map((option) => {
    const updatedOption = inputs.find((input) => input.id === option.id);
    if (updatedOption) option.answer = updatedOption.value;

    return option;
  });

  storeDataToLocalStorage("survey", questionList);
  window.location.reload();
  console.table(inputs);
};

const createRadioOptionElement = (option, name, questionId) => {
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

const registerInput = (option, questionId) => {
  const container = document.createElement("div");
  const input = document.createElement("input");
  input.className = "register";
  input.name = option.name;
  input.type = option.type;
  input.id = option.id;
  if (option.type === "checkbox") {
    container.className = "terms";
    container.textContent = option.value;
    input.checked = option.answer ? "checked" : "";
  } else if (option.type === "submit") {
    input.value = option.value;
    input.className = "";
    input.addEventListener("click", (e) => validateRegister(e, questionId));
  } else {
    input.placeholder = option.value;
    input.value = option.answer;
  }
  container.appendChild(input);

  return container;
};

const optionsBuilder = (question) => {
  const optionsFragment = document.createDocumentFragment();
  const fieldset = document.createElement("fieldset");
  const isRegister = question.refName === "register";

  question.options.forEach((optionInput) =>
    isRegister
      ? fieldset.appendChild(registerInput(optionInput, question.id))
      : optionsFragment.appendChild(
          createRadioOptionElement(optionInput, question.refName, question.id)
        )
  );

  if (isRegister) {
    fieldset.className = "register-container";
    optionsFragment.appendChild(fieldset);
  }
  return optionsFragment;
};

const fieldsetBuilder = (question) => {
  const fieldset = document.createElement("fieldset");
  const legend = document.createElement("legend");

  legend.textContent = question.title;

  fieldset.className = "question-block";
  fieldset.append(legend);
  fieldset.appendChild(optionsBuilder(question));

  fieldset.addEventListener("submit", (e) => submitAnswer(e, question.id));

  return fieldset;
};

const totalQuestions = questionList.length;
const completedQuestions = questionList.filter((e) => e.isComplete);
const nomberOfCompletedQuestions = completedQuestions.length;
const isAllCompleted = nomberOfCompletedQuestions === totalQuestions;
const nextQuestion = questionList.find((e) => e.isComplete === false);
const prevQuestion = completedQuestions[nomberOfCompletedQuestions - 1];

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

const form = document.createElement("form");
form.id = "survey-form";

if (isAllCompleted) {
  questionList.forEach((currentQuestion) => {
    form.appendChild(fieldsetBuilder(currentQuestion));
  });
} else {
  form.appendChild(fieldsetBuilder(nextQuestion));
  if (nomberOfCompletedQuestions >= 1) {
    console.log("entro aqui", nomberOfCompletedQuestions);
    form.appendChild(buttonToGoToPrevoiusQuestion(prevQuestion.id));
  }
}

document.getElementById("form-wrapper").appendChild(form);

if (isAllCompleted) {
  // disable all fields after registration complete
  [...document.querySelectorAll("fieldset")].map(
    (currentFieldset) => (currentFieldset.disabled = true)
  );

  const resetButtonContainer = document.createElement("div");
  resetButtonContainer.className = "question-block";
  const resetButton = document.createElement("input");
  resetButton.className = "reset";
  resetButton.type = "reset";
  resetButton.value = "Repetir la encuesta";
  resetButton.addEventListener("click", () => {
    localStorage.removeItem("survey");
    window.location.reload();
  });

  resetButtonContainer.appendChild(resetButton);

  document.getElementById("form-wrapper").appendChild(resetButtonContainer);
}

window.onbeforeunload = () => {
  window.scrollTo(0, 0);
};
