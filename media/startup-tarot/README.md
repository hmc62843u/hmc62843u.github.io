# Startup Tarot videos

Finished videos for the [Startup Tarot page](../../startup-tarot.htm) and social posts, with the project files needed to edit or re-render them. Each project keeps its finished files in `exports/`.

| Project | Audience | Finished video | How it was made |
| --- | --- | --- | --- |
| [2026-11-03-side-by-side](2026-11-03-side-by-side/) | Founders on the funnel page | 30 s comparison, 16:9 and 4:5 | Screen captures composed by render_video.py; post text in POST.md |
| [2026-11-03-stickman-pitch](2026-11-03-stickman-pitch/) | Founders on social media | 28 s pitch, 9:16 | stickman-video-director (Autopilot B1) with locally drawn art (draw-art.mjs) and Gemini Bodi narration |
| [2026-11-03-openfor-executive](2026-11-03-openfor-executive/) | OpenFor leadership | 45 s explainer, 16:9 | Same as the pitch; script in startup-tarot enterprise/EXECUTIVE_VIDEO.md |

The executive video is public but not linked from the funnel page while the OpenFor pilot is pending.

## Re-rendering a stickman project

1. Clone https://github.com/kaomei/stickman-video-director and run `npm ci` in skills/directing-stickman-videos.
2. Install FFmpeg and use Node 20 or later.
3. Redraw art if needed: `node draw-art.mjs`, with that skill's node_modules/@napi-rs/canvas available (set CANVAS_MODULE to its path).
4. From the skill folder: `node scripts/autopilot.mjs preview <project>/project.json`, review, then `approve` and `render`.

Render output goes to each project's `output/` folder, which git ignores.
