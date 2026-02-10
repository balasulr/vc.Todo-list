# To‑Do List App

A clean, minimal, vibe‑coded to‑do list application built with **HTML, CSS, and JavaScript**.  
Tasks can be added, edited, completed, restored, and deleted, with all data persisted using `localStorage`.

This project focuses on **clear UX, intentional interactions, and state‑driven UI behavior.**

## Features

- Add tasks using the **Add** button or by pressing **Enter**
- **Search tasks** with a live search bar
- **Filter tasks** by:
  - All
  - Active
  - Completed
- **Edit tasks** using a dedicated Edit button
- Mark tasks as complete or restore them
- Delete individual tasks
- Delete tasks directly from both active and completed sections
- Automatic timestamps for:
  - When a task is **added**
  - When a task is **completed**
- Separate **Active Tasks** and **Completed Tasks** sections
- Independent bulk delete buttons for:
  - **Active tasks**
  - **Completed tasks**
- Bulk delete buttons:
  - Are **disabled** when their list is empty
  - Become **fully active and red** when tasks are present
- **Dark Mode toggle** with persistent theme storage
- All text, inputs, and placeholders adapt correctly to dark mode
- Confirmation required when deleting completed tasks
- Undo support for bulk delete actions
- Trash section for recovering deleted tasks
- Deleting a task moves it to Trash
- Tasks can be restored or permanently deleted from Trash
- Bulk actions move tasks to Trash instead of deleting permanently
- Bulk action to move all completed tasks to Trash
- Inline confirmation message when completed tasks are moved to Trash
- Undo button appears alongside the confirmation message for quick recovery
- Undo and status feedback are displayed together above the Trash section
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
- Defensive UX (disabled actions when unavailable)
- Clean DOM updates with a single render cycle
- Clear, non‑destructive feedback for bulk actions
- Inline status messaging paired with Undo for user confidence
- Trash‑first deletion model to prevent accidental data loss

## Future Enhancements

- Clear trash button with confirmation and status message
- Add smooth transitions between light/dark
- Animations for adding, editing and deleting tasks
- Task categories or tags
- Drag‑and‑drop task reordering
