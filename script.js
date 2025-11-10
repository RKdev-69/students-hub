const form = document.getElementById("reference-form");
const list = document.getElementById("reference-list");
const tabItems = document.querySelectorAll(".tab-item");
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

let calendar;

document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  if (calendarEl) {
    const reportForm = document.getElementById('report-form');
    const titleInput = document.getElementById('report-title');
    const reportdateInput = document.getElementById('report-date');
    const targetdateInput = document.getElementById('target-date');

    // localStorageから保存されたイベントを読み込む
    const savedEvents = JSON.parse(localStorage.getItem('reportEvents')) || [];

    calendar = new FullCalendar.Calendar(calendarEl, {
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
    displayReports();

    // フォーム送信で新しいレポートを追加
    reportForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const title = titleInput.value.trim();
      const reportdate = reportdateInput.value;
      const targetdate = targetdateInput.value;

      if (title && reportdate && targetdate) {
        calendar.addEvent({
          title: title,
          start: reportdate,
          color: '#ff0000ff'
        });

        calendar.addEvent({
          title: title,
          start: targetdate,
          color: '#008900ff'
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

      displayReports();
    }

    function displayReports() {
      const reportList = document.getElementById("report-list");
      if (!reportList) return;
    
    // localStorageからイベントデータを取得
      const savedEvents = JSON.parse(localStorage.getItem('reportEvents')) || [];
    
      // レポート名でイベントをグループ化し、日付をまとめる
      const reports = savedEvents.reduce((acc, event) => {
        if (!acc[event.title]) {
          acc[event.title] = {
            deadlines: []
          };
        }
        // 日付の重複を避けて追加
        if (!acc[event.title].deadlines.includes(event.start.split('T')[0])) {
            acc[event.title].deadlines.push(event.start.split('T')[0]);
        }
        return acc;
      }, {});
    
      // リストをクリア
      reportList.innerHTML = '';
    
      // レポートごとにリストアイテムを作成して表示
      for (const title in reports) {
        const report = reports[title];
        const li = document.createElement('li');
    
        // 日付を昇順でソート
        report.deadlines.sort();
    
        const targetDate = report.deadlines[0]; // 目標提出日
        const originalDate = report.deadlines[1] || targetDate; // 本来の提出日
    
        li.innerHTML = `
          <strong>${title}</strong>
          <br>
          <small>目標日: ${targetDate} / 提出日: ${originalDate}</small>
        `;
        reportList.appendChild(li);
      }
  }
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

tabItems.forEach((tabItem) => {
  tabItem.addEventListener("click", () => {
    // すべてのタブを非アクティブにする
    tabItems.forEach((t) => {
      t.classList.remove("active");
    });
    // すべてのコンテンツを非表示にする
    const tabPanels = document.querySelectorAll(".tab-panel");
    tabPanels.forEach((tabPanel) => {
      tabPanel.classList.remove("active");
    });

    // クリックされたタブをアクティブにする
    tabItem.classList.add("active");

    // 対応するコンテンツを表示
    const tabIndex = Array.from(tabItems).indexOf(tabItem);
    const activePanel = tabPanels[tabIndex];
    activePanel.classList.add("active");

    // カレンダータブが表示されたら、カレンダーのサイズを更新
    if (activePanel.querySelector('#calendar') && calendar) {
      calendar.updateSize();
    }
  });
});

