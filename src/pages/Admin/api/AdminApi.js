import { getAuth, signInWithEmailAndPassword, signOut, deleteUser } from "firebase/auth";
import { getFirestore, collection, doc, where, documentId, updateDoc, addDoc, setDoc, query, getDocs, getDoc, deleteDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase/Config";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const AdminApi = {};

AdminApi.users = {
	getUsers: async () => {
		const q = query(collection(db, "users"));
		const snap = await getDocs(q);
		let users = [];
		snap.forEach((doc) => {
			users.push({ id: doc.id, ...doc.data() });
		});
		return users;
	},
}

export default AdminApi;