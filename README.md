# To‑Do List App

A clean, minimal, vibe‑coded to‑do list application built with **HTML, CSS, and JavaScript**.  
Tasks can be added, edited, completed, restored, and deleted, with all data persisted using `localStorage`.

This project focuses on **clear UX, intentional interactions, and state‑driven UI behavior.**

## Features

- Navigation buttons to jump directly to Active Tasks, Completed Tasks, or Trash
- Back to Top button with smooth scrolling and auto-show on scroll
- Add tasks using the **Add** button or by pressing **Enter**
- **Live search** with instant filtering
- Filter tasks by **All**, **Active**, or **Completed**
- **Edit tasks** using a dedicated Edit button
- Mark tasks as complete or restore them
- Delete tasks from both active and completed sections
- Automatic timestamps for when tasks are **added** and **completed**
- Separate **Active Tasks** and **Completed Tasks** sections
- Independent bulk actions for:
  - **Active tasks**
  - **Completed tasks**
- Bulk action buttons:
  - Are **disabled** when no tasks are present
  - Become **active and visually emphasized** when available
- **Dark Mode toggle** with persistent theme storage
- All text, inputs, and placeholders adapt correctly to dark mode
- Confirmation required when deleting completed tasks
- **Undo support** for bulk actions
- **Trash section** for safe task recovery
- Deleting a task moves it to Trash instead of deleting permantently
- Tasks can be **restored or permanently deleted** from Trash
- Clear Trash button with confirmation and inline status feedback
- Bulk actions move tasks to Trash with **inline confirmation feedback**
- Undo and status feedback are displayed **side‑by‑side above the Trash section**
- Persistent storage using `localStorage`
- Clean, modern UI with subtle styling
- Fully responsive layout

## How to Run

1. Clone the repo
2. Open `index.html` in your browser
3. Start adding tasks

## Design Highlights

- State‑driven UI (buttons reflect actual task availability)
- Clear separation of destructive actions
- Visual affordances for edit, complete, restore, and delete
- Smooth in-page navigation for quick access to each task section
- Defensive UX (disabled actions when unavailable)
- Defensive UX for destructive actions with confirmation and clear feedback
- Clean DOM updates with a single render cycle
- Clear, non‑destructive feedback for bulk actions
- Inline status messaging paired with Undo for user confidence
- Trash‑first deletion model to prevent accidental data loss

## Future Enhancements

- Button to choose if want to jump down to To-Do List or Completed Tasks or Trash
- Scheduling future tasks (choosing date & time in a calender)
- Choosing if want to add a task or a reminder
- Task categories or tags
- Add calender
- Duplicate tasks
- Drag‑and‑drop task reordering
- Add smooth transitions between light/dark
- Animations for adding, editing and deleting tasks
