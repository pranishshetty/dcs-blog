#DCS Blog — Modern Full-Stack Web Platform

> A sleek, high-performance, dark-themed blog management system built for **Dynamic Computer School (DCS)** with React 19, Vite, and a lightweight PHP backend designed for cPanel deployment.

---

## Key Features

### Ambient Media Engine (No Cropping)
- **Smart Image Fitting**: Uploaded images, wide article banners, and circular brand logos render with `object-fit: contain` on top of an ambient blurred backdrop glow.
- **Zero Clipping**: Ensures 100% of logos, badges, and cover text are visible without awkward top/bottom cropping.

### Smart Content Formatter & Editor
- **ChatGPT & Raw Text Parsing**: Automatically transforms unformatted text or copied AI responses into structured HTML with headings, bullet lists, bold key-value pairs, and code output blocks.
- **Visual Toolbar Controls**: One-click buttons to insert Section Titles (`H2`), Numbered Subheadings (`H3`), Section Dividers (`---`), Bullet Point Lists, and Blockquotes.
- ** Auto-Format Button**: Formats raw pasted text instantly inside the article editor.

###  Secure CMS Admin Portal
- **Protected Routes**: Password-secured login interface with interactive show/hide password visibility toggle.
- **Full CRUD Capabilities**: Create, edit, publish, draft, or delete articles with real-time state updates.
- **Dynamic Category Management**: Add or remove categories on the fly directly from the post editor.
- **Media Upload Manager**: Drag-and-drop or file selector support for images (`.jpg`, `.png`, `.webp`) and HTML5 videos (`.mp4`, `.webm`).

### Real-Time Analytics Dashboard
- **Visual Metrics**: Interactive charts powered by Recharts displaying total article views, active published posts, category distributions, and daily engagement trends.
- **Synchronized View Counter**: Automatically increments view counts on individual article reads.

### Modern UI & Social Connectivity
- **Glassmorphism & Nextplate Aesthetics**: Dark mode by default with smooth Day/Night theme toggling.
- **Social Sharing**: Direct share links for WhatsApp, Instagram, and 1-click URL copy to clipboard.
- **Developer Credit Footer**: Multi-column responsive footer featuring quick links, top categories, and developer attribution card.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 (Hooks, Context API) |
| **Build Tool & Server** | Vite 8 |
| **Routing** | React Router DOM v7 |
| **Icons & Analytics** | Lucide React, Recharts |
| **Styling** | Custom Vanilla CSS (Design Tokens, Responsive Grid) |
| **Backend API** | Lightweight PHP 8 REST Endpoints (`/public/api/`) |
| **Data Persistence** | JSON Storage / cPanel File System |

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- PHP 8.0+ (for backend API execution)

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pranishshetty/dcs-blog.git
   cd dcs-blog
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Launch local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## 🔌 API Endpoints (`/public/api/`)

- `GET /api/posts.php` — Fetch all published and draft articles.
- `POST /api/posts.php` — Create a new blog post.
- `POST /api/upload.php` — Upload media files (returns `/uploads/filename`).
- `GET /api/categories.php` — Retrieve list of categories.
- `POST /api/categories.php` — Add a new category.
- `DELETE /api/categories.php?name=CategoryName` — Delete a category.
- `GET /api/backup.php` — Generate a 1-click JSON database backup archive.

---

## Developer Attribution

Designed & Developed with ❤️ by **Pranish Shetty**  
- **GitHub**: [@pranishshetty](https://github.com/pranishshetty)  
- **Repository**: [https://github.com/pranishshetty/dcs-blog](https://github.com/pranishshetty/dcs-blog)  
- **Organization**: Dynamic Computer School (DCS)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
