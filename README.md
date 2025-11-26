# devrajgoswami.github.io
Repository to manage my GitHub Page.

This simple GitHub Pages demo contains a small single-page website with two tools:

- Calculator — a responsive basic calculator (arithmetic, percent, ±, clear)
- Calendar — interactive month view with navigation and date selection
- Calendar — interactive month view with navigation and date selection

How to preview locally (simple):

1. Open `index.html` in your browser (no server required for static files).
2. Or quickly test using Python's simple HTTP server (from this repo root):

```powershell
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Files added:

- `index.html` — main page includes both tools
- `assets/css/style.css` — styling
- `assets/js/main.js` — small client-side JS for both calculator and calendar

If you want enhancements (themes, scientific functions, event saving in calendar, or a packaged site), tell me which features you'd like next.
 
Keyboard / accessibility tips:

- Calculator: use number keys, `.` for decimal, `+ - * /` for operators, `Enter` for equals, `Backspace` to delete one digit, `Esc` to clear.
 - Calendar: switch to the Calendar tab and use Left/Right arrow keys to navigate months, click a date to select it.
- Calculator: the History column (right side) shows the last 10 calculations (persisted in your browser) and includes a Clear button. The layout now displays the calculator and history side-by-side on larger screens and stacked on smaller screens.

Theme switcher
- The site includes a theme toggle in the header (🌙 / ☀️) — click to switch between Light and Dark themes.
- Theme preference is saved in your browser localStorage (key: `site_theme_v1`) and is initialized by the saved choice or your system preference.
- You can also press the `t` key to toggle themes (when not focused in a text input).
- Calendar: switch to the Calendar tab and use Left/Right arrow keys to navigate months, click a date to select it.

Try it now by opening `index.html` in your browser.
