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

test("listings and detail pages are retired with meta refresh redirects", () => {
  assert.equal(existsSync(new URL("../listings.htm", import.meta.url)), true);

  const index = read("listings.htm");
  assert.match(index, /http-equiv="refresh"/);
  assert.match(index, /url=https:\/\/wpatent\.com\/services\.htm"/);

  for (const page of detailPages) {
    assert.equal(existsSync(new URL(`../${page}`, import.meta.url)), true);
    const html = read(page);
    assert.match(html, /http-equiv="refresh"/);
    assert.match(html, /url=https:\/\/wpatent\.com\/services\.htm"/);
    assert.match(html, /<link rel="canonical" href="https:\/\/wpatent\.com\/services\.htm">/);
    assert.match(html, /mailto:wp@wpatent\.com/);
  }
});
