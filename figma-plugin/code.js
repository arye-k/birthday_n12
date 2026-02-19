// Red Buttons Generator – Figma Plugin
// Targets "Frame 45" (node 64:305) and creates a full red button design system

const RED = { r: 0.898, g: 0.224, b: 0.208, a: 1 };   // #E53935
const RED_HOVER = { r: 0.773, g: 0.157, b: 0.157, a: 1 }; // #C62828
const RED_PRESSED = { r: 0.718, g: 0.110, b: 0.110, a: 1 }; // #B71C1C
const RED_DISABLED_BG = { r: 1.0, g: 0.804, b: 0.804, a: 1 }; // #FFCCCC
const RED_DISABLED_TEXT = { r: 0.898, g: 0.502, b: 0.502, a: 1 }; // #E58080
const WHITE = { r: 1, g: 1, b: 1, a: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, a: 0 };

const CORNER_RADIUS = 8;
const FONT_BOLD = { family: "Inter", style: "Bold" };
const FONT_MEDIUM = { family: "Inter", style: "Medium" };

const SIZES = [
  { name: "Large",  height: 56, hPad: 32, vPad: 16, fontSize: 16, iconSize: 20 },
  { name: "Medium", height: 44, hPad: 24, vPad: 10, fontSize: 14, iconSize: 18 },
  { name: "Small",  height: 32, hPad: 16, vPad: 8,  fontSize: 12, iconSize: 14 },
];

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync(FONT_BOLD),
    figma.loadFontAsync(FONT_MEDIUM),
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
  ]);
}

function createText(content, size, color, bold = true) {
  const t = figma.createText();
  t.fontName = bold ? FONT_BOLD : FONT_MEDIUM;
  t.fontSize = size;
  t.fills = [{ type: "SOLID", color }];
  t.characters = content;
  return t;
}

function setAutoLayout(frame, direction, gap, hPad, vPad) {
  frame.layoutMode = direction;
  frame.itemSpacing = gap;
  frame.paddingLeft = hPad;
  frame.paddingRight = hPad;
  frame.paddingTop = vPad;
  frame.paddingBottom = vPad;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.primaryAxisAlignItems = "CENTER";
  frame.counterAxisAlignItems = "CENTER";
}

// ─── Button Creators ──────────────────────────────────────────────

function makeFilledButton(label, size, fillColor, textColor, disabled = false) {
  const btn = figma.createFrame();
  btn.name = label;
  btn.cornerRadius = CORNER_RADIUS;
  btn.fills = [{ type: "SOLID", color: fillColor }];
  btn.strokes = [];
  btn.opacity = disabled ? 0.6 : 1;

  setAutoLayout(btn, "HORIZONTAL", 8, size.hPad, 0);
  btn.minHeight = size.height;
  btn.counterAxisSizingMode = "FIXED";
  btn.layoutSizingVertical = "FIXED";
  btn.resize(btn.width || size.hPad * 2 + 60, size.height);

  const text = createText(label, size.fontSize, textColor);
  btn.appendChild(text);

  // Re-apply autolayout sizing after adding child
  btn.primaryAxisSizingMode = "AUTO";
  btn.counterAxisSizingMode = "FIXED";

  return btn;
}

function makeOutlinedButton(label, size, borderColor, textColor, disabled = false) {
  const btn = figma.createFrame();
  btn.name = label;
  btn.cornerRadius = CORNER_RADIUS;
  btn.fills = [{ type: "SOLID", color: WHITE }];
  btn.strokes = [{ type: "SOLID", color: borderColor }];
  btn.strokeWeight = 2;
  btn.strokeAlign = "INSIDE";
  btn.opacity = disabled ? 0.6 : 1;

  setAutoLayout(btn, "HORIZONTAL", 8, size.hPad, 0);
  btn.minHeight = size.height;
  btn.counterAxisSizingMode = "FIXED";
  btn.layoutSizingVertical = "FIXED";
  btn.resize(btn.width || size.hPad * 2 + 60, size.height);

  const text = createText(label, size.fontSize, textColor);
  btn.appendChild(text);

  btn.primaryAxisSizingMode = "AUTO";
  btn.counterAxisSizingMode = "FIXED";

  return btn;
}

function makeGhostButton(label, size, textColor, disabled = false) {
  const btn = figma.createFrame();
  btn.name = label;
  btn.cornerRadius = CORNER_RADIUS;
  btn.fills = [];
  btn.strokes = [];
  btn.opacity = disabled ? 0.6 : 1;

  setAutoLayout(btn, "HORIZONTAL", 8, size.hPad, 0);
  btn.minHeight = size.height;
  btn.counterAxisSizingMode = "FIXED";
  btn.layoutSizingVertical = "FIXED";
  btn.resize(btn.width || size.hPad * 2 + 60, size.height);

  const text = createText(label, size.fontSize, textColor);
  btn.appendChild(text);

  btn.primaryAxisSizingMode = "AUTO";
  btn.counterAxisSizingMode = "FIXED";

  return btn;
}

