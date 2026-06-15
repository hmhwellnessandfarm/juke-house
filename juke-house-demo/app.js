const categories = [
  "Singers",
  "Rappers",
  "Dancers",
  "DJs",
  "Comedians",
  "Poets",
  "Hosts",
  "Musicians",
  "Drag Performers",
  "Models",
  "Actors",
  "Live Painters",
  "Fitness Performers",
  "Other Entertainers",
];

const gifts = [
  ["Rose", 1],
  ["Fire", 5],
  ["Crown", 10],
  ["Mic Drop", 25],
  ["Standing Ovation", 50],
  ["VIP Table", 100],
];

const artists = [
  {
    id: "nia-vale",
    name: "Nia Vale",
    category: "Singers",
    city: "Atlanta, GA",
    featured: true,
    followers: "18.4K",
    tips: 4260,
    bio: "Soul vocalist releasing weekly live-room sessions and fan-request covers.",
  },
  {
    id: "dj-marble",
    name: "DJ Marble",
    category: "DJs",
    city: "Chicago, IL",
    featured: true,
    followers: "22.1K",
    tips: 5920,
    bio: "Open-format DJ with club edits, house sets, and crate-digging breakdowns.",
  },
  {
    id: "kam-verse",
    name: "Kam Verse",
    category: "Poets",
    city: "Brooklyn, NY",
    featured: false,
    followers: "9.8K",
    tips: 1880,
    bio: "Spoken word artist mixing poetry, theater, and intimate studio films.",
  },
  {
    id: "lola-flare",
    name: "Lola Flare",
    category: "Drag Performers",
    city: "New Orleans, LA",
    featured: true,
    followers: "31.7K",
    tips: 7440,
    bio: "High-glam drag performer sharing runway clips, character pieces, and behind-the-scenes videos.",
  },
  {
    id: "tre-main",
    name: "Tre Main",
    category: "Comedians",
    city: "Detroit, MI",
    featured: false,
    followers: "12.6K",
    tips: 2310,
    bio: "Stand-up comic posting crowd-work clips, sketches, and monthly long-form specials.",
  },
  {
    id: "sol-canvas",
    name: "Sol Canvas",
    category: "Live Painters",
    city: "Austin, TX",
    featured: false,
    followers: "7.2K",
    tips: 1280,
    bio: "Live painter creating time-lapse performance art to original music.",
  },
];

const videos = [
  {
    id: "gold-room-session",
    title: "Gold Room Session",
    artist: "Nia Vale",
    artistId: "nia-vale",
    category: "Singers",
    duration: "04:18",
    views: "48K",
    tips: 940,
    description: "A stripped-down vocal session filmed inside the Juke House gold room.",
  },
  {
    id: "midnight-edit",
    title: "Midnight Edit Pack",
    artist: "DJ Marble",
    artistId: "dj-marble",
    category: "DJs",
    duration: "12:42",
    views: "72K",
    tips: 1320,
    description: "Three club edits and a quick breakdown of the transitions.",
  },
  {
    id: "velvet-monologue",
    title: "Velvet Monologue",
    artist: "Kam Verse",
    artistId: "kam-verse",
    category: "Poets",
    duration: "06:02",
    views: "21K",
    tips: 410,
    description: "A cinematic spoken word performance about applause, memory, and home.",
  },
  {
    id: "final-bow",
    title: "Final Bow Fantasy",
    artist: "Lola Flare",
    artistId: "lola-flare",
    category: "Drag Performers",
    duration: "08:33",
    views: "91K",
    tips: 2210,
    description: "A choreographed showcase with costume reveal notes from Lola.",
  },
  {
    id: "front-row-set",
    title: "Front Row Set",
    artist: "Tre Main",
    artistId: "tre-main",
    category: "Comedians",
    duration: "15:08",
    views: "39K",
    tips: 660,
    description: "A tight club set with clean audio and fan comments.",
  },
  {
    id: "paint-to-bass",
    title: "Paint to Bass",
    artist: "Sol Canvas",
    artistId: "sol-canvas",
    category: "Live Painters",
    duration: "10:16",
    views: "17K",
    tips: 340,
    description: "A live canvas build set to a bass-heavy original loop.",
  },
];

const pendingArtists = [
  ["Maya Torch", "Dancers", "Portfolio and two reels submitted", "Pending"],
  ["King Route", "Rappers", "Needs identity verification", "Pending"],
  ["Eliza North", "Actors", "Strong reel and references", "Approved"],
  ["The Blue Hour", "Musicians", "Stage samples were incomplete", "Denied"],
];

