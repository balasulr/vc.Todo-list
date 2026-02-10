# To‑Do List App

A clean, minimal, vibe‑coded to‑do list application built with **HTML, CSS, and JavaScript**.  
Tasks can be added, edited, completed, restored, and deleted, with all data persisted using `localStorage`.

This project focuses on **clear UX, intentional interactions, and state‑driven UI behavior.**

## Features

### Navigation & Layout

- Jump buttons to instantly navigate to Active Tasks, Completed Tasks, or Trash
- Back to Top button with smooth scrolling and auto‑show on scroll
- Fully responsive layout with clean, modern styling

### Task Creation & Editing

- Add tasks using the Add button or by pressing Enter
- Optional scheduling with a built‑in date and time picker
- “Schedule Task” button that reveals or hides scheduling fields on demand
- Validation prevents selecting a date or time in the past

- Edit tasks inline with a dedicated Edit button

### Search & Filtering

- Live search with instant filtering
- Filter tasks by All, Active, or Completed

### Task Management

- Mark tasks as complete or restore them
- Delete tasks from both active and completed sections
- Automatic timestamps for when tasks are added and completed
- Scheduled tasks display their chosen date and time

### Sections & Organization

- Separate Active Tasks, Completed Tasks, and Trash sections
- Trash‑first deletion model to prevent accidental data loss
- Restore or permanently delete tasks from Trash

### Bulk Actions

- Independent bulk actions for Active and Completed tasks
- Bulk buttons disable when no tasks are available
- Bulk actions move tasks to Trash with inline confirmation feedback
- Undo support for bulk actions with paired status messaging

### Appearance & UX

- Dark Mode toggle with persistent theme storage
- All text, inputs, and placeholders adapt correctly to dark mode
- Smooth in‑page navigation and clear visual affordances
- Defensive UX for destructive actions with confirmation prompts

### Persistence

- All tasks, states, and theme preferences saved using `localStorage`

## How to Run

1. Clone the repo
2. Open `index.html` in your browser
3. Start adding tasks

## Design Highlights

- State‑driven UI with buttons that reflect real task availability
- Clear separation of destructive actions with confirmation prompts
- Intuitive visual affordances for editing, completing, restoring, and deleting tasks
- Smooth in‑page navigation for fast movement between sections
- Defensive UX: disabled actions when unavailable, confirmations for destructive steps
- Clean, efficient DOM updates with a single render cycle
- Inline status messaging paired with Undo for safe, reversible bulk actions
- Trash‑first deletion model to prevent accidental data loss
- Optional scheduling fields for planning tasks with specific dates and times

## Future Enhancements

- Scheduled Tasks having own button next to All, Active and Completed called Upcoming so can see Scheduled Tasks
- Adding sorting by scheduled date
- Once task reaches the scheduled time, removing the Scheduled and have it be active
- Ability to edit date and time when Editing tasks

- Choosing if want to add a task or a reminder
- Task categories or tags
- Add calender
- Duplicate tasks
- Drag‑and‑drop task reordering
- Add smooth transitions between light/dark
- Animations for adding, editing and deleting tasks
