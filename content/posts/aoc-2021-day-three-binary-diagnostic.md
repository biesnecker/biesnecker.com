---
title: "AoC 2021 Day Three: Binary Diagnostic"
date: 2021-12-04T02:11:19.406Z
summary: Fun with binary numbers and counting things.
tags:
  - golang
  - adventofcode
  - generics
draft: false
---
We're on day three already, and things are getting a *little* bit harder than they were the last two days. Today's problem involves some string handling which, later in season, often really slows me down, but it was pretty lightweight for this puzzle. It also involves a bit of binary number handling, which is a staple of AoC puzzles.

### The Problem

[See the original problem](https://adventofcode.com/2021/day/3) and [my full solution](https://github.com/biesnecker/godvent/blob/main/twentytwentyone/day_three.go).

#### Before we get started

Much has been said about the lack of generics in Go, and I for one am very happy that they're coming in Go 1.18. A typesafe algorithm module in the standard library is one of the victims of this lack of generics. Maybe next year I'll be able to use them for AoC, but for now I need to define the functions I need myself. For this puzzle, I'm defining one to filter slices of strings based on a user-defined predicate.

```go
func FilterStrings(strings []string, pred func(string) bool) []string {
    var res []string
    for _, s := range strings {
        if pred(s) {
            res = append(res, s)
        }
    }
    return res
}
```

Now onto the problems.

### Part One

*Given a list of binary numbers, construct two numbers, one formed from the most common bit in each position, and the other formed by the least common bits. Return the product of these two numbers.*

I'm fairly certain there's some neat bit-twiddling that could solve this problem more elegantly but I couldn't figure it out so I decided to just handle them as strings. First we'll iterate through each of the bit strings and figure out if, for each position, there are more ones or more zeros, and then construct result strings, one made up of the most common digit in each position, one made up of the least.

```go
func highLowBinaryStrings(nums []string) (string, string) {
    digits := make([]int, len(nums[0]))

    for _, num := range nums {
        for idx, bit := range num {
            if bit == '1' {
                digits[idx]++
            } else {
                digits[idx]--
            }
        }
    }
    var high []byte
    var low []byte
    for _, i := range digits {
        if i >= 0 {
            // Tie behavior is the same as 1 being the most common.
            high = append(high, '1')
            low = append(low, '0')
        } else {
            high = append(high, '0')
            low = append(low, '1')
        }
    }

    return string(high), string(low)
}
```

We don't need to know how many of each there are, just which is more common, so we can just add and subtract. Finally, remember that strings in Go are immutable, so create slices of bytes first and then convert them.

Converting those two strings to integers and multiplying them together is the answer.

### Part Two

*Given two copies of a list of binary numbers, reduce each down to a single entry. Start with the most significant binary digit, and keep only those numbers that have, for one copy, the most common digit, and for the other, the least common digit. Keep reducing, moving down the list of binary digits from most to least significant, until only one value is left in each list.*

In Part Two, we need to iteratively reduce the list of numbers using a simple algorithm until there's only one left. The algorithm goes something like this:

1. Start with the most significant bit and calculate which value is most/least common. 
2. Remove all numbers that don't contain that value in that index.
3. If there is only one number left, stop. If not, move on to the next position and go to 1.

We have to do this twice, once for the most common value and once for the least common value. The answer is the product of the two final numbers in each group.

```go
func findCandidate(candidates []string, takeHigh bool) string {
    i := 0
    for len(candidates) > 1 {
        high, low := highLowBinaryStrings(candidates)
        var match string
        if takeHigh {
            match = high
        } else {
            match = low
        }

        candidates = utils.FilterStrings(
            candidates,
            func(s string) bool {
                return s[i] == match[i]
            })

        i++
    }
    return candidates[0]
}
```

This function reuses `highLowBinaryStrings`, which isn't particularly efficient--we really only need to calculate the most common binary digit for a particular position, but we're calculating it for all of the positions. On my Macbook, though, it runs in 0.006 seconds, so I'm satisfied with the inefficient approach.