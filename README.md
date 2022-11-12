# Open in VSCode workflow

Searches for a local Git repo based on the path/s of your choice and allows you
to either open them in VSCode or in your Terminal. It's really fast. It uses
[Deno](https://deno.land/). It's written in
[TypeScript](https://www.typescriptlang.org/).

![VSCode Alfred 5 Workflow](./assets/vscode.gif)

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

## Development

You will first need to install `deno` as mentioned earlier in this README.

### Tests

`deno test`

### Formatting

`deno fmt`

### Build your own workflow

You can also build your own version of the workflow with:

```
./bin/build_release <version> <notes>

# example

./bin/build_release 1.2.3 blabla
```

## Resources

- Alfred App:: https://www.alfredapp.com/
- VSCode:: https://code.visualstudio.com/

## Copyright

MIT License (http://www.opensource.org/licenses/mit-license.html)
