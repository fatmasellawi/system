import React from "react";
import styles from "../style/ImageCheckboxGrid.module.css"; 

const ImageCheckboxGrid = () => {
  const imageNames = [
    "01.jpg",
    "02.jpg",
    "03.jpg",
    "04.jpg",
    "05.jpg",
    "06.jpg",
    "07.jpg",
    "08.jpg",
  ];

  return (
    <div className={styles.grid}>
      {imageNames.map((image, i) => (
        <div key={i} className={styles.imageItem}>
          <img
            src={`/${image}`}
            alt={`icon ${i + 1}`}
            className={styles.icon}
          />
          <input type="checkbox" />
        </div>
      ))}
    </div>
  );
};

export default ImageCheckboxGrid;
