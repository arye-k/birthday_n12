// Dashboard Screen Generator – Figma Plugin

// ─── Colors ───────────────────────────────────────────────────────
const C = {
  primary:      { r: 0.388, g: 0.400, b: 0.945, a: 1 }, // #6366F1 indigo
  primaryDark:  { r: 0.290, g: 0.298, b: 0.827, a: 1 }, // #4A4CD3
  sidebar:      { r: 0.118, g: 0.106, b: 0.294, a: 1 }, // #1E1B4B dark indigo
  sidebarHover: { r: 0.176, g: 0.165, b: 0.400, a: 1 }, // #2D2A66
  sidebarActive:{ r: 0.388, g: 0.400, b: 0.945, a: 1 }, // #6366F1
  bg:           { r: 0.973, g: 0.980, b: 0.992, a: 1 }, // #F8FAFC
  white:        { r: 1,     g: 1,     b: 1,     a: 1 },
  card:         { r: 1,     g: 1,     b: 1,     a: 1 },
  border:       { r: 0.886, g: 0.914, b: 0.941, a: 1 }, // #E2E8F0
  textDark:     { r: 0.118, g: 0.161, b: 0.235, a: 1 }, // #1E293B
  textMid:      { r: 0.392, g: 0.455, b: 0.545, a: 1 }, // #64748B
  textLight:    { r: 0.608, g: 0.659, b: 0.718, a: 1 }, // #9BA8B7
  textSidebar:  { r: 0.729, g: 0.749, b: 0.867, a: 1 }, // #BABFDD
  green:        { r: 0.063, g: 0.725, b: 0.506, a: 1 }, // #10B981
  greenBg:      { r: 0.863, g: 0.973, b: 0.933, a: 1 }, // #DCFAEE
  red:          { r: 0.937, g: 0.267, b: 0.267, a: 1 }, // #EF4444
  redBg:        { r: 0.996, g: 0.898, b: 0.898, a: 1 }, // #FEE5E5
  amber:        { r: 0.961, g: 0.620, b: 0.039, a: 1 }, // #F59E0A
  amberBg:      { r: 1.000, g: 0.949, b: 0.863, a: 1 }, // #FFF2DC
  purple:       { r: 0.545, g: 0.361, b: 0.918, a: 1 }, // #8B5CEA
  purpleBg:     { r: 0.933, g: 0.898, b: 0.996, a: 1 }, // #EEE5FE
  chartBar1:    { r: 0.388, g: 0.400, b: 0.945, a: 1 }, // #6366F1
  chartBar2:    { r: 0.745, g: 0.761, b: 0.976, a: 1 }, // #BEC2F9
  transparent:  { r: 0,     g: 0,     b: 0,     a: 0 },
};

const FONT_BOLD    = { family: "Inter", style: "Bold" };
const FONT_SEMI    = { family: "Inter", style: "Semi Bold" };
const FONT_MED     = { family: "Inter", style: "Medium" };
const FONT_REG     = { family: "Inter", style: "Regular" };

// ─── Helpers ──────────────────────────────────────────────────────

async function loadFonts() {
  const fonts = [FONT_BOLD, FONT_SEMI, FONT_MED, FONT_REG];
  for (const f of fonts) {
    try { await figma.loadFontAsync(f); } catch(e) {}
  }
  // Fallback
  try { await figma.loadFontAsync({ family: "Inter", style: "SemiBold" }); } catch(e) {}
}

function txt(content, size, color, font) {
  const t = figma.createText();
  t.fontName = font || FONT_REG;
  t.fontSize = size || 14;
  t.fills = [{ type: "SOLID", color: color || C.textDark }];
  t.characters = String(content);
  return t;
}

function rect(w, h, color, radius) {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = [{ type: "SOLID", color: color || C.white }];
  if (radius) r.cornerRadius = radius;
  r.strokes = [];
  return r;
}

function frame(name, w, h, color) {
  const f = figma.createFrame();
  f.name = name;
  if (w && h) f.resize(w, h);
  f.fills = color ? [{ type: "SOLID", color }] : [];
  f.strokes = [];
  f.clipsContent = false;
  return f;
}

function al(node, dir, gap, pl, pr, pt, pb) {
  node.layoutMode = dir || "VERTICAL";
  node.itemSpacing = gap || 0;
  node.paddingLeft   = pl || 0;
  node.paddingRight  = pr || 0;
  node.paddingTop    = pt || 0;
  node.paddingBottom = pb || 0;
  node.primaryAxisSizingMode  = "AUTO";
  node.counterAxisSizingMode  = "AUTO";
  node.primaryAxisAlignItems  = "MIN";
  node.counterAxisAlignItems  = "MIN";
}

function alCenter(node) {
  node.primaryAxisAlignItems  = "CENTER";
  node.counterAxisAlignItems  = "CENTER";
}

function chip(label, color, bgColor, size) {
  const c = figma.createFrame();
  c.name = "Chip";
  c.cornerRadius = 100;
  c.fills = [{ type: "SOLID", color: bgColor }];
  c.strokes = [];
  al(c, "HORIZONTAL", 4, 10, 10, 5, 5);
  alCenter(c);
  c.appendChild(txt(label, size || 12, color, FONT_SEMI));
  return c;
}

function shadow(node) {
  node.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0.071, g: 0.161, b: 0.318, a: 0.06 },
    offset: { x: 0, y: 4 },
    radius: 16,
    spread: 0,
    visible: true,
    blendMode: "NORMAL"
  }];
}

// ─── SIDEBAR ──────────────────────────────────────────────────────

function makeSidebar(h) {
  const sb = frame("Sidebar", 240, h, C.sidebar);
  sb.clipsContent = true;

  // Logo area
  const logoArea = frame("Logo Area", 240, 72, C.transparent);
  al(logoArea, "HORIZONTAL", 10, 24, 24, 0, 0);
  alCenter(logoArea);
  logoArea.resize(240, 72);
  logoArea.primaryAxisSizingMode = "FIXED";
  logoArea.counterAxisSizingMode = "FIXED";

  const logoIcon = frame("Logo Icon", 36, 36, C.primary);
  logoIcon.cornerRadius = 10;
  logoIcon.primaryAxisSizingMode = "FIXED";
  logoIcon.counterAxisSizingMode = "FIXED";

  const logoT = txt("D", 20, C.white, FONT_BOLD);
  logoIcon.appendChild(logoT);
  logoIcon.layoutMode = "NONE";
  logoT.x = 10; logoT.y = 8;

  const logoName = txt("Dashify", 18, C.white, FONT_BOLD);
  logoArea.appendChild(logoIcon);
  logoArea.appendChild(logoName);
  sb.appendChild(logoArea);

  // Divider
  const div1 = rect(240, 1, { r: 1, g: 1, b: 1, a: 0.08 });
  sb.appendChild(div1);

  // Nav section label
  const navLabel = frame("Nav Label", 240, 32, C.transparent);
  navLabel.primaryAxisSizingMode = "FIXED";
  navLabel.counterAxisSizingMode = "FIXED";
  const nlTxt = txt("MAIN MENU", 10, C.textSidebar, FONT_SEMI);
  nlTxt.letterSpacing = { value: 1.5, unit: "PIXELS" };
  navLabel.appendChild(nlTxt);
  navLabel.layoutMode = "NONE";
  nlTxt.x = 24; nlTxt.y = 12;
  sb.appendChild(navLabel);

  // Nav items: [label, active, icon-letter]
  const navItems = [
    ["Dashboard", true,  "◉"],
    ["Analytics",  false, "▦"],
    ["Users",      false, "◎"],
    ["Orders",     false, "≡"],
    ["Products",   false, "◫"],
    ["Settings",   false, "⚙"],
  ];

  for (const [label, active, icon] of navItems) {
    const item = frame("Nav – " + label, 240, 48, active ? C.sidebarActive : C.transparent);
    item.cornerRadius = 0;
    item.primaryAxisSizingMode = "FIXED";
    item.counterAxisSizingMode = "FIXED";
    if (active) {
      // active indicator bar
      const bar = rect(4, 48, C.white);
      item.appendChild(bar);
      bar.x = 0; bar.y = 0;
    }
    item.layoutMode = "NONE";

    const iconTxt = txt(icon, 16, active ? C.white : C.textSidebar, FONT_REG);
    iconTxt.x = 24; iconTxt.y = 16;
    item.appendChild(iconTxt);

    const labelTxt = txt(label, 14, active ? C.white : C.textSidebar, active ? FONT_SEMI : FONT_MED);
    labelTxt.x = 52; labelTxt.y = 16;
    item.appendChild(labelTxt);

    sb.appendChild(item);
  }

  // Spacer
  const spacerH = h - 72 - 1 - 32 - (navItems.length * 48) - 96;
  if (spacerH > 0) {
    const spacer = rect(240, spacerH, C.transparent);
    sb.appendChild(spacer);
  }

  // Divider bottom
  const div2 = rect(240, 1, { r: 1, g: 1, b: 1, a: 0.08 });
  sb.appendChild(div2);

  // User profile at bottom
  const profile = frame("User Profile", 240, 72, C.transparent);
  profile.primaryAxisSizingMode = "FIXED";
  profile.counterAxisSizingMode = "FIXED";
  profile.layoutMode = "NONE";

  const avatar = frame("Avatar", 40, 40, C.primary);
  avatar.cornerRadius = 20;
  avatar.primaryAxisSizingMode = "FIXED";
  avatar.counterAxisSizingMode = "FIXED";
  const avTxt = txt("AY", 14, C.white, FONT_BOLD);
  avatar.appendChild(avTxt);
  avatar.layoutMode = "NONE";
  avTxt.x = 7; avTxt.y = 12;
  avatar.x = 20; avatar.y = 16;

  const userName = txt("Arye K.", 14, C.white, FONT_SEMI);
  userName.x = 68; userName.y = 18;
  const userRole = txt("Admin", 12, C.textSidebar, FONT_REG);
  userRole.x = 68; userRole.y = 38;

  profile.appendChild(avatar);
  profile.appendChild(userName);
  profile.appendChild(userRole);
  sb.appendChild(profile);

  sb.layoutMode = "NONE";
  sb.resize(240, h);

  return sb;
}

// ─── HEADER BAR ───────────────────────────────────────────────────

function makeHeader(w) {
  const header = frame("Header", w, 72, C.white);
  header.primaryAxisSizingMode = "FIXED";
  header.counterAxisSizingMode = "FIXED";
  header.strokes = [{ type: "SOLID", color: C.border }];
  header.strokeWeight = 1;
  header.strokeAlign = "INSIDE";
  header.layoutMode = "NONE";

  // Page title
  const title = txt("Dashboard", 22, C.textDark, FONT_BOLD);
  title.x = 32; title.y = 22;

  const subtitle = txt("Welcome back, Arye!", 13, C.textMid, FONT_REG);
  subtitle.x = 32; subtitle.y = 48;

  // Search bar
  const search = frame("Search", 280, 40, C.bg);
  search.cornerRadius = 10;
  search.strokes = [{ type: "SOLID", color: C.border }];
  search.strokeWeight = 1;
  search.strokeAlign = "INSIDE";
  search.primaryAxisSizingMode = "FIXED";
  search.counterAxisSizingMode = "FIXED";
  search.layoutMode = "NONE";
  const searchTxt = txt("⌕  Search...", 14, C.textLight, FONT_REG);
  searchTxt.x = 14; searchTxt.y = 11;
  search.appendChild(searchTxt);
  search.x = w - 440; search.y = 16;

  // Notification bell
  const notifBtn = frame("Notif", 40, 40, C.bg);
  notifBtn.cornerRadius = 10;
  notifBtn.strokes = [{ type: "SOLID", color: C.border }];
  notifBtn.strokeWeight = 1;
  notifBtn.strokeAlign = "INSIDE";
  notifBtn.primaryAxisSizingMode = "FIXED";
  notifBtn.counterAxisSizingMode = "FIXED";
  notifBtn.layoutMode = "NONE";
  const bellTxt = txt("🔔", 16, C.textMid, FONT_REG);
  bellTxt.x = 11; bellTxt.y = 11;
  notifBtn.appendChild(bellTxt);
  notifBtn.x = w - 148; notifBtn.y = 16;

  // Badge on bell
  const badge = frame("Badge", 16, 16, C.red);
  badge.cornerRadius = 8;
  badge.primaryAxisSizingMode = "FIXED";
  badge.counterAxisSizingMode = "FIXED";
  badge.layoutMode = "NONE";
  const badgeTxt = txt("3", 9, C.white, FONT_BOLD);
  badgeTxt.x = 4; badgeTxt.y = 3;
  badge.appendChild(badgeTxt);
  badge.x = w - 124; badge.y = 12;

  // Avatar
  const avBtn = frame("Avatar", 40, 40, C.primary);
  avBtn.cornerRadius = 20;
  avBtn.primaryAxisSizingMode = "FIXED";
  avBtn.counterAxisSizingMode = "FIXED";
  avBtn.layoutMode = "NONE";
  const avTxt = txt("AY", 13, C.white, FONT_BOLD);
  avTxt.x = 7; avTxt.y = 13;
  avBtn.appendChild(avTxt);
  avBtn.x = w - 96; avBtn.y = 16;

  header.appendChild(title);
  header.appendChild(subtitle);
  header.appendChild(search);
  header.appendChild(notifBtn);
  header.appendChild(badge);
  header.appendChild(avBtn);

  return header;
}

