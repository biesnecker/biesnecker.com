---
title: "AoC 2021 Day One: Sonar Sweep"
date: 2021-12-01T22:33:43.088Z
summary: It's that time of year again!
tags:
  - golang
  - adventofcode
draft: false
---
The [Advent of Code](https://adventofcode.com/) is my favorite time of the year. This time around I'm using Go, a language I've been learning over the last few months (by completing previous years' AoC problems), and will be blogging my (hopefully!) daily solutions.

### The problem

[See the original problem](https://adventofcode.com/2021/day/1) and [my full solution](https://github.com/biesnecker/godvent/blob/main/twentytwentyone/day_one.go).

#### Part One

*Given a list of integers, find the number of integers that are larger than the one immediately preceding it.*

This problem is fairly straightforward. Once we've parsed the input file, we have a slice of integers, and need to iterate through it. There are two options for this:

1. You could iterate from element 0 to element `len(nums)-1` and compare `nums[i] < nums[i+1]`;
2. You could iterate from element 1 to element `len(nums)` and compare `nums[i] > nums[i-1]`. 

I actually think the second approach would be easier because you don't need to think too hard about where to stop, but in the heat of the moment I went for the first approach.

```go
func DayOneA(fp *bufio.Reader) string {
    nums := readInputDayOne(fp)
    count := 0
    for i := 0; i < len(nums)-1; i++ {
        if nums[i] < nums[i+1] {
            count++
        }
    }
    return strconv.Itoa(count)
}
```

(see the above Github link to the full solution for the definition of `readInputDayOne`)

#### Part Two

*Given a list of integers and a three integer wide sliding window, find the number of windows where the sum of values is larger than the sum of values in the window immediately preceding it.*

Like all AoC problems, part two is a variation of part one. Now instead of comparing individual integers, you're comparing the sums of three integer wide window. The windows overlap, such that the first one would be indexes 0, 1, and 2; the second indexes 1, 2, and 3; the third indexes 2, 3, and 4, etc.

The two obvious solutions are the basically the same as part one. I chose the first again:

```go
func DayOneB(fp *bufio.Reader) string {
    nums := readInputDayOne(fp)
    count := 0
    for i := 0; i < len(nums)-3; i++ {
        if nums[i]+nums[i+1]+nums[i+2] < nums[i+1]+nums[i+2]+nums[i+3] {
            count++
        }
    }
    return strconv.Itoa(count)
}
```

There's a better solution, though, which I think is fairly obvious when looking at the code. Comparing two windows, `i+1` and `i+2` are in both, so really the only question is whether `i+3` is larger than `i` or not. The loop could then be written very cleanly as:

```go
for i := 3; i < len(nums); i++ {
    if nums[i] > nums[i-3] {
        count++
    }
}
```

or even:

```go
for i, v := range nums[3:] {
    if v > nums[i-3] {
        count++
    }
}
```

but when trying to compete for a quick time these things aren't always so obvious. Much to my chagrin, though, an off-by-one error with the loop termination cost me a minute and several hundred places for part two, so in the future I need to be more alert to when I can simplify such things.