// Mobile Portfolio Header Generator – Figma Plugin
// Generates a mobile header with a RTL side menu (hamburger → slide-in panel)
// covering all portfolio categories: בית, אודות, עבודות, קורות חיים, צור קשר

// ─── Colors ───────────────────────────────────────────────────────
const C = {
  bg:           { r: 0.988, g: 0.988, b: 0.992, a: 1 }, // #FCFCFD
  headerBg:     { r: 1,     g: 1,     b: 1,     a: 1 },
  border:       { r: 0.902, g: 0.910, b: 0.929, a: 1 }, // #E6E8ED
  textDark:     { r: 0.106, g: 0.118, b: 0.157, a: 1 }, // #1B1E28
  textMid:      { r: 0.416, g: 0.443, b: 0.502, a: 1 }, // #6A7180
  accent:       { r: 0.949, g: 0.400, b: 0.216, a: 1 }, // #F26637 coral accent
  white:        { r: 1,     g: 1,     b: 1,     a: 1 },
  overlay:      { r: 0.055, g: 0.063, b: 0.086, a: 0.55 },
  menuBg:       { r: 0.078, g: 0.086, b: 0.114, a: 1 }, // #14161D
  menuBorder:   { r: 1,     g: 1,     b: 1,     a: 0.08 },
  menuText:     { r: 0.882, g: 0.890, b: 0.910, a: 1 }, // #E1E3E8
  menuTextDim:  { r: 0.478, g: 0.494, b: 0.541, a: 1 }, // #7A7E8A
  transparent:  { r: 0,     g: 0,     b: 0,     a: 0 },
};

const FONT_BOLD = { family: "Inter", style: "Bold" };
const FONT_SEMI = { family: "Inter", style: "Semi Bold" };
const FONT_MED  = { family: "Inter", style: "Medium" };
const FONT_REG  = { family: "Inter", style: "Regular" };

// ─── Helpers ──────────────────────────────────────────────────────

async function loadFonts() {
  const fonts = [FONT_BOLD, FONT_SEMI, FONT_MED, FONT_REG];
  for (const f of fonts) {
    try { await figma.loadFontAsync(f); } catch (e) {}
  }
}

function txt(content, size, color, font, align) {
  const t = figma.createText();
  t.fontName = font || FONT_REG;
  t.fontSize = size || 14;
  t.fills = [{ type: "SOLID", color: color || C.textDark }];
  t.characters = String(content);
  if (align) t.textAlignHorizontal = align;
  return t;
}

function rect(w, h, color, radius) {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = [{ type: "SOLID", color: color || C.white }];
  r.strokes = [];
  if (radius) r.cornerRadius = radius;
  return r;
}

function frame(name, w, h, color) {
  const f = figma.createFrame();
  f.name = name;
  if (w && h) f.resize(w, h);
  f.fills = color ? [{ type: "SOLID", color }] : [];
  f.strokes = [];
  f.clipsContent = false;
  f.layoutMode = "NONE";
  return f;
}

function fixed(node, w, h) {
  node.primaryAxisSizingMode = "FIXED";
  node.counterAxisSizingMode = "FIXED";
  node.resize(w, h);
}

function shadowLeft(node) {
  node.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.25 },
    offset: { x: -6, y: 0 },
    radius: 24,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  }];
}

// ─── Hamburger / close icon (drawn with rectangles, no icon font needed) ──

function makeHamburgerIcon(size, color) {
  const box = frame("Hamburger Icon", size, size, C.transparent);
  fixed(box, size, size);
  const barW = size * 0.6;
  const barH = 2;
  const gap = (size - barH * 3) / 4;
  for (let i = 0; i < 3; i++) {
    const bar = rect(barW, barH, color, 1);
    bar.x = (size - barW) / 2;
    bar.y = gap + i * (barH + gap);
    box.appendChild(bar);
  }
  return box;
}

function makeCloseIcon(size, color) {
  const box = frame("Close Icon", size, size, C.transparent);
  fixed(box, size, size);
  const barW = size * 0.75;
  const barH = 2;
  const bar1 = rect(barW, barH, color, 1);
  bar1.x = (size - barW) / 2;
  bar1.y = size / 2 - barH / 2;
  bar1.rotation = 45;
  const bar2 = rect(barW, barH, color, 1);
  bar2.x = (size - barW) / 2;
  bar2.y = size / 2 - barH / 2;
  bar2.rotation = -45;
  box.appendChild(bar1);
  box.appendChild(bar2);
  return box;
}

// ─── Mobile status bar (decorative) ────────────────────────────────

