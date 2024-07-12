"use client";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import React, { useState } from "react";







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
  return (
    <div>
      <div>
        <form>
          <input
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
            placeholder="Proje ismi giriniz"
          />
          <input
            value={newDescription}
            onChange={(e) => setNewDescription(e.currentTarget.value)}
            placeholder="Proje bilgilerini giriniz"
          />
          <input
            value={newImage}
            onChange={(e) => setNewImage(e.currentTarget.value)}
            placeholder="fotoğraf giriniz"
          />
          <input
            value={newLink}
            onChange={(e) => setNewLink(e.currentTarget.value)}
            placeholder="bağlantı  giriniz"
          />
        </form>
      </div>
      <button onClick={addNewProject}>Ekle!</button>
    </div>
  );
};

export default PostReq;
