import React, { useState } from "react";
import { motion } from "motion/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

//import all the icons
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

export default function Dashboard(props) {
  const { cards, onLike, onDislike, onNext, progress } = props;

  const [leaving, setLeaving] = useState(false); //card animation on leaving(fully swiped)
  const [dir, setDir] = useState(0); //swipe direction
  const [reaction, setReaction] = useState(null); 


  //Trigger a swipe-off animation
  const startSwipe = (direction) => {
    if (leaving) return;
    setDir(direction);
    setLeaving(true);
  };

  const handleDragEnd = (_, info) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    //right swipe = LIKE
    if (offsetX > 130 || velocityX > 500) {
      return startSwipe(1);
    }

    //left swipe = DISLIKE
    if (offsetX < -130 || velocityX < -500) {
      return startSwipe(-1);
    }

    //else, snap back to center (no action)
  };

  const top = cards?.[0];
  const behind = cards?.[1];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 200 }}>
      <div className="homepage-card">
        <h1>Cat Images</h1>

        {/* Progress indicator */}
        <div style={{ marginBottom: 10 }}>
          {progress.seenCount} / {progress.total}
        </div>

        {/* Card stack */}
        <div
          style={{
            width: 300,
            height: 300,
            position: "relative",
            marginBottom: 20,
          }}
        >
          {/* Bottom card(preview) */}
          {behind && (
            <motion.img
              key={behind.id}
              src={behind.src}
              draggable={false}
              style={{
                position: "absolute",
                inset: 0,
                width: 300,
                height: 300,
                objectFit: "cover",
                borderRadius: 16,
                transform: "scale(0.96) translateY(6px)",
                opacity: 0.75,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Top card */}
          {top && (
            <motion.img
              key={top.id}//ensures old image not flashes again when swiped
              src={top.src}
              drag={leaving ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 1.05, rotate: 6 }}
              animate={
                leaving
                  ? { x: dir * 600, rotate: dir * 18, opacity: 0 }
                  : { x: 0, rotate: 0, opacity: 1 }
              }
              transition={
                leaving
                  ? { duration: 0.22 }
                  : { type: "spring", stiffness: 300, damping: 25 }
              }
              onAnimationComplete={() => {

                if (!leaving) return; //only advance after the card has fully left the screen

                setLeaving(false);

                if (dir === 1) {
                  onLike();
                  setReaction("like");
                }
                if (dir === -1) {
                  onDislike();
                  setReaction("dislike");
                }
              }}
              style={{
                position: "absolute",
                inset: 0,
                width: 300,
                height: 300,
                objectFit: "cover",
                borderRadius: 16,
                cursor: leaving ? "default" : "grab",
                touchAction: "pan-y",
              }}
            />
          )}
        </div>
      </div>

      {/* like/dislike animation */}
      {reaction && (
        <motion.div
          key={reaction}
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{ y: -60, opacity: 0, scale: 1.3 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            position: "absolute",
            bottom: 120,
            fontSize: "2rem",
            pointerEvents: "none",
          }}
          onAnimationComplete={() => setReaction(null)}
        >
          <div style={{ fontSize: 20, fontFamily: 'sans-serif' }}>
            {reaction === "like" ? '+1' : '-1'}
            <FontAwesomeIcon
            icon={
              reaction === "like"
                ? "fa-regular fa-heart"
                : "fa-solid fa-heart-crack"
            }
          />
          </div>
        </motion.div>
      )}


      <div style={{ display: "flex", gap: 10 }}>
        <button 
          className="icon-btn" 
          disabled={leaving} 
          onClick={() => {
            setReaction("dislike");
            onDislike();
          }}>
          <FontAwesomeIcon icon="fa-solid fa-heart-crack" size="lg"/>
        </button>

        <button disabled={leaving} onClick={onNext}>
          NEXT CAT
        </button>

        <button 
          className="icon-btn" 
          disabled={leaving} 
          onClick={() => {
            setReaction("like");
            onLike();
          }}
        >
          <FontAwesomeIcon icon="fa-regular fa-heart" size="lg" />
        </button>
      </div>
    </div>
  );
}