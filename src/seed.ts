import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { environment } from './environment/environment';

// Initialize Firebase

const app = initializeApp(environment.firebase);
const firestore = getFirestore(app);
const auth = getAuth(app);

// Seed Auth Users
export const seedAuth = async () => {
  const users = [
    {
      email: 'mehdi@gmail.com',
      password: '1234567',
      name: 'mehdi',
      role: 'student',
      class_name: 'M2',
      subject_name: 'angularTP',
    },
    {
      email: 'soufiane@gmail.com',
      password: '1234567',
      name: 'soufiane',
      role: 'student',
      class_name: 'M2',
      subject_name: 'angularTP',
    },
    {
      email: 'bakary@gmail.com',
      password: '1234567',
      name: 'bakary',
      role: 'student',
      class_name: 'M2',
      subject_name: 'angularTP',
    },
    {
      email: 'Thomas.ferreira@efrei.fr',
      password: 'Professor1234',
      name: 'Thomas Ferreira',
      role: 'professor',
      class_name: 'M2',
      subject_name: 'angularTP',
    },
    {
      email: 'Boris.rose@efrei.fr',
      password: 'Professor1234',
      name: 'Boris Rose',
      role: 'professor',
      class_name: 'M2',
      subject_name: 'angularTP',
    },
  ];
  const newUsers = [];

  for (const user of users) {
    try {
      const { email, password, ...metadata } = user;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );

      const userRef = doc(firestore, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        email: email,
        ...metadata, // Add additional metadata (e.g., role)
        createdAt: userCredential.user.metadata.creationTime,
      });
      // Store user info and UID in an array
      newUsers.push({
        uid: userCredential.user.uid,
        email: user.email,
        ...metadata,
      });

      console.log(`Seeded Auth user: ${user.email}`);
    } catch (error) {
      console.error(
        `Error seeding Auth user (${user.email}):`,
        (error as any).message
      );
    }
  }

  return newUsers; // Return user info with UID
};

export const seedClassesGradesCourses = async (
  users: {
    uid: string;
    email: string;
    name: string;
    role: string;
    class_name: string;
    subject_name: string;
  }[]
) => {
  // Let's assume we already have the professor UID and the student UIDs from `users`
  const professor = users.find((user) => user.role === 'professor');
  const professorId = professor?.uid;
  const studentIds = users
    .filter((user) => user.role === 'student')
    .map((user) => user.uid);

  // Example of a class document
  const classDoc = {
    name: 'M2',
    professorId,
    students: studentIds.map((studentId, index) => ({
      _id: studentId,
      attendance: index % 2 === 0, // Example alternating attendance for demonstration
      name: users.find((user) => user.uid === studentId)?.name || 'Unknown',
    })),
  };

  // Create the class document
  const classRef = doc(collection(firestore, 'classes'));
  await setDoc(classRef, classDoc);
  console.log(`Seeded class: M2`);

  // Example of grade document for each student
  for (const studentId of studentIds) {
    const gradeDoc = {
      grade: '20', // Example grade
      professorId,
      studentId,
      subjectName: 'angularTP', // Example subject
    };

    const gradeRef = doc(collection(firestore, 'grades'));
    await setDoc(gradeRef, gradeDoc);
    console.log(`Seeded grade for student ID: ${studentId}`);
  }

  // Example of a course document
  const courseDoc = {
    classId: classRef.id,
    className: 'M2',
    courseName: 'Angular',
    date: new Date('2024-12-25T00:00:00Z'), // Example date
    startTime: '12:45',
    endTime: '13:45',
    professorId,
    students: studentIds.map((studentId) => ({
      _id: studentId,
      attendance: 'absent', // All students are marked present as an example
      name: users.find((user) => user.uid === studentId)?.name || 'Unknown',
      subjectName: users.find((user) => user.uid === studentId)?.subject_name, // Example subject
    })),
  };

  // Create the course document
  const courseRef = doc(collection(firestore, 'courses'));
  await setDoc(courseRef, courseDoc);
  console.log(`Seeded course: Theatre for class M2`);
};

const isCollectionEmpty = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(firestore, collectionName));
  return querySnapshot.empty;
};

// Call seed function
const seed = async () => {
  console.log('Starting seeding process...');

  const isUsersEmpty = await isCollectionEmpty('users');
  if (!isUsersEmpty) {
    console.log(
      'Seed already settled, skipping seed ;), The App will start now wait a moment......'
    );
    return;
  }

  try {
    // Seed auth users first
    const users = await seedAuth(); // Assuming seedAuth() is already defined

    // Now seed classes, grades, and courses with the auth user data
    await seedClassesGradesCourses(users);

    console.log('Seeding complete. The App will start now wait a moment...');
    return;
  } catch (error) {
    console.error('Error during seeding:', error);
  }
};

// Main function to run both seeds
seed().catch((error) => {
  console.error('Error during seeding:', error);
});
