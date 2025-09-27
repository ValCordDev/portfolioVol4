# Firebase Admin Setup Instructions

This guide will help you set up Firebase for your portfolio events admin system.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "portfolio-events")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 3. Create an Admin User

1. Still in Authentication, go to the "Users" tab
2. Click "Add user"
3. Enter your admin email and password
4. Click "Add user"

## 4. Enable Firestore Database

1. In the left sidebar, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" (recommended)
4. Select a location close to you
5. Click "Done"

## 5. Set up Security Rules

1. In Firestore, go to the "Rules" tab
2. Replace the default rules with:

**Option 1: Development Rules (Recommended for setup)**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Temporary development rules - allows all reads and writes
    match /events/{document} {
      allow read, write: if true;
    }
  }
}
```

**Option 2: Production Rules (Use after migration is complete)**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Events collection - read public, write only for authenticated users
    match /events/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "dev.raj.norge@gmail.com";
    }
  }
}
```

3. **For initial setup:** Use Option 1 (development rules) to complete the migration
4. **After migration:** Switch to Option 2 (production rules) for security
5. Click "Publish"

## 6. Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps" section
3. Click "Web" (</>) icon to add a web app
4. Enter an app name (e.g., "Portfolio Admin")
5. Click "Register app"
6. Copy the configuration object

## 7. Update Environment Variables

1. Open `.env.local` in your project root
2. Replace the Firebase configuration values:

```bash
# Firebase Configuration - Replace with your values
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Admin credentials
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@domain.com
ADMIN_EMAIL=your_admin_email@domain.com
ADMIN_PASSWORD=your_secure_password_here
```

## 8. Start the Development Server

```bash
npm run dev
```

## 9. Migrate Existing Events (One-time only)

1. Navigate to `http://localhost:3000/admin/migrate`
2. Click "Start Migration" to move your existing events to Firebase
3. Wait for the migration to complete

## 10. Access Admin Dashboard

1. Navigate to `http://localhost:3000/admin/login`
2. Log in with your admin credentials
3. Start managing your events!

## Usage

### Admin Dashboard Features:
- **View Events**: See all events with statistics
- **Add Event**: Create new events with date/time picker
- **Edit Event**: Modify existing events
- **Delete Event**: Remove events with confirmation
- **Responsive Design**: Works on desktop and mobile

### Public Calendar:
- Events are automatically displayed on `/kalender`
- Real-time updates from Firebase
- Fallback to local data if Firebase is unavailable

### Security:
- Only authenticated admin users can modify events
- Public users can only view events
- Protected admin routes with automatic redirects

## Troubleshooting

### Common Issues:

1. **"Firebase project not found"**
   - Check your project ID in `.env.local`
   - Make sure the Firebase project exists

2. **"Permission denied"**
   - Verify Firestore security rules
   - Ensure admin email matches the rules

3. **"Auth domain not authorized"**
   - Add your domain to authorized domains in Firebase Auth settings

4. **"Events not loading"**
   - Check browser console for errors
   - Verify Firebase configuration
   - The app will fallback to local data if Firebase fails

### Support:
If you encounter issues, check:
1. Browser console for error messages
2. Firebase console for project settings
3. Network tab for failed requests

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx      # Admin login
│   │   ├── migrate/page.tsx    # Data migration
│   │   ├── page.tsx           # Admin dashboard
│   │   └── EventForm.tsx      # Event creation/editing form
│   └── kalender/
│       └── EventList.tsx      # Public event display
├── components/
│   └── ProtectedRoute.tsx     # Route protection
├── hooks/
│   └── useAuth.tsx           # Authentication logic
├── lib/
│   ├── firebase.ts           # Firebase configuration
│   └── events.ts             # Event CRUD operations
└── data/
    └── events.ts             # Original local events (fallback)
```

That's it! You now have a complete Firebase-powered admin system for managing your photography events.