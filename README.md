# Smart Issue Board

## Project Design & Decisions

### 1. Why Did You Choose This Frontend Stack?

I chose **React + Firebase + React Router** because:

- **React** provides a simple and component-based structure for building interactive web applications
- **React Router** allows rapid navigation between pages without page reloads
- **Firebase Authentication** handles secure login, signup, and password reset automatically
- **Firestore Database** provides a real-time cloud database without needing a backend server
- This stack is ideal for small-to-medium applications and works seamlessly with Vercel for frontend-only deployments

---

### 2. Explain Your Firestore Data Structure

The Firestore database is structured to be simple, scalable, and easy to query.

**Collections:**

🔹 **issues Collection**
```javascript
{
  "title": "Login button not working",
  "description": "Clicking login does nothing",
  "status": "open",
  "priority": "high",
  "assignedTo": "john@example.com",
  "createdBy": "admin@example.com",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**This structure:**
- Avoids deep nesting - flat structure for simple queries
- Enables fast filtering by status and priority
- Allows easy expansion for comments, assignments, or activity history

---

### 3. Explain How You Handled Similar Issues

To reduce duplicate issue creation, a basic similarity detection mechanism was implemented during issue creation.

**How it works:**
- The issue title is tokenized into individual words
- Existing issues are scanned for overlapping keywords
- Similar issues are shown to the user before submission if 60%+ of words match

**This approach:**
- Helps users discover existing solutions
- Prevents duplicate issues from cluttering the dashboard
- Keeps the issue list clean and organized
- The logic is lightweight to maintain fast frontend performance

---

### 4. What Was Confusing or Challenging?

The main challenges faced during development were:

- **Firebase Authentication** - Configuring email/password login, password reset, and session management correctly
- **Firestore Security Rules** - Understanding how to restrict database access to only authenticated users
- **Real-time Updates** - Dashboard requires refresh to see new issues; could use listeners for live updates
- **Form Validation** - Ensuring proper email format, password confirmation, and required field validation
- **CSS Styling** - Creating a professional dark theme without using CSS frameworks

These challenges deepened my understanding of authentication, database security, and frontend deployment.

---

### 5. What Would You Improve Next?

Given more time, the following improvements would be implemented:

- Add **Edit Issues** - Allow users to update issue details
- Add **Delete Issues** - Enable issue deletion with confirmation
- Implement **Real-time Updates** - Use Firestore listeners for live dashboard updates
- Add **Search Functionality** - Find issues quickly by typing keywords
- Improve **Similar Issue Detection** - Use TF-IDF or NLP techniques for better accuracy
- Add **Comments** - Allow team members to discuss issues
- Add **Notifications** - Alert users when issues are assigned to them
- Add **Analytics** - Show statistics on open/closed issues and team performance

---

## Live Application

🔗 **Live URL:** [https://smart-issue-board.vercel.app](https://smart-issue-board.vercel.app)

The application is fully deployed and ready to test with all core features working.
