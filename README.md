# Cat Tinder App

A simple React app that lets users browse cat images and mark them as liked or disliked using swipe gestures or buttons. After reviewing a fixed number of cats, the app shows a summary of liked cats.

## Features

-Fetches random cat images from the Cataas API  

-Swipe right to like, swipe left to dislike  

-Button controls for like, dislike, and next  

-Smooth swipe and feedback animations using Framer Motion  

-Progress indicator showing viewed cats  

-Summary page displaying liked cats  

-Restart flow after completion  

-Image preloading to avoid flickering  


## Tech Stack
-React (Vite)
-Framer Motion
-Font Awesome
-SCSS

##How It Works
-The app always keeps two cards in memory:  

  -The top card (current)  
  
  -A second card behind it for preview  
  
-When a card is liked, disliked, or skipped:  

  -The current card is removed  
  
  -The next card becomes active  
  
  -A new card is fetched and preloaded  
  
-User interactions are protected against double triggers using refs  

-After viewing a fixed number of cats, the summary screen is shown

## Project Structure
src/
-App.jsx          # Main app logic and state  

-Homepage.jsx     # Swipeable card UI  

-Summary.jsx      # Final summary screen  

-main.jsx         # React entry point  

-index.scss       # Global styles  

-App.scss         # App-specific styles

## API Used
https://cataas.com/cat
