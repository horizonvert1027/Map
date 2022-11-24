import { getAuth, signInWithEmailAndPassword, signOut, deleteUser } from "firebase/auth";
import { getFirestore, collection, doc, where, documentId, updateDoc, addDoc, setDoc, query, getDocs, getDoc, deleteDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase/Config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const FirebaseAPI = {};

FirebaseAPI.auth = {
	checkUserRegistered: async email => {
		const q = query(collection(db, "users"), where("email", "==", email));
		const userSnapshot = await getDocs(q);
		return !!userSnapshot.docs.length;
	},
	checkVerificationCode: async (email, code) => {
		const docSnap = await getDoc(doc(db, "codes", email));
		return +code === docSnap.data().code;
	},
	signIn: async data => {
		const { user } = await signInWithEmailAndPassword(auth, data.email, data.password);
		const info = await FirebaseAPI.user.get(user.uid);
		return { uid: user.uid, token: user.accessToken, ...info };
	},
	signOut: async () => {
		return await signOut(auth);
	},
	register: async (uid, data) => {
		return await setDoc(doc(db, "users", uid), {
			email: data.email,
			username: data.username,
			name: data.name,
			country: data.country,
			projects: []
		});
	}
};


FirebaseAPI.user = {
	get: async uid => {
		return (await getDoc(doc(db, "users", uid))).data()
	},
	update: async (uid, data) => {
		return await updateDoc(doc(db, "users", uid), data);
	},
	delete: async uid => {
		await deleteDoc(doc(db, "users", uid));
		return await deleteUser(auth.currentUser);
	},
};

FirebaseAPI.project = {
	get: async id => {
		const docSnap = await getDoc(doc(db, "projects", id));
		return docSnap.data();
	},
	getMyProjects: async (uid) => {
		let userProjects = (await getDoc(doc(db, "users", uid))).data().projects || [];
		let projects = [];
		if (userProjects.length) {
			
			let loading = true;
			while (loading) {
				// console.log(userProjects.splice(0, 9));
				// console.log(userProjects)

				const q = query(collection(db, "projects"), where(documentId(), 'in', userProjects.splice(0, 9)));
				const snap = await getDocs(q);
				snap.forEach((doc) => {
					projects.push({ id: doc.id, ...doc.data() });
				});
				if (userProjects.length === 0) {
					loading = false;
				}
			}
		}
		return projects;
	},
	add: async (data) => {
		const project = await addDoc(collection(db, "projects"), data);
		let projects = (await getDoc(doc(db, "users", auth.currentUser.uid))).data().projects;
		if (!projects) {
			projects = [project.id];
		} else {
			projects.push(project.id);
		}
		updateDoc(doc(db, "users", auth.currentUser.uid), { projects });
		return project;
	},
	save: async (id, data) => {
		return await updateDoc(doc(db, "projects", id), data);
	},
	delete: async (id) => {
		let projects = (await getDoc(doc(db, "users", auth.currentUser.uid))).data().projects;
		updateDoc(doc(db, "users", auth.currentUser.uid), { projects: projects.filter(p => p !== id) });
		return await deleteDoc(doc(db, "projects", id));
	}
};

FirebaseAPI.icon = {
	get: async () => {
		let icons = [];
		const q = query(collection(db, "icons"));
		const snap = await getDocs(q);
		snap.forEach((doc) => {
			icons.push({ id: doc.id, ...doc.data() });
		});
		return icons;
	},
	add: async data => {
		return await addDoc(collection(db, "icons"), data);
	}
};
export default FirebaseAPI; 