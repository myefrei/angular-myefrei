# MyEfrei App - Firebase Seeding and Setup

This repository provides a complete Angular application with Firebase integration for authentication and Firestore database management. Follow the steps below to set up the project, seed data, and run the application.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Firebase Setup](#firebase-setup)
3. [Seed Data](#seed-data)
   - [Users Collection](#users-collection)
   - [Classes Collection](#classes-collection)
   - [Grades Collection](#grades-collection)
   - [Courses Collection](#courses-collection)
4. [Running the Seed Script](#running-the-seed-script)
5. [Firebase Firestore Rules](#firebase-firestore-rules)

---

## Project Setup

### Prerequisites

1. **Node.js** (v14+)
2. **Angular CLI** (v12+)
3. **Firebase Account**

### Installation Steps

```markdown
1. Clone this repository:

   git clone https://github.com/myefrei/angular-myefrei.git
   cd angular-myefrei
```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Firebase in `src/environment/environment.ts`:

   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: "your-api-key",
       authDomain: "your-auth-domain",
       projectId: "your-project-id",
       storageBucket: "your-storage-bucket",
       messagingSenderId: "your-messaging-sender-id",
       appId: "your-app-id",
       measurementId: "your-measurement-id",
     },
   };
   ```

   ### You will find our credentials in the app if you doesn't have one

---

## Firebase Setup

1. Run `firebase init` in the root directory:

   - Select the following services:
     - **Firestore (Database)**
     - **Authentication**

2. In the Firebase Console:
   - Enable **Email/Password** Authentication.
   - Set up Firestore in **test mode**.

---

## Firebase Emulator Setup For Seed DATA

1. Run `firebase init emulators` in the root directory:

   - Select the following services:
     - **Firestore (Database)**
     - **Authentication**

2. Make sure you don't have collections yet

## Firebase Firestore Rules

To execute the seed script, update your Firestore rules as follows:

1. Go to Firebase Console.
2. Navigate to **Firestore Database** > **Rules**.
3. Replace the rules with:

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write;
    }
  }
}
```

## Seed Data

### Collections Structure

#### Users Collection

| **Field**      | **Type** | **Description**                           |
| -------------- | -------- | ----------------------------------------- |
| `uid`          | string   | Unique user ID assigned by Firebase Auth. |
| `email`        | string   | User's email.                             |
| `name`         | string   | User's name.                              |
| `role`         | string   | User's role (`student` or `professor`).   |
| `class_name`   | string   | Class name the user belongs to.           |
| `subject_name` | string   | Subject associated with the user.         |
| `createdAt`    | string   | Date when the user was created.           |

---

#### Classes Collection

| **Field**     | **Type** | **Description**                  |
| ------------- | -------- | -------------------------------- |
| `name`        | string   | Class name (e.g., "M2").         |
| `professorId` | string   | Professor's UID.                 |
| `students`    | array    | Array of students with metadata. |

---

#### Grades Collection

| **Field**     | **Type** | **Description**                 |
| ------------- | -------- | ------------------------------- |
| `grade`       | string   | Student's grade (e.g., `"20"`). |
| `professorId` | string   | Professor's UID.                |
| `studentId`   | string   | Student's UID.                  |
| `subjectName` | string   | Subject name the grade is for.  |

---

#### Courses Collection

| **Field**     | **Type** | **Description**                         |
| ------------- | -------- | --------------------------------------- |
| `classId`     | string   | Class ID linked to the class document.  |
| `className`   | string   | Class name (e.g., "M2").                |
| `courseName`  | string   | Name of the course (e.g., "Angular").   |
| `date`        | Date     | Date of the course.                     |
| `startTime`   | string   | Start time of the course.               |
| `endTime`     | string   | End time of the course.                 |
| `professorId` | string   | Professor's UID.                        |
| `students`    | array    | Array of students with attendance info. |

---

### Sample User Data

| **Email**                | **Password**  | **Role**  | **Class** | **Subject** |
| ------------------------ | ------------- | --------- | --------- | ----------- |
| mehdi@gmail.com          | 1234567       | student   | M2        | angularTP   |
| soufiane@gmail.com       | 1234567       | student   | M2        | angularTP   |
| bakary@gmail.com         | 1234567       | student   | M2        | angularTP   |
| Thomas.ferreira@efrei.fr | Professor1234 | professor | M2        | angularTP   |
| Boris.rose@efrei.fr      | Professor1234 | professor | M2        | angularTP   |

---

## Running the Seed Script

### Scripts in `package.json`

```json
"scripts": {
  "ng": "ng",
  "seed": "node --no-warnings=ExperimentalWarning --loader ts-node/esm ./src/seed.ts",
  "start-seed": "npm run seed && npm run start",
  "start": "ng serve --hmr",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
}
```

### Running the Seed Script

1. Seed the database:

   ```bash
   npm run seed
   ```

2. Start the app if seed is ok:
   ```bash
   npm run start
   ```

### Troubleshooting

- Ensure Firebase credentials in `environment.ts` are correct.
- Check the Firebase Console for seeded data under the `users`, `classes`, `grades`, and `courses` collections.
- Please refresh when you're logged the init of styles is broken

Made by Mehdi - Bakary - Soufiane
