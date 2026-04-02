
# Intro
Implementation of a technical test. An animated bar chart race visualizing world population rankings by country over time. This app can be either run locally or accessed at https://ch-population-test.vercel.app/
 
## Notes
- PopulationChart2 was my second attempt at the solution. At first, I've looked into implementing the given task via a Chart library. I've picked Recharts as it seemed a popular choice and easy to use.
It was a good solution except for implementing the required animations. 
It might have been possible using the library but I couldn't find good examples online and I would have spent too much time trying to make it work.
So in the end, I decided to go for a different route and implement the UI without a chart library.
If you want to check out <PopulationChart /> you should be able to do so by uncommenting the component and installing the following packages

```
 npm install recharts
 npm install @recharts/devtools --save-dev
```
- I've added some comments in PopulationChart2.tsx to better explain my thought process since this is a technical test part of the interview process. These comments are addressed to the reviewer. If this was actual production code, I would have most likely presented them differently or not included them if unnecessary.

- I've used the initial data provided for this test. However, the data caused big jumps when switching to different years. I've looked online for real population over the years and now the animation resembles what is seen in the GIF part of the test instructions. The original set of data can still be tested by following the instructions inside `app/api/population/route.ts`

- I wasn't sure if the chart was meant to stop when it reaches the last year. At the moment, it just loops back to the first year in the dataset

## Tech Stack
 - react v19.2.4
 - next v16.2.2
 - motion v12.38.0 - Used to handle custom animations (country row placement, bar resizing)

 Developed with Node v24.14.0 installed locally (min version should be Node.js >=18.18.0)

## Potential Improvements
- Better error scenario UI. I didn't spend much time on this. Can be simulated by throwing an error in `app/api/population/route.ts`
- UI to control speed
- UI to change amount of displayed countries
- The sorting logic could be improved. Right now, countries change position as soon as we transition to the next year.
   A better approach would be to update population values gradually over the year interval, based on the population delta between the current year and the next, so growth is simulated over time and countries swap position as soon as they overtake or are overtaken.


## How to run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to access the local site.