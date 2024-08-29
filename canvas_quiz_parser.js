const questions = [];
const correctAnswers = [];
const correctIndexes = [];
const builtJson = {};

for (const q of [...document.querySelectorAll("#questions .question")]) {
  const correct_answer = q
    .querySelector(".correct_answer label")
    .innerText.trim();
  const correct_index = getIndex(
    [...q.querySelectorAll(".answers .answer")],
    correct_answer
  );
  const question = q.querySelector(".question_text").innerText.trim();

  questions.push(question);
  correctAnswers.push(correct_answer);
  correctIndexes.push(correct_index);
  builtJson[
    question
      .split(" ")
      .map((e) => e[0])
      .join("")
  ] = {
    question,
    correct_answer,
    correct_index,
  };
}
function getIndex(arr, corr) {
  for (const i in arr) {
    if (arr[i].title.includes(corr)) return i;
  }
  return -1;
}

function parse(x) {
  const parsed = JSON.parse(x);
  for (index in parsed) {
    console.log(
      `${parsed[index].question}\n${parsed[index].correct_index} - ${parsed[index].correct_answer}`
    );
  }
}


// canvas overrides the console log 
count = 0;
function printToScreen(parsed) {
  let element = document.createElement('div')
  element.style.marginLeft = "120px";
  for (index in parsed) {
    element.innerHTML += `${parsed[index].question}</br>${parsed[index].correct_index} - ${parsed[index].correct_answer}</br></br>`
    count += 1;
  }
  document.body.appendChild(element);
  element.scrollIntoView(true);
}
printToScreen(builtJson);
console.log(count);
