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

document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  const reportForm = document.getElementById('report-form');
  const titleInput = document.getElementById('report-title');
  const dateInput = document.getElementById('report-date');

  // localStorageから保存されたイベントを読み込む
  const savedEvents = JSON.parse(localStorage.getItem('reportEvents')) || [];

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'ja',
    height: 'auto',
    editable: true, // ドラッグで動かせるようにする
    events: savedEvents,
    eventClick: function(info) {
      if (confirm(`「${info.event.title}」を削除しますか？`)) {
        info.event.remove();
        saveEvents(); // 削除後にlocalStorage更新
      }
    },
    eventDrop: function() {
      saveEvents(); // 日付変更時に保存
    }
  });

  calendar.render();

  // フォーム送信で新しいレポートを追加
  reportForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const date = dateInput.value;

    if (title && date) {
      calendar.addEvent({
        title: title,
        start: date,
        color: '#74c0fc'
      });

      saveEvents(); // localStorageに保存
      reportForm.reset();
    }
  });

  // localStorageにイベントを保存する関数
  function saveEvents() {
    const events = calendar.getEvents().map(event => ({
      title: event.title,
      start: event.startStr,
      color: event.backgroundColor
    }));
    localStorage.setItem('reportEvents', JSON.stringify(events));
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