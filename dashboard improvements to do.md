# RouteIQ - Dashboard Improvements

## 🔥 HIGH-IMPACT IMPROVEMENTS

### 1. Add Resume/Start Workout Card at Top of Dashboard
Add a fully tappable card at the top of the dashboard:

**If user has previous workout:**
```
▶️ Continue last workout
Russian Twists + Bird Dog
Last done: Nov 21, 2025
Start again →
```

**If no previous workout:**
```
🔥 Start today's workout
Based on your last workout (auto-build).
```

Putting it front-and-center turns the dashboard into something actionable.

---

### 2. Add Motivation Streak Tracker
Use existing activity data for a simple dopamine hook.

**Suggested UI:**
```
Your Weekly Activity
🟩 🟩 🟩 🟥 🟥 🟩 🟦
Mon Tue Wed Thu Fri Sat Sun
🔥 3-day streak! Keep going!
```

**Color coding:**
- 🟩 green = workout
- 🟦 blue = run
- 🟥 red = no activity

Add a small flame next to streak days and a subtle animation when streak increases.

This is extremely motivating and will make the dashboard feel alive.

---

### 3. Quick Actions Bar
Beneath the header, add 3 large rounded buttons:
- 🏋️ Start Workout
- 🏃 Start Run (GPS)
- ➕ Quick Log

These are the main actions people use 90% of the time.

Especially on mobile, this reduces navigation friction massively.

---

## ⚡ MEDIUM-IMPACT IMPROVEMENTS

### 4. Add "This Week Overview" Instead of Raw Stats
Instead of "Total Runs: 1", which feels flat, show:

```
This Week
• 2 Workouts
• 5 km Run
• 30m Training Time
• 🔥 Active 3 days
```

It makes the data more meaningful and more motivating.

---

### 5. Show "Last Workout Summary" Card
People like seeing what they last achieved.

**Example:**
```
Last Workout

Russian Twists, Bird Dog
📦 Volume: 3202 kg
⏱️ Duration: N/A
🗓️ Nov 21, 2025
View →
```

It reinforces habits and helps users quickly repeat what they did.

---

## 🎯 SMALL POLISH

### 6. Personal Greeting
Add warmth to the dashboard:

```
"Good to see you, Mischa 👋
Ready for today's workout?"
```

---

### 7. Recent Activities Should Show Workout + Running
Right now it looks running-only.
Include workouts so the dashboard feels unified.

---

## Implementation Status
- [ ] Resume/Start Workout card at top
- [ ] Weekly activity streak tracker
- [ ] Quick Actions bar
- [ ] This Week Overview
- [ ] Last Workout Summary card
- [ ] Personal greeting
- [ ] Recent Activities unified view