function makeStatusBar(w) {
  const bar = frame("Status Bar", w, 44, C.transparent);
  fixed(bar, w, 44);
  const time = txt("9:41", 14, C.textDark, FONT_SEMI);
  time.x = 24; time.y = 14;
  bar.appendChild(time);
  return bar;
}

// ─── Header bar (RTL: logo on the right, menu button on the left) ────

function makeHeader(w, menuOpen) {
  const header = frame("Header", w, 64, C.headerBg);
  fixed(header, w, 64);
  header.strokes = [{ type: "SOLID", color: C.border }];
  header.strokeWeight = 1;
  header.strokeBottomWeight = 1;
  header.strokeAlign = "INSIDE";

  const logo = txt("תיק עבודות", 18, C.textDark, FONT_BOLD, "RIGHT");
  fixed(logo, 160, 24);
  logo.x = w - 24 - 160;
  logo.y = 20;
  header.appendChild(logo);

  const menuBtn = menuOpen
    ? makeCloseIcon(24, C.textDark)
    : makeHamburgerIcon(24, C.textDark);
  menuBtn.x = 24;
  menuBtn.y = 20;
  header.appendChild(menuBtn);

  return header;
}

// ─── Hero content behind the header (closed state) ─────────────────

function makeHeroContent(w, h) {
  const content = frame("Hero Content", w, h, C.bg);
  fixed(content, w, h);

  const avatar = frame("Avatar", 88, 88, C.accent);
  avatar.cornerRadius = 44;
  fixed(avatar, 88, 88);
  avatar.x = w / 2 - 44;
  avatar.y = 48;
  const avTxt = txt("AY", 28, C.white, FONT_BOLD);
  avTxt.x = 25; avTxt.y = 30;
  avatar.appendChild(avTxt);
  content.appendChild(avatar);

  const name = txt("ארי כהן", 24, C.textDark, FONT_BOLD, "CENTER");
  fixed(name, w - 48, 32);
  name.x = 24; name.y = 152;
  content.appendChild(name);

  const role = txt("מעצב ומפתח פרונט־אנד", 14, C.textMid, FONT_MED, "CENTER");
  fixed(role, w - 48, 20);
  role.x = 24; role.y = 188;
  content.appendChild(role);

  const hint = txt("← לחצו על התפריט כדי לצפות בכל הקטגוריות", 12, C.menuTextDim, FONT_REG, "CENTER");
  fixed(hint, w - 48, 32);
  hint.x = 24; hint.y = h - 56;
  content.appendChild(hint);

  return content;
}

// ─── Side menu panel (slides in from the right, RTL) ────────────────

