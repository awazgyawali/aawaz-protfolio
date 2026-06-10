// Minimal char splitter: wraps every character of an element in
// span.word > span.char so GSAP can animate per-glyph. Idempotent across
// StrictMode remounts via a data flag; revert() restores the original markup.
export function splitChars(el: HTMLElement): { chars: HTMLElement[]; revert: () => void } {
  if (el.dataset.split === "1") {
    return { chars: Array.from(el.querySelectorAll<HTMLElement>(".char")), revert: () => {} };
  }
  const original = el.innerHTML;
  const text = el.textContent ?? "";
  el.innerHTML = "";
  el.dataset.split = "1";
  const chars: HTMLElement[] = [];
  for (const word of text.split(/(\s+)/)) {
    if (!word) continue;
    if (/^\s+$/.test(word)) {
      el.appendChild(document.createTextNode(" "));
      continue;
    }
    const w = document.createElement("span");
    w.className = "word";
    for (const ch of word) {
      const c = document.createElement("span");
      c.className = "char";
      c.textContent = ch;
      w.appendChild(c);
      chars.push(c);
    }
    el.appendChild(w);
  }
  return {
    chars,
    revert: () => {
      el.innerHTML = original;
      delete el.dataset.split;
    },
  };
}
