const admin = require("firebase-admin");
//get the service acc
const serviceAccount = require("./serviceAccountKey.json");

//initialize the app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const users = Array.from({ length: 50 }, (_, i) => ({
    email: `geminiuser${i + 1}@aiuse.com`,
    password: "aipass123"
}));


//create all the users
const createUsers = async () => {
    for (const user of users) {
        try {
            const userRecord = await admin.auth().createUser({
                email: user.email,
                password: user.password,
            });
            console.log(`✅ Created user: ${user.email}`);
        } catch (error) {
            if (error.code === 'auth/email-already-exists') {
                console.log(`⚠️ User already exists: ${user.email}`);
            } else {
                console.error(`❌ Error creating ${user.email}:`, error.message);
            }
        }
    }
};

createUsers();