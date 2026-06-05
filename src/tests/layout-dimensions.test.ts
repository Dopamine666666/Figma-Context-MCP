import { describe, test, expect } from "vitest";
import { buildSimplifiedLayout } from "~/transformers/layout.js";
import type { Node as FigmaDocumentNode } from "@figma/rest-api-spec";

function makeNode(overrides: Record<string, unknown> = {}) {
  return {
    id: "1:1",
    name: "Node",
    type: "FRAME",
    layoutMode: "HORIZONTAL",
    layoutSizingHorizontal: "HUG",
    layoutSizingVertical: "HUG",
    layoutGrow: 0,
    absoluteBoundingBox: { x: 0, y: 0, width: 123, height: 45 },
    children: [],
    ...overrides,
  } as unknown as FigmaDocumentNode;
}

describe("layout dimensions", () => {
  test("hug sizing still emits dimensions from bounding box", () => {
    const node = makeNode({
      layoutSizingHorizontal: "HUG",
      layoutSizingVertical: "HUG",
      absoluteBoundingBox: { x: 0, y: 0, width: 123.4, height: 45.6 },
    });

    const layout = buildSimplifiedLayout(node);
    expect(layout.sizing).toEqual({ horizontal: "hug", vertical: "hug" });
    expect(layout.dimensions).toEqual({ width: 123.4, height: 45.6 });
  });

  test("fill sizing still emits dimensions from bounding box", () => {
    const node = makeNode({
      layoutSizingHorizontal: "FILL",
      layoutSizingVertical: "FILL",
    });

    const layout = buildSimplifiedLayout(node);
    expect(layout.sizing).toEqual({ horizontal: "fill", vertical: "fill" });
    expect(layout.dimensions).toEqual({ width: 123, height: 45 });
  });
});

