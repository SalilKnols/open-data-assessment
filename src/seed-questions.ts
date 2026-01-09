
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { QUESTIONS } from "./app/services/assessment-questions.data";
import { environment } from "./app/environments/environment";

const firebaseConfig = environment.firebase;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedFirestore() {
    console.log('Starting seed process...');
    console.log(`Found ${QUESTIONS.length} questions to seed.`);

    const batchSize = 10;
    let seededCount = 0;

    for (const q of QUESTIONS) {
        try {
            await setDoc(doc(db, 'questions', q.id.toString()), q, { merge: true });
            seededCount++;
            if (seededCount % batchSize === 0) {
                console.log(`Seeded ${seededCount} questions...`);
            }
        } catch (error) {
            console.error(`Error seeding question ${q.id}:`, error);
        }
    }

    console.log('Seeding complete. ' + seededCount + ' questions updated.');
    process.exit(0);
}

seedFirestore();
