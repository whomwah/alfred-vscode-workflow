# Open in VSCode workflow

Searches for folder with `.git` repos in the path of your choice and allows you
to either open them in VSCode or in the terminal. It's really fast though. It
uses [Deno](https://deno.land/). It's written in
[TypeScript](https://www.typescriptlang.org/).

### Install

The project and workflow requires the [Deno](https://deno.land/) binary to be
installed. This can be done simply from the [Deno](https://deno.land/) website
above.

> [Deno](https://deno.land/) is a runtime for JavaScript.
> [Deno](https://deno.land/) was co-created by Ryan Dahl, who also created
> Node.js.

We also need `findd`:

- [`findd`](https://github.com/whomwah/findd) - A tiny little utility that does
  the magic of finding all the repos really really fast.

The easiest way to install `findd` is via `homebrew` (the same with `deno`):

```
$ brew install deno
$ brew install whomwah/tap/findd
```