const storageKey = "jukeHouseStateV1";
const defaultState = {
  artists,
  videos,
  activeCategories: categories,
  applications: pendingArtists.map(([name, category, notes, status], index) => ({
    id: `app-${index + 1}`,
    name,
    category,
    notes,
    status,
    email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
    city: "Submitted online",
  })),
  currentUser: { name: "Demo Fan", email: "fan@juke.house", role: "fan" },
  users: [
    { name: "Demo Fan", email: "fan@juke.house", role: "fan" },
    { name: "Nia Vale", email: "artist@juke.house", role: "artist", artistId: "nia-vale" },
    { name: "Juke Admin", email: "admin@juke.house", role: "admin" },
  ],
  follows: [],
  ledger: [
    { id: "tip-1", artistId: "nia-vale", gift: "Crown", gross: 10, createdAt: "Seed gift" },
    { id: "tip-2", artistId: "dj-marble", gift: "VIP Table", gross: 100, createdAt: "Seed gift" },
  ],
  subscriptions: [],
  uploads: [],
};

let state = loadState();

const app = document.querySelector("#app");
const nav = document.querySelector(".main-nav");
const menuToggle = document.querySelector(".menu-toggle");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
});

function money(value) {
  return `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) return structuredClone(defaultState);
    return {
      ...structuredClone(defaultState),
      ...saved,
      artists: saved.artists || structuredClone(defaultState.artists),
      videos: saved.videos || structuredClone(defaultState.videos),
      applications: saved.applications || structuredClone(defaultState.applications),
      activeCategories: saved.activeCategories || [...categories],
      ledger: saved.ledger || [],
      follows: saved.follows || [],
      subscriptions: saved.subscriptions || [],
      uploads: saved.uploads || [],
      users: saved.users || structuredClone(defaultState.users),
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function clean(value) {
  return String(value || "").trim().replace(/[<>"']/g, "");
}

function currentRoute() {
  return window.location.hash.replace(/^#/, "") || "home";
}

function artistTips(artistId) {
  const seeded = state.artists.find((artist) => artist.id === artistId)?.tips || 0;
  return seeded + state.ledger.filter((entry) => entry.artistId === artistId).reduce((sum, entry) => sum + entry.gross, 0);
}

function artistFollowerLabel(artist) {
  const follows = state.follows.filter((follow) => follow.artistId === artist.id).length;
  return follows ? `${artist.followers} + ${follows}` : artist.followers;
}

function activeCategoriesOptions(selected = "") {
  return state.activeCategories.map((cat) => `<option ${cat === selected ? "selected" : ""}>${cat}</option>`).join("");
}

function roleNotice(roles, action) {
  if (!state.currentUser || !roles.includes(state.currentUser.role)) {
    showToast(`${action} requires ${roles.join(" or ")} access.`);
    return false;
  }
  return true;
}

function renderAccountStrip() {
  const user = state.currentUser;
  app.insertAdjacentHTML("afterbegin", `
    <section class="account-strip">
      <div>
        <strong>${user ? user.name : "Guest"}</strong>
        <span>${user ? `${user.role} account` : "Create or choose a demo account to test the flows"}</span>
      </div>
      <div class="account-actions">
        <button class="btn btn-light btn-small" data-login-role="fan">Fan</button>
        <button class="btn btn-light btn-small" data-login-role="artist">Artist</button>
        <button class="btn btn-light btn-small" data-login-role="admin">Admin</button>
        <button class="btn btn-light btn-small" data-action="reset-demo">Reset Demo</button>
      </div>
    </section>
  `);
}

function artistCard(artist, index) {
  return `
    <article class="card">
      <div class="artist-art alt-${index % 4}">
        <div>
          <span class="pill gold">${artist.category}</span>
          <h3>${artist.name}</h3>
        </div>
      </div>
      <div class="card-body">
        <p>${artist.bio}</p>
        <div class="pill-row">
          <span class="pill">${artist.city}</span>
          <span class="pill">${artistFollowerLabel(artist)} followers</span>
          ${artist.featured ? '<span class="pill gold">Featured</span>' : ""}
        </div>
        <div class="actions">
          <a class="btn btn-secondary" href="#artist/${artist.id}">View Profile</a>
          <a class="btn btn-light" href="#gift/${artist.id}">Send Gift</a>
        </div>
      </div>
    </article>
  `;
}

function videoCard(video, index) {
  return `
    <article class="card">
      <a href="#watch/${video.id}" class="video-art alt-${index % 4}" aria-label="Watch ${video.title}">
        <div>
          <span class="pill gold">${video.duration}</span>
          <h3>${video.title}</h3>
        </div>
      </a>
      <div class="card-body">
        <p><strong>${video.artist}</strong> / ${video.category}</p>
        <p>${video.description}</p>
        <div class="pill-row">
          <span class="pill">${video.views} views</span>
          <span class="pill">${money(video.tips)} tips</span>
        </div>
      </div>
    </article>
  `;
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="hero-content">
        <span class="eyebrow">Approved artists only / No live streaming in Version 1</span>
        <h1>Juke House</h1>
        <p>A video platform where approved entertainers upload polished performances, grow fan communities, and receive tips and gifts with a clear 70/30 payout model.</p>
        <div class="actions">
          <a class="btn btn-primary" href="#browse">Browse Artists</a>
          <a class="btn btn-secondary" href="#apply">Apply as Artist</a>
          <a class="btn btn-ghost" href="#feed">Watch Videos</a>
        </div>
      </div>
    </section>
    <section class="page feature-band">
      <div class="section-head">
        <div>
          <span class="eyebrow">Version 1 model</span>
          <h2>Upload. Watch. Tip.</h2>
        </div>
        <p>Juke House starts with approved uploads, follows, fan subscriptions, and placeholder Stripe payment buttons before live streaming arrives later.</p>
      </div>
      <div class="grid grid-4">
        <div class="stat"><strong>70%</strong><span>artist payout on tips and gifts</span></div>
        <div class="stat"><strong>30%</strong><span>Juke House platform share</span></div>
        <div class="stat"><strong>${state.activeCategories.length}</strong><span>active talent categories ready for discovery</span></div>
        <div class="stat"><strong>6</strong><span>gift levels from Rose to VIP Table</span></div>
      </div>
    </section>
    <section class="page">
      <div class="section-head">
        <div>
          <span class="eyebrow">Featured artists</span>
          <h2>On the house stage</h2>
        </div>
        <a class="btn btn-light" href="#browse">See all</a>
      </div>
      <div class="grid grid-3">${state.artists.filter((artist) => artist.featured).map(artistCard).join("")}</div>
    </section>
  `;
}

