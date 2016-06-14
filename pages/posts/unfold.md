---
title: Unfold
date: "2016-06-21"
layout: post
path: "/blog/unfold/"
---

# Optional background information

A fellow [recurser](https://recurse.com)
named [Emily Xie](http://xie-emily.com)
held [a workshop](https://twitter.com/emilyxxie/status/737775164935524354/photo/1)
to teach [p5.js](https://p5js.org/),
which she used to make [a few](http://xie-emily.com/code_art/algorithmic_plants/index.html) [beautiful sketches](http://xie-emily.com/code_art/green_rain.html).
At the end, she challenged us to create a rain of green characters in the style of the Matrix, as she had.
I accepted her challenge, but got bored of reading tutorials and docs,
so I decided to start learning my way around the library by rewriting
[Emily's code](https://github.com/emilyxxie/personal_portfolio_xie/blob/master/p5/green_rain_sketch.js)
to be mostly functional.

You can see my sketch [here](https://nabilhassein.github.io/p5-sketches)
and my code for it [here](https://github.com/nabilhassein/p5-sketches)
if you're interested, but this blog post isn't about p5, although p5 is super cool and well worth writing about.
I'll try to find time to do that after I've figured out how I want to post my second rewritten sketch online
and created a few original sketches.

This blog post is about the `unfold` function, which I happened to use in this context,
but which is also useful in many other contexts. After using it, I thought to myself:
"I feel like many people are familiar with `fold` (or `reduce`), but not many people are familiar with `unfold`.
Why don't I tell them?"

So I did at the Recurse Center's Thursday presentations on June 9th.
This blog post is an extended version of that 5 minute talk.

I give examples in both Haskell and Javascript so hopefully many readers can understand!
The concept of an `unfold` is not specific to any particular programming language.

# Main content: What is unfold?
As you might guess if you're already familiar with `fold` or `reduce` in any of its many guises,
`unfold` is the opposite (or more precisely, the **dual**) of `fold`.
Like `fold`, `unfold` is a higher order function (i.e. a function that takes a function as an argument),
which are typically nicer to use in functional programming than direct recursion.

> Recursive equations are the “assembly language” of functional programming, and direct recursion the goto.  
-- Jeremy Gibson, ["Origami Programming"](https://www.cs.ox.ac.uk/jeremy.gibbons/publications/origami.pdf)

In a `fold`, we consume a recursive data structure one piece at a time
to produce some sort of summary value.

In an `unfold`, we generate a recursive data structure one piece at a time
making use of some sort of state.

The function we pass to `unfold` as an argument should somehow be able to indicate the following two cases:
1. There is both a value to be added to the data structure, and an updated state.
2. We are done building the data structure.

The `unfold` function can be defined in many ways, in many languages, for many types of data structures.
How we define it has relevance for the "shape" or type signature of the functions we pass to it.
But I think you'll feel a kind of basic similarity no matter how we do it.

Here's a stateful implementation of `unfold` for arrays in pre-ES2015 Javascript,
relying on the convention that the function `f` should return an array
containing the value to be added to the output array as the zeroth element, and an updated state as the first element,
until the function is done building the array, when it should return `false` (or some falsy value).

(I borrowed this convention from [ramda.js](http://ramdajs.com/0.21.0/index.html),
which is the library I imported in my actual program.)


```javascript
  function unfold(f, seed) {
    var arr = [];
    var state = seed;

    while (var next = f(state)) {
      state = next[1];
      arr.push(next[0]);
    }

    return arr;
  }
```

We can use it to write a function which makes an array of all the even numbers less than some bound passed as an argument.
We can even be fancy and use the new Javascript standard, ES2015:

```javascript
const evensUpTo = n => {
  const step = current => current >= n ? false : [current, current+2];
  return unfold(step, 0);
}
```

If we call `evensUpTo(10)` we get the expected `[0, 2, 4, 6, 8]`.

If you write a function (or procedure, or whatever) that mutates internal state to present a pure interface,
are you doing functional programming?

If a tree falls in the forest and no one hears, does it make it a sound?

I try not to spend my time pondering such questions, although I often can't help myself.
Anyway, if it pleases you more, here's a purely functional implementation for a linked list in Haskell:

```haskell
unfold :: (s -> Maybe (a, s)) -> s -> [a]
unfold f state = case f state of
  Just (x, newState) -> x : unfold f newState
  Nothing            -> []
```

The type signature gives us a lot of information about `unfold`.
For one thing, the type `s` of the state is generic: we can use this for any type of state.
Same for the type `a` of elements in the output list -- we can use this to build any type of output list: `[Int]`, `[String]`, etc.

Here, `f` is a function which operates on some input state `s`, and
returns an optional tuple of a value to put in the list and an updated state.
In the case that the function returns `Nothing`
(represented explicitly as one of the two cases of Haskell's `Maybe`, since Haskell has no `null` or `undefined`),
we reach the terminating case of the empty list, and so we are done.

I'll tell you, this pleases me more.
I consider this code far more clear than my Javascript code above, but your opinion may vary.

We can do a lot of fun things with unfold. If you didn't already know,
Haskell's [laziness](https://wiki.haskell.org/Lazy_evaluation) means we can define infinite lists with no problem,
as long as we don't attempt to summon too much of the list into memory.
(To avoid such problems we can use the `take` function, which takes two arguments:
how many elements you want to take from a list, and a list which might be very long.
Haskell will only evaluate as many elements of the list as we actually ask to examine.)

So here's a list of all the Fibonnaci numbers:

```haskell
fibs :: [Integer]
fibs = unfold (\(f0, f1) -> Just (f1, (f1, f0+f1))) (0, 1)
```

We always have the current and previous fibonacci numbers as state at each iteration;
we continually add the current (larger) number to our output list of all the fibonacci numbers.
To update the state: the sum of the two numbers becomes the new larger number, i.e. the next iteration's fibonacci number,
and the previously larger number becomes the new smaller number, i.e. the next iteration's previous fibonnaci number.

In other words, this is a correct hand-optimization of the naive recursive implementation:

```haskell
  naiveFibs :: [Integer]
  naiveFibs = map fib [0..]
    where
      fib 0 = 1
      fib 1 = 1
      fib n = fib (n-1) + fib (n-2)
```
(`[0..]` is Haskell shorthand for the infinite list of all natural numbers, starting from zero and counting up by one.)

If we `take 10 fibs` we get the expected `[1, 1, 2, 3, 5, 8, 13, 21, 34, 55]`.

# Conclusion
The next time you write a for loop to build a data structure, consider an `unfold`!
You can do it for much more complex data structures than the Javascript array and Haskell linked list I chose for my examples.

If you can share code you refactored (or thought to write with an `unfold` in the first place),
tell me about it, I'd be interested to read it!

# References
I used [this presentation by Conal Elliott](http://conal.net/talks/folds-and-unfolds.pdf)
in my presentation of `unfold` at Recurse Center. I also lifted the Jeremy Gibson quote above from it.
It might be hard going if you don't already know Haskell or a similar language.
But it covers far more material than this introductory blog post.

For those who can read a little Haskell but have a hard time understanding the nonstandard syntax in that presentation,
[this blog post](https://chris-taylor.github.io/blog/2013/02/10/the-algebra-of-algebraic-data-types/)
gives a good intuition for it.

Hopefully, those without a decent reading knowledge of Haskell were able to get something out of this blog post!
