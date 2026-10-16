import fs from "node:fs";
import path from "node:path";
import { parse } from "@babel/parser";

const ROOT = path.resolve("src");
const EXTENSIONS = new Set([".jsx", ".tsx"]);

let changedFiles = 0;
let changedTags = 0;
let changedCatchBlocks = 0;

function collectFiles(directory) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatOpeningTag(source, node) {
  const name = source.slice(node.name.start, node.name.end);

  const attributes = node.attributes.map((attribute) => {
    if (attribute.type === "JSXAttribute" && attribute.name.type === "JSXIdentifier" && attribute.name.name === "className" && attribute.value?.type === "StringLiteral") {
      const original = source.slice(attribute.start, attribute.end);
      const quote = source[attribute.value.start];
      const value = attribute.value.value.replace(/\s+/g, " ").trim();

      return `${attribute.name.name}=${quote}${value}${quote}`;
    }

    return source.slice(attribute.start, attribute.end);
  });

  const inside = [name, ...attributes].join(" ");

  return `<${inside}${node.selfClosing ? " />" : ">"}`;
}

function collectOpeningTags(node, tags = []) {
  if (!node || typeof node !== "object") return tags;

  if (node.type === "JSXOpeningElement") {
    tags.push(node);
  }

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const child of value) {
        collectOpeningTags(child, tags);
      }
    } else if (value && typeof value === "object") {
      collectOpeningTags(value, tags);
    }
  }

  return tags;
}

function formatJSX(source, file) {
  const ast = parse(source, {
    sourceType: "unambiguous",
    plugins: ["jsx", ...(file.endsWith(".tsx") ? ["typescript"] : [])],
  });

  const tags = collectOpeningTags(ast);

  const edits = tags
    .map((node) => ({
      start: node.start,
      end: node.end,
      replacement: formatOpeningTag(source, node),
    }))
    .filter((edit) => source.slice(edit.start, edit.end) !== edit.replacement)
    .sort((a, b) => b.start - a.start);

  let output = source;

  for (const edit of edits) {
    output = output.slice(0, edit.start) + edit.replacement + output.slice(edit.end);
  }

  return {
    output,
    count: edits.length,
  };
}

// Put catch on a new line while preserving the indentation of its try block.
// This is a source-level transformation; it does not alter program logic.
function formatTryCatch(source) {
  const lines = source.split("\n");
  let changed = 0;

  for (let i = 0; i < lines.length; i++) {
    const current = lines[i];

    // Match a closing brace followed by catch on the same line.
    const match = current.match(/^(\s*)}(?:\s*)catch\b(.*)$/);

    if (match) {
      const indent = match[1];
      const catchRest = match[2];

      lines[i] = `${indent}}`;
      lines.splice(i + 1, 0, "", `${indent}catch${catchRest}`);

      i += 2;
      changed++;
    }
  }

  return {
    output: lines.join("\n"),
    count: changed,
  };
}

for (const file of collectFiles(ROOT)) {
  const source = fs.readFileSync(file, "utf8");

  let jsxResult;

  try {
    jsxResult = formatJSX(source, file);
  } catch (error) {
    console.error(`Skipped ${file}: ${error.message}`);
    continue;
  }

  const catchResult = formatTryCatch(jsxResult.output);
  const output = catchResult.output;

  if (output === source) continue;

  fs.writeFileSync(file, output);

  changedFiles++;
  changedTags += jsxResult.count;
  changedCatchBlocks += catchResult.count;

  console.log(`Formatted ${path.relative(process.cwd(), file)}`);
}

console.log(`
Formatting complete:
- Files changed: ${changedFiles}
- JSX opening tags updated: ${changedTags}
- Catch blocks moved: ${changedCatchBlocks}
`);
