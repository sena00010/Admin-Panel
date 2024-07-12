"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, doc, getDoc, addDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import PostReq from "@/components/postR";

interface Project {
  image: string;
  name: string;
  description: string;
  link: string;
  uid: string;
}

const firebaseConfig = {
  apiKey: "AIzaSyCwU76Wlwc-55i5XGm9cA6b1DwPgljkjOQ",
  authDomain: "my-portfolio-29f09.firebaseapp.com",
  projectId: "my-portfolio-29f09",
  storageBucket: "my-portfolio-29f09.appspot.com",
  messagingSenderId: "183966692903",
  appId: "1:183966692903:web:e4a44b7f010db15480c002",
  measurementId: "G-NYPW5J58YY",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const fetchProjects = async () => {
  const projectsCollection = collection(db, "projects");
  const projectSnapshot = await getDocs(projectsCollection);
  const projectList = projectSnapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));
  return projectList;
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  useEffect(() => {
    const getProjects = async () => {
      const projectsData = await fetchProjects();
      console.log("Fetched Projects:", projectsData);
      setProjects(projectsData);
    };
    getProjects();
  }, []);

  const handleEditClick = async (projectId: string) => {
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);
    if (projectSnap.exists()) {
      setSelectedProject({ uid: projectId, ...projectSnap.data() } as Project);
      console.log(selectedProject,'selectedProject')
      setOpenUpdate(true);
    } else {
      console.log("Belge bulunamadı");
    }
  };

  const handleUpdate = async () => {
    if (selectedProject) {
      const projectRef = doc(db, "projects", selectedProject.uid);
      await updateDoc(projectRef, {
        name: selectedProject.name,
        description: selectedProject.description,
        image: selectedProject.image,
        link: selectedProject.link,
      });
      setOpenUpdate(false);
      const updatedProjects = await fetchProjects();
      setProjects(updatedProjects);
    }
  };

  return (
    <main className={styles.main}>
      {openUpdate && selectedProject ? (
        <div>
          <input
            value={selectedProject.name}
            onChange={(e) => setSelectedProject({ ...selectedProject, name: e.currentTarget.value })}
            placeholder="Proje ismi giriniz"
          />
          <input
            value={selectedProject.description}
            onChange={(e) => setSelectedProject({ ...selectedProject, description: e.currentTarget.value })}
            placeholder="Proje bilgilerini giriniz"
          />
          <input
            value={selectedProject.image}
            onChange={(e) => setSelectedProject({ ...selectedProject, image: e.currentTarget.value })}
            placeholder="Fotoğraf giriniz"
          />
          <input
            value={selectedProject.link}
            onChange={(e) => setSelectedProject({ ...selectedProject, link: e.currentTarget.value })}
            placeholder="Bağlantı giriniz"
          />
          <button onClick={handleUpdate}>Güncellemeyi Kaydet</button>
        </div>
      ) : (
        <div></div>
      )}

      <PostReq />

      <div className={styles.projectList}>
        {projects.map((project, index) => (
          <div key={index} className={styles.projectCard}>
            <img
              src={project.image}
              alt={`Project ${index + 1} Thumbnail`}
              className={styles.projectImage}
            />
            <div className={styles.projectContent}>
              <p className={styles.projectText}>{project.description}</p>
              <p className={styles.projectText}>{project.name}</p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectLink}
              >
                GitHub Link
              </a>
            </div>
            <button onClick={() => handleEditClick(project.uid)}>Düzenle!</button>
          </div>
        ))}
      </div>
    </main>
  );
}
