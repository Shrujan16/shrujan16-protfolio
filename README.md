# C Shrujan Reddy | 3D Scroll Portfolio

A cinematic, scroll-driven personal portfolio with a 360° rotating 3D hero card, starfield depth, and glass panels that fly in with 3D perspective. It is a single HTML file with no build step.

## Features

- Loader with a name and a 0 to 100% counter
- 3D hero: my photo on a card that rotates 360° as you scroll, with mouse-tilt parallax and orbiting rings
- Kinetic hero words and a camera push through a starfield
- Pinned scroll story: About, Skills, Education and Projects panels with 3D transitions
- Section dots, scroll progress bar and a cursor spotlight on cards
- Contact form (opens your email app) and social links
- Responsive: works on phone, tablet and desktop
- Respects `prefers-reduced-motion`

## Tech

- HTML, CSS and vanilla JavaScript
- [Three.js](https://threejs.org/) r128 for the 3D scene
- [GSAP](https://gsap.com/) 3.12.5 + ScrollTrigger for scroll animation
- Google Fonts: Space Grotesk and Inter

Libraries load from CDNs, so you need an internet connection.

## Run locally

1. Download or clone this repo.
2. Open the folder in VS Code and start it with the **Live Server** extension, or open `index.html` in Chrome.

## Customize

| What | Where |
| --- | --- |
| Email used by the contact form | `EMAIL` near the top of the `<script>` |
| Photo on the 3D card | `PHOTO` in the same line (a data URI or an image path) |
| About, skills, education, projects | The `<section class="panel">` blocks in the HTML |
| Hero words | The `.w` elements inside `.ws` |
| Social links | The buttons in the `#contact` section |
| Resume | Keep `resume.pdf` next to `index.html` |

If you use an image path for `PHOTO`, run the page through Live Server, because opening the file directly can block it.

## Deploy with GitHub Pages

1. Rename `portfolio.html` to `index.html` and push to the `main` branch.
2. In the repo go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Your site goes live at `https://shrujan16.github.io/<repo-name>/`.

## Project structure

```
├── index.html    # the whole portfolio (HTML, CSS, JS)
├── resume.pdf    # linked from the Resume button
└── README.md
```

## Contact

- Email: shrujanreddy8765@gmail.com
- LinkedIn: [c-shrujan-reddy](https://www.linkedin.com/in/c-shrujan-reddy-658500335)
- GitHub: [Shrujan16](https://github.com/Shrujan16)
- Instagram: [@shrujan_16](https://www.instagram.com/shrujan_16)

## License

Personal portfolio. Please don't copy my photo, name or content. Feel free to take inspiration from the code.
