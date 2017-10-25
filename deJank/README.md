# Udacity Website Optimization Project

## Introduction

This is the fifth project of Udacity's Front End Nanodegree Program. The aim of this project was to optimize an online portfolio that we were provided with for speed, with emphasis on optimizing the critical rendering path and making the page render as quickly as possible.
Using PageSpeedInsights, I optimized index.html for desktop and mobile.
Using Google Chrome DevTools FPS counter and timeline, I optimized the JavaScript in main.js until it ran at 60 FPS.

## Viewing the project

* Download the source code by selecting 'Download ZIP', open the frontend-nanodegree-mobile-portfolio folder, right click on index.html, and open it in a browser.
* You can also view the optimized portfolio [here]( https://ninalouw.github.io/frontend-nanodegree-mobile-portfolio/).

## Optimizations I made to index.html

1. Using Grunt, I minified the CSS files using minify, and minified the JS files using uglify.
2. I also compressed all the images using Grunt (tinyimg), but then later had to further scale and compress pizzeria.jpg using GIMP.
3. I used a media query to prevent print.min.css from render blocking.
4. I inlined the critical CSS from style.min.css as per the PageSpeedInsights [guide](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery#example) to prevent render blocking.
5. I used Web Font Loader to defer the loading of the Google Fonts I used and made it an asynchronous script.
6. I made the JavaScript files load asynchronously and I moved all scripts to the bottom of index.html.
7. I achieved a PageSpeedInsights score of 90/100 for desktop and mobile.

## Optimizations I made to main.js

1. I optimized the Pizza slider component that changes the size of your pizza by making two functions, changePizzaSizes() and layout() to prevent layout and style recalculations. I avoided unnecessary DOM querying to get the randomPizzaContainer class by saving it in variables declared outside of both functions.
2. I moved var pizzasDiv outside of the for-loop that creates and appends all of the pizzas when the page loads.
3. I optimized the functions that move the sliding background pizzas based on scroll position. I optimized the updatePositions() function by saving variables outside of the loops, took calculations out of the loops and saved them in var scrollPosition and itemsLength, and created a scrollArray to hold all the possible pizza positions, and changed the calculation of scroll in the for loop so that it doesn't have to be constantly calculated. In the second for loop I used transform:translateX to display the pizzas in a way that would prevent triggering layout.
4. I moved the items variable outside of updatePositions() so that the DOM isn't queried every time you scroll, I declared it globally so it can be accessed by updatePositions(), and defined it within the event listener so that the DOM is only queried once when the DOM content is loaded.
5. I changed all instances of querySelectorAll to getElementsByClassName because it is faster.
6. In the last eventListener function, instead of creating a time-consuming 200 pizzas I dynamically calculated the number of necessary pizzas based on the screen height. I also moved defining of var elem to outside the loop.

## Resources

* [Critical Rendering Path course](https://www.udacity.com/course/ud884)
* [Udacity Nanodegree lectures and project webcasts](https://classroom.udacity.com/nanodegrees/nd001/syllabus)
* [PageSpeedInsights](https://developers.google.com/speed/pagespeed/insights/)
* Chrome Developer Tools
* [Optimizing Performance](https://developers.google.com/web/fundamentals/performance/ "web performance")
* [Analyzing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp.html "analyzing crp")
* [Optimizing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path.html "optimize the crp!")
* [Avoiding Rendering Blocking CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css.html "render blocking css")
* [Optimizing JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript.html "javascript")
* [Optimizing Images for the Web](https://www.designbrooklyn.com/resources/help-center/Website-Management/Optimizing-images-for-the-web.html)
