# Tofula Architecture

**AI-Powered Personalized Children's Storybook Platform**

---

## Overview

Tofula is a dual-interface platform for creating and distributing personalized children's stories:

1. **Studio (Private)** - Development environment for content creators
2. **Public App** - Customer-facing story catalog and personalization

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        TOFULA PLATFORM                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐              ┌───────────────────┐   │
│  │  STUDIO (Private) │              │  PUBLIC APP       │   │
│  │  /studio/*       │              │  /customer-app/*  │   │
│  │                  │              │                   │   │
│  │  - Create Stories│              │  - Browse Catalog │   │
│  │  - AI Generation │              │  - View Stories   │   │
│  │  - Edit & Curate │              │  [Future: Custom] │   │
│  │  - Approve/Publish│             │                   │   │
│  └──────────────────┘              └───────────────────┘   │
│           │                                  │              │
│           └──────────────┬───────────────────┘              │
│                          ↓                                  │
│              ┌───────────────────────┐                     │
│              │   Backend API         │                     │
│              │   FastAPI + Python    │                     │
│              └───────────────────────┘                     │
│                          ↓                                  │
│              ┌───────────────────────┐                     │
│              │   Tofula Pipeline     │                     │
│              │   (Story Generation)  │                     │
│              └───────────────────────┘                     │
│                          ↓                                  │
│              ┌───────────────────────┐                     │
│              │   Google Gemini AI    │                     │
│              │   - 2.0 Flash Exp     │                     │
│              │   - 2.5 Flash Image   │                     │
│              └───────────────────────┘                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Application Structure

### 📁 Directory Layout

```
Tofula/
├── frontend/              # Next.js Application
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── studio/                     # 🔒 PRIVATE - Developer Interface
│   │   │   ├── login/page.tsx          # Studio access
│   │   │   ├── dashboard/page.tsx      # Story templates list
│   │   │   └── story/new/page.tsx      # AI story generation
│   │   └── customer-app/               # 🌐 PUBLIC - Customer Interface
│   │       └── catalog/page.tsx        # Browse approved stories
│   ├── components/
│   └── lib/
│
├── backend/               # FastAPI Application
│   ├── app/
│   │   ├── api/v1/endpoints/
│   │   │   ├── studio.py               # Studio-only endpoints
│   │   │   ├── catalog.py              # Public catalog
│   │   │   └── stories.py              # Story personalization
│   │   ├── services/
│   │   │   ├── tofula_service.py       # Pipeline wrapper
│   │   │   ├── database_service.py     # Data access
│   │   │   └── storage_service.py      # File storage
│   │   ├── models/                     # Database models
│   │   └── schemas/                    # API schemas
│   └── requirements.txt
│
└── tofula/                # Story Generation Pipeline
    ├── src/
    │   ├── pipeline.py                 # Main generation pipeline
    │   ├── llm_factory.py              # Gemini LLM clients
    │   ├── pdf_export.py               # PDF generation
    │   ├── prompt_loader.py            # Prompt templates
    │   └── structures.py               # Data structures
    └── prompts/                        # System/user prompts
```

---

## The Two Interfaces

### 🎨 Studio (Developer/Content Creator Interface)

**Purpose**: Private workspace for creating and curating story templates

**Access**: `/studio/*` routes (authentication required in production)

**Workflow**:

```
1. LOGIN
   ↓
2. CREATE NEW STORY
   - Enter themes, age range, moral, culture
   - Click "Generate Story"
   ↓
3. AI GENERATION (Tofula Pipeline)
   - Template selection
   - Outline creation
   - Draft writing
   - Story polishing
   - Content moderation
   - Illustration prompt generation
   - Image generation (Gemini 2.5 Flash Image)
   ↓
4. REVIEW & EDIT
   - View generated story
   - Edit text and prompts
   - Refine pages
   ↓
5. APPROVE FOR CATALOG
   - Mark as "Approved"
   - Story becomes visible in public catalog
```

**Key Features**:
- ✨ AI-powered story generation with full Tofula pipeline
- 📝 Draft management (save work-in-progress)
- ✏️ Manual editing and curation
- ✅ Approve/reject workflow
- 🎨 Illustration prompt management
- 📊 Story analytics (future)

**Studio Pages**:
- `/studio/login` - Access control
- `/studio/dashboard` - List all templates (drafts + approved)
- `/studio/story/new` - Generate new story with AI
- `/studio/story/{id}/edit` - Edit existing template (future)

---

### 🌐 Public App (Customer Interface)

**Purpose**: Browse and explore approved story templates

**Access**: `/customer-app/*` routes (public access)

**Current Flow**:

```
1. BROWSE CATALOG
   - View all approved story templates
   - Filter by age range, themes
   ↓
2. VIEW STORY DETAILS
   - Read description
   - See sample pages
   - Preview illustrations
```

**Future Flow** (Personalization Layer - Coming Soon):

```
3. CUSTOMIZE STORY
   - Enter child's name, age
   - Describe appearance
   - Select preferences
   ↓
4. GENERATE PERSONALIZED VERSION
   - Replace placeholders with child's info
   - Adjust illustrations with child's appearance
   - Generate custom images
   ↓
5. DOWNLOAD & SHARE
   - Get PDF storybook
   - Audio narration (optional)
   - Save to library
```

**Public Pages**:
- `/` - Landing page
- `/customer-app/catalog` - Browse approved stories
- `/customer-app/story/{id}` - Story details (future)
- `/customer-app/story/{id}/customize` - Personalization (future)
- `/customer-app/library` - User's personalized stories (future)

---

## Story Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                     STORY LIFECYCLE                          │
└─────────────────────────────────────────────────────────────┘

1. CREATION (Studio)
   Developer enters: themes, age range, moral, culture
   ↓
2. AI GENERATION (Tofula Pipeline)
   ┌──────────────────────────────────────────┐
   │ a. Template Selection                     │
   │ b. Story Outline (characters, plot, beats)│
   │ c. Draft Writing (full prose)             │
   │ d. Polish & Refine (better flow)          │
   │ e. Content Moderation (age-appropriate)   │
   │ f. Illustration Prompts (per page)        │
   │ g. Image Generation (Gemini AI)           │
   └──────────────────────────────────────────┘
   ↓
3. DRAFT STATUS
   Story saved to database as "draft"
   Visible only in Studio
   ↓
4. REVIEW & EDIT (Studio)
   - Manual review by content creator
   - Text editing if needed
   - Illustration adjustments
   - Quality check
   ↓
5. APPROVAL (Studio)
   Status changed from "draft" → "approved"
   ↓
6. PUBLIC CATALOG
   Story visible to all users
   Available for browsing
   ↓
7. PERSONALIZATION (Future)
   Users customize with their child's info
   Generate personalized PDF
```

---

## Technical Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React + TypeScript
- **Styling**: Tailwind CSS (warm, minimalist design)
- **Components**: shadcn/ui
- **API Client**: Fetch API

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL / Firestore
- **Storage**: Cloud Storage (images, PDFs)
- **Authentication**: Firebase Auth (future)
- **API Docs**: OpenAPI / Swagger

### AI Pipeline
- **Story Generation**: Gemini 2.0 Flash Exp
- **Image Generation**: Gemini 2.5 Flash Image
- **Content Moderation**: Gemini 2.0 Flash Lite
- **Framework**: LangChain
- **PDF Export**: ReportLab

---

## API Endpoints

### Studio Endpoints (Private)

```
POST   /api/v1/studio/stories/generate
  → Generate new story with full Tofula pipeline
  → Returns: StoryTemplate (saved as draft)

GET    /api/v1/studio/stories
  → List all story templates (drafts + approved)
  → Filters: status, skip, limit

GET    /api/v1/studio/stories/{id}
  → Get single story template

PATCH  /api/v1/studio/stories/{id}
  → Edit story template

POST   /api/v1/studio/stories/{id}/approve
  → Approve story for public catalog

DELETE /api/v1/studio/stories/{id}
  → Delete story template
```

### Public Endpoints

```
GET    /api/v1/catalog
  → List approved stories only
  → Public catalog

GET    /api/v1/catalog/{id}
  → Get story template details (future)
```

### Personalization Endpoints (Future)

```
POST   /api/v1/stories/personalize
  → Create personalized story instance
  → Input: template_id, child_name, age, appearance
  → Output: Personalized pages, illustrations, PDF

GET    /api/v1/stories/user/{user_id}
  → Get user's personalized stories
```

---

## Story Generation Pipeline

### Complete Tofula Pipeline Stages

```python
1. Template Selection
   Input:  themes, age
   Output: StoryTemplate (theme, beats, structure)

2. Outline Creation
   Input:  template, child_name, reading_level, length, tone
   Output: StoryOutline (title, characters, beats with summaries)

3. Draft Writing
   Input:  outline, child_name, length, reading_level
   Output: Full story text (draft)

4. Polish & Refine
   Input:  draft, reading_level, tone
   Output: Polished story (final text)

5. Content Moderation
   Input:  polished story
   Output: ModerationResult (is_safe, reason)

6. Illustration Prompts
   Input:  polished story, style, outline
   Output: IllustrationPrompts (per page)

7. Image Generation
   Input:  illustration prompts, story context
   Output: Generated images (PNG files)
```

### Models Used

- **Story Generation**: `gemini-2.0-flash-exp` (temp: 0.7)
- **Moderation**: `gemini-2.0-flash-lite` (temp: 0.0)
- **Polish**: `gemini-2.0-flash-exp` (temp: 0.4)
- **Images**: `gemini-2.5-flash-image`

---

## Data Models

### StoryTemplate (Database)

```typescript
{
  id: string
  title: string
  description: string
  themes: string
  age_range: string          // "3-5", "6-8", etc.
  culture: string            // "universal", "japanese", etc.
  moral: string              // Story lesson
  status: "draft" | "approved"
  pages: [
    {
      page_number: int
      template_text: string   // Text with {child_name} placeholders
      base_prompt: string     // Illustration prompt
    }
  ]
  created_at: datetime
  updated_at: datetime
}
```

### PersonalizedStory (Future)

```typescript
{
  id: string
  template_id: string
  user_id: string
  child_name: string
  age: int
  appearance: {
    skin_tone: string
    hair_color: string
    hair_style: string
    eye_color: string
    clothing: string
  }
  personalized_pages: [
    {
      page_number: int
      text: string              // With child's name
      illustration_url: string  // Custom generated image
    }
  ]
  pdf_url: string
  audio_url: string             // Optional TTS
  created_at: datetime
}
```

---

## Design Philosophy

### Color Palette
- **Primary**: Warm orange/amber tones (#FB923C - #F59E0B)
- **Neutral**: Soft stone/beige (#F5F5F4 - #78716C)
- **Background**: Light gradients with warm undertones
- **Goal**: Trust, warmth, familiarity, premium feel

### UI/UX Principles
- ✨ **Minimalist**: Clean, uncluttered interfaces
- 🌊 **Smooth**: Subtle animations and transitions (300ms)
- 🎯 **User-friendly**: Clear hierarchy, easy navigation
- 💎 **Premium**: Rounded corners (2xl/3xl), soft shadows
- 👶 **Family-focused**: Warm, approachable, trustworthy

---

## Future Roadmap

### Phase 1: Studio Enhancement (Current)
- ✅ AI story generation with Gemini
- ✅ Draft/approve workflow
- ✅ Story template management
- 🔄 Rich text editor for manual editing
- 🔄 Bulk illustration regeneration
- 🔄 Version history

### Phase 2: Personalization Layer
- 🔜 User authentication
- 🔜 Child profile management
- 🔜 Story customization flow
- 🔜 Real-time illustration generation
- 🔜 PDF download with custom cover
- 🔜 Audio narration (TTS)

### Phase 3: Enhanced Features
- 📋 User library (saved stories)
- 🎁 Gift/share functionality
- 🌍 Multi-language support
- 📱 Mobile app
- 💳 Payment integration
- 📊 Analytics dashboard

---

## Development Notes

### Running the Application

**Backend**:
```bash
./run_backend.sh
# Or manually:
cd backend
uvicorn app.main:app --reload --port 8000
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

**Access**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Environment Variables

```env
# Backend (.env)
GOOGLE_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://...
FIREBASE_CREDENTIALS=path/to/credentials.json

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Key Design Decisions

1. **Separate Studio & Public App**
   - Clear separation of concerns
   - Studio for content creation (private)
   - Public app for consumption only
   - Different UX optimizations for each audience

2. **Draft-to-Approved Workflow**
   - AI generates drafts automatically
   - Human review ensures quality
   - Only approved content reaches users
   - Allows iteration and refinement

3. **Template-Based Personalization**
   - Stories are templates with placeholders
   - Generate once, personalize many times
   - Efficient and cost-effective
   - Consistent quality

4. **Full Pipeline Integration**
   - Complete Tofula pipeline with Gemini
   - All steps: outline → draft → polish → moderation → images
   - No shortcuts, premium quality
   - Automated but curated

5. **Future-Ready Architecture**
   - API-first design
   - Modular services
   - Easy to add features
   - Scalable structure

---

## Summary

**Tofula** is a two-sided platform:

- **Studio (Private)**: Developers iterate and create stories with AI assistance, then publish to catalog
- **Public App**: Customers browse approved stories (future: personalize and download)

The full **Tofula pipeline** with **Google Gemini AI** handles story generation, ensuring high-quality, age-appropriate, illustrated content ready for personalization.

---

*Last updated: November 17, 2025*
