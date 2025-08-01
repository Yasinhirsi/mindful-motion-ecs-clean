# Mindful Motion

Mindful Motion is a Dockerized Next.js application for mental health tracking, emotion analysis, and Supabase-powered session scheduling.

## 🧠 Features

- Facial emotion detection using face-api.js + TensorFlow.js
- Sentiment-aware daily check-ins
- Secure Supabase integration (auth, database, real-time)
- Dockerized for local development and cloud deployment

---

## 🚀 Quick Start (with Docker)

### 📁 1. Clone the repository

```bash
git clone git@github.com:Yasinhirsi/mindful-motion-ecs.git
cd mindful-motion-ecs
```

### 🔐 2. Get Supabase credentials

> ⚠️ `.env` is not included in this repository for security reasons.  
> To run the app with full functionality, **please request the `.env` file** directly from the author.

Once received, place it in the project root:

```env
# .env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### 🐳 3. Run using Docker Compose

```bash
export $(cat .env | xargs)
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧪 Development (non-Docker)

```bash
npm install --legacy-peer-deps
npm run dev
```

---

## 🐋 Docker Overview

- ✅ Multi-stage production-ready Dockerfile
- ✅ `.dockerignore` for fast, clean builds
- ✅ `.env` values injected at build and runtime
- ✅ Works locally and deployable to ECS/ECR

---

## 📦 Tech Stack

| Layer        | Tool                  |
|--------------|------------------------|
| Frontend     | Next.js 15 + React     |
| Backend      | Supabase (Postgres)    |
| Styling      | Tailwind CSS + shadcn  |
| ML/AI        | TensorFlow.js + face-api.js |
| DevOps       | Docker, Docker Compose |

---

## 📁 Project Structure

```
mindful-motion/
├── app/                 # Next.js App Router pages
├── components/          # UI components
├── supabase.ts          # Supabase client
├── Dockerfile           # Container build file
├── docker-compose.yml   # Local Docker orchestration
└── .env.example         # Required environment variables
```

---

## 📚 Deployment

This project is ready for deployment via:

- ✅ Docker Compose
- 🔜 GitHub Actions + ECR + ECS Fargate (optional extension)

---

## 🔐 Security

- `.env` is excluded from GitHub via `.gitignore`
- `anon` key is scoped to limited public access
- Supabase security can be hardened via RLS

---

## 📄 License

MIT — feel free to fork and build upon it.

---

## 📬 Contact

For access to the `.env` file or deployment help, contact:  
📧 yasinhirsi3@gmail.com  
🔗 https://yasinhirsi.com