function renderApply() {
  app.innerHTML = `
    <section class="page">
      <div class="section-head">
        <div>
          <span class="eyebrow">Artist application</span>
          <h2>Apply for upload access</h2>
        </div>
        <p>Only approved artists can upload videos. Admins can approve, deny, feature artists, and manage categories.</p>
      </div>
      <div class="grid grid-2">
        <div class="card"><div class="card-body">
          <form class="form" data-action="apply">
            <label>Stage name<input name="name" required placeholder="Your artist or act name" /></label>
            <label>Email<input name="email" required type="email" placeholder="artist@example.com" /></label>
            <label>Primary category<select name="category">${activeCategoriesOptions()}</select></label>
            <label>City<input name="city" placeholder="City, ST" /></label>
            <label>Portfolio or video links<textarea name="portfolio" rows="4" placeholder="Paste links to performances, reels, or press."></textarea></label>
            <label>Why Juke House?<textarea name="notes" rows="4" placeholder="Tell us what fans can expect from your videos."></textarea></label>
            <button class="btn btn-primary" type="submit">Submit Application</button>
          </form>
        </div></div>
        <div class="card"><div class="card-body">
          <h3>Approval checklist</h3>
          <p>Version 1 protects the upload library by requiring human approval before video uploads are unlocked.</p>
          <div class="pill-row">
            <span class="pill">Identity review</span>
            <span class="pill">Portfolio review</span>
            <span class="pill">Category fit</span>
            <span class="pill">Community standards</span>
          </div>
          <div class="actions">
            <a class="btn btn-secondary" href="#admin-dashboard">View Admin Queue</a>
          </div>
        </div></div>
      </div>
    </section>
  `;
}

function renderBrowse() {
  app.innerHTML = `
    <section class="page">
      <div class="section-head">
        <div>
          <span class="eyebrow">Browse artists</span>
          <h2>Find your next favorite act</h2>
        </div>
        <p>Fans can create accounts, follow artists, watch videos, and send tips or gifts.</p>
      </div>
      <div class="toolbar">
        <input id="search" placeholder="Search artists, cities, or categories" />
        <select id="categoryFilter">
          <option value="">All categories</option>
          ${activeCategoriesOptions()}
        </select>
      </div>
      <div class="grid grid-3" id="artistGrid"></div>
    </section>
  `;
  const grid = document.querySelector("#artistGrid");
  const search = document.querySelector("#search");
  const categoryFilter = document.querySelector("#categoryFilter");
  const update = () => {
    const query = search.value.toLowerCase();
    const category = categoryFilter.value;
    grid.innerHTML = state.artists
      .filter((artist) => !category || artist.category === category)
      .filter((artist) => `${artist.name} ${artist.city} ${artist.category}`.toLowerCase().includes(query))
      .map(artistCard)
      .join("");
  };
  search.addEventListener("input", update);
  categoryFilter.addEventListener("change", update);
  update();
}

