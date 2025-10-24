const form = document.getElementById("reference-form");
const list = document.getElementById("reference-list");
let count = 1;

// ページ読み込み時にアクセス日を自動入力
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const formatted = today.toISOString().split("T")[0];

  const accessInput = document.getElementById("access");
  const updateInput = document.getElementById("updated");


  if (accessInput) {
    if (!accessInput.value){
      accessInput.value = formatted;
    }
    accessInput.placeholder = formatted;
  }
  if (updateInput){
    updateInput.placeholder = formatted;
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault(); // ページのリロードを防ぐ

  const number = document.getElementById("number").value.trim();
  const author = document.getElementById("author").value.trim();
  const title = document.getElementById("title").value.trim();
  const site = document.getElementById("site").value.trim();
  const updated = document.getElementById("updated").value.trim();
  const url = document.getElementById("url").value.trim();
  const access = document.getElementById("access").value.trim();

  // 文献フォーマットを組み立て
  const formatted = `[${number}] ${author}. “${title}”. ${site}. ${updated}. ${url}, (${access})`;

  // <li>要素を作ってリストに追加
  const li = document.createElement("li");
  li.textContent = formatted;

  // 📋コピー用ボタンを作成
  const copyBtn = document.createElement("button");
  copyBtn.textContent = "📋 コピー";
  copyBtn.classList.add("copy-btn");
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(formatted)
      .then(() => {
        copyBtn.textContent = "✅ コピー済み";
        setTimeout(() => (copyBtn.textContent = "📋 コピー"), 1500);
      })
      .catch(() => {
        alert("コピーに失敗しました。");
      });
  });

  li.appendChild(copyBtn);
  list.appendChild(li);

  count++;

  form.reset(); // 入力欄をリセット
});