<img src="assets/header.svg" alt="Brayden Scuffham. I design and build AI products end to end, in Claude Code." width="100%">

**Design engineer, open to remote design-engineering roles.** I take AI products from the first flow to production on my own: the interface in React and TypeScript, the API routes and database behind it, and the prompts in between. Right now that's two products, Pip and Lecivo.

[LinkedIn](https://www.linkedin.com/in/brayden-scuffham-299135440/) · [Pip on the web](https://pip-ai-drab.vercel.app) · [Lecivo demo](https://lecivo-demo.lovable.app)

<table>
  <tr>
    <td width="50%" valign="top">
      <a href="https://github.com/braydenscuffham2-coder/pip-ai"><img src="assets/card-pip.svg" alt="Pip: an AI analyst for local businesses" width="100%"></a>
      <p><a href="https://github.com/braydenscuffham2-coder/pip-ai"><b>Code and write-up</b></a> · <a href="https://pip-ai-drab.vercel.app">Live site</a></p>
    </td>
    <td width="50%" valign="top">
      <a href="https://github.com/braydenscuffham2-coder/lecivo"><img src="assets/card-lecivo.svg" alt="Lecivo: lectures into notes and flashcards" width="100%"></a>
      <p><a href="https://github.com/braydenscuffham2-coder/lecivo"><b>Case study</b></a> · <a href="https://lecivo-demo.lovable.app">Interactive demo</a></p>
    </td>
  </tr>
</table>

## Pip

<a href="https://github.com/braydenscuffham2-coder/pip-ai/tree/main/claude-app"><img src="assets/pip-home.webp" alt="Pip's home screen in the Claude app: a 3D glass character next to the headline 'Meet the upside of being understood.' and a website field." width="100%"></a>

- An AI analyst for local businesses. It reads a business's site, detects about 60 known chat, booking and review tools, and pulls in its Google reviews and nearby competitors. Claude structures what it found, and plain code ranks the AI upgrades that fit, each with the evidence behind it.
- Runs in two places: inside the Claude app on the viewer's own plan, and on the web with Next.js 16, React 19, TypeScript, Supabase and the Claude API.

## Lecivo

<a href="https://lecivo-demo.lovable.app"><img src="assets/lecivo-sources.webp" alt="Lecivo's Show sources view. A class note on the right links 'Facilitated diffusion is still passive' to the transcript line said at 01:15, which is highlighted on the left." width="100%"></a>

- An iPhone app that records a lecture and transcribes it on the phone with Apple's speech tools. Audio never leaves the phone, and transcript text goes to an AI only after the student agrees.
- Every class note and flashcard links back to the moment it was said. In App Store submission now.

## Now

- **Lecivo:** in App Store submission.
- **Pip:** talking with local business owners about where their work gets stuck, and building the Brain, a staged scan where Claude proposes AI agents and plain code scores them.

**Recently shipped**

<!-- recent:start -->
- [Add a readiness check and refusal logs to /api/sample](https://github.com/braydenscuffham2-coder/pip-ai/commit/e9c5ccbd5f477334a3a2666a845d0016912e496b) · `pip-ai` · Nov 15
- [Serve the Claude-app Pip page as the website's home page](https://github.com/braydenscuffham2-coder/pip-ai/commit/4aff2c2cbb2434f5cc26c9c5020663357ad4313c) · `pip-ai` · Nov 15
- [Add the email gate's pass and an invisible bot check (#2)](https://github.com/braydenscuffham2-coder/pip-ai/commit/6039a6ce100b028e101c6974fdc9121d6024a7de) · `pip-ai` · Nov 14
- [Add a spend guard so strangers can't run up the API bills (#1)](https://github.com/braydenscuffham2-coder/pip-ai/commit/4833b7c04560cd4b35b4ffae47db348b7902ff7f) · `pip-ai` · Nov 14
- [Add Google Analytics 4 to Pip](https://github.com/braydenscuffham2-coder/pip-ai/commit/a1f32fd501f8a9aad649e17a52821fa528aa05b1) · `pip-ai` · Nov 14
<!-- recent:end -->

<sub>Updated daily from my public commits by a GitHub Action in this repo.</sub>

## How I work

- **Claude Code every day, and I review what it writes.** Nothing it writes ships until I've read it.
- **"Complete" means it works where people will actually use it.** For Lecivo, that meant testing interruptions, unclear transcripts, and keeping existing recordings safe, not just the happy path.
- **Understand the work before adding AI.** In Pip, Claude turns a messy website into structured facts, plain code does the scoring, and every recommendation names the review or gap that earned it.

## Writing

Short posts on LinkedIn about what I'm building and why:

- [You can leave a lecture with every word recorded and still miss the point.](https://www.linkedin.com/feed/update/urn:li:activity:7526344191107448832/) On what Lecivo is for.
- [A business can become so good at working around a problem that it stops recognizing the problem.](https://www.linkedin.com/feed/update/urn:li:activity:7525998011970203648/) On deciding where AI belongs in a business.
- ["Complete" should mean it works where people will actually use it.](https://www.linkedin.com/feed/update/urn:li:activity:7524263059880779776/) On what counts as done.

---

<sub>Boise area, Idaho · Business Administration at BYU–Idaho · [LinkedIn](https://www.linkedin.com/in/brayden-scuffham-299135440/)</sub>

<sub>The header and cards above are drawn by code in [`src/`](src).</sub>
