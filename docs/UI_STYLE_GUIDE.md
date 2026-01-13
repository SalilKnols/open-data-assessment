# Survey Platform UI Style Guide
## Mockups & Design System

**Date:** 2026-01-13  
**Based on:** Current ODA Design System

---

## 1. Design System Summary

### Colors
| Token                    | Value                  | Usage                          |
| ------------------------ | ---------------------- | ------------------------------ |
| `--nashtech-primary`     | `#0066cc`              | Buttons, links, active states  |
| `--nashtech-secondary`   | `#ff6600`              | Accents, highlights, gradients |
| `--nashtech-accent`      | `#00a86b`              | Success states                 |
| `--nashtech-bg-gradient` | `blue → orange (135°)` | Headers, hero sections         |

### Typography
- **Font:** Inter (Google Fonts)
- **Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Components
- White cards with subtle shadows (`box-shadow: 0 4px 6px rgba(0,0,0,0.1)`)
- Rounded corners (`border-radius: 0.5rem`)
- Gradient header with white text

---

## 2. Screen Mockups

### Screen 1: Admin Dashboard
The main hub for survey administrators to manage all surveys.

![Admin Dashboard](/home/nashtech/.gemini/antigravity/brain/9952f9b6-73cc-4690-9a28-65d74a3586c9/admin_dashboard_mockup_1768296562101.png)

**Key Elements:**
- Left sidebar navigation (Dashboard, My Surveys, Responses, Settings)
- Survey cards in a grid showing views, responses, and status
- Status badges: Active (green), Draft (orange), Closed (gray)

---

### Screen 2: Survey Builder
Drag-and-drop interface for creating dynamic surveys.

![Survey Builder](/home/nashtech/.gemini/antigravity/brain/9952f9b6-73cc-4690-9a28-65d74a3586c9/survey_builder_mockup_1768296589145.png)

**Key Elements:**
- Left panel: Draggable question types
- Center canvas: Survey preview with editable questions
- Right panel: Properties editor for selected question
- Save/Cancel buttons in brand colors

---

### Screen 3: Survey Response Page (User-Facing)
Clean interface for users taking surveys - matches current ODA look.

![Survey Response](/home/nashtech/.gemini/antigravity/brain/9952f9b6-73cc-4690-9a28-65d74a3586c9/survey_response_page_1768296610852.png)

**Key Elements:**
- Gradient header with survey title
- Progress bar (blue filled, gray remaining)
- One question per page pattern (same as ODA)
- Previous (outlined) / Next (filled) navigation

---

### Screen 4: Analytics Dashboard
View and analyze survey responses.

![Analytics Dashboard](/home/nashtech/.gemini/antigravity/brain/9952f9b6-73cc-4690-9a28-65d74a3586c9/analytics_dashboard_mockup_1768296640402.png)

**Key Elements:**
- Stats cards showing key metrics
- Charts: Bar (responses over time), Pie (score distribution)
- Data table with individual responses
- Export options (not shown, will be added)

---

## 3. Consistency with ODA

| ODA Element          | Platform Equivalent                   |
| -------------------- | ------------------------------------- |
| Gradient header      | ✅ Same gradient header on all screens |
| Progress bar         | ✅ Same style on Survey Response page  |
| White content cards  | ✅ Used throughout all screens         |
| Orange + Blue colors | ✅ Primary palette                     |
| Inter font           | ✅ System-wide                         |

---

## 4. Next Steps

1. **Approve these mockups** as the design direction
2. **Create Angular components** following this style guide
3. **Reuse existing SCSS variables** from ODA's `styles.scss`
