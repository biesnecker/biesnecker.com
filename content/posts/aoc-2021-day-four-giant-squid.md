---
title: "AoC 2021 Day Four: Giant Squid"
date: 2021-12-04T19:45:03.673Z
summary: When it's just you and a giant squid, bingo is better than arm wrestling.
tags:
  - adventofcode
  - golang
  - ""
draft: false
---
Another day another Advent of Code problem. This time, we're playing a bunch of games of bingo simultaneously to, according to the storyline, pass the time whilst trapped on a submarine with a giant squid. As one does, obviously. 

### The Problem

[See the original problem](https://adventofcode.com/2021/day/4) and [my full solution](https://github.com/biesnecker/godvent/blob/main/twentytwentyone/day_four.go).

#### Part One

*Given a bunch of 5x5 bingo cards and the order in which the numbers are called, determine the first card that wins, then calculate the "score" of that card, which is the solution.*

To be totally honest, I spent almost all of my time on this problem parsing the input. :-( I definitely need to improve my Go text parsing skills if I'm going to be at all competitive in these problems. Once you have the input parsed, it's a pretty simple exercise in tracking the state of the cards as you iterate through the numbers being called. 

The puzzle input is a line of comma-delimited numbers, a blank line, and then a series of 5x5 blocks of numbers (each representing a card) with a blank line in between them. First, I defined a type for the card (which I called `board` here, because it was 9pm and I was in a hurry) and squares on the card.

```go
type squareD4 struct {
    value  int
    marked bool
}

type boardD4 struct {
    squares [5][5]squareD4
    won     bool
}
```

This is how I ended up parsing the input. It could probably be improved but it worked for me.

```go
func readInputDayFour(fp *bufio.Reader) ([]int, []boardD4) {
    var nums []int
    var boards []boardD4

    lines := utils.ReadStringsAsSlice(fp)
    first := lines[0]

    for _, n := range strings.Split(first, ",") {
        nums = append(nums, utils.ReadInt(n))
    }

    lines = lines[2:]
    for len(lines) > 0 {
        var newboard boardD4
        boardLines := lines[:5]
        for i, line := range boardLines {
            _, err := fmt.Sscanf(
                line,
                "%d %d %d %d %d",
                &newboard.squares[i][0].value,
                &newboard.squares[i][1].value,
                &newboard.squares[i][2].value,
                &newboard.squares[i][3].value,
                &newboard.squares[i][4].value,
            )

            if err != nil {
                log.Fatalln(err)
            }
        }
        boards = append(boards, newboard)
        lines = lines[5:]
        if len(lines) > 0 {
            lines = lines[1:]
        }
    }
    return nums, boards
}
```

Looking at it again I'm not really sure how I could have done it much more compactly, but it certainly feels like a lot of code for what it does.

Once all of the cards have been read, the only thing that's left to do is mark them when each number comes up, and check to see if a particular card is a winner. I ended up combining both operations into a single function:

```go
// Returns true if the mark results in the board winning.
func (b *boardD4) mark(value int) bool {
    for i := 0; i < 5; i++ {
        for j := 0; j < 5; j++ {
            if b.squares[i][j].value == value {
                b.squares[i][j].marked = true

                rowWin := true
                columnWin := true
                for x := 0; x < 5; x++ {
                    if rowWin && !b.squares[i][x].marked {
                        rowWin = false
                    }
                    if columnWin && !b.squares[x][j].marked {
                        columnWin = false
                    }
                }

                if rowWin || columnWin {
                    b.won = true
                    return true
                } else {
                    return false
                }
            }
        }
    }
    return false
}
```

Gosh that's a lot of loops! Here's the breakdown:

1. First, loop through each square and see if the square's value matches the called number. 
2. If it does, then mark is as "marked."
3. Check the row and column of which the marked square is part to see if this card is a winner, returning true if so or false otherwise.

One interesting thing about this function is that it's brute force--worst case it searches all 25 squares each time. A lot of the [solutions on Reddit](https://www.reddit.com/r/adventofcode/comments/r8i1lq/2021_day_4_solutions/) used a set of some sort to store the numbers in each board to do a quick check, but when I tried that here it was actually slightly slower. Thinking about it more, though, that makes sense--linear scans of memory are *really* cheap on modern hardware. I'm sure there's a point at which scanning the elements like this is slower than a hashset lookup, but that point is definitely greater than 5x5.

Once you've read the input and figured out how to mark the numbers and check to see if a card is a winner, the problem is basically complete (there's a scoring function, too, but you can check the code on Github to see that).

```go
func DayFourA(fp *bufio.Reader) string {
    nums, boards := readInputDayFour(fp)
    for _, num := range nums {
        for bid := range boards {
            if boards[bid].mark(num) {
                return strconv.Itoa(boards[bid].score(num))
            }
        }
    }
    return ""
}
```

#### Part Two

*The same as Part One, but find the last winner instead of the first.*

This is one of those really simple Part Twos were you can reuse almost 100% of your Part One code. Instead of finding the first winner, find the last. To do this I added a `won` flag to the board object (it's already in the definition above) and marked off each board that won until only one remained. Whereas the first part took me like 20 minutes because figuring out the input parsing was hard, this part took me about 3 minutes to complete.

```go
func DayFourB(fp *bufio.Reader) string {
    nums, boards := readInputDayFour(fp)
    boardsLeft := len(boards)
    for _, num := range nums {
        for bid := range boards {
            if boards[bid].won {
                continue
            }
            if boards[bid].mark(num) {
                if boardsLeft == 1 {
                    return strconv.Itoa(boards[bid].score(num))
                } else {
                    boardsLeft--
                }
            }
        }
    }
    return ""
}
```