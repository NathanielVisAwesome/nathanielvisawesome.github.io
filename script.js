async function loadConfig() {
  const defaults = {
    siteTitle: "NATEMAN'S HOMEPAGE",
    browserTitle: "Nateman's Homepage - Welcome!",
    tagline: "Welcome to my little corner of the internet!",
    lastUpdated: "October 1999",
    showUnderConstruction: true,
    ticker: "WELCOME, INTERNET TRAVELER! Thanks for stopping by! ☆ Sign the guestbook! ☆",
    welcomeHeading: "Hey there, web surfer!",
    welcomeParagraphs: [
      "You've found my homepage! Make yourself at home, explore the links, and don't forget to bookmark this page.",
      "This site is proudly hand-coded with plain HTML, CSS, and JavaScript. No frameworks. No fancy stuff. Just the WEB!"
    ],
    importantNote: "PLEASE SIGN MY GUESTBOOK!!!",
    aboutParagraphs: [
      "Hi! I'm Nate. This is my personal github page.",
      "I like games, computers, and making things."
    ],
    webmaster: "Nateman",
    location: "Somewhere on the web",
    email: "NOPE",
    visitorNumber: 42,
    navigation: [
      { label: "Home", href: "#top" },
      { label: "About Me", href: "#about-section" },
      { label: "What's New", href: "#updates-section" },
      { label: "Cool Links", href: "#favorites-section" },
      { label: "Guestbook", href: "#guestbook-section" }
    ],
    updates: [
      { date: "10/19/2026", text: "My homepage is online! More stuff coming soon." },
      { date: "10/19/2026", text: "Added some cool links. Check them out!" }
    ],
    favorites: [
      { label: "Left-Sided Studios", href: "https://leftsidedstudios.com/", description: "My Game Studio" },
      { label: "WASM.rip", href: "https://wasm.rip/", description: "Web ports of some cool games" },
      { label: "Nate's Things", href: "https://nathanielvisawesome.github.io/NatesThings", description: "My site which I bet students will enjoy." }
    ],
    guestbookUrl: "https://nateman.atabook.org/",
    webring: {
      previous: "#",
      random: "#",
      next: "#"
    },
    footerText: "Made with HTML, enthusiasm, and way too many animated GIFs.",
    copyright: "© 2026 Nateman LLC. All rights reserved-ish.",
    theme: {
      background: "#000080",
      text: "#ffff00",
      link: "#00ffff",
      visited: "#ff66ff",
      panel: "#000066",
      border: "#ffff00",
      heading: "#ff00ff"
    }
  };

  let config = defaults;
  try {
    const response = await fetch("./config.json", { cache: "no-store" });
    if (!response.ok) throw new Error("config.json could not be loaded");
    config = mergeConfig(defaults, await response.json());
  } catch (error) {
    console.warn("Using default site config:", error);
  }
  render(config);
}

function mergeConfig(base, override) {
  const result = { ...base, ...override };
  result.theme = { ...base.theme, ...(override.theme || {}) };
  return result;
}

function el(id) { return document.getElementById(id); }
function addText(parent, tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  parent.appendChild(node);
  return node;
}
function safeLink(item) {
  const a = document.createElement("a");
  a.textContent = item.label || item.title || item.href || "Link";
  a.href = item.href || "#";
  if (/^https?:\/\//i.test(a.href)) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  return a;
}
function render(config) {
  document.title = config.browserTitle || config.siteTitle || "My Homepage";
  el("site-title").textContent = config.siteTitle || "MY HOMEPAGE";
  el("tagline").textContent = config.tagline || "";
  el("updated").textContent = config.lastUpdated || "";
  el("ticker").textContent = config.ticker || "";
  el("construction").hidden = !config.showUnderConstruction;
  el("welcome-heading").textContent = config.welcomeHeading || "Welcome!";
  el("important-note").textContent = config.importantNote || "";
  el("webmaster").textContent = config.webmaster || "";
  el("location").textContent = config.location || "";
  el("counter").textContent = String(config.visitorNumber ?? 0).padStart(6, "0");
  el("visitor-number").textContent = String(config.visitorNumber ?? 0);
  el("footer-text").textContent = config.footerText || "";
  el("copyright").textContent = config.copyright || "";
  el("guestbook-link").href = config.guestbookUrl || "#";
  el("webring-prev").href = config.webring?.previous || "#";
  el("webring-random").href = config.webring?.random || "#";
  el("webring-next").href = config.webring?.next || "#";

  const theme = config.theme || {};
  const cssVars = {
    "--page-bg": theme.background,
    "--page-text": theme.text,
    "--link": theme.link,
    "--visited": theme.visited,
    "--panel-bg": theme.panel,
    "--panel-border": theme.border,
    "--heading": theme.heading
  };
  for (const [key, value] of Object.entries(cssVars)) {
    if (value) document.documentElement.style.setProperty(key, value);
  }

  const nav = el("nav-links");
  nav.replaceChildren();
  (config.navigation || []).forEach(item => nav.appendChild(safeLink(item)));

  const welcome = el("welcome-copy");
  welcome.replaceChildren();
  (config.welcomeParagraphs || []).forEach(p => addText(welcome, "p", p));

  const about = el("about-copy");
  about.replaceChildren();
  (config.aboutParagraphs || []).forEach(p => addText(about, "p", p));

  const updates = el("updates-list");
  updates.replaceChildren();
  (config.updates || []).forEach(item => {
    const li = document.createElement("li");
    const strong = addText(li, "strong", (item.date ? "[" + item.date + "] " : ""));
    strong.style.color = "var(--link)";
    li.appendChild(document.createTextNode(item.text || ""));
    updates.appendChild(li);
  });

  const favorites = el("favorites-list");
  favorites.replaceChildren();
  (config.favorites || []).forEach(item => {
    const li = document.createElement("li");
    const a = safeLink(item);
    li.appendChild(a);
    if (item.description) li.appendChild(document.createTextNode(" — " + item.description));
    favorites.appendChild(li);
  });
}
loadConfig();