// ─── KPI CARD ─────────────────────────────────────────────────────

function makeKpiCard(title, value, change, up, iconLabel, iconColor, iconBg) {
  const card = frame("KPI – " + title, 260, 130, C.white);
  card.cornerRadius = 16;
  card.primaryAxisSizingMode = "FIXED";
  card.counterAxisSizingMode = "FIXED";
  card.layoutMode = "NONE";
  shadow(card);

  // Icon circle
  const iconCircle = frame("Icon", 48, 48, iconBg);
  iconCircle.cornerRadius = 14;
  iconCircle.primaryAxisSizingMode = "FIXED";
  iconCircle.counterAxisSizingMode = "FIXED";
  iconCircle.layoutMode = "NONE";
  const iconTxt = txt(iconLabel, 22, iconColor, FONT_REG);
  iconTxt.x = 12; iconTxt.y = 12;
  iconCircle.appendChild(iconTxt);
  iconCircle.x = 20; iconCircle.y = 20;

  // Value
  const valueTxt = txt(value, 28, C.textDark, FONT_BOLD);
  valueTxt.x = 20; valueTxt.y = 76;

  // Title
  const titleTxt = txt(title, 12, C.textMid, FONT_MED);
  titleTxt.x = 20; titleTxt.y = 110;

  // Change chip
  const changeBg = up ? C.greenBg : C.redBg;
  const changeColor = up ? C.green : C.red;
  const changeArrow = up ? "↑" : "↓";
  const changeChip = chip(changeArrow + " " + change, changeColor, changeBg, 11);
  changeChip.x = 160; changeChip.y = 20;

  card.appendChild(iconCircle);
  card.appendChild(valueTxt);
  card.appendChild(titleTxt);
  card.appendChild(changeChip);

  return card;
}

// ─── BAR CHART ────────────────────────────────────────────────────

