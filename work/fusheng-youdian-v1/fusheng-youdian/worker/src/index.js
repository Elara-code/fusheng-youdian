import manifest from "../../assets/cards/manifest.json";

const cards = manifest.characters.flatMap((character) =>
  character.cards.map((card) => ({ ...card, character: character.id }))
);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(`<!doctype html><meta name="viewport" content="width=device-width"><title>浮生有典</title>
<style>body{margin:0;background:#171512;color:#f5ead5;font:16px system-ui;text-align:center}main{max-width:560px;margin:8vh auto;padding:24px}h1{font:42px Georgia;margin:0 0 8px}p{color:#b9aa91}img{display:block;width:100%;max-height:70vh;object-fit:contain;margin:24px 0;border-radius:12px;background:#2a251f}button,select{padding:12px 16px;border:1px solid #92794f;border-radius:999px;background:#d6ad68;color:#211a11;font-weight:700}select{margin-right:8px;background:#f5ead5}</style>
<main><h1>浮生有典</h1><p>抽一张今日偶得卡</p><select id="character"><option value="">随机角色</option><option value="character-01">角色一</option><option value="character-02">角色二</option><option value="character-03">角色三</option></select><button id="draw">抽卡</button><img id="card" alt="等待抽卡" hidden></main>
<script>const img=document.querySelector('#card');document.querySelector('#draw').onclick=()=>{const c=document.querySelector('#character').value;img.src='/card.png'+(c?'?character='+c:'');img.hidden=false}</script>`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
    if (request.method !== "GET" || !["/card", "/card.png"].includes(url.pathname)) {
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
