const url = `https://raw.githubusercontent.com/thecmdrunner/remotion-render-alternatives/main/README.md`;

const readme = await fetch(url).then((res) => res.text());

console.log(readme);
