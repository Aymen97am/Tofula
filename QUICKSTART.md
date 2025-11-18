# 🚀 Tofula Quick Start Guide

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)
- Google AI API key

---

## 1. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add your Google AI API key:
# GOOGLE_API_KEY=your-key-here

# Run the backend
uvicorn app.main:app --reload
```

Backend runs on: **http://localhost:8000**

API docs: **http://localhost:8000/docs**

---

## 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Run dev server
npm run dev
# or
pnpm dev
```

Frontend runs on: **http://localhost:3000**

---

## 3. Access the Platform

### Public Routes (No Auth)

- **Landing page:** http://localhost:3000/
- **Story catalog:** http://localhost:3000/customer/catalog
- **Story detail:** http://localhost:3000/customer/story/[id]
- **User library:** http://localhost:3000/customer/library

### Hidden Studio Access

1. Scroll to footer on any page
2. Click the small "Studio" text link
3. Enter password: **`Tofula@2025`**
4. Access dashboard: http://localhost:3000/studio/dashboard

---

## 4. Test Story Generation

### Option A: Via Customer Flow

1. Go to catalog: http://localhost:3000/customer/catalog
2. Click "View Details" on any story
3. Fill in customization form:
   - Child's name: e.g., "Emma"
   - Age: e.g., 5
   - Optional: gender, appearance
4. Click "Generate Personalized Story"
5. Wait 2-3 minutes for generation
6. Check library: http://localhost:3000/customer/library

### Option B: Via Studio (Create New Template)

1. Access Studio (password: `Tofula@2025`)
2. Click "Create New Story"
3. Fill in form:
   - Themes: e.g., "friendship, adventure"
   - Age range: e.g., "4-6"
   - Culture: "universal"
   - Moral: "the importance of kindness"
4. Click "Generate Story Template"
5. Wait 2-3 minutes
6. Story saved as draft in database

---

## 5. Environment Variables

### Backend (`/backend/.env`)

```env
# Required
GOOGLE_API_KEY=your-google-ai-key

# Studio Access
STUDIO_PASSWORD=Tofula@2025

# Optional
DATABASE_URL=sqlite:///./tofula.db
STORAGE_TYPE=local
LOCAL_STORAGE_PATH=./storage
```

### Frontend (`/frontend/.env.local`)

```env
# Optional - defaults to localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 6. Project Structure

```
/frontend/
  app/(marketing)/page.tsx     → Landing page
  app/(app)/customer/...        → Catalog, story detail, library
  app/(studio)/studio/...       → Password-protected admin
  components/layout/...         → Header, Footer, PageShell
  components/stories/...        → StoryCard, CustomizationPanel
  lib/api.ts                    → API client with studio auth

/backend/
  app/core/config.py            → Settings (inc. STUDIO_PASSWORD)
  app/core/dependencies.py      → Auth dependencies
  app/api/v1/endpoints/...      → API routes
  app/services/...              → Business logic
  tofula_pipeline/...           → AI story generation
```

---

## 7. Troubleshooting

### Backend won't start

- Check `GOOGLE_API_KEY` is set in `.env`
- Verify Python 3.10+ installed
- Try: `pip install -r requirements.txt --upgrade`

### Frontend won't start

- Check Node.js 18+ installed
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`

### Studio login not working

- Password is: `Tofula@2025` (case-sensitive)
- Check browser localStorage: `localStorage.getItem('tofula_studio_auth')`
- Clear and try again: `localStorage.removeItem('tofula_studio_auth')`

### API calls failing

- Check backend is running on port 8000
- Check CORS settings in `backend/app/core/config.py`
- For studio endpoints, verify `X-Studio-Password` header is being sent

---

## 8. Key Files

| File | Purpose |
|------|---------|
| `frontend/components/layout/SiteHeader.tsx` | Main navigation |
| `frontend/components/layout/SiteFooter.tsx` | Footer with Studio link |
| `frontend/components/studio/StudioGuard.tsx` | Auth guard for studio routes |
| `frontend/lib/api.ts` | API client (auto-adds studio password) |
| `backend/app/core/config.py` | Backend settings |
| `backend/app/core/dependencies.py` | `verify_studio_password()` |
| `backend/app/api/v1/endpoints/studio.py` | Protected studio endpoints |

---

## 9. Development Tips

### Hot Reload

- Frontend: Auto-reloads on file changes
- Backend: Use `--reload` flag: `uvicorn app.main:app --reload`

### Testing APIs

- Use Swagger UI: http://localhost:8000/docs
- For studio endpoints, add header: `X-Studio-Password: Tofula@2025`

### Debugging

- Frontend: Check browser console
- Backend: Check terminal logs
- Database: SQLite at `backend/tofula.db` (use SQLite browser)

---

## 10. Production Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

Set environment variables:
- `NEXT_PUBLIC_API_URL` → Your backend URL

### Backend (Railway / Cloud Run)

```bash
cd backend
# Deploy to Railway or Google Cloud Run
# Set environment variables (GOOGLE_API_KEY, STUDIO_PASSWORD, etc.)
```

---

## 📚 Additional Resources

- Full summary: `RESTRUCTURE_SUMMARY.md`
- API documentation: http://localhost:8000/docs (when backend is running)
- Architecture: `ARCHITECTURE.md`

---

## ✅ Quick Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Google AI API key configured
- [ ] Landing page loads
- [ ] Catalog shows stories
- [ ] Story detail page works
- [ ] Studio login with password works
- [ ] Studio dashboard accessible

**Studio Password:** `Tofula@2025`

🎉 **Ready to create magical stories!**
