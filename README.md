# 📝 Smart Notes (Mynotes)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A beautiful, high-performance note-taking application specifically designed to seamlessly replicate the **macOS Apple Notes in Dark Mode** aesthetic. Built for the modern web utilizing Next.js, Tailwind CSS, and a robust Rich Text editing core.

## ✨ Features

- 🎨 **Authentic macOS Design:** Pixel-perfect dark mode replication featuring deep semantic grays (`#1C1C1E` & `#1E1E1E`), fluid edge-to-edge layouts, and classic Apple Golden Yellow highlights.
- 📝 **Rich Text Editor:** A fully integrated WYSIWYG interface (powered by React Quill) cleverly restyled to sit below a custom Apple-centric unified toolbar.
- 🌙 **Native Light/Dark Engine:** Implemented with `next-themes` to perfectly sync with your operating system's settings or manual overrides without CSS flashing.
- 🔠 **Curated Typography:** Integrated Google Fonts allowing on-the-fly text styling inside your notes (Inter, Roboto, Lora, Fira Code).
- 💾 **Local Persistence:** Instant CRUD (Create, Edit, Delete) operations stored securely and automatically in `localStorage`. 
- 📥 **Local Export:** Export any of your notes directly to your machine as raw `.txt` or rich `.html` documents with a single click.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router & React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Editor:** [React Quill New](https://github.com/zenoamaro/react-quill)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theming:** `next-themes`

## 🚀 Getting Started

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/Surajgupta007/Mynotes.git
cd smartNotes
npm install
```

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application logic is primarily managed within `app/page.tsx` and the internal component structures.

## 📚 Future Roadmap

- Cloud Synchronization via Database architectures (MongoDB/PostgreSQL)
- Drag and Drop re-ordering for Sidebar Notes
- Keyboard Shortcuts (e.g. `CMD + N` for new note)

---
*Developed by Surajgupta007*
