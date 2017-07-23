---
title: generative-DOOM
date: "2017-07-23"
layout: post
path: "/blog/generative-DOOM/"
---

## Introduction
[`generative-DOOM`](https://nabilhassein.github.io/generative-DOOM) is a generator of random rhymes patterned after those of my favorite rapper, DOOM.
[Check it out live on the web](https://nabilhassein.github.io/generative-DOOM) and generate some rhymes of your own!
They don't hold a candle to DOOM's, but some of them are pretty amusing.

I worked on it as while participating in a program called [Code Narratives](http://sfpc.io/codenarratives) at the School for Poetic Computation (SFPC).
I enjoyed the program a lot! My sincere thanks go out to all of the organizers, teachers, and fellow students.
I don't typically think of myself as an artist, but I tried to really get into that mindset for this two-week intensive.
It's too short a time to create a fully developed piece of artwork, but I like my prototype well enough to share and document it.

Now, a little background information for the uninitiated: DOOM has been rhyming since the 1980s and has performed under many names including MF DOOM, Viktor Vaughn, and King Geedorah, and has been a part of various musical collaborations with names of their own, e.g. Madvillain and JJ DOOM.
He always wears a mask and has sent impostors out under it to take his place at an unknown number of his live shows.
So generating fake rhymes in his style seemed somehow fitting to me.

If I ever find the time, there's a lot more I could do to improve this project, which was the work of just a few days.
Sooner rather than later, I'll update the README in the [source code repository](https://github.com/nabilhassein/generative-DOOM) to give a proper technical overview.
But for this post, I'd like to give an overview which keeps technical details to a minimum, and pose a few questions about decolonizing software that I got to thinking about while creating the rhyme generator. This entire post is intended to be accessible to an audience of non-programmers.

## The poetry and flow of hip-hop
The rhymes are randomly generated based on the vocabulary of about 150 songs from DOOM's corpus, which I obtained from [Genius](https://genius.com).

The single most dissatisfying thing for me about the generated rhymes is their lack of flow.
If you don't know what is meant by flow in hip-hop, I don't really know how to explain it to you;
maybe you can pick it up if you're able to listen to a few good rhymes over a good beat, like those in the classic [All Caps](https://www.youtube.com/watch?v=ewc1hixzYPY).
Flow is somehow related to both the beat the words are set to, and to meter in poetry, but I won't attempt to say how exactly.

What I can say is that my brief experiments to make the generated rhymes flow by counting syllables or enforcing stress patterns were unsuccessful.
Every once in a while one of the generated rhymes will flow well simply by chance, but in general they flow poorly.
I still think it's possible to improve my work in this regard, but I don't know whether I'll invest the time.

I made no attempt to make the rhymes mean anything, again in contrast to DOOM's lyrics which explore diverse themes.
Here's another of my favorites, [Strange Ways](https://www.youtube.com/watch?v=uSxlZQUqVPY),
where in two short verses DOOM draws a powerful analogy between police occupation of Black neighborhoods "at home" and military occupation "over there".
I would be remiss to fail to repeat in this blog post what I said at the SFPC show where we presented our work, where I played part of this song:
I disagree with many things DOOM has said, but I completely endorse DOOM's message that these two things are inseparable -- "same game" -- and you can't reform 'em.
Fuck the police from Brooklyn to Palestine. I will conclude on a related theme, but for now let us return to the poetics.

DOOM's verses employ many other poetic qualities that I was vaguely aware of as a longtime fan, but had little occasion to name and think about explicitly.
During this work, I hand-annotated a few of his verses for some of them, including alliteration, assonance, consonance, slant rhyme and internal rhyme.
(I had to dust off some of my poetry-related vocabulary, untouched as much of it was since high school English class.)
It was inspiring and humbling to consider just how much DOOM is able to pack into so few words. Contrast my struggle to write short blog posts.
But anyway, I'd like to share a few more thoughts this project provoked about rhyming and pronunciation in particular.

## Pronouncing rhymes
Given a word, I can trivially generate a list of rhyming words for it by using the excellent [Pronouncing](https://pronouncing.readthedocs.io/en/latest/)
library created by [Allison Parrish](https://twitter.com/aparrish), who was one of our teachers for this two-week SFPC intensive.
(A "library" is code that someone else wrote and nicely packaged up for others to use in their own programs.)

(Side note and shameless plug for both of us: Allison also gave a hilarious [talk on lossy data compression](https://www.youtube.com/watch?v=meovx9OqWJc)
at [!!con](http://bangbangcon.com) last year, which I co-organize. Check it out!)

As is documented on Pronouncing's own website, it is based on the [CMU Pronouncing Dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict).
Like so many other projects in the history of computing, it was funded by the US military through [DARPA](https://en.wikipedia.org/wiki/DARPA).
Only General American English is represented in the list of pronunciations for a given word.

Now, if you listened to either DOOM song I linked to above or have previous familiarity with him, you are probably aware that he does not usually pronounce words according to the prescriptions of General American English.
Like many MCs, he typically employs [African American Vernacular English](https://en.wikipedia.org/wiki/African_American_Vernacular_English) (AAVE), although again like many MCs, he will sometimes switch accents or dialects either for reasons of character and narrative, or for convenience to obtain more rhymes.

Therefore, since my program depends on Pronouncing to generate a pair of rhyming words which are then used to generate the rest of the line, many rhymes that DOOM might make, or has in fact made, will not be captured by `generative-DOOM` as it exists in its current state. That's a damn shame. Even though this is kind of a silly example, it is remarkable that computer science generally and natural language processing (NLP) specifically have been shaped so pervasively by imperialism that even a hip-hop rhyme generator art project is indelibly marked by it. This is without even touching on how much NLP research is English-only.

Although it can be a useful simplification to think of software abstracted away from material reality, everyone who uses technology, and most of all those of us who design and build it, should never lose sight of the fact that technology always reflects the circumstances of its funding and creation. Technology created to meet the needs of the capitalist class and its imperialist militaries will be fundamentally oppressive in ways both subtle and obvious. In this instance we encounter the propagation of the US military's inattention to and erasure of alternative linguistic modes. I will not attempt here to survey or summarize the many other documented instances of racism, sexism, ableism, and other oppressions built into software and other types of technology.

## Decolonizing Pronouncing
Instead, I attempt to conclude with a productive suggestion. I'm far from a linguistics expert, so perhaps my speculations here are off base, but I believe it's technically feasible to at least partially remedy this situation by making use of some well-known facts about the English dialects such as AAVE. My example is drawn from phonology, literally the "study of sounds", although a complete project would touch on many more areas of linguistics.

For example, in AAVE "first" and "verse" are rhymes due to the phenomenon of [consonant cluster reduction](https://en.wikipedia.org/wiki/Cluster_reduction). Not every transformation between General American English and AAVE (or any of the many other English dialects that might be of interest to software artists) can be captured by such rules, but I believe this one is completely regular, or at least mostly regular. Many other phonological rules can also be described by relatively simple patterns. I see no reason that [the list of phones for words returned by Pronouncing for a given word](https://pronouncing.readthedocs.io/en/latest/tutorial.html#word-pronunciations) could not be transformed by a function to apply these rules and thus alter a word's list of rhymes according to the dialect of interest.

I have neither the linguistic expertise nor the time to undertake such a project myself, but I hope others might take it up. Writing software is a time-consuming and messy business, and I often become dispirited by how much work it is to do things that I feel ought to be easy -- and I have no intuition that a project like this ought to be easy; on the contrary, it seems pretty hard. Sometimes I question whether the type of work I just proposed is just another species of reformism, which I long ago rejected as hopeless in, say, US politics. But if we are not going to throw away actually existing technology and start from scratch, and if we are also not going to resign ourselves to be content with what exists now, such as the tyranny of a single dialect of English, I see no alternative than to undertake decolonizing projects of this type not only in the realm of natural language processing, but throughout software.

Another technology is possible. It's up to us to build it.
