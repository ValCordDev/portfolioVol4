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
3. Choose "Start in production mode" (we'll add security rules next)
4. Select a location for your database
5. Click "Done"

### Add Security Rules
In Firestore Database > Rules, replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents for authenticated users
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // Allow write access only to admin users
    match /events/{document} {
      allow write: if request.auth != null && 
        request.auth.token.email in ['admin@yourportfolio.com', 'your-admin@email.com'];
    }
    
    match /albums/{document} {
      allow write: if request.auth != null && 
        request.auth.token.email in ['admin@yourportfolio.com', 'your-admin@email.com'];
    }
  }
}
```

## 5. Enable Storage (for image uploads)

1. In the left sidebar, click "Storage"
2. Click "Get started"
3. Review the security rules and click "Next"
4. Choose a location and click "Done"

### Add Storage Security Rules
In Storage > Rules, use:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow write access only to authenticated admin users
    match /{allPaths=**} {
      allow write: if request.auth != null && 
        request.auth.token.email in ['admin@yourportfolio.com', 'your-admin@email.com'];
    }
  }
}
```

## 4. Enable Firestore Database (continued)
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

### Common Firebase Errors & Solutions:

#### 1. **"Missing or insufficient permissions"**
**Cause**: Firestore security rules blocking access
**Solutions**:
- Ensure you're logged in as an admin user
- Check that your email matches the admin email in security rules
- Verify security rules are properly deployed in Firestore console
- Replace `'admin@yourportfolio.com'` in rules with your actual admin email

#### 2. **"ERR_BLOCKED_BY_CLIENT"**
**Cause**: Ad blockers or browser security features
**Solutions**:
- Disable ad blockers (uBlock Origin, AdBlock Plus, etc.)
- Test in incognito/private browsing mode
- Try a different browser
- Add your domain to ad blocker whitelist

#### 3. **"Firebase not initialized"**
**Cause**: Missing or incorrect environment variables
**Solutions**:
- Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set in `.env.local`
- Ensure values don't contain the fallback strings (`fallback-key`, etc.)
- Restart your development server after adding variables
- Verify your Firebase project configuration matches the variables

#### 4. **"Network request failed" / "Failed to fetch"**
**Cause**: Connectivity or CORS issues
**Solutions**:
- Check your internet connection
- Verify Firebase project is active (not deleted/suspended)
- Check Firebase status page: https://status.firebase.google.com/
- Add your domain to authorized domains in Firebase Auth settings

#### 5. **"User does not have access to project"**
**Cause**: Authentication or project access issues
**Solutions**:
- Ensure you're logged in with the correct Google account in Firebase console
- Verify the Firebase project ID matches your environment variables
- Check that your user has Owner/Editor role in the Firebase project

#### 6. **"Failed to add album" during migration**
**Cause**: Various data or permission issues
**Solutions**:
- Check the browser console for specific error messages
- Ensure all required album fields are present (title, date, cover, images)
- Verify image URLs are accessible
- Check that Firestore security rules allow write access for albums

### Debug Tools:

#### Use the Firebase Debug Component
1. Navigate to `/admin/migrate-albums`
2. Check the "Firebase Debug Information" section at the top
3. Verify all services show as "Connected"
4. Ensure authentication status shows "Authenticated"

#### Browser Console Logging
The migration process includes detailed console logging:
- `📝 Adding album...` - Starting album addition
- `🔄 Uploading album data...` - Data being sent to Firebase
- `✅ Album added successfully...` - Success confirmation
- `❌ Error adding album...` - Error details

### Environment Variables Checklist:

Make sure you have ALL of these set correctly:

**Development (.env.local):**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_ADMIN_EMAIL=your-admin@email.com
```

**Production (Hosting Platform):**
- Add the same variables to Vercel, Netlify, or your hosting platform
- Do NOT use quotes around the values
- Ensure there are no trailing spaces

### Firebase Console Verification:

1. **Authentication**: Go to Authentication > Users - verify your admin user exists
2. **Firestore**: Go to Firestore Database - check that security rules are deployed
3. **Storage**: Go to Storage - verify it's enabled and rules are set
4. **Project Settings**: Verify your project ID and configuration values

### Step-by-Step Debug Process:

1. **Check Environment Variables**
   - Open `/admin/migrate-albums`
   - Look at the debug info - all should show "✓ Set"

2. **Verify Firebase Connection**
   - All services should show "Connected"

3. **Check Authentication**
   - Status should show "Authenticated"
   - Your email should be displayed

4. **Test Migration**
   - Start with a small test (1-2 albums if possible)
   - Check browser console for detailed error messages
   - Note which specific albums fail and why

5. **Contact Support**
   - If issues persist, provide:
     - Browser console screenshots
     - Debug component status
     - Specific error messages
     - Your Firebase project ID (safe to share)

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