"use client";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import styles from "./postR.module.css"; // CSS dosyanızı import edin

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

const PostReq = () => {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newLink, setNewLink] = useState("");
  const [imagePreview, setImagePreview] = useState<string | File | ArrayBuffer | null>("");

  const addNewProject = async () => {
    const data = {
      name: newName,
      description: newDescription,
      image: newImage,
      link: newLink,
    };

    try {
      const postDoc = await addDoc(collection(db, "projects"), data);
      console.log("Proje ID'si: ", postDoc.id);
    } catch (e) {
      console.error("Proje eklenirken hata oluştu: ", e);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <input
          className={styles.input}
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
          placeholder="Proje ismi giriniz"
        />
        <textarea
          className={styles.textarea}
          value={newDescription}
          onChange={(e) => setNewDescription(e.currentTarget.value)}
          placeholder="Proje bilgilerini giriniz"
        />
        <input
          type="file"
          className={styles.fileInput}
          id="myFile"
          name="filename"
          onChange={handleImageChange}
          placeholder="Fotoğraf giriniz"
        />
        <input
          className={styles.input}
          value={newLink}
          onChange={(e) => setNewLink(e.currentTarget.value)}
          placeholder="Bağlantı giriniz"
        />
      </form>
      {imagePreview && <img className={styles.imgPreview} src={imagePreview as string} alt="Preview" />}
      <button className={styles.button} onClick={addNewProject}>Ekle!</button>
    </div>
  );
};

export default PostReq;
