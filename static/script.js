const STORAGE_KEY = "history";
const MAX_HISTORY = 10;

async function generateCode(text) {
  try {
    const response = await fetch("/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error("Network Error");

    const data = await response.json();
    return data.image;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function getHistory() {
  const historyStr = localStorage.getItem(STORAGE_KEY);
  return historyStr ? JSON.parse(historyStr) : {};
}

function saveHistory(text, dataUrl) {
  const history = getHistory();

  delete history[text];

  history[text] = dataUrl;

  const keys = Object.keys(history);
  if (keys.length > MAX_HISTORY) {
    delete history[keys[0]];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = getHistory();
  const listElement = document.getElementById("history-list");
  const template = document.getElementById("history-template");

  listElement.innerHTML = "";

  const entries = Object.entries(history).reverse();

  if (entries.length === 0) {
    listElement.innerHTML = '<div class="empty-message">履歴はありません</div>';
    return;
  }

  entries.forEach(([text, image]) => {
    const clone = template.content.cloneNode(true);

    const summaryImg = clone.querySelector(".history-thumb");
    const summaryText = clone.querySelector(".history-text");
    const detailsImg = clone.querySelector(".code-image");

    summaryImg.src = image;
    summaryText.textContent = text;
    detailsImg.src = image;

    listElement.appendChild(clone);
  });
}

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = document.getElementById("text-input").value;

  const history = getHistory();
  const dataUrl = history[text] || (await generateCode(text));

  if (dataUrl) {
    document.getElementById("result-image").src = dataUrl;
    saveHistory(text, dataUrl);
  }
});

function init() {
  renderHistory();
}

document.getElementById("clear-btn").addEventListener("click", () => {
  if (confirm("履歴をすべて削除しますか？")) {
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  }
});

init();