// ─── Section label ────────────────────────────────────────────────

function makeSectionLabel(title) {
  const frame = figma.createFrame();
  frame.name = `Section – ${title}`;
  frame.fills = [];
  frame.strokes = [];
  setAutoLayout(frame, "VERTICAL", 4, 0, 0);
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";

  const t = createText(title.toUpperCase(), 11, { r: 0.4, g: 0.4, b: 0.4, a: 1 }, false);
  t.letterSpacing = { value: 1.5, unit: "PIXELS" };
  frame.appendChild(t);

  return frame;
}

function makeDivider(width = 600) {
  const line = figma.createLine();
  line.resize(width, 0);
  line.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9, a: 1 } }];
  line.strokeWeight = 1;
  return line;
}

// ─── Row of buttons ───────────────────────────────────────────────

function makeButtonRow(buttons, gap = 16) {
  const row = figma.createFrame();
  row.name = "Button Row";
  row.fills = [];
  row.strokes = [];
  setAutoLayout(row, "HORIZONTAL", gap, 0, 0);
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  buttons.forEach(b => row.appendChild(b));
  return row;
}

// ─── Main ─────────────────────────────────────────────────────────

async function main() {
  await loadFonts();

  // Find target frame
  let targetFrame = null;
  for (const page of figma.root.children) {
    const found = page.findOne(n => n.id === "64:305" || n.name === "Frame 45");
    if (found) { targetFrame = found; figma.currentPage = page; break; }
  }
  if (!targetFrame) {
    figma.notify("❌ Frame 45 not found. Running on current page.");
    targetFrame = figma.currentPage;
  }

  // ── Outer container with auto layout ──
  const container = figma.createFrame();
  container.name = "🔴 Red Button System";
  container.fills = [{ type: "SOLID", color: WHITE }];
  container.strokes = [];
  container.cornerRadius = 16;
  container.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.08 },
    offset: { x: 0, y: 4 },
    radius: 24,
    spread: 0,
    visible: true,
    blendMode: "NORMAL"
  }];

  setAutoLayout(container, "VERTICAL", 32, 48, 48);
  container.primaryAxisSizingMode = "AUTO";
  container.counterAxisSizingMode = "AUTO";

  // ── 1. Filled Buttons ──
  container.appendChild(makeSectionLabel("Filled Buttons"));
  for (const size of SIZES) {
    const row = makeButtonRow([
      makeFilledButton(`${size.name} Default`, size, RED, WHITE),
      makeFilledButton(`${size.name} Hover`, size, RED_HOVER, WHITE),
      makeFilledButton(`${size.name} Pressed`, size, RED_PRESSED, WHITE),
      makeFilledButton(`${size.name} Disabled`, size, RED_DISABLED_BG, RED_DISABLED_TEXT, true),
    ]);
    container.appendChild(row);
  }

  container.appendChild(makeDivider());

  // ── 2. Outlined Buttons ──
  container.appendChild(makeSectionLabel("Outlined Buttons"));
  for (const size of SIZES) {
    const row = makeButtonRow([
      makeOutlinedButton(`${size.name} Default`, size, RED, RED),
      makeOutlinedButton(`${size.name} Hover`, size, RED_HOVER, RED_HOVER),
      makeOutlinedButton(`${size.name} Pressed`, size, RED_PRESSED, RED_PRESSED),
      makeOutlinedButton(`${size.name} Disabled`, size, RED_DISABLED_TEXT, RED_DISABLED_TEXT, true),
    ]);
    container.appendChild(row);
  }

  container.appendChild(makeDivider());

  // ── 3. Ghost / Text Buttons ──
  container.appendChild(makeSectionLabel("Ghost Buttons"));
  for (const size of SIZES) {
    const row = makeButtonRow([
      makeGhostButton(`${size.name} Default`, size, RED),
      makeGhostButton(`${size.name} Hover`, size, RED_HOVER),
      makeGhostButton(`${size.name} Pressed`, size, RED_PRESSED),
      makeGhostButton(`${size.name} Disabled`, size, RED_DISABLED_TEXT, true),
    ]);
    container.appendChild(row);
  }

  // ── Place inside target frame ──
  targetFrame.appendChild(container);
  container.x = 80;
  container.y = 80;

  figma.viewport.scrollAndZoomIntoView([container]);
  figma.notify("✅ Red buttons added to Frame 45!");
  figma.closePlugin();
}

main().catch(err => {
  figma.notify("❌ Error: " + err.message);
  figma.closePlugin();
});