function makeBarChart(w, h) {
  const card = frame("Revenue Chart", w, h, C.white);
  card.cornerRadius = 16;
  card.primaryAxisSizingMode = "FIXED";
  card.counterAxisSizingMode = "FIXED";
  card.layoutMode = "NONE";
  shadow(card);

  // Header
  const headerTxt = txt("Monthly Revenue", 16, C.textDark, FONT_BOLD);
  headerTxt.x = 24; headerTxt.y = 24;

  const subTxt = txt("Jan – Jul 2026", 12, C.textMid, FONT_REG);
  subTxt.x = 24; subTxt.y = 48;

  // Legend
  const leg1Dot = frame("dot", 10, 10, C.chartBar1);
  leg1Dot.cornerRadius = 5;
  leg1Dot.primaryAxisSizingMode = "FIXED"; leg1Dot.counterAxisSizingMode = "FIXED";
  leg1Dot.x = w - 180; leg1Dot.y = 28;
  const leg1Txt = txt("Revenue", 12, C.textMid, FONT_REG);
  leg1Txt.x = w - 165; leg1Txt.y = 24;

  const leg2Dot = frame("dot", 10, 10, C.chartBar2);
  leg2Dot.cornerRadius = 5;
  leg2Dot.primaryAxisSizingMode = "FIXED"; leg2Dot.cornerRadius = 5;
  leg2Dot.primaryAxisSizingMode = "FIXED"; leg2Dot.counterAxisSizingMode = "FIXED";
  leg2Dot.x = w - 100; leg2Dot.y = 28;
  const leg2Txt = txt("Target", 12, C.textMid, FONT_REG);
  leg2Txt.x = w - 85; leg2Txt.y = 24;

  card.appendChild(headerTxt);
  card.appendChild(subTxt);
  card.appendChild(leg1Dot);
  card.appendChild(leg1Txt);
  card.appendChild(leg2Dot);
  card.appendChild(leg2Txt);

  // Chart area
  const chartX = 24;
  const chartY = 72;
  const chartW = w - 48;
  const chartH = h - 120;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const values    = [0.55, 0.70, 0.60, 0.85, 0.75, 0.90, 0.80];
  const targetVals= [0.65, 0.65, 0.70, 0.70, 0.80, 0.80, 0.85];

  const colW = chartW / months.length;
  const barW = 20;

  // Horizontal grid lines
  for (let i = 0; i <= 4; i++) {
    const gy = chartY + chartH - (chartH * i / 4);
    const line = figma.createLine();
    line.x = chartX; line.y = gy;
    line.resize(chartW, 0);
    line.strokes = [{ type: "SOLID", color: C.border }];
    line.strokeWeight = 1;
    line.opacity = 0.6;
    card.appendChild(line);
    const gridLbl = txt((i * 25) + "k", 10, C.textLight, FONT_REG);
    gridLbl.x = chartX - 24; gridLbl.y = gy - 7;
    card.appendChild(gridLbl);
  }

  for (let i = 0; i < months.length; i++) {
    const cx = chartX + colW * i + colW / 2;

    // Revenue bar
    const bh = chartH * values[i];
    const b = rect(barW, bh, C.chartBar1, 6);
    b.x = cx - barW - 3;
    b.y = chartY + chartH - bh;
    card.appendChild(b);

    // Target bar
    const th = chartH * targetVals[i];
    const tb = rect(barW, th, C.chartBar2, 6);
    tb.x = cx + 3;
    tb.y = chartY + chartH - th;
    card.appendChild(tb);

    // Month label
    const ml = txt(months[i], 11, C.textLight, FONT_REG);
    ml.x = cx - 8; ml.y = chartY + chartH + 8;
    card.appendChild(ml);
  }

  return card;
}

// ─── DONUT CHART ──────────────────────────────────────────────────

