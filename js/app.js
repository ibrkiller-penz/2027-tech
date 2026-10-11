const app = document.getElementById("app");
const search = document.getElementById("search");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function ytEmbed(url) {
  const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function home() {
  return `
    <h1>기술·가정 수업 홈</h1>
    <p class="muted">단원을 고르면 차시별 목표, 활동, 자료를 볼 수 있어요.</p>
    ${SITE.notices.length ? `<div class="notice"><b>📢 공지</b><ul>${SITE.notices.map(n => `<li>${esc(n)}</li>`).join("")}</ul></div>` : ""}
    <h2>단원</h2>
    <div class="grid">${SITE.units.map((u, i) => `
      <a class="card" href="#/u/${i}">
        <div class="num">${i + 1}단원</div>
        <h3>${esc(u.title)}</h3>
        <div class="muted">${esc(u.desc)}</div>
        <div class="muted">${u.lessons.length}개 차시</div>
      </a>`).join("")}</div>`;
}

function unit(i) {
  const u = SITE.units[i];
  if (!u) return notFound();
  return `
    <div class="crumb"><a href="#/">홈</a> › ${i + 1}단원</div>
    <h1>${i + 1}. ${esc(u.title)}</h1>
    <p class="muted">${esc(u.desc)}</p>
    ${u.lessons.length ? `<ul class="lessons">${u.lessons.map((l, j) => `
      <li><a href="#/u/${i}/${j}"><span>${esc(l.title)}</span><span class="muted">›</span></a></li>`).join("")}</ul>`
      : `<p class="muted">아직 등록된 차시가 없습니다.</p>`}`;
}

function lesson(i, j) {
  const u = SITE.units[i], l = u && u.lessons[j];
  if (!l) return notFound();
  const list = (t, a) => a && a.length ? `<div class="box"><b>${t}</b><ol>${a.map(x => `<li>${esc(x)}</li>`).join("")}</ol></div>` : "";
  const res = l.resources || [];
  const firstPdf = res.find(r => /\.pdf$/i.test(r.file));
  const yt = l.video && ytEmbed(l.video);
  return `
    <div class="crumb"><a href="#/">홈</a> › <a href="#/u/${i}">${i + 1}단원</a> › ${esc(l.title)}</div>
    <h1>${esc(l.title)}</h1>
    ${list("🎯 학습 목표", l.goals)}
    ${list("📝 활동", l.activities)}
    ${res.length ? `<h2>자료</h2><div class="res">${res.map(r => `<a href="${esc(r.file)}" target="_blank" rel="noopener">📄 ${esc(r.label)}</a>`).join("")}</div>` : ""}
    ${firstPdf ? `<iframe class="pdf" src="${esc(firstPdf.file)}" title="${esc(firstPdf.label)}"></iframe>` : ""}
    ${yt ? `<h2>영상</h2><div class="video"><iframe src="${yt}" allowfullscreen title="수업 영상"></iframe></div>` : ""}
    <p>${j > 0 ? `<a href="#/u/${i}/${j - 1}">‹ 이전 차시</a>` : ""}
       ${j < u.lessons.length - 1 ? ` · <a href="#/u/${i}/${j + 1}">다음 차시 ›</a>` : ""}</p>`;
}

function results(q) {
  q = q.toLowerCase();
  const hits = [];
  SITE.units.forEach((u, i) => u.lessons.forEach((l, j) => {
    const text = [u.title, l.title, ...(l.goals || []), ...(l.activities || []), ...(l.resources || []).map(r => r.label)].join(" ").toLowerCase();
    if (text.includes(q)) hits.push(`<li><a href="#/u/${i}/${j}"><span>${esc(l.title)}</span><span class="muted">${esc(u.title)}</span></a></li>`);
  }));
  return `<h1>“${esc(q)}” 검색 결과</h1>${hits.length ? `<ul class="lessons">${hits.join("")}</ul>` : `<p class="muted">결과가 없습니다.</p>`}`;
}

const notFound = () => `<p>페이지를 찾을 수 없습니다. <a href="#/">홈으로</a></p>`;

function render() {
  const q = search.value.trim();
  if (q) { app.innerHTML = results(q); return; }
  const p = location.hash.replace(/^#\/?/, "").split("/");
  app.innerHTML = p[0] === "u" ? (p[2] !== undefined ? lesson(+p[1], +p[2]) : unit(+p[1])) : home();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", () => { search.value = ""; render(); });
search.addEventListener("input", render);
render();
