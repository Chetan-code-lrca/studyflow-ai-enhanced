# StudyFlow AI - Enhanced Study Management System

🚀 **Complete Enhanced StudyFlow** with AI-powered features for BTech CSE students and GATE preparation.

## ✨ Features

### 📚 Subject Management
- Add and manage multiple subjects
- Track study hours vs target hours
- Visual progress bars for each subject
- Color-coded subject cards
- Quick-add study time buttons (+30min, +1hr, +2hr)
- Last studied timestamp tracking

### 📅 Study Schedule
- View progress overview for all subjects
- Completion percentages
- Recent study session history with timestamps
- Subject-wise progress tracking
- Time-based analytics

### ✅ Assignment Tracking
- Add assignments with titles, subjects, deadlines, and priorities
- Priority levels: High, Medium, Low (color-coded)
- Deadline urgency alerts (overdue, due soon)
- Mark assignments as complete/incomplete
- Separate views for pending and completed assignments
- Visual indicators for urgent deadlines

### 📈 Analytics Dashboard
- Total study hours counter
- Weekly study hours tracking
- Assignment completion rate
- Subject-wise breakdown with progress bars
- Upcoming deadlines widget
- Performance metrics

### 🤖 AI-Powered Recommendations
- Context-aware study suggestions
- Subject-specific tips for DSA, DBMS, OS, etc.
- GATE preparation guidance
- Deadline urgency notifications
- Progress-based recommendations
- Personalized study plans

### 💾 Data Persistence
- LocalStorage integration
- All data saved automatically
- Survives page refreshes
- No backend required for basic usage

### 🎨 Modern UI/UX
- Beautiful purple gradient theme (#667eea to #764ba2)
- Responsive design (mobile-friendly)
- Smooth animations and transitions
- Glassmorphism effects
- Clean, professional interface
- 4 interactive tabs: Subjects, Schedule, Assignments, Analytics

## 🛠️ Technology Stack

- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **LocalStorage** - Data persistence
- **CSS-in-JS** - Inline styling

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Clone this repository**
```bash
git clone https://github.com/Chetan-code-lrca/studyflow-ai-enhanced.git
cd studyflow-ai-enhanced
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
studyflow-ai-enhanced/
├── src/
│   └── App.tsx          # Main application component
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md           # This file
```

## 💻 Usage Guide

### Adding Subjects
1. Go to the **Subjects** tab
2. Enter subject name (e.g., "Data Structures", "DBMS", "Operating Systems")
3. Click "Add Subject"
4. Use quick-add buttons (+30min, +1hr, +2hr) to log study time

### Tracking Study Sessions
1. Click on any subject card's time buttons to add study hours
2. View your study sessions in the **Schedule** tab
3. Check progress bars to see completion percentage

### Managing Assignments
1. Navigate to the **Assignments** tab
2. Fill in assignment title, subject, deadline, and priority
3. Click "Add Assignment"
4. Mark assignments complete or delete them as needed

### Viewing Analytics
1. Open the **Analytics** tab
2. View total and weekly study hours
3. Check completion rates
4. Read AI-powered recommendations
5. See upcoming deadlines

## 🎯 Target Audience

- BTech CSE Students
- GATE aspirants
- Engineering students
- Anyone preparing for competitive exams
- Self-learners tracking study progress

## 🔧 Customization

To integrate into your own project:

1. **Copy the App.tsx file** from `src/App.tsx`
2. **Add to your Vite + React + TypeScript project**
3. **Update imports** if needed
4. **Customize colors** in the styles object
5. **Modify AI recommendations** in the `getAIRecommendations` function

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Deploy to GitHub Pages
```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Deploy to Vercel/Netlify
- Connect your GitHub repository
- Set build command: `npm run build`
- Set output directory: `dist`

## 📝 Key Components

### Type Interfaces
- `Subject` - Subject data structure
- `Assignment` - Assignment data structure
- `StudySession` - Study session records
- `TabType` - Tab navigation types

### Main Functions
- `addSubject()` - Add new subject
- `addStudyTime()` - Log study session
- `addAssignmentHandler()` - Create assignment
- `getAIRecommendations()` - Generate smart suggestions
- `getTotalStudyHours()` - Calculate total hours
- `getCompletionRate()` - Calculate completion percentage

## 💬 AI Recommendations Include

- **DSA**: Practice patterns, solve LeetCode problems
- **DBMS**: Focus on normalization, SQL, transactions
- **OS**: Study scheduling, memory management, deadlocks
- **GATE**: Solve previous year questions, take mock tests
- **General**: Progress tracking, deadline reminders

## 🔐 Features Coming Soon

- 🔥 Firebase backend integration
- 📱 Multi-device sync
- 📊 Advanced analytics graphs
- 🔔 Push notifications
- 🏆 Gamification (streaks, badges)
- 📄 Export data as PDF/CSV
- ☁️ Cloud backup

## 👥 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

**Chetan** - [@Chetan-code-lrca](https://github.com/Chetan-code-lrca)

Project Link: [https://github.com/Chetan-code-lrca/studyflow-ai-enhanced](https://github.com/Chetan-code-lrca/studyflow-ai-enhanced)

## ⭐ Show Your Support

Give a ⭐ if this project helped you!

---

**Built with ❤️ for students preparing for BTech CSE & GATE exams**
