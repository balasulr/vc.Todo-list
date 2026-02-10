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

## Future Enhancements

- If bulk delete completed tasks, want button to say move to trash
- Add smooth transitions between light/dark
- Animations for adding, editing and deleting tasks
- Task categories or tags
- Drag‑and‑drop task reordering
