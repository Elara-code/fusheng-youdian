import manifest from "../../assets/cards/manifest.json";

const cards = manifest.characters.flatMap((character) =>
  character.cards.map((card) => ({ ...card, character: character.id }))
);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
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