function makeSideMenu(h, panelW) {
  const panel = frame("Side Menu Panel", panelW, h, C.menuBg);
  fixed(panel, panelW, h);
  panel.clipsContent = true;
  shadowLeft(panel);

  // Profile block
  const profile = frame("Profile", panelW, 140, C.transparent);
  fixed(profile, panelW, 140);

  const avatar = frame("Avatar", 64, 64, C.accent);
  avatar.cornerRadius = 32;
  fixed(avatar, 64, 64);
  avatar.x = panelW - 24 - 64;
  avatar.y = 44;
  const avTxt = txt("AY", 20, C.white, FONT_BOLD);
  avTxt.x = 18; avTxt.y = 20;
  avatar.appendChild(avTxt);
  profile.appendChild(avatar);

  const name = txt("ארי כהן", 16, C.white, FONT_SEMI, "RIGHT");
  fixed(name, panelW - 48, 22);
  name.x = 24; name.y = 114;
  profile.appendChild(name);

  panel.appendChild(profile);

  const divTop = rect(panelW, 1, C.menuBorder);
  divTop.x = 0; divTop.y = 140;
  panel.appendChild(divTop);

  // Nav items: [icon, label]
  const navItems = [
    ["🏠", "בית"],
    ["👤", "אודות"],
    ["💼", "עבודות"],
    ["📄", "קורות חיים"],
    ["✉️", "צור קשר"],
  ];

  const itemH = 56;
  const startY = 164;
  for (let i = 0; i < navItems.length; i++) {
    const [icon, label] = navItems[i];
    const active = i === 0;
    const itemY = startY + i * itemH;

    const item = frame("Nav – " + label, panelW, itemH, active ? { r: 1, g: 1, b: 1, a: 0.06 } : C.transparent);
    fixed(item, panelW, itemH);
    item.y = itemY;

    if (active) {
      const activeBar = rect(3, itemH, C.accent);
      activeBar.x = 0; activeBar.y = 0;
      item.appendChild(activeBar);
    }

    const labelTxt = txt(label, 15, active ? C.white : C.menuText, active ? FONT_SEMI : FONT_MED, "RIGHT");
    fixed(labelTxt, panelW - 24 - 36 - 12, 20);
    labelTxt.x = 24; labelTxt.y = itemH / 2 - 10;
    item.appendChild(labelTxt);

    const iconTxt = txt(icon, 18, C.menuText, FONT_REG, "RIGHT");
    fixed(iconTxt, 24, 24);
    iconTxt.x = panelW - 24 - 24;
    iconTxt.y = itemH / 2 - 12;
    item.appendChild(iconTxt);

    panel.appendChild(item);
  }

  const divBottom = rect(panelW, 1, C.menuBorder);
  divBottom.x = 0; divBottom.y = startY + navItems.length * itemH + 16;
  panel.appendChild(divBottom);

  // Social row
  const socials = ["📷", "in", "🐙"];
  const socialY = divBottom.y + 24;
  const socialSize = 36;
  const socialGap = 12;
  const socialsW = socials.length * socialSize + (socials.length - 1) * socialGap;
  let sx = panelW - 24 - socialsW;
  for (const s of socials) {
    const bubble = frame("Social", socialSize, socialSize, { r: 1, g: 1, b: 1, a: 0.08 });
    bubble.cornerRadius = socialSize / 2;
    fixed(bubble, socialSize, socialSize);
    bubble.x = sx; bubble.y = socialY;
    const sTxt = txt(s, 14, C.menuText, FONT_MED, "CENTER");
    fixed(sTxt, socialSize, socialSize);
    sTxt.x = 0; sTxt.y = socialSize / 2 - 8;
    sTxt.textAlignVertical = "CENTER";
    bubble.appendChild(sTxt);
    panel.appendChild(bubble);
    sx += socialSize + socialGap;
  }

  return panel;
}

// ─── Screen builders ──────────────────────────────────────────────

function makeClosedScreen(w, h) {
  const screen = frame("Mobile Header – Closed", w, h, C.bg);
  fixed(screen, w, h);
  screen.clipsContent = true;
  screen.cornerRadius = 32;

  const statusBar = makeStatusBar(w);
  statusBar.x = 0; statusBar.y = 0;
  screen.appendChild(statusBar);

  const header = makeHeader(w, false);
  header.x = 0; header.y = 44;
  screen.appendChild(header);

  const hero = makeHeroContent(w, h - 44 - 64);
  hero.x = 0; hero.y = 108;
  screen.appendChild(hero);

  return screen;
}

function makeOpenScreen(w, h) {
  const screen = frame("Mobile Header – Menu Open (RTL)", w, h, C.bg);
  fixed(screen, w, h);
  screen.clipsContent = true;
  screen.cornerRadius = 32;

  const statusBar = makeStatusBar(w);
  statusBar.x = 0; statusBar.y = 0;
  screen.appendChild(statusBar);

  const header = makeHeader(w, true);
  header.x = 0; header.y = 44;
  screen.appendChild(header);

  const hero = makeHeroContent(w, h - 44 - 64);
  hero.x = 0; hero.y = 108;
  screen.appendChild(hero);

  // Dark overlay over the content behind the menu
  const overlay = rect(w, h - 44, C.overlay);
  overlay.x = 0; overlay.y = 44;
  screen.appendChild(overlay);

  // Side menu panel, slid in from the right, below the header
  const panelW = Math.round(w * 0.78);
  const menu = makeSideMenu(h - 44 - 64, panelW);
  menu.x = w - panelW;
  menu.y = 44 + 64;
  screen.appendChild(menu);

  return screen;
}

// ─── Main ─────────────────────────────────────────────────────────

async function main() {
  await loadFonts();
  await figma.loadAllPagesAsync();

  const W = 375;
  const H = 812;
  const GAP = 80;

  const page = figma.currentPage;

  const closed = makeClosedScreen(W, H);
  closed.x = 100;
  closed.y = 100;
  page.appendChild(closed);

  const open = makeOpenScreen(W, H);
  open.x = 100 + W + GAP;
  open.y = 100;
  page.appendChild(open);

  figma.viewport.scrollAndZoomIntoView([closed, open]);
  figma.notify("✅ Mobile portfolio header + RTL side menu created!");
  figma.closePlugin();
}

main().catch(err => {
  figma.notify("❌ Error: " + err.message);
  figma.closePlugin();
});
