# devrajgoswami.github.io
Repository to manage my GitHub Page.
- This repository contains a small personal site (ready for GitHub Pages) that showcases a profile and a downloadable resume.
Details in the profile:
- Work Experience
- Projects
- Tech Skills
- Education Background
- Downloadable Resume
- Option to contact me via email.

## How to preview locally

If you want to preview or modify the site locally you can either open the files directly in your browser (static HTML) or use Jekyll to serve it.

Using Jekyll (optional):

1. Install Ruby and add the `jekyll` gem. On Windows you can install Ruby via the RubyInstaller.
2. Install bundler and jekyll:

```powershell
gem install bundler jekyll
jekyll serve --watch
```

Then open http://127.0.0.1:4000/ in your browser.

## Resume

The repository already contains a resume at `assets/Devraj_Resume_2024.pdf` which is linked from the homepage and the About page for direct download.

## Deploying / GitHub Pages

Because this repository is named `devrajgoswami.github.io` it will be served as a user site from:

```
https://devrajgoswami.github.io/
```

To deploy changes: commit and push to the `main` branch (or the default branch configured in the repo). GitHub Pages will automatically publish the site from the repository root.

If you want a custom domain, add a CNAME file in the repo root and configure DNS accordingly.

## Next steps / TODO

- Fill the About page with real project links and job details.
- Replace placeholder contact info with your real email / social links.
- Add a profile photo if you'd like and link it in the header.