function makeDonutChart(w, h) {
  const card = frame("Traffic Sources", w, h, C.white);
  card.cornerRadius = 16;
  card.primaryAxisSizingMode = "FIXED";
  card.counterAxisSizingMode = "FIXED";
  card.layoutMode = "NONE";
  shadow(card);

  const headerTxt = txt("Traffic Sources", 16, C.textDark, FONT_BOLD);
  headerTxt.x = 24; headerTxt.y = 24;

  const subTxt = txt("This month", 12, C.textMid, FONT_REG);
  subTxt.x = 24; subTxt.y = 48;

  // Donut (simplified with concentric ellipses)
  const cx = w / 2;
  const cy = h / 2 + 20;
  const R = 80;
  const innerR = 52;

  const segments = [
    { pct: 0.42, color: C.primary, label: "Organic" },
    { pct: 0.28, color: C.amber,   label: "Paid Ads" },
    { pct: 0.18, color: C.green,   label: "Social"   },
    { pct: 0.12, color: C.purple,  label: "Referral" },
  ];

  // Draw outer ring as colored ellipses stacked (simplified representation)
  const outerRing = figma.createEllipse();
  outerRing.resize(R * 2, R * 2);
  outerRing.x = cx - R; outerRing.y = cy - R;
  outerRing.fills = [{ type: "SOLID", color: C.primary }];
  outerRing.strokes = [];
  card.appendChild(outerRing);

  // Second arc - amber (covers ~58% → 28% visible = 70% of circle as bg)
  const ring2 = figma.createEllipse();
  ring2.resize(R * 2, R * 2);
  ring2.x = cx - R; ring2.y = cy - R;
  ring2.fills = [{ type: "SOLID", color: C.amber }];
  ring2.arcData = { startingAngle: 2.639, endingAngle: Math.PI * 2, innerRadius: 0 };
  ring2.strokes = [];
  card.appendChild(ring2);

  // green
  const ring3 = figma.createEllipse();
  ring3.resize(R * 2, R * 2);
  ring3.x = cx - R; ring3.y = cy - R;
  ring3.fills = [{ type: "SOLID", color: C.green }];
  ring3.arcData = { startingAngle: 4.398, endingAngle: Math.PI * 2, innerRadius: 0 };
  ring3.strokes = [];
  card.appendChild(ring3);

  // purple
  const ring4 = figma.createEllipse();
  ring4.resize(R * 2, R * 2);
  ring4.x = cx - R; ring4.y = cy - R;
  ring4.fills = [{ type: "SOLID", color: C.purple }];
  ring4.arcData = { startingAngle: 5.531, endingAngle: Math.PI * 2, innerRadius: 0 };
  ring4.strokes = [];
  card.appendChild(ring4);

  // Donut hole
  const hole = figma.createEllipse();
  hole.resize(innerR * 2, innerR * 2);
  hole.x = cx - innerR; hole.y = cy - innerR;
  hole.fills = [{ type: "SOLID", color: C.white }];
  hole.strokes = [];
  card.appendChild(hole);

  // Center text
  const pctTxt = txt("42%", 20, C.textDark, FONT_BOLD);
  pctTxt.x = cx - 18; pctTxt.y = cy - 14;
  card.appendChild(pctTxt);
  const pctLabel = txt("Organic", 11, C.textMid, FONT_REG);
  pctLabel.x = cx - 18; pctLabel.y = cy + 10;
  card.appendChild(pctLabel);

  // Legend
  let legendY = cy + R + 16;
  for (const seg of segments) {
    const dot = frame("dot", 10, 10, seg.color);
    dot.cornerRadius = 5;
    dot.primaryAxisSizingMode = "FIXED";
    dot.counterAxisSizingMode = "FIXED";
    dot.x = 24; dot.y = legendY + 2;
    card.appendChild(dot);

    const lbl = txt(seg.label, 12, C.textMid, FONT_REG);
    lbl.x = 40; lbl.y = legendY;
    card.appendChild(lbl);

    const pct = txt(Math.round(seg.pct * 100) + "%", 12, C.textDark, FONT_SEMI);
    pct.x = w - 50; pct.y = legendY;
    card.appendChild(pct);

    legendY += 22;
  }

  return card;
}

// ─── RECENT ORDERS TABLE ──────────────────────────────────────────

