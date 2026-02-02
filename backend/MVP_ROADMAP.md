# LabDrop Backend: MVP Roadmap & Progress

This document summarizes the current state of the LabDrop backend and the remaining milestones for the teammates.

---

## ✅ Completed Features

### 1. Authentication & Security
- **JWT Flow**: implements Access Tokens (short-lived) and Refresh Tokens (database-stored).
- **Security Middleware**: `verifyJWT` ensures all resource-heavy routes are protected.
- **User Models**: Secure password hashing with `bcrypt`.

### 2. Hierarchical Folder Management
- **Stateless Structure**: Folders use a `path` string (e.g., `/Lab1/src/`) for lightning-fast lookups.
- **Relational Integrity**: Supports nested folders and prevents naming conflicts within the same path.
- **API**: Endpoints for creating folders and retrieving contents (subfolders + files).

### 3. Integrated File Logic
- **DB Record Persistence**: Uploaded files are automatically recorded in the `File` collection.
- **Two-Way Linking**: Files point to their parent folders, and Folders maintain an array of their child file IDs.
- **Schema Simplification**: Merged metadata (name, size, type) into the main `File` model for performance.

---

## 🛠️ Remaining MVP Milestones

### 1. The "Smart Drop" (Recursive Logic)
- **Goal**: Support dragging and dropping whole directories.
- **Logic**: Automatically recreate the folder structure in the DB based on the `webkitRelativePath` sent by the frontend.

### 2. Secure Workbench Retrieval
- **Goal**: Protect file downloads.
- **Logic**: Verify ownership via JWT before serving the file storage URL.

### 3. Cloud Storage Persistence
- **Goal**: Replace local `public/temp` storage with Cloudinary or AWS S3.
- **Task**: Flip the switch in `fileupload.controller.js` to send binary data to the cloud.

---

## 🚀 How to Test Current Features

| Feature | Endpoint | Method | Required Data |
| :--- | :--- | :--- | :--- |
| **Login** | `/api/v1/auth/login` | `POST` | `email`, `password` |
| **Create Folder** | `/api/v1/folder/create` | `POST` | `name`, `parentFolder` (optional) |
| **List Folder** | `/api/v1/folder/:id?` | `GET` | `id` (optional, defaults to Home) |
| **Upload File** | `/drop/upload` | `POST` | `folderId`, `files` (form-data) |

> [!NOTE]
> All resource routes require a `Bearer <token>` in the Authorization header.
