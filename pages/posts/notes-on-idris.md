---
title: A few notes on Idris
date: "2016-07-01"
layout: post
path: "/blog/notes-on-idris/"
---

# Introduction
I'm a longtime type theory, functional programming and programming language nerd.
Haskell was far from the first language I studied but it was the first language I loved,
the first language where I felt a coherent structure give me some confidence that anything I was doing made any sense.
During my current batch at the [Recurse Center](https://recurse.com),
one way I've continued these studies is by learning to program in [Idris](http://www.idris-lang.org/),
mostly through exercises from [a forthcoming book by Edwin Brady, the creator of the language](https://www.manning.com/books/type-driven-development-with-idris).
This book especially emphasizes interactive development. I can't recommend it enough!

As concisely as I can: Idris a programming language much like Haskell with **dependent types**,
so-called because *types may depend on values*.
There are **no** restrictions on which values may appear in types,
and *types are first-class values* that can be passed to functions as arguments
and calculated as the return value of functions, like any other value.
This allows the programmers to maintain all kinds of interesting invariants within the type system -- **any** computable property.
However, you might incur an annoying proof obligation to convince the compiler that your code is actually correct.
I currently lack a good intuition for theorem proving in Idris --
sometimes the compiler seems able to see all kinds of deep facts I might never have guessed;
other times, the compiler seems quite astoundingly unable to figure out that `n + 1` = `1 + n`, and I have to help it.
This feels painful.

I'm working on a much longer article on these topics,
hopefully to be published in [Code Words](https://codewords.recurse.com),
but I didn't want to wait to share a few brief code snippets.
I post this code with minimal explanation, hoping others might sense as I do
the power and expressiveness of Idris without extensive commentary.
I can easily tell it's worth a far deeper study -- so far I've hardly scratched the surface of dependently typed programming.
Let me know your impressions too.

Stay tuned for my forthcoming article for a far more detailed tutorial, once I have a deeper knowledge myself!
Unlike this blog post, that article particularly targets people with zero preexisting knowledge of typed functional programming.
If you're impatient to wait 2 or 3 months, in the conclusion I recommend some existing tutorials and papers about Idris.

# Elementary dependent types
## Preliminary: natural numbers
A natural number is zero or it is the successor of a natural number.

`data Nat = Z | S Nat`

This makes no use of dependent types.

Somehow, we can also write these with integer literals:  
`0` -> `Z`  
`1` -> `S Z`  
`2` -> `S (S Z)`  
...etc.

## Vectors
This is the traditional first example of a family of dependent types. I carry on this tradition.

A `Vect` is a list which carries its length around in its type, and contains elements all of the same type.

```
data Vect : Nat -> Type -> Type where
  Nil : Vect 0 a
  (::) : a -> Vect n a -> Vect (S n) a
```

Somehow, we can write these like
```
xs : Vect 1 String
xs = ["foo"]

ys : Vect 3 Int -- or Vect 3 Nat, or Vect 3 Double, or...
ys = [1, 2, 3]

zs : Vect 0 a
zs = []
```

Note that in Idris, type inference is undecidable in general. All types must be annotated explicitly in source code.
A limited form of type inference is possible in practice using Idris's interactive tools, however.

Functions on vectors that you can find in the Idris standard library maintain the invariants you might expect, e.g. `append`:

```
append : Vect n a -> Vect m a -> Vect (n + m) a
append []        ys = ys
append (x :: xs) ys = x :: append xs ys
```

Since there are no restrictions on which values may appear in types,
the typechecker must perform many computations at compile-time, such as addition in this simple example.

## Bounded numbers
We wouldn't want to index into a vector of length `n` with a type like `Int` or `Nat` --
we already know how long the vector is, so let's actually use that fact in our program!

We can define the type `Fin n` to represent the set of natural numbers smaller than `n`.

```
data Fin : Nat -> Type
  FZ : Fin (S k)
  FS : Fin k -> Fin (S k)
```

Then we can use it to define a type-safe indexing operation into a vector,
where only values less than the length of the (zero-indexed) vector are allowed as indices:

```
index : Fin n -> Vect n a -> a
index FZ     (x :: xs) = x
index (FS k) (x :: xs) = index k xs
```

No need for `Maybe` when indexing into a vector because we're guaranteed a result.
Note that the type `Fin Z` is empty -- it's impossible to construct a natural number less than zero,
so the impossibility of indexing into an empty vector falls out of this construction very naturally.
Hence why our case analysis in `index` was complete without accounting for any empty vector cases.

## Matrices
There is no need for a special type synonym syntax in Idris.
I am greatly pleased by how *few* features the language has -- clean, orthogonal, powerful.
We can define matrices as vectors as vectors of `Double`s as follows:

```
Matrix : Nat -> Nat -> Type
Matrix n m = Vect n (Vect m Double)
```

You can [peek at my implementation here if you're interested](https://github.com/nabilhassein/idris-meap/blob/master/ch3.idr#L31),
along with other spoilers to exercises in Edwin Brady's aforementioned book,
but here I just want to share the type signature of matrix multiplication:

`mul_matrix : Matrix n m -> Matrix m p -> Matrix n p`

This is one of the most natural ways to express the row/column invariants respected by matrix multiplication I've seen in code.
Matrices of mismatched sizes simply won't typecheck as arguments to the function.

# printf
Without speaking for others, I tend to consider my own use of code generation techniques such as macros
a clear indication that the language I'm working in lacks the required "power" or "expressiveness" (whatever those words mean)
to directly express the ideas I have about solving the problem I have.

That's a drag. Maybe I should have been using some other language. But by the time I think this, it's probably too late.

In many programming languages, the venerable `printf` function is implemented with one or another of these techniques.
In Idris, we simply calculate the type of the remaining arguments by examining the value of the format string.
For the first time in this blogpost, we frequently give names to earlier values in our type signatures,
so that later types can depend on them.

```
data Format = Number | Str | Lit String

PrintfType : List Format -> Type
PrintfType = foldr (\fmt, t => case fmt of
  Number => Int -> t
  Str    => String -> t
  Lit _  => t
) String

printfFmts : (fmts : List Format) -> String -> PrintfType fmts
printfFmts []                acc = acc
printfFmts (Number :: fmts)  acc = \i => printfFmts fmts (acc ++ show i)
printfFmts (Str :: fmts)     acc = \s => printfFmts fmts (acc ++ s)
printfFmts (Lit s :: fmts)   acc = printfFmts fmts (acc ++ s)

toFormat : List Char -> List Format
toFormat []                    = []
toFormat ('%' :: 'd' :: chars) = Number  :: toFormat chars
toFormat ('%' :: 's' :: chars) = Str     :: toFormat chars
toFormat ('%' :: chars)        = Lit "%" :: toFormat chars
toFormat (c :: chars)          = case toFormat chars of
  Lit lit :: fmts => Lit (strCons c lit) :: fmts
  fmts            => Lit (strCons c "" ) :: fmts

printf : (fmt : String) -> (PrintfType . Main.toFormat . Prelude.Strings.unpack) fmt
printf _ = printfFmts _ ""
```

The type of `printf` is so specific we don't even have to explicitly give the first argument in the body!
Nice.

# Effectful programming
This is an example of maintaining correctness invariants for an external resource, a file handle, using **dependent effects**.
I lifted it straight from [the official Idris effects tutorial](http://docs.idris-lang.org/en/latest/effects/depeff.html#file-management).

We can model all kinds of "impure" or external resources including state, exceptions, randomness, and input/output
using **algebraic effects**, which collect the effects available to the program in a list or some other value.
[Here's a paper for reference.](https://eb.host.cs.st-andrews.ac.uk/drafts/effects.pdf)
[Here's another reference.](https://eb.host.cs.st-andrews.ac.uk/drafts/dep-eff.pdf)

We can combine dependent types and algebraic effects:
the effects available to our program may depend on the result of earlier actions.
So if we attempt to open a file handle and succeed, we have the effect available and can read from the file;
if we fail, then we don't have the proper effect available and it will be a type error to try reading from the file anyway.
(For example, in the `False` arm of the case analysis within `dumpFile` below.)

The longer article I'm working on is designed to **slowly** build up to a similar example,
including for programmers completely unfamiliar with functional programming or any expressive static type system.
Without that context, if you think these snippets read like beautiful nonsense,
even as a Haskell programmer that's how I felt when I began studying dependent types too!

Don't mind the lack of implementation for `open`, just study its type,
and then convince yourself you can see how you'd use it to build `readFile` and `dumpFile`
with the given type signatures and implementations.

The first list of effects is `open`'s list of effects available on entry;
the second are those available on exit.
That will depend on if we managed to open the file or not!

For `readFile` and `dumpFile`, the fact that they have only one list of effects in the type
means they are guaranteed to have the same effects available on entry as on exit.

Finally, think of `!` as a prefix function with the type `c a -> a`
within some kind of context c like `IO`.
It allows us to avoid the verbosity of naming things we only use once in some kind of `do`-notation context.

```
open : (fname : String)
       -> (m : Mode)
       -> Eff Bool [FILE_IO ()]
                   (\res => [FILE_IO (case res of
                                           True => OpenFile m
                                           False => ())])

readFile : Eff (List String) [FILE_IO (OpenFile Read)]
readFile = readAcc [] where
    readAcc : List String -> Eff (List String) [FILE_IO (OpenFile Read)]
    readAcc acc = if (not !eof)
                     then readAcc (!readLine :: acc)
                     else pure (reverse acc)

dumpFile : String -> Eff () [FILE_IO (), STDIO]
dumpFile name = case !(open name Read) of
                    True => do putStrLn (show !readFile)
                               close
                    False => putStrLn ("Error!")
```

# Conclusion
I hope these notes have piqued your interest to learn more about programming with dependent types,
despite my leaving unsaid so very much more than what I do say.
Again, I'm writing a longer article myself, but for now I once again recommend
[a book by Idris's primary author](https://www.manning.com/books/type-driven-development-with-idris).
I've been finding it especially enlightening in its many discussions of how to use Idris's interactive features for development.
I also took away a great deal from the following tutorials and interesting papers about more advanced applications, among others:
- [The official tutorial](http://docs.idris-lang.org/en/latest/tutorial/)
- [The effects tutorial](http://docs.idris-lang.org/en/latest/tutorial/)
- [Type providers](https://www.itu.dk/people/drc/pubs/dependent-type-providers.pdf)
- [Resource-safe systems programming with embedded DSLs](https://eb.host.cs.st-andrews.ac.uk/drafts/dsl-idris.pdf)

If this blog post interested you, [get in touch](/contact) about dependent types anytime!
