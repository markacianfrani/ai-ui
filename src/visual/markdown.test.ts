import { describe, expect, test } from "bun:test";
import { AiMarkdown } from "./markdown";

const block = new AiMarkdown();
const parseInlines = (text: string) =>
  (
    block as unknown as { parseInlines(t: string): ReturnType<(typeof block)["parseInlines"]> }
  ).parseInlines(text);
const parseBlocks = (text: string) =>
  (
    block as unknown as { parseBlocks(t: string): ReturnType<(typeof block)["parseBlocks"]> }
  ).parseBlocks(text);

describe("AiMarkdown.parseInlines", () => {
  test("parses plain text", () => {
    expect(parseInlines("hello world")).toEqual([{ type: "text", value: "hello world" }]);
  });

  test("parses inline code, emphasis, strong text, and links", () => {
    expect(parseInlines("use **bold** and *italic* with [link](http://example.com)")).toEqual([
      { type: "text", value: "use " },
      { type: "strong", value: "bold" },
      { type: "text", value: " and " },
      { type: "emphasis", value: "italic" },
      { type: "text", value: " with " },
      { type: "link", text: "link", href: "http://example.com" },
    ]);
  });

  test("parses underscore emphasis", () => {
    expect(parseInlines("this is _italic_ text")).toEqual([
      { type: "text", value: "this is " },
      { type: "emphasis", value: "italic" },
      { type: "text", value: " text" },
    ]);
  });
});

describe("AiMarkdown.parseBlocks", () => {
  test("parses nested unordered lists", () => {
    expect(parseBlocks("- item 1\n  - nested item\n- item 2")).toEqual([
      {
        type: "ul",
        items: [
          {
            text: "item 1",
            children: [
              {
                type: "ul",
                items: [{ text: "nested item", children: [] }],
              },
            ],
          },
          { text: "item 2", children: [] },
        ],
      },
    ]);
  });

  test("parses blockquotes and lists in mixed content", () => {
    expect(parseBlocks("# Title\n\nSome text\n\n> a quote\n\n1. first\n2. second")).toEqual([
      { type: "heading", level: 1, text: "Title" },
      { type: "paragraph", text: "Some text" },
      { type: "blockquote", blocks: [{ type: "paragraph", text: "a quote" }] },
      {
        type: "ol",
        items: [
          { text: "first", children: [] },
          { text: "second", children: [] },
        ],
      },
    ]);
  });
});