function renderArtistProfile(id = "nia-vale") {
  const artist = state.artists.find((item) => item.id === id) || state.artists[0];
  const artistVideos = state.videos.filter((video) => video.artistId === artist.id);
  const isFollowing = state.follows.some((follow) => follow.artistId === artist.id && follow.email === state.currentUser?.email);
  app.innerHTML = `
    <section class="page">
      <div class="profile-hero">
        <div class="profile-panel">
          <span class="eyebrow">${artist.category} / ${artist.city}</span>
          <h2>${artist.name}</h2>
          <p>${artist.bio}</p>
          <div class="pill-row">
            <span class="pill gold">${artistFollowerLabel(artist)} followers</span>
            <span class="pill gold">${money(artistTips(artist.id))} total gifts</span>
          </div>
          <div class="actions">
            <button class="btn btn-primary" data-action="follow" data-artist-id="${artist.id}">${isFollowing ? "Following" : "Follow"}</button>
            <a class="btn btn-ghost" href="#gift/${artist.id}">Send Gift</a>
            <a class="btn btn-ghost" href="#subscribe">Subscribe</a>
          </div>
        </div>
        <div class="card"><div class="artist-art alt-2" style="min-height: 100%;"><h3>Featured profile video</h3></div></div>
      </div>
      <div class="section-head">
        <div>
          <span class="eyebrow">Videos</span>
          <h2>Latest uploads</h2>
        </div>
      </div>
      <div class="grid grid-3">${artistVideos.length ? artistVideos.map(videoCard).join("") : state.videos.slice(0, 3).map(videoCard).join("")}</div>
    </section>
  `;
}

function renderFeed() {
  app.innerHTML = `
    <section class="page">
      <div class="section-head">
        <div>
          <span class="eyebrow">Video feed</span>
          <h2>Fresh uploads from approved artists</h2>
        </div>
        <p>Uploads include titles, descriptions, categories, and creator attribution. Upload controls remain locked to approved artists.</p>
      </div>
      <div class="toolbar">
        <input id="videoSearch" placeholder="Search videos or artists" />
        <select id="videoCategory">
          <option value="">All categories</option>
          ${activeCategoriesOptions()}
        </select>
      </div>
      <div class="grid grid-3" id="videoGrid"></div>
    </section>
  `;
  const grid = document.querySelector("#videoGrid");
  const search = document.querySelector("#videoSearch");
  const categoryFilter = document.querySelector("#videoCategory");
  const update = () => {
    const query = search.value.toLowerCase();
    const category = categoryFilter.value;
    grid.innerHTML = state.videos
      .filter((video) => !category || video.category === category)
      .filter((video) => `${video.title} ${video.artist} ${video.category}`.toLowerCase().includes(query))
      .map(videoCard)
      .join("");
  };
  search.addEventListener("input", update);
  categoryFilter.addEventListener("change", update);
  update();
}

