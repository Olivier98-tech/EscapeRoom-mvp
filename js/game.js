/* ============================================================
   ESCAPE ROOM ENGINE — "Red de Mensheid van de Kwaadaardige Code"
   Shared logic for all levels:
   - Global countdown timer (configurable via admin.html)
   - Progress tracking + level gating (no URL skipping)
   - Answer checking via salted hashes (no plaintext answers in source)
   - Persistent lockouts (survive page refresh)
   - Hint system (unlocks after failed attempts)
   - Sound on/off toggle
   - Facilitator skip support (via admin portal)
   ============================================================ */

const ER = (() => {
  "use strict";

  // ---------- Storage keys ----------
  const K = {
    config:   "er_config",     // { durationMin, extraMs }
    start:    "er_start",      // timestamp (ms) when game started
    progress: "er_progress",   // array of completed level numbers
    sound:    "er_sound",      // "on" | "off"
    fails:    "er_fails_",     // + level id → number of wrong attempts
    lock:     "er_lock_",      // + level id → timestamp until which input is locked
    group:    "er_group",      // team/group name (shown in HUD + admin portal)
    intro:    "er_intro_",     // + level number → has this level's intro been shown?
    lentry:   "er_lentry_",    // + level number → timestamp first entered
    ltime:    "er_ltime_"      // + level number → solve time in seconds
  };

  const TOTAL_LEVELS = 6;
  const PUZZLE_IDS = ["l1", "l2", "l3", "l4", "l5", "l6a", "l6b", "l6c"];
  const LEVEL_NAMES = ["De Cijfercode", "De Firewall", "Hexa Lockdown",
                       "Code van de Vier", "Kernel Infiltratie", "De Finale"];

  // Lockout policy: first 3 wrong attempts are free (no wait). From the 4th
  // wrong attempt on, the wait grows 10s per attempt (10, 20, 30, ...) up to a
  // 60s maximum, then stays at 60s each further attempt.
  const FREE_ATTEMPTS = 3;         // no lockout for the first N wrong answers
  const LOCKOUT_STEP_SECONDS = 10; // added wait per attempt past the free ones
  const LOCKOUT_MAX_SECONDS = 60;  // hard cap on the wait (1 minute)
  const HINT_AFTER_FAILS = 2;      // hint unlocks after this many wrong attempts

  /** Wait (seconds) to apply after the given cumulative number of wrong attempts. */
  function lockoutSecondsFor(fails) {
    if (fails <= FREE_ATTEMPTS) return 0;
    return Math.min((fails - FREE_ATTEMPTS) * LOCKOUT_STEP_SECONDS, LOCKOUT_MAX_SECONDS);
  }

  // ---------- Answer hashes (salted djb2 — answers never appear in source) ----------
  const SALT = "EC2150:";
  const HASHES = {
    l1:  "b8376ff8",
    l2:  "49511f1e",
    l3:  "34ffa805",
    l4:  "b83ac99a",
    l5:  "51f29ef4",
    l6a: "b838a432",
    l6b: "72a5bf96",
    l6c: "3f613188",
    pin: "b83a4179"
  };

  function hash(str) {
    const s = SALT + str;
    let h = 5381;
    for (let i = 0; i < s.length; i++) {
      h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
    }
    return h.toString(16);
  }

  function normalize(str) {
    return String(str || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  // ---------- Storage helpers ----------
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch { return fallback; }
    },
    set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
    del(key) { localStorage.removeItem(key); }
  };

  // ---------- Config / game state ----------
  function getConfig() {
    return store.get(K.config, { durationMin: 60, extraMs: 0 });
  }
  function setConfig(cfg) { store.set(K.config, cfg); }

  function startGame() {
    store.set(K.start, Date.now());
    store.set(K.progress, []);
    // clear per-level state
    PUZZLE_IDS.forEach(id => {
      store.del(K.fails + id);
      store.del(K.lock + id);
    });
    for (let i = 1; i <= TOTAL_LEVELS; i++) { store.del(K.intro + i); store.del(K.lentry + i); store.del(K.ltime + i); }
    const cfg = getConfig();
    cfg.extraMs = 0;
    setConfig(cfg);
  }

  function resetGame() {
    store.del(K.start);
    store.del(K.progress);
    PUZZLE_IDS.forEach(id => {
      store.del(K.fails + id);
      store.del(K.lock + id);
    });
    for (let i = 1; i <= TOTAL_LEVELS; i++) { store.del(K.intro + i); store.del(K.lentry + i); store.del(K.ltime + i); }
  }

  function isStarted() { return store.get(K.start, null) !== null; }

  function remainingMs() {
    const start = store.get(K.start, null);
    if (start === null) return null;
    const cfg = getConfig();
    const end = start + cfg.durationMin * 60000 + (cfg.extraMs || 0);
    return end - Date.now();
  }

  function addTime(minutes) {
    const cfg = getConfig();
    cfg.extraMs = (cfg.extraMs || 0) + minutes * 60000;
    setConfig(cfg);
  }

  // ---------- Progress ----------
  function getProgress() { return store.get(K.progress, []); }

  function completeLevel(n) {
    const p = getProgress();
    if (!p.includes(n)) p.push(n);
    store.set(K.progress, p);
  }

  function isComplete(n) { return getProgress().includes(n); }

  /** Redirect players who try to skip ahead or haven't started. */
  function guard(level, basePath) {
    if (!isStarted()) {
      window.location.href = basePath + "index.html";
      return false;
    }
    for (let i = 1; i < level; i++) {
      if (!isComplete(i)) {
        window.location.href = basePath + "levels/level" + i + ".html";
        return false;
      }
    }
    return true;
  }

  // ---------- Group / team name ----------
  function getGroupName() { return store.get(K.group, ""); }
  function setGroupName(name) { store.set(K.group, String(name || "").trim().slice(0, 40)); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---------- Per-level timing ----------
  function startLevelTimer(n) {
    if (store.get(K.lentry + n, null) === null) store.set(K.lentry + n, Date.now());
  }
  function recordLevelSolved(n) {
    if (store.get(K.ltime + n, null) !== null) return;
    const entry = store.get(K.lentry + n, null);
    if (entry === null) return;
    store.set(K.ltime + n, Math.max(0, Math.round((Date.now() - entry) / 1000)));
  }
  function getLevelTime(n) { return store.get(K.ltime + n, null); }
  function elapsedMs() {
    const start = store.get(K.start, null);
    return start === null ? 0 : Date.now() - start;
  }

  // ---------- Answers ----------
  function check(id, input) {
    return hash(normalize(input)) === HASHES[id];
  }
  function checkRaw(id, alreadyNormalized) {
    return hash(alreadyNormalized) === HASHES[id];
  }

  // ---------- Fails / lockout / hints ----------
  function registerFail(id) {
    const fails = store.get(K.fails + id, 0) + 1;
    store.set(K.fails + id, fails);
    const secs = lockoutSecondsFor(fails);
    if (secs > 0) store.set(K.lock + id, Date.now() + secs * 1000);
    return { fails, hintUnlocked: fails >= HINT_AFTER_FAILS, lockSeconds: secs };
  }

  function getFails(id) { return store.get(K.fails + id, 0); }

  function lockedForMs(id) {
    const until = store.get(K.lock + id, 0);
    return Math.max(0, until - Date.now());
  }

  function clearLocks() {
    PUZZLE_IDS.forEach(id => store.del(K.lock + id));
  }

  // ---------- Sound ----------
  function soundOn() { return store.get(K.sound, "on") === "on"; }
  function toggleSound() {
    store.set(K.sound, soundOn() ? "off" : "on");
    syncSoundButton();
    if (!soundOn()) {
      document.querySelectorAll("audio").forEach(a => { a.pause(); });
    }
    return soundOn();
  }
  function play(elId) {
    if (!soundOn()) return;
    const el = document.getElementById(elId);
    if (el) { el.currentTime = 0; el.play().catch(() => {}); }
  }
  function syncSoundButton() {
    const btn = document.getElementById("er-sound-btn");
    if (btn) {
      btn.textContent = soundOn() ? "🔊" : "🔇";
      btn.title = soundOn() ? "Geluid uitzetten" : "Geluid aanzetten";
      btn.setAttribute("aria-label", btn.title);
    }
  }

  // ---------- HUD (mission status bar on every level page) ----------
  let hudLevel = null;

  function initHUD(level, basePath) {
    hudLevel = level;
    startLevelTimer(level);
    const hud = document.createElement("div");
    hud.className = "er-hud";
    const grp = getGroupName();
    hud.innerHTML =
      '<span class="er-hud-item er-hud-mission">MISSIE 2150</span>' +
      (grp ? '<span class="er-hud-item er-hud-group">👥 ' + escapeHtml(grp) + "</span>" : "") +
      '<span class="er-hud-item">LEVEL <strong>' + level + "</strong>/" + TOTAL_LEVELS + "</span>" +
      '<a class="er-hud-item er-hud-link" href="' + basePath + 'dashboard.html">◈ missiecontrole</a>' +
      '<span class="er-hud-item er-hud-timer" id="er-timer">--:--</span>' +
      '<button class="er-hud-btn" id="er-sound-btn" type="button">🔊</button>';
    document.body.prepend(hud);
    document.getElementById("er-sound-btn").addEventListener("click", toggleSound);
    syncSoundButton();
    tickTimer();
    setInterval(tickTimer, 1000);
  }

  function fmt(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(total / 60);
    const s = String(total % 60).padStart(2, "0");
    return m + ":" + s;
  }

  function tickTimer() {
    const el = document.getElementById("er-timer");
    if (!el) return;
    const rem = remainingMs();
    if (rem === null) { el.textContent = "--:--"; return; }
    if (rem <= 0) {
      el.textContent = "TIJD OM";
      el.classList.add("er-timer-expired");
      document.body.classList.add("er-time-up");
    } else {
      el.textContent = fmt(rem);
      el.classList.toggle("er-timer-warning", rem < 5 * 60000);
    }
  }

  // ---------- Standard puzzle wiring ----------
  /**
   * Wires a puzzle: submit button/enter, feedback, lockout countdown, hint button.
   * opts: { id, level, inputEl, submitEl, feedbackEl, hintText, hintEl, hintBtn,
   *         getValue?, onSuccess }
   */
  function wirePuzzle(opts) {
    const feedback = document.getElementById(opts.feedbackEl);
    const submit = document.getElementById(opts.submitEl);
    const input = opts.inputEl ? document.getElementById(opts.inputEl) : null;
    const hintBtn = opts.hintBtn ? document.getElementById(opts.hintBtn) : null;
    const hintEl = opts.hintEl ? document.getElementById(opts.hintEl) : null;
    let lockInterval = null;

    function refreshHint() {
      if (!hintBtn) return;
      const unlocked = getFails(opts.id) >= HINT_AFTER_FAILS;
      hintBtn.disabled = !unlocked;
      hintBtn.textContent = unlocked
        ? "💡 Toon hint"
        : "💡 Hint (na " + HINT_AFTER_FAILS + " foute pogingen)";
    }

    function refreshLock() {
      const ms = lockedForMs(opts.id);
      if (ms > 0) {
        submit.disabled = true;
        feedback.className = "er-feedback er-locked";
        feedback.textContent = "⛔ Systeem geblokkeerd — wacht " + fmt(ms);
        if (!lockInterval) {
          lockInterval = setInterval(() => {
            const left = lockedForMs(opts.id);
            if (left <= 0) {
              clearInterval(lockInterval);
              lockInterval = null;
              submit.disabled = false;
              feedback.textContent = "🔁 Probeer opnieuw.";
              feedback.className = "er-feedback";
            } else {
              feedback.textContent = "⛔ Systeem geblokkeerd — wacht " + fmt(left);
            }
          }, 500);
        }
        return true;
      }
      return false;
    }

    function attempt() {
      if (refreshLock()) return;
      const value = opts.getValue ? opts.getValue() : (input ? input.value : "");
      if (check(opts.id, value)) {
        play("er-audio-correct");
        feedback.className = "er-feedback er-success";
        feedback.textContent = "✅ Correct!";
        opts.onSuccess();
      } else {
        play("er-audio-error");
        const { fails, hintUnlocked } = registerFail(opts.id);
        refreshHint();
        if (!refreshLock()) {
          // Still within the free attempts — no lockout, just try again.
          const left = Math.max(0, FREE_ATTEMPTS - fails);
          feedback.className = "er-feedback er-error";
          feedback.textContent = left > 0
            ? "❌ Onjuist. Nog " + left + " poging" + (left === 1 ? "" : "en") + " zonder wachttijd."
            : "❌ Onjuist. Probeer opnieuw.";
        }
        if (hintUnlocked && hintBtn) {
          feedback.textContent += " — 💡 hint beschikbaar (poging " + fails + ")";
        }
      }
    }

    submit.addEventListener("click", attempt);
    if (input) {
      input.addEventListener("keydown", e => { if (e.key === "Enter") attempt(); });
    }
    if (hintBtn && hintEl) {
      hintBtn.addEventListener("click", () => {
        hintEl.textContent = opts.hintText;
        hintEl.classList.add("er-hint-visible");
      });
    }
    refreshHint();
    refreshLock();
  }

  // ---------- Level intro / transition screens ----------
  const INTROS = {
    1: { title: "Level 1 — De Cijfercode",
         text: "Jullie zijn binnen. Het eerste beveiligingsluik blokkeert de toegang. De AI heeft haar toegangscode verstopt in een QR-transmissie. Scan het signaal, kraak de 4-cijferige code en open de eerste deur." },
    2: { title: "Level 2 — De Firewall",
         text: "De eerste deur staat open — maar de AI heeft razendsnel haar firewall versterkt. Een onderschept commando bevat de sleutel, versluierd in een verschoven code. Ontcijfer het en schakel de firewall uit." },
    3: { title: "Level 3 — Hexa Lockdown",
         text: "De firewall ligt plat. Dieper in het systeem stuiten jullie op een hexadecimale vergrendeling. Vertaal de code terug naar leesbare tekst en kom één stap dichter bij de kern." },
    4: { title: "Level 4 — Code van de Vier",
         text: "De dataversleuteling is gekraakt. Voorbij deze deur ligt de AI-controlekamer, beveiligd met een symbolencode. De juiste volgorde vinden jullie op een fysieke aanwijzing in de ruimte. 🚨 Alarmfase actief." },
    5: { title: "Level 5 — Kernel Infiltratie",
         text: "Het alarm valt stil. Jullie staan in het hart van het systeem: de AI Kernel. Zij daagt jullie uit met een raadsel van getallen. Kies de juiste sleutels uit de matrix en infiltreer de kern." },
    6: { title: "Level 6 — De Finale",
         text: "Dit is het. Eén laatste verdedigingslinie scheidt jullie van de zelfvernietigingsknop: drie finale sloten. Los ze alle drie op — de tijd dringt. De toekomst van de mensheid ligt in jullie handen." }
  };

  /**
   * Shows a full-screen transition/intro overlay for a level. Appears once per
   * level (persisted); pass { force: true } to always show. The puzzle sits
   * behind it, so players never land straight in an exercise (also on skip).
   */
  function showLevelIntro(level, opts) {
    opts = opts || {};
    const data = INTROS[level];
    if (!data) return;
    if (!opts.force && store.get(K.intro + level, false)) return;
    const overlay = document.createElement("div");
    overlay.className = "er-overlay er-intro-overlay";
    overlay.innerHTML =
      '<div class="er-overlay-card">' +
      '<p class="er-intro-eyebrow">▸ TRANSMISSIE ONTVANGEN</p>' +
      "<h2>" + data.title + "</h2>" +
      "<p>" + data.text + "</p>" +
      '<button class="er-btn er-btn-primary" id="er-intro-start" type="button">▸ Start opdracht</button>' +
      "</div>";
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("er-overlay-visible"));
    const startBtn = document.getElementById("er-intro-start");
    startBtn.focus();
    startBtn.addEventListener("click", () => {
      store.set(K.intro + level, true);
      overlay.classList.remove("er-overlay-visible");
      setTimeout(() => overlay.remove(), 300);
    });
  }

  /** Shows the story overlay after completing a level. */
  function showSuccess(level, title, story, nextHref) {
    completeLevel(level);
    recordLevelSolved(level);
    const overlay = document.createElement("div");
    overlay.className = "er-overlay";
    overlay.innerHTML =
      '<div class="er-overlay-card">' +
      "<h2>" + title + "</h2>" +
      "<p>" + story + "</p>" +
      '<a class="er-btn er-btn-primary" href="' + nextHref + '">Volgende ▸</a>' +
      '<a class="er-btn er-btn-secondary" href="../dashboard.html" style="margin-left:.6rem">◈ Missiecontrole</a>' +
      "</div>";
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("er-overlay-visible"));
  }

  /** If a facilitator already marked this level complete (skip), offer the shortcut. */
  function offerSkipBanner(level, nextHref) {
    if (!isComplete(level)) return;
    const bar = document.createElement("div");
    bar.className = "er-skip-banner";
    bar.innerHTML =
      "✔ Dit level is al voltooid (of vrijgegeven door de spelleider). " +
      '<a href="' + nextHref + '">Ga direct verder ▸</a>';
    const hud = document.querySelector(".er-hud");
    (hud || document.body).insertAdjacentElement(hud ? "afterend" : "afterbegin", bar);
  }

  // ---------- Admin ----------
  function checkPin(pin) { return hash(normalize(pin)) === HASHES.pin; }

  return {
    TOTAL_LEVELS, LEVEL_NAMES, HINT_AFTER_FAILS,
    FREE_ATTEMPTS, LOCKOUT_STEP_SECONDS, LOCKOUT_MAX_SECONDS, lockoutSecondsFor,
    hash, normalize,
    getConfig, setConfig, startGame, resetGame, isStarted,
    remainingMs, elapsedMs, addTime, fmt,
    getProgress, completeLevel, isComplete, guard,
    getGroupName, setGroupName,
    startLevelTimer, recordLevelSolved, getLevelTime,
    check, checkRaw, registerFail, getFails, lockedForMs, clearLocks,
    soundOn, toggleSound, play,
    initHUD, wirePuzzle, showLevelIntro, showSuccess, offerSkipBanner,
    checkPin
  };
})();
