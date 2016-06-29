---
title: Visualizing NYC criminal court summonses
date: "2016-06-28"
layout: post
path: "/blog/visualizing-nyc-summonses/"
---

# Background: why this project?
You can [view the map this blog post documents live on the web](https://nabilhassein.github.io/nyc-summons-precinct-visualization/).

I've been writing code since high school, but until recently,
very little of my work has been the type of thing I can easily *show* to non-programmers.
I've been wanting to change that, and I've also been wanting to bring my tech and political organizing work together more.

So, a main focus of my current stint at the [Recurse Center](https://recurse.com) has been learning modern frontend web development.
An overlapping focus has been to learn about data cleaning, analysis and visualization.
The first project I chose to do touching on all of these things was to build the map linked above,
which visualizes how many criminal court summonses were issued for each violation in every police precinct of New York City.

(A violation is illegal behavior which does not rise to the level of a crime, i.e. a misdemeanor or felony.
A summons is a ticket the police can write you to require you to appear in court without arresting you.)

On the tech side, this was a useful project for me to learn something about technologies including:
[pandas](http://pandas.pydata.org/),
[d3.js](https://d3js.org/),
[React.js](https://facebook.github.io/react/),
[Redux](http://redux.js.org/),
[npm](https://www.npmjs.com/),
[babel](https://babeljs.io/),
and [webpack](https://webpack.github.io/).
It was my first time using all of them -- for those I've used again, the learning from this has meant faster going the next time!
I spend most of my first month back at RC on this project,
but I had a few other things going on around at the same time, so it was not a full month of actual work.

On the political side, this was my first time digging around the [NYC open data website](https://nycopendata.socrata.com/),
and the first time I used my tech skills to create an original product I hoped might be of interest to other activists.
I gave this aspect of the project less emphasis than the tech aspect, which I hope not to replicate in the future,
but I think others might take my ideas for interactive maps relevant to grassroots organizing more seriously
now that I have some published work I can discuss.

I have far more ambitious ideas about digging into police, prison and court data,
but those will have to wait for another day.
In this blog post I'll limit myself to summarizing the work I did to create this map.
I published it over two months ago so I'm a bit late documenting it, but better late than never!

# Getting and transforming the data
This map uses just two, relatively small datasets:
a geojson file (no different than plain json) describing the shape of the precincts,
and a CSV which basically maps keys of `(precinct, violation)` pairs
to values of how many summonses were issued in the given year.

The geojson file I straightforwardly downloaded [here](https://raw.githubusercontent.com/dwillis/nyc-maps/master/police_precincts.geojson).

The CSV I created from [this spreadsheet](https://data.cityofnewyork.us/Public-Safety/Criminal-Court-Summonses/j8nm-zs7q)
using python's pandas library, throwing away incomplete 2015 data and some comments and aggregates which were of no interest,
and adding some derived data useful to the creating the legend on the map.
You can look at [my script here](https://github.com/nabilhassein/nyc-summons-precinct-visualization/blob/master/src/clean.py) and
[the generated CSV here](https://github.com/nabilhassein/nyc-summons-precinct-visualization/blob/master/data/clean-summons-data.csv).

The script doesn't work on the virtual machine I'm currently doing development work on, though,
apparently due to differing versions of python libraries from the bare-metal Linux installation I was using at the time.
I haven't bothered to investigate since creating the CSV is a one-shot sort of deal and I've already done it.
Anyway, this blog post is not about my many computer issues.

There is no communication with any API or database backend --
all data is transferred to the client when the user browses to the webpage.
The map is hosted as a one-page static site on [github pages](https://pages.github.com/).

# Building the map
Once I had the data, which took very little time even given my need to learn basic pandas, this was the fun part.
I spent a lot of time reading d3 tutorials and examples, notably including
[this official example](https://bl.ocks.org/mbostock/4060606),
[this handy tutorial](https://github.com/maptime-ams/animated-borders-d3js),
and [this guide to using d3 with React](https://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/).

Obeying discipline to keep my code modular was a primary focus throughout the project after the first week,
which definitely slowed me down but I feel paid off in the end.
I **really** do not like how essentially all frontend tutorials encourage you to
just throw script tags into your HTML and pollute the global scope willy-nilly. I absolutely refuse to follow this approach.
It might be the easiest way to get rolling, but in my experience, it does not take long at all before it comes back and bites me.
Due to that experience, I was determined to use proper dependency management and build tools, namely npm and webpack,
based on recommendations I got from other programmers I know and and from my reading online.

Besides those project-wide concerns,
React in specific encourages you to create your application as a nested hierarchy of modular, reusable components.
It is a very pleasant approach, especially compared to what I found searching around
the last time I checked out frontend development, which was in summer of 2013.
(That investigation ended with me deciding to stay far away from the frontend, a decision I did not revisit until this project.)

Sometimes though, it's not obvious (at least not to a frontend newbie like myself)
how to make React play nicely with libraries that assume they'll be running the whole show.
Even though d3 seems like a much better citizen in this regard than some other browser libraries I've used a bit,
I'm not sure the particular way I glued React and D3 together is ideal.
I might spend some more time reading about that, particularly with respect to the newly released
[d3 4.0](https://github.com/d3/d3/releases/tag/v4.0.0).

Anyway, probably my favorite aspect of creating this app is the natural decomposition of the UI into components:
the autocomplete box, the legend, the map itself, and the slider each live in their own file.
[Check it out!](https://github.com/nabilhassein/nyc-summons-precinct-visualization/blob/master/src/components)

In particular, I loved how trivial it was [for me to plug in](https://github.com/nabilhassein/nyc-summons-precinct-visualization/blob/master/src/components/ViolationInput.js#L24)
the [react-autocomplete library](https://www.npmjs.com/package/react-autocomplete) from npm.
The pleasantness of this experience was one of the main reasons I chose to create this blog with
[Gatsby.js](https://github.com/gatsbyjs/gatsby).
More on that another day.

Finally, a note on state management: all user state (of which is there isn't much: basically year, violation and mouse position)
is managed through Redux, which has relevance to the code I wrote to create my React components.
Basically, any component can only update any state by dispatching an action to a global store containing **all** application state.
A pure function updates the current state by invoking a user-defined function to combine it with the data from the new action.
Then all React components are updated based on their new properties (`props`) reflecting the updated state.
No reaching into the DOM yourself to update elements when you get new data!

Redux works really, really nicely with React's emphasis on one-way data flow down the nested hierarchy of components.
It has a natural appeal to someone like myself with a background in functional programming,
and a healthy fear of the bugs that carelessly handled state is bound to introduce into my applications.
And it enables neat features like [time-travel debugging](https://github.com/gaearon/redux-devtools),
since you can keep the log of all actions that resulted in updates to the state,
though I didn't need those for this simple project.

# Possibilities for future work
There's so much more I could do with this map, but I don't know that I'll ever do most of the things I list below
because there's also so much more I can do on other projects and there are just 24 hours in the day.

Let me know if you have other ideas for more work,
or for a totally different interactive map that would be useful to political organizing work!

Anyway, the possibilities are listed below in my rough priority order.
It's amazing how much work can come out of a small project if you really want to do it right!
I'm very glad I didn't wait to make the map perfect before just getting it out there, though.

## Link to this blog post from the map
This I should definitely do, since while the map is not very complex, it is not self-explanatory either.

## Make the map responsive and mobile-friendly
Creating the map was a laptop-centric process, like all of my software development work,
but I've more typically showed the map to others using my phone. That quickly showed me many things I overlooked.

The slider to select the year of data is not easy to use from a phone in my experience.
Deleting words from the autocomplete box acts just a little funky sometimes -- I haven't tracked down why yet.

Also, resizing and refreshing the page behaves oddly, and there's definitely wasted white space on the page.
That especially hurts on mobile where you have so little screen space to work with in the first place.
I'll have to learn more about CSS to get the page looking just the way I want it to.

## Normalize for the population of each precinct
This was [a suggestion from George Joseph](https://twitter.com/georgejoseph94/status/740393252231188480), a journalist at The Intercept.

It [seems that this is the necessary data](http://johnkeefe.net/nyc-police-precinct-and-census-data).
I haven't dug into it yet, though.

## Use more existing components and/or publish my own components
I'm sure there's a react-slider component out there somewhere -- I just haven't looked yet.
I'm still using the first slider I found when creating my
[horrible initial version of the map](https://github.com/nabilhassein/nyc-summons-precinct-visualization/blob/5eafaaaa4dbccfb4221df1ed438917e65f9f39e5/index.html)
where all HTML, CSS and Javascript lived in one giant file, compared to the modular approach of the current code.

It would be nice to check out the state not only of slider React components, but also of d3 map and legend React components,
and either further reduce my code size by reusing suitable existing components as I did for the autocomplete box,
or if such components aren't out there yet,
genericize and publish my own d3 legend map components to save others some work in the future!

## Refactor the code for drawing the tooltips
This is [some of the dumbest code I've written in years](https://github.com/nabilhassein/nyc-summons-precinct-visualization/blob/master/src/components/PrecinctMap.js#L94).
I didn't know that SVGs have a `title` element,
so I decided to give each precinct its tooltip by drawing a rectangle based on the user's mouse coordinates.

Still though, I'm glad I pushed through and just published something; I had been feeling stuck at the time.

## Investigate why the python script doesn't work on my current machine
I've been putting some effort into making the development environments
for my various tech projects reproducible and cleanly separated.
I should get my script to convert the spreadsheet into a CSV working again as part of that process.

# Acknowledgements
I cannot possibly name everyone I am indebted to for publishing this map, but I'd like to shout out
two of my fellow batchmates at the Recurse Center who made particularly large contributions to me getting this map out there:
[Mykola Bilokonsky](https://twitter.com/mykola),
who led several **very** useful sessions about modern frontend web development with React, Redux and related technologies;
and [Mimi Onuoha](https://twitter.com/thistimeitsmimi),
who taught me some elementary facts about interactive maps and put many useful resources in my hands about D3.
