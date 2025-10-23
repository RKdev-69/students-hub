const form = document.getElementById("reference-form");
const list = document.getElementById("reference-list");
let count = 1;

form.addEventListener("submit", (event) => {
  event.preventDefault(); // ページのリロードを防ぐ

  const author = document.getElementById("author").value.trim();
  const title = document.getElementById("title").value.trim();
  const site = document.getElementById("site").value.trim();
  const updated = document.getElementById("updated").value.trim();
  const url = document.getElementById("url").value.trim();
  const accessed = document.getElementById("accessed").value.trim();

  // 文献フォーマットを組み立て
  const formatted = `[${count}] ${author}. “${title}”. ${site}. ${updated}. ${url}, (${accessed})`;

  // <li>要素を作ってリストに追加
  const li = document.createElement("li");
  li.textContent = formatted;
  list.appendChild(li);

  count++;

  form.reset(); // 入力欄をリセット
});