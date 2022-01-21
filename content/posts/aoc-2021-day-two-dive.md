---
title: "AoC 2021 Day Two: Dive!"
date: 2021-12-02T17:46:33.562Z
summary: Piloting our submarine.
tags:
  - adventofcode
  - golang
draft: false
---
Advent of Code Day Two is upon us. This is another easy problem, as the first few tend to be (to lull you into a false sense of security, no doubt), so let's dive (heh!) right in.

### The Problem

[See the original problem](https://adventofcode.com/2021/day/2) and [my full solution](https://github.com/biesnecker/godvent/blob/main/twentytwentyone/day_two.go).

#### Part One

*You're given a list of commands that consist of a command (either the string "forward", "up", or "down") and an integer argument. Forward indicates that you move forward, up and down indicate that you dive or rise (you're piloting a submarine, after all). At the end, what is the product of your horizontal and vertical positions?*

Though it didn't end up mattering here, I've learned the hard way from past AoC's that you should always parse your input into structs rather trying to solve directly from the string versions, so let's do that first.

```go
type inputDayTwo struct {
    command string
    arg     int
}

func readInputDayTwo(fp *bufio.Reader) (res []inputDayTwo) {
    utils.ReadStrings(fp, func(s string) {
        var c string
        var a int
        fmt.Sscanf(s, "%s %d", &c, &a)
        res = append(res, inputDayTwo{c, a})
    })
    return
}
```

Now it's a matter of tracking two pieces of state--the horizontal and vertical positions--as you're traversing the list of commands. 

```go
func DayTwoA(fp *bufio.Reader) string {
    input := readInputDayTwo(fp)
    depth := 0
    pos := 0
    for _, c := range input {
        switch c.command {
        case "forward":
            pos += c.arg
        case "down":
            depth += c.arg
        case "up":
            depth -= c.arg
        }
    }
    return strconv.Itoa(depth * pos)
}
```

#### Part Two

*Almost the same as part one, but with an added twist--instead of up and down directly modifying your depth, it instead modifies a third piece of state, aim, which is then used to calculate the depth change when moving forward.*

Really this part isn't any harder than the first, it's just a matter of changing how the state is updated.

```go
func DayTwoB(fp *bufio.Reader) string {
    input := readInputDayTwo(fp)
    depth := 0
    pos := 0
    aim := 0
    for _, c := range input {
        switch c.command {
        case "forward":
            pos += c.arg
            depth += aim * c.arg
        case "down":
            aim += c.arg
        case "up":
            aim -= c.arg
        }
    }
    return strconv.Itoa(depth * pos)
}
```

#### Improvements

If I were writing something like this for real, I would have defined an interface for the command handler:

```go
type commandHandler interface {
    handleForward(arg int)
    handleUp(arg int)
    handleDown(arg int)
    getAnswer() int
}
```

and then two structs that implemented that interface. This would let you encapsulate the state nicely, and not repeat the instruction dispatch code. But for an AoC solution that is almost certainly overkill.