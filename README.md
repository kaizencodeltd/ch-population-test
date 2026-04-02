
# Intro
Implementation of a technical test: an animated bar chart race visualising world population rankings by country over time. The app can be run locally or accessed at https://ch-population-test.vercel.app/

## Notes
- Tested on Chrome v146 and Firefox v149
- I initially explored the task using Recharts, as it seemed like a good fit for quickly building the chart structure. I later switched to a custom implementation because it gave me more direct control over the animation behaviour required by the task.
- The earlier Recharts-based implementation is still present in the codebase and should still be testable by uncommenting the original component and installing the related packages:
```
 npm install recharts
 npm install @recharts/devtools --save-dev
```
- I've added some comments in PopulationChart2.tsx to make the implementation choices easier to follow in the context of a technical test. In production code, I would normally keep comments more limited and focused on non-obvious logic.

- I initially worked with the dataset provided in the task. I also experimented with a real-world population dataset which produced smoother year-to-year transitions  and closer to the behaviour shown in the reference GIF. The original dataset remains available and can be restored by following the instructions in `app/api/population/route.ts`.

- To reflect the animated behaviour shown in the reference GIF, I initially implemented autoplay so the chart could advance through the timeline automatically. Manual pagination controls were then added as well (previous year, next year, and direct year selection) to satisfy the interaction requirement from the brief.

- I wasn't sure if the chart was meant to stop when it reaches the last year. At the moment, it just loops back to the first year in the dataset.

- The bonus asked to apply vertical animation and display 15 countries. The animation has been implemented. The default number of visible countries is set to 10 to stay aligned with the base requirement, but the chart also supports other values at runtime to inspect the animation behaviour with different dataset sizes. 

- For country colours, I used deterministic assignment based on the country name and a fixed palette. This ensures that a given country keeps the same colour across year transitions while keeping the implementation simple and predictable. I chose this approach because the reference animation appeared to reuse colours from a palette rather than require globally unique colours for every country in the dataset.

## Tech Stack
 - React v19.2.4
 - Next v16.2.2
 - Motion v12.38.0 - Used to handle custom animations (country row placement, bar resizing)

 Developed with Node.js v24.14.0 installed locally (min version should be Node.js 18.18.0)

## Potential Improvements
- Styling could be refined further, particularly around consistency, responsiveness, and reducing the amount of handwritten CSS. A utility-first approach such as Tailwind CSS would likely make this easier to scale and maintain.
- Accessibility was not a focus area for this exercise and has not been addressed yet. Given the animated and data-heavy nature of the chart, useful next steps would include semantic improvements, keyboard interaction review, and validation against colour-vision deficiencies.
- Better mobile UI. It's decent but it definitely has room for improvement.
- Improved error-state UI. An error scenario can be simulated by throwing an error in `app/api/population/route.ts`.
- UI buttons/controls to speed up/slow down the autoplay functionality 
- The sorting logic could be improved. Right now, countries change position as soon as we transition to the next year.
   A better approach would be to update population values gradually over the year interval, based on the population delta between the current year and the next, so growth is simulated over time and countries swap position as soon as they overtake or are overtaken.


## How to run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to access the local site.