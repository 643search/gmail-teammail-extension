# TeamMail - Gmail Team Collaboration Extension

A Chrome extension that adds team collaboration features to Gmail, allowing you to comment on email threads and @mention teammates without forwarding emails.

## 🚀 Features

- **💬 Email Comments**: Add team comments to any Gmail thread
- **@ Mentions**: Tag teammates to bring them into email discussions  
- **🔄 Real-time Sync**: Comments update live across team members
- **⌨️ Keyboard Shortcuts**: Quick access with Ctrl+Shift+C
- **🎯 Gmail Native**: Works seamlessly within Gmail interface

## 📦 Installation (Development)

1. Clone this repository:
   ```bash
   git clone https://github.com/643search/gmail-teammail-extension.git
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable "Developer mode" in the top right

4. Click "Load unpacked" and select the extension folder

5. Open Gmail and look for the "💬 Comment" button in email toolbars

## 🛠️ Development Setup

### File Structure
```
gmail-teammail-extension/
├── manifest.json          # Extension manifest (V3)
├── content-script.js      # Gmail integration logic
├── styles.css            # Comment sidebar styling
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── background.js         # Service worker
└── icons/               # Extension icons (16, 32, 48, 128px)
```

### Key Components

- **Content Script**: Injects comment functionality into Gmail
- **Comment Sidebar**: Slide-out panel for viewing/adding comments
- **Background Service Worker**: Handles data sync and notifications
- **Popup**: Quick access to features and team management

## 🔧 Technical Details

### Gmail Integration
- Uses MutationObserver to detect email changes
- Extracts email IDs from Gmail's DOM structure  
- Injects comment button into Gmail toolbar
- Creates slide-out sidebar for comment interface

### Data Storage
- Currently stores comments locally (demo mode)
- Will integrate with Firebase backend for team sync
- Uses Chrome storage API for user preferences

### Security & Permissions
- Minimal permissions (activeTab, storage)
- Only runs on mail.google.com domains
- No email content access - only metadata

## ⌨️ Keyboard Shortcuts

- **Ctrl+Shift+C** (Cmd+Shift+C on Mac): Toggle comment sidebar
- **Enter**: Post comment (when focused in comment box)

## 🌟 MVP Roadmap

### Phase 1 (Current - Week 1-2)
- ✅ Basic Chrome extension structure
- ✅ Gmail DOM integration
- ✅ Comment sidebar UI
- 🔄 Local comment storage

### Phase 2 (Week 3-4)
- 🔄 Backend API integration
- 🔄 Real-time comment sync
- 🔄 Basic @mention system
- 🔄 Team creation/management

### Phase 3 (Week 5-6)
- 🔄 Advanced @mention features
- 🔄 Comment notifications
- 🔄 Chrome Web Store submission
- 🔄 User onboarding flow

## 🧪 Testing

### Manual Testing
1. Load extension in developer mode
2. Open Gmail
3. Click "💬 Comment" button in email
4. Add comments and verify display
5. Test keyboard shortcut (Ctrl+Shift+C)

### Email ID Extraction Test
The extension tries multiple methods to identify emails:
- Gmail's data-thread-id attribute
- URL parsing for inbox IDs
- Content-based fallback hashing

## 🔗 Related Repositories

- [Backend API](https://github.com/643search/gmail-teammail-backend)
- [Web App Dashboard](https://github.com/643search/gmail-teammail-webapp)  
- [Documentation](https://github.com/643search/gmail-teammail-docs)

## 📝 Contributing

1. Make changes to extension files
2. Test in Gmail with developer mode
3. Commit changes with clear messages
4. Create pull request for review

## 🎯 Market Position

**Target**: 1.8 billion Gmail users with zero native team collaboration  
**Competition**: Front ($19-79/user), Hiver ($15/user), Drag ($8/user)  
**Advantage**: Native Gmail integration at 60% lower cost ($8/user)  

## 📊 Revenue Model

- **Free**: 3 team members, basic comments
- **Pro ($8/user/month)**: Unlimited team, @mentions, mobile app
- **Enterprise**: Custom pricing, SSO, admin controls

---

**Status**: MVP Development Phase  
**Timeline**: 6-8 weeks to launch  
**Goal**: $15K+ MRR in 90 days