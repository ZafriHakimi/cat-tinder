import { useEffect, useRef, useState } from "react";
import Dashboard from "./Homepage";
import Summary from "./Summary";

const TOTAL_CATS = 10;

async function fetchCatCard() {
  let data;

  try {
    const res = await fetch("https://cataas.com/cat", {
      headers: { Accept: "application/json" },
    });
    data = await res.json();
  } catch {
    //Fallback
    const res = await fetch("https://cataas.com/cat?json=true");
    data = await res.json();
  }

  const id = data?._id ?? data?.id;

  let src = data?.url;
  if (src && !src.startsWith("http")) {
    src = `https://cataas.com${src}`;
  }

  //if no url, construct from id
  if (!src && id) {
    src = `https://cataas.com/cat/${id}`;
  }

  // fallback
  if (!src) {
    src = `https://cataas.com/cat?${Date.now()}-${Math.random()}`;
  }

  return { id, src };
}

//preload image so it is already in browser cache, can prevents flicker/blank
function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

function App() {
  /**
   * 2 cards:
   *cards[0], top (current)
   *cards[1], behind (user can peek)
   */
  const [cards, setCards] = useState([]);

  // Store results
  const [liked, setLiked] = useState([]);
  const [disliked, setDisliked] = useState([]);

  // Progress tracking
  const [seenCount, setSeenCount] = useState(0);
  const [done, setDone] = useState(false);

  //prevent double advance due to fast clicks/swipes
  const advancingRef = useRef(false);

  //load 2 img
  useEffect(() => {
    (async () => {
      const a = await fetchCatCard();
      const b = await fetchCatCard();

      await Promise.all([
        preloadImage(a.src),
        preloadImage(b.src),
      ]);

      setCards([a, b]);
    })();
  }, []);

  //next card/img
  const advance = async (action) => {
    if (advancingRef.current) return;
    if (!cards[0]) return;

    advancingRef.current = true;

    const current = cards[0];

    //record like/dislike
    if (action === "like") setLiked((p) => [...p, current]);
    if (action === "dislike") setDisliked((p) => [...p, current]);

    const nextSeen = seenCount + 1;
    setSeenCount(nextSeen);


    //shift first so the "behind card" becomes the next top card
    setCards((prev) => prev.slice(1));

    // Stop if finished
    if (nextSeen >= TOTAL_CATS) {
      setDone(true);
      advancingRef.current = false;
      return;
    }

    // Fetch + preload next card
    const newCard = await fetchCatCard();
    await preloadImage(newCard.src);

    setCards((prev) => [...prev, newCard]);
    advancingRef.current = false;
  };

  //restart whole flow
  const restart = async () => {
    setLiked([]);
    setDisliked([]);
    setSeenCount(0);
    setDone(false);

    const a = await fetchCatCard();
    const b = await fetchCatCard();

    await Promise.all([
      preloadImage(a.src),
      preloadImage(b.src),
    ]);

    setCards([a, b]);
  };


  if (done) {
    return (
      <Summary
        total={TOTAL_CATS}
        liked={liked}
        onRestart={restart}
      />
    );
  }

  return (
    <Dashboard
      cards={cards}
      onLike={() => advance("like")}
      onDislike={() => advance("dislike")}
      onNext={() => advance("skip")}
      progress={{ seenCount, total: TOTAL_CATS }}
    />
  );
}

export default App;