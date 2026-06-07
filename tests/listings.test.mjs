import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const detailPages = [
  "listing-points2perks.htm",
  "listing-tourist-aid.htm",
  "listing-persona-album.htm",
  "listing-sign-language-chat.htm",
  "listing-dashing-robo.htm"
];

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("listings index shows portfolio references and all detail links", () => {
  assert.equal(existsSync(new URL("../listings.htm", import.meta.url)), true);
  const listings = read("listings.htm");
  assert.match(listings, /Portfolio/i);
  assert.match(listings, /Andrew Leung works across/i);
  assert.match(listings, /ItemList/);
  for (const href of detailPages) {
    assert.match(listings, new RegExp(`href="${href}"`));
  }
});

for (const page of detailPages) {
  test(`${page} exposes canonical, inquiry CTA, and schema`, () => {
    assert.equal(existsSync(new URL(`../${page}`, import.meta.url)), true);
    const html = read(page);
    assert.match(html, /<link rel="canonical" href="https:\/\/wpatent\.com\//);
    assert.match(html, /mailto:wp@wpatent\.com/);
    assert.match(html, /<script type="application\/ld\+json">/);
  });
}
