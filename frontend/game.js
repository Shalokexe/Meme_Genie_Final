
async function startGame() {
    await fetch("http://127.0.0.1:8000/api/start");
    nextQuestion();
}

async function nextQuestion() {
    const res = await fetch("http://127.0.0.1:8000/api/question");
    const data = await res.json();
    const area = document.getElementById("gameArea");

    if (data.guess) {
        area.innerHTML = `<h2>🎯 I guess: ${data.guess.name}</h2>
                          <video src="${data.guess.media_url}" controls autoplay></video>`;
        return;
    }

    area.innerHTML = `
        <h2>${data.question}</h2>
        <button onclick="answer(${data.question_id}, 'yes')">Yes</button>
        <button onclick="answer(${data.question_id}, 'no')">No</button>
    `;
}

async function answer(qid, ans) {
    await fetch(`http://127.0.0.1:8000/api/answer?question_id=${qid}&answer=${ans}`, {
        method: "POST"
    });
    nextQuestion();
}

function voiceMode() {
    alert("Voice mode coming soon 🚀");
}
