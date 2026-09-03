import manifest from "../../assets/cards/manifest.json";

const cards = manifest.characters.flatMap((character) =>
  character.cards.map((card) => ({ ...card, character: character.id }))
);
const xml = (value) => String(value || "").replace(/[&<>\"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" }[char]));
const base64 = (bytes) => {
  let result = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) result += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(result);
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(`<!doctype html><meta name="viewport" content="width=device-width"><title>浮生有典</title>
<style>body{margin:0;background:#090807;color:#f5ead5;font:16px system-ui;text-align:center}main{max-width:900px;margin:8vh auto;padding:24px}h1{font:42px Georgia;margin:0 0 8px}p{color:#b9aa91}.stage{position:relative;min-height:520px;margin:28px auto;display:grid;place-items:center;perspective:1200px}.stage:before{content:"";position:absolute;width:260px;height:260px;border-radius:50%;background:#d6ad68;filter:blur(70px);opacity:0}.card{position:relative;width:100%;max-height:70vh;object-fit:contain;border-radius:18px;opacity:0;transform:rotateY(90deg) scale(.55);filter:brightness(.25);box-shadow:0 0 0 2px #d6ad68,0 0 0 8px #5e431b,0 0 0 10px #d6ad68,0 0 0 18px #2b1b08,0 0 40px #d6ad68}.card.show{animation:cardOpen 2.2s cubic-bezier(.2,.8,.2,1) forwards}.stage.show:before{animation:burst 2.2s ease-out forwards}.stage:after{content:"";position:absolute;inset:8% 0;background:linear-gradient(110deg,transparent 35%,rgba(255,244,190,.9) 48%,transparent 60%);transform:translateX(-120%);pointer-events:none}.stage.show:after{animation:shine 1.8s 1s ease-out forwards}@keyframes cardOpen{0%{opacity:0;transform:rotateY(90deg) scale(.55);filter:brightness(.25)}35%{opacity:1;transform:rotateY(-24deg) scale(1.04);filter:brightness(1.8)}65%{transform:rotateY(14deg) scale(1.01);filter:brightness(1.15)}100%{opacity:1;transform:rotateY(0) scale(1);filter:brightness(1)}}@keyframes burst{0%{opacity:0;transform:scale(.3)}35%{opacity:1;transform:scale(1.7)}100%{opacity:.35;transform:scale(1.1)}}@keyframes shine{to{transform:translateX(120%)}}button,select{padding:12px 16px;border:1px solid #92794f;border-radius:999px;background:#d6ad68;color:#211a11;font-weight:700}select{margin-right:8px;background:#f5ead5}</style>
<main><h1>浮生有典</h1><p>抽一张今日偶得卡</p><select id="character"><option value="">随机角色</option><option value="character-01">角色一</option><option value="character-02">角色二</option><option value="character-03">角色三</option></select><button id="draw">抽卡</button><div id="stage" class="stage"><img id="card" class="card" alt="等待抽卡" hidden></div></main>
<script>const stage=document.querySelector('#stage'),img=document.querySelector('#card');document.querySelector('#draw').onclick=()=>{const c=document.querySelector('#character').value;stage.classList.remove('show');img.classList.remove('show');void stage.offsetWidth;img.src='/card.svg?nonce='+Date.now()+(c?'&character='+c:'');img.hidden=false;stage.classList.add('show');img.classList.add('show')}</script>`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
    if (request.method !== "GET" || !["/card", "/card.png", "/card.svg"].includes(url.pathname)) {
      return new Response("Not found", { status: 404 });
    }

    const character = url.searchParams.get("character");
    const state = url.searchParams.get("state");
    const matches = cards.filter((card) =>
      (!character || card.character === character) && (!state || card.state === state)
    );
    if (!matches.length) return new Response("Card not found", { status: 404 });

    const card = matches[Math.floor(Math.random() * matches.length)];
    const object = await env.CARDS.get(card.object);
    if (!object) return new Response("Card asset unavailable", { status: 503 });

    if (url.pathname === "/card.svg") {
      const image = `data:image/png;base64,${base64(new Uint8Array(await object.arrayBuffer()))}`;
      const quote = xml(url.searchParams.get("quote") || "今日偶得");
      const source = xml(url.searchParams.get("source") || `浮生有典 · ${card.state}`);
      return new Response(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" rx="24" fill="#191612"/><rect x="520" y="40" width="620" height="720" rx="16" fill="#2a241d"/><image href="${image}" x="540" y="60" width="580" height="680" preserveAspectRatio="xMidYMid meet"/><text x="80" y="250" fill="#92794f" font-size="18" font-family="sans-serif">浮生有典 · ${xml(card.state)}</text><text x="80" y="340" fill="#f5ead5" font-size="36" font-family="serif">${quote}</text><text x="80" y="420" fill="#cdbb9c" font-size="22" font-family="serif">——${source}</text><text x="80" y="700" fill="#92794f" font-size="16" font-family="sans-serif">${xml(card.id)}</text></svg>`, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "no-store", "X-Card-Id": card.id, "X-Card-State": card.state } });
    }
    return new Response(object.body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
        "X-Card-Id": card.id,
        "X-Card-State": card.state,
      },
    });
  },
};
