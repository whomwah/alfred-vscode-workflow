export function run(args: string[] = Deno.args) {
  const items = args.map((arg: string) => {
    const parts = arg.split("/");

    return {
      title: parts[parts.length - 1],
      subtitle: arg,
      arg,
    };
  });

  console.log(JSON.stringify({ items }));
}

run();