function makeOrdersTable(w, h) {
  const card = frame("Recent Orders", w, h, C.white);
  card.cornerRadius = 16;
  card.primaryAxisSizingMode = "FIXED";
  card.counterAxisSizingMode = "FIXED";
  card.layoutMode = "NONE";
  shadow(card);

  const headerTxt = txt("Recent Orders", 16, C.textDark, FONT_BOLD);
  headerTxt.x = 24; headerTxt.y = 24;

  const viewAll = txt("View all →", 12, C.primary, FONT_MED);
  viewAll.x = w - 80; viewAll.y = 28;
  card.appendChild(headerTxt);
  card.appendChild(viewAll);

  // Table header
  const cols = ["Order ID", "Customer", "Amount", "Date", "Status"];
  const colX  = [24, 110, 230, 320, 410];
  const thY = 60;
  for (let i = 0; i < cols.length; i++) {
    const th = txt(cols[i], 11, C.textLight, FONT_SEMI);
    th.letterSpacing = { value: 0.5, unit: "PIXELS" };
    th.x = colX[i]; th.y = thY;
    card.appendChild(th);
  }

  // Divider
  const thDiv = rect(w - 48, 1, C.border);
  thDiv.x = 24; thDiv.y = 78;
  card.appendChild(thDiv);

  // Rows
  const orders = [
    ["#10234", "Yael Cohen",   "$249.00", "Feb 18", "Completed"],
    ["#10233", "Moshe Levi",   "$89.50",  "Feb 18", "Pending"],
    ["#10232", "Shira Mizrahi","$349.00", "Feb 17", "Completed"],
    ["#10231", "Dani Avraham", "$129.00", "Feb 17", "Cancelled"],
    ["#10230", "Noa Ben-David","$549.00", "Feb 16", "Completed"],
  ];

  const statusColors = {
    "Completed": { fg: C.green,  bg: C.greenBg },
    "Pending":   { fg: C.amber,  bg: C.amberBg },
    "Cancelled": { fg: C.red,    bg: C.redBg   },
  };

  for (let r = 0; r < orders.length; r++) {
    const rowY = 90 + r * 46;
    const [id, customer, amount, date, status] = orders[r];

    // Row bg (alternating)
    if (r % 2 === 0) {
      const rowBg = rect(w - 48, 42, C.bg, 8);
      rowBg.x = 24; rowBg.y = rowY;
      card.appendChild(rowBg);
    }

    const idTxt       = txt(id,       12, C.textDark, FONT_MED);
    const custTxt     = txt(customer, 12, C.textDark, FONT_REG);
    const amountTxt   = txt(amount,   12, C.textDark, FONT_SEMI);
    const dateTxt     = txt(date,     12, C.textMid,  FONT_REG);

    idTxt.x     = colX[0]; idTxt.y     = rowY + 14;
    custTxt.x   = colX[1]; custTxt.y   = rowY + 14;
    amountTxt.x = colX[2]; amountTxt.y = rowY + 14;
    dateTxt.x   = colX[3]; dateTxt.y   = rowY + 14;

    card.appendChild(idTxt);
    card.appendChild(custTxt);
    card.appendChild(amountTxt);
    card.appendChild(dateTxt);

    const sc = statusColors[status];
    const statusChip = chip(status, sc.fg, sc.bg, 11);
    statusChip.x = colX[4]; statusChip.y = rowY + 11;
    card.appendChild(statusChip);
  }

  return card;
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────

function makeActivityFeed(w, h) {
  const card = frame("Activity Feed", w, h, C.white);
  card.cornerRadius = 16;
  card.primaryAxisSizingMode = "FIXED";
  card.counterAxisSizingMode = "FIXED";
  card.layoutMode = "NONE";
  shadow(card);

  const headerTxt = txt("Recent Activity", 16, C.textDark, FONT_BOLD);
  headerTxt.x = 24; headerTxt.y = 24;
  card.appendChild(headerTxt);

  const activities = [
    { icon: "🛒", color: C.purpleBg, title: "New order placed", sub: "Order #10234 · $249", time: "2m ago" },
    { icon: "👤", color: C.greenBg,  title: "New user signed up", sub: "Yael Cohen joined", time: "15m ago" },
    { icon: "💳", color: C.amberBg,  title: "Payment received",   sub: "Invoice #INV-0091",  time: "1h ago" },
    { icon: "⚠️", color: C.redBg,    title: "Low stock alert",    sub: "Product SKU-774",    time: "3h ago" },
    { icon: "📦", color: C.purpleBg, title: "Order shipped",      sub: "Order #10228",       time: "5h ago" },
    { icon: "⭐", color: C.amberBg,  title: "New 5-star review",  sub: "From Moshe Levi",    time: "7h ago" },
  ];

  for (let i = 0; i < activities.length; i++) {
    const act = activities[i];
    const rowY = 60 + i * 54;

    // Icon bubble
    const bubble = frame("Bubble", 36, 36, act.color);
    bubble.cornerRadius = 10;
    bubble.primaryAxisSizingMode = "FIXED";
    bubble.counterAxisSizingMode = "FIXED";
    bubble.layoutMode = "NONE";
    const iconTxt = txt(act.icon, 16, C.textDark, FONT_REG);
    iconTxt.x = 9; iconTxt.y = 9;
    bubble.appendChild(iconTxt);
    bubble.x = 24; bubble.y = rowY;
    card.appendChild(bubble);

    const titleTxt = txt(act.title, 13, C.textDark, FONT_SEMI);
    titleTxt.x = 70; titleTxt.y = rowY + 2;
    card.appendChild(titleTxt);

    const subTxt2 = txt(act.sub, 11, C.textMid, FONT_REG);
    subTxt2.x = 70; subTxt2.y = rowY + 20;
    card.appendChild(subTxt2);

    const timeTxt = txt(act.time, 11, C.textLight, FONT_REG);
    timeTxt.x = w - 60; timeTxt.y = rowY + 10;
    card.appendChild(timeTxt);

    // Divider
    if (i < activities.length - 1) {
      const divLine = rect(w - 48, 1, C.border);
      divLine.x = 24; divLine.y = rowY + 50;
      card.appendChild(divLine);
    }
  }

  return card;
}

// ─── MAIN ─────────────────────────────────────────────────────────

async function main() {
  await loadFonts();
  await figma.loadAllPagesAsync();

  const W = 1440;
  const H = 900;
  const SIDEBAR_W = 240;
  const CONTENT_W = W - SIDEBAR_W;

  // Root screen frame
  const screen = frame("Dashboard Screen", W, H, C.bg);
  screen.clipsContent = true;

  // Sidebar
  const sidebar = makeSidebar(H);
  sidebar.x = 0; sidebar.y = 0;
  screen.appendChild(sidebar);

  // Content area
  const content = frame("Content", CONTENT_W, H, C.bg);
  content.primaryAxisSizingMode = "FIXED";
  content.counterAxisSizingMode = "FIXED";
  content.layoutMode = "NONE";
  content.x = SIDEBAR_W; content.y = 0;

  // Header
  const header = makeHeader(CONTENT_W);
  header.x = 0; header.y = 0;
  content.appendChild(header);

  const PAD = 28;
  let curY = 72 + PAD;

  // KPI Cards row
  const kpiData = [
    ["Total Revenue",  "$84,230", "12.5%", true,  "💰", C.primary, C.purpleBg],
    ["Total Users",    "12,480",  "8.3%",  true,  "👥", C.green,   C.greenBg ],
    ["Total Orders",   "3,842",   "3.1%",  false, "📦", C.amber,   C.amberBg ],
    ["Conv. Rate",     "4.27%",   "0.8%",  true,  "📈", C.purple,  C.purpleBg],
  ];

  const cardW = Math.floor((CONTENT_W - PAD * 2 - 20 * 3) / 4);
  for (let i = 0; i < kpiData.length; i++) {
    const [title, value, change, up, icon, ic, ib] = kpiData[i];
    const kpi = makeKpiCard(title, value, change, up, icon, ic, ib);
    kpi.resize(cardW, 130);
    kpi.x = PAD + i * (cardW + 20);
    kpi.y = curY;
    content.appendChild(kpi);
  }

  curY += 130 + PAD;

  // Bar chart + Donut side by side
  const chartRowH = 280;
  const barChartW = Math.floor(CONTENT_W * 0.60) - PAD - 10;
  const donutW = CONTENT_W - PAD * 2 - barChartW - 20;

  const barChart = makeBarChart(barChartW, chartRowH);
  barChart.x = PAD; barChart.y = curY;
  content.appendChild(barChart);

  const donut = makeDonutChart(donutW, chartRowH);
  donut.x = PAD + barChartW + 20; donut.y = curY;
  content.appendChild(donut);

  curY += chartRowH + PAD;

  // Orders table + Activity feed
  const bottomH = H - curY - PAD;
  const tableW = Math.floor(CONTENT_W * 0.62) - PAD - 10;
  const feedW  = CONTENT_W - PAD * 2 - tableW - 20;

  const table = makeOrdersTable(tableW, bottomH);
  table.x = PAD; table.y = curY;
  content.appendChild(table);

  const feed = makeActivityFeed(feedW, bottomH);
  feed.x = PAD + tableW + 20; feed.y = curY;
  content.appendChild(feed);

  screen.appendChild(content);

  // Place on current page
  const page = figma.currentPage;
  page.appendChild(screen);
  screen.x = 100;
  screen.y = 100;

  figma.viewport.scrollAndZoomIntoView([screen]);
  figma.notify("✅ Dashboard Screen created!");
  figma.closePlugin();
}

main().catch(err => {
  figma.notify("❌ Error: " + err.message);
  figma.closePlugin();
});