function renderWatch(id = "gold-room-session") {
  const video = state.videos.find((item) => item.id === id) || state.videos[0];
  const artist = state.artists.find((item) => item.id === video.artistId);
  app.innerHTML = `
    <section class="page">
      <div class="watch-layout">
        <div>
          <div class="video-player" role="img" aria-label="Placeholder video player for ${video.title}">
            <div class="play-symbol"></div>
          </div>
          <div class="card-body">
          <span class="eyebrow">${video.category} / ${video.duration}</span>
            <h2>${video.title}</h2>
            <p>${video.description}</p>
            <div class="pill-row">
              <span class="pill">${video.views} views</span>
              <span class="pill">${money(video.tips)} gifted</span>
              <span class="pill">Placeholder video playback</span>
            </div>
          </div>
        </div>
        <aside class="side-panel">
          <h3>${video.artist}</h3>
          <p>${artist ? artist.bio : "Approved Juke House artist."}</p>
          <div class="actions">
            <a class="btn btn-secondary" href="#artist/${video.artistId}">Artist Profile</a>
            <a class="btn btn-primary" href="#gift/${video.artistId}">Tip This Artist</a>
            <button class="btn btn-light" data-action="quick-tip" data-artist-id="${video.artistId}">Stripe Tip $5</button>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderSubscribe() {
  app.innerHTML = `
    <section class="page">
      <div class="section-head">
        <div>
          <span class="eyebrow">Fan subscription</span>
          <h2>Support the house every month</h2>
        </div>
        <p>Placeholder Stripe buttons are included for Version 1 while payment processing is wired later.</p>
      </div>
      <div class="grid grid-3">
        ${[
          ["Fan", 7, "Follow artists, save videos, and unlock subscriber-only comments."],
          ["Backstage", 15, "Monthly featured drops, artist updates, and early video access."],
          ["House Patron", 30, "Priority fan badge, monthly gift credit, and featured support."],
        ].map(([name, price, text]) => `
          <article class="card"><div class="card-body">
            <span class="eyebrow">${name}</span>
            <strong class="price">$${price}/mo</strong>
            <p>${text}</p>
            <button class="btn btn-primary" data-action="subscribe" data-plan="${name}" data-price="${price}">Stripe Subscribe</button>
          </div></article>
        `).join("")}
      </div>
      <div class="grid grid-2" style="margin-top: 18px;">
        <div class="card"><div class="card-body">
          <h3>Create a fan account</h3>
          <p>Fans can create accounts to follow artists, save videos, subscribe, and send gifts.</p>
          <form class="form" data-action="fan-account">
            <label>Name<input name="name" required placeholder="Your name" /></label>
            <label>Email<input name="email" required type="email" placeholder="fan@example.com" /></label>
            <label>Password<input name="password" required type="password" placeholder="Create a password" /></label>
            <button class="btn btn-secondary" type="submit">Create Account</button>
          </form>
        </div></div>
        <div class="card"><div class="card-body">
          <h3>Fan actions</h3>
          <p>Version 1 focuses on account creation, watching videos, following artists, subscriptions, and gifts before live streaming is added.</p>
          <div class="pill-row">
            <span class="pill">Watch videos</span>
            <span class="pill">Follow artists</span>
            <span class="pill">Send tips</span>
            <span class="pill">Subscribe</span>
          </div>
        </div></div>
      </div>
    </section>
  `;
}

function renderGift(id = "nia-vale") {
  const artist = state.artists.find((item) => item.id === id) || state.artists[0];
  app.innerHTML = `
    <section class="page">
      <div class="section-head">
        <div>
          <span class="eyebrow">Gifts and tips</span>
          <h2>Send love to ${artist.name}</h2>
        </div>
        <p>Artists keep 70% of every gift. Juke House keeps 30% to run the platform.</p>
      </div>
      <div class="grid grid-2">
        <div class="card"><div class="card-body">
          <div class="gift-grid">
            ${gifts.map(([name, price], index) => `
              <button class="gift-card ${index === 2 ? "selected" : ""}" data-gift="${name}" data-price="${price}">
                <strong>${name}</strong>
                <span>$${price}</span>
              </button>
            `).join("")}
          </div>
          <div class="actions">
            <button class="btn btn-primary" id="sendGiftButton" data-artist-id="${artist.id}">Stripe Gift Button</button>
          </div>
        </div></div>
        <div class="card"><div class="card-body">
          <h3>Payout preview</h3>
          <p>Select a gift to preview how the 70/30 split works.</p>
          <div class="grid" id="payoutPreview"></div>
        </div></div>
      </div>
    </section>
  `;
  const payout = document.querySelector("#payoutPreview");
  const cards = document.querySelectorAll(".gift-card");
  const update = (card) => {
    cards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    const price = Number(card.dataset.price);
    payout.innerHTML = `
      <div class="stat" style="background: var(--green-soft); color: var(--ink);"><strong>${money(price * 0.7)}</strong><span>artist keeps 70%</span></div>
      <div class="stat" style="background: var(--gold-soft); color: var(--ink);"><strong>${money(price * 0.3)}</strong><span>Juke House keeps 30%</span></div>
    `;
  };
  cards.forEach((card) => card.addEventListener("click", () => update(card)));
  update(document.querySelector(".gift-card.selected"));
  document.querySelector("#sendGiftButton").addEventListener("click", () => {
    const selected = document.querySelector(".gift-card.selected");
    addGift(artist.id, selected.dataset.gift, Number(selected.dataset.price));
  });
}

function renderArtistDashboard() {
  const artist = state.artists.find((item) => item.id === state.currentUser?.artistId) || state.artists[0];
  const artistVideos = state.videos.filter((video) => video.artistId === artist.id);
  const artistLedger = state.ledger.filter((entry) => entry.artistId === artist.id);
  const totalGross = artistTips(artist.id);
  const uploadLocked = state.currentUser?.role !== "artist";
  app.innerHTML = `
    <section class="page">
      <div class="section-head">
        <div>
          <span class="eyebrow">Artist dashboard</span>
          <h2>Upload and earnings center</h2>
        </div>
        <p>Upload is available only for approved artists. Switch to the artist demo account to save upload drafts.</p>
      </div>
      <div class="grid grid-4">
        <div class="card"><div class="card-body"><span class="eyebrow">Status</span><h3>${uploadLocked ? "Locked" : "Approved"}</h3><p>${uploadLocked ? "Artist login required." : "Video uploads enabled."}</p></div></div>
        <div class="card"><div class="card-body"><span class="eyebrow">Gross gifts</span><h3>${money(totalGross)}</h3><p>${money(totalGross * 0.7)} artist share.</p></div></div>
        <div class="card"><div class="card-body"><span class="eyebrow">Followers</span><h3>${artistFollowerLabel(artist)}</h3><p>${state.follows.filter((follow) => follow.artistId === artist.id).length} demo follows.</p></div></div>
        <div class="card"><div class="card-body"><span class="eyebrow">Videos</span><h3>${artistVideos.length}</h3><p>${state.uploads.filter((upload) => upload.artistId === artist.id).length} upload drafts saved.</p></div></div>
      </div>
      <div class="grid grid-2" style="margin-top: 18px;">
        <div class="card"><div class="card-body">
          <h3>New video upload</h3>
          <form class="form" data-action="upload">
            <div class="upload-drop"><strong>Drop video file here</strong><br /><span>Metadata is saved locally; video hosting comes next.</span></div>
            <label>Title<input name="title" required placeholder="Video title" ${uploadLocked ? "disabled" : ""} /></label>
            <label>Description<textarea name="description" rows="4" placeholder="Describe this upload" ${uploadLocked ? "disabled" : ""}></textarea></label>
            <label>Category<select name="category" ${uploadLocked ? "disabled" : ""}>${activeCategoriesOptions(artist.category)}</select></label>
            <button class="btn btn-primary" type="submit" ${uploadLocked ? "disabled" : ""}>Save Upload Draft</button>
          </form>
        </div></div>
        <div class="card"><div class="card-body">
          <h3>Recent gifts</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Gift</th><th>Gross</th><th>Artist 70%</th><th>Platform 30%</th></tr></thead>
              <tbody>
                ${artistLedger.length ? artistLedger.slice(-8).reverse().map((entry) => `<tr><td>${entry.gift}</td><td>${money(entry.gross)}</td><td>${money(entry.gross * 0.7)}</td><td>${money(entry.gross * 0.3)}</td></tr>`).join("") : `<tr><td colspan="4">No gifts yet.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div></div>
      </div>
      <div class="grid" style="margin-top: 18px;">
        <div class="card"><div class="card-body">
          <h3>Saved upload drafts</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Category</th><th>Description</th><th>Status</th></tr></thead>
              <tbody>
                ${state.uploads.filter((upload) => upload.artistId === artist.id).length ? state.uploads.filter((upload) => upload.artistId === artist.id).map((upload) => `<tr><td>${upload.title}</td><td>${upload.category}</td><td>${upload.description}</td><td><span class="status pending">Draft</span></td></tr>`).join("") : `<tr><td colspan="4">No drafts saved yet.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div></div>
      </div>
    </section>
  `;
}

function renderAdminDashboard() {
  const pendingCount = state.applications.filter((item) => item.status === "Pending").length;
  const featuredCount = state.artists.filter((artist) => artist.featured).length;
  const giftGross = state.ledger.reduce((sum, entry) => sum + entry.gross, 0);
  const subscriptionGross = state.subscriptions.reduce((sum, entry) => sum + entry.price, 0);
  app.innerHTML = `
    <section class="page">
      <div class="section-head">
        <div>
          <span class="eyebrow">Admin dashboard</span>
          <h2>Approvals, features, and categories</h2>
        </div>
        <p>Admins approve or deny artists, feature artists, and manage category visibility.</p>
      </div>
      <div class="grid grid-3">
        <div class="card"><div class="card-body"><span class="eyebrow">Pending</span><h3>${pendingCount} applications</h3><p>Ready for review.</p></div></div>
        <div class="card"><div class="card-body"><span class="eyebrow">Platform share</span><h3>${money(giftGross * 0.3)}</h3><p>30% of recorded gifts.</p></div></div>
        <div class="card"><div class="card-body"><span class="eyebrow">Subscriptions</span><h3>${money(subscriptionGross)}</h3><p>${state.subscriptions.length} demo subscription events.</p></div></div>
      </div>
      <div class="grid grid-3" style="margin-top: 18px;">
        <div class="card"><div class="card-body"><span class="eyebrow">Featured</span><h3>${featuredCount} artists</h3><p>Shown on the home page.</p></div></div>
        <div class="card"><div class="card-body"><span class="eyebrow">Categories</span><h3>${state.activeCategories.length}</h3><p>Active talent categories.</p></div></div>
        <div class="card"><div class="card-body"><span class="eyebrow">Artist payouts</span><h3>${money(giftGross * 0.7)}</h3><p>70% owed to artists from gifts.</p></div></div>
      </div>
      <div class="grid grid-2" style="margin-top: 18px;">
        <div class="card"><div class="card-body">
          <h3>Artist review queue</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Artist</th><th>Category</th><th>Notes</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                ${state.applications.map((application) => `<tr><td>${application.name}</td><td>${application.category}</td><td>${application.notes}</td><td><span class="status ${application.status.toLowerCase()}">${application.status}</span></td><td><button class="btn btn-light" data-action="approve" data-app-id="${application.id}">Approve</button> <button class="btn btn-light" data-action="deny" data-app-id="${application.id}">Deny</button></td></tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div></div>
        <div class="card"><div class="card-body">
          <h3>Manage categories</h3>
          <form data-action="categories">
            <div class="check-grid">
              ${categories.map((cat) => `<label><input name="categories" type="checkbox" value="${cat}" ${state.activeCategories.includes(cat) ? "checked" : ""} />${cat}</label>`).join("")}
            </div>
            <div class="actions">
              <button class="btn btn-primary" type="submit">Save Categories</button>
            </div>
          </form>
        </div></div>
      </div>
      <div class="grid" style="margin-top: 18px;">
        <div class="card"><div class="card-body">
          <h3>Featured artist controls</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Artist</th><th>Category</th><th>Featured</th><th>Action</th></tr></thead>
              <tbody>
                ${state.artists.map((artist) => `<tr><td>${artist.name}</td><td>${artist.category}</td><td>${artist.featured ? "Yes" : "No"}</td><td><button class="btn btn-light" data-action="feature" data-artist-id="${artist.id}">${artist.featured ? "Remove Feature" : "Feature Artist"}</button></td></tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div></div>
      </div>
      <div class="grid" style="margin-top: 18px;">
        <div class="card"><div class="card-body">
          <h3>Payment and payout ledger</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Artist</th><th>Gift</th><th>Gross</th><th>Artist 70%</th><th>Juke House 30%</th></tr></thead>
              <tbody>
                ${state.ledger.length ? state.ledger.slice().reverse().map((entry) => {
                  const artist = state.artists.find((item) => item.id === entry.artistId);
                  return `<tr><td>${artist ? artist.name : "Unknown"}</td><td>${entry.gift}</td><td>${money(entry.gross)}</td><td>${money(entry.gross * 0.7)}</td><td>${money(entry.gross * 0.3)}</td></tr>`;
                }).join("") : `<tr><td colspan="5">No payment events recorded yet.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div></div>
      </div>
    </section>
  `;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = "position:fixed;left:50%;bottom:24px;z-index:60;transform:translateX(-50%);max-width:calc(100vw - 32px);padding:13px 16px;border-radius:8px;color:#070906;background:#d7a72d;font-weight:800;box-shadow:0 12px 30px rgba(7,9,6,.24);";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

function refresh(message) {
  saveState();
  router();
  if (message) showToast(message);
}

function addGift(artistId, gift, gross) {
  if (!roleNotice(["fan", "admin"], "Sending gifts")) return;
  state.ledger.push({
    id: `tip-${Date.now()}`,
    artistId,
    gift,
    gross,
    createdAt: new Date().toLocaleString(),
    fanEmail: state.currentUser.email,
  });
  refresh(`${gift} sent. Artist keeps ${money(gross * 0.7)} and Juke House keeps ${money(gross * 0.3)}.`);
}

function approveApplication(applicationId) {
  if (!roleNotice(["admin"], "Approving artists")) return;
  const application = state.applications.find((item) => item.id === applicationId);
  if (!application) return;
  application.status = "Approved";
  const artistId = slugify(application.name);
  if (!state.artists.some((artist) => artist.id === artistId)) {
    state.artists.push({
      id: artistId,
      name: application.name,
      category: application.category,
      city: application.city || "New artist",
      featured: false,
      followers: "0",
      tips: 0,
      bio: application.notes || "Approved Juke House artist preparing their first upload.",
    });
  }
  refresh(`${application.name} approved and added to Browse Artists.`);
}

function denyApplication(applicationId) {
  if (!roleNotice(["admin"], "Denying artists")) return;
  const application = state.applications.find((item) => item.id === applicationId);
  if (!application) return;
  application.status = "Denied";
  refresh(`${application.name} denied.`);
}

function handleFormSubmit(form) {
  const formData = new FormData(form);
  const action = form.dataset.action;

  if (action === "apply") {
    const name = clean(formData.get("name"));
    state.applications.unshift({
      id: `app-${Date.now()}`,
      name,
      email: clean(formData.get("email")),
      category: formData.get("category"),
      city: clean(formData.get("city")) || "Not provided",
      notes: clean(formData.get("notes")) || clean(formData.get("portfolio")) || "Application submitted for review.",
      status: "Pending",
    });
    form.reset();
    refresh(`${name} application submitted for admin review.`);
    return;
  }

  if (action === "fan-account") {
    const user = {
      name: clean(formData.get("name")),
      email: clean(formData.get("email")),
      role: "fan",
    };
    state.users = state.users.filter((item) => item.email !== user.email).concat(user);
    state.currentUser = user;
    form.reset();
    refresh(`Fan account created for ${user.name}.`);
    return;
  }

  if (action === "upload") {
    if (!roleNotice(["artist"], "Uploading videos")) return;
    const artist = state.artists.find((item) => item.id === state.currentUser.artistId);
    if (!artist) {
      showToast("This artist account is not connected to an approved artist.");
      return;
    }
    const title = clean(formData.get("title"));
    const description = clean(formData.get("description"));
    const category = formData.get("category");
    const video = {
      id: slugify(`${title}-${Date.now()}`),
      title,
      artist: artist.name,
      artistId: artist.id,
      category,
      duration: "Draft",
      views: "0",
      tips: 0,
      description,
    };
    state.uploads.unshift({ ...video, status: "Draft" });
    state.videos.unshift(video);
    form.reset();
    refresh(`${title} saved as a video draft.`);
    return;
  }

  if (action === "categories") {
    if (!roleNotice(["admin"], "Managing categories")) return;
    const selected = formData.getAll("categories");
    state.activeCategories = selected.length ? selected : [...categories];
    refresh("Category settings saved.");
  }
}

function wireInteractions() {
  document.querySelectorAll("form[data-action]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handleFormSubmit(form);
    });
  });

  document.querySelectorAll("[data-login-role]").forEach((button) => {
    button.addEventListener("click", () => {
      const user = state.users.find((item) => item.role === button.dataset.loginRole);
      state.currentUser = user;
      refresh(`Switched to ${user.name}.`);
    });
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    if (button.tagName === "FORM") return;
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "reset-demo") {
        localStorage.removeItem(storageKey);
        state = loadState();
        refresh("Demo data reset.");
      }
      if (action === "follow") {
        if (!roleNotice(["fan", "admin"], "Following artists")) return;
        const artistId = button.dataset.artistId;
        const exists = state.follows.some((follow) => follow.artistId === artistId && follow.email === state.currentUser.email);
        if (exists) {
          state.follows = state.follows.filter((follow) => !(follow.artistId === artistId && follow.email === state.currentUser.email));
          refresh("Artist unfollowed.");
        } else {
          state.follows.push({ artistId, email: state.currentUser.email });
          refresh("Artist followed.");
        }
      }
      if (action === "quick-tip") addGift(button.dataset.artistId, "Fire", 5);
      if (action === "subscribe") {
        if (!roleNotice(["fan", "admin"], "Subscribing")) return;
        state.subscriptions.push({
          id: `sub-${Date.now()}`,
          plan: button.dataset.plan,
          price: Number(button.dataset.price),
          email: state.currentUser.email,
          createdAt: new Date().toLocaleString(),
        });
        refresh(`${button.dataset.plan} subscription saved with Stripe placeholder.`);
      }
      if (action === "approve") approveApplication(button.dataset.appId);
      if (action === "deny") denyApplication(button.dataset.appId);
      if (action === "feature") {
        if (!roleNotice(["admin"], "Featuring artists")) return;
        const artist = state.artists.find((item) => item.id === button.dataset.artistId);
        artist.featured = !artist.featured;
        refresh(`${artist.name} feature status updated.`);
      }
    });
  });
}

function setActive(route) {
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const linkRoute = link.getAttribute("href").slice(1);
    link.classList.toggle("active", route.startsWith(linkRoute));
  });
}

function router() {
  const hash = window.location.hash.replace(/^#/, "") || "home";
  const [route, id] = hash.split("/");
  const routes = {
    home: renderHome,
    apply: renderApply,
    browse: renderBrowse,
    artist: () => renderArtistProfile(id),
    feed: renderFeed,
    watch: () => renderWatch(id),
    subscribe: renderSubscribe,
    gift: () => renderGift(id),
    "artist-dashboard": renderArtistDashboard,
    "admin-dashboard": renderAdminDashboard,
  };
  (routes[route] || renderHome)();
  renderAccountStrip();
  setActive(route);
  wireInteractions();
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", router);
router();
