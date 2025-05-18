import React from "react";
import styles from "../style/ImageCheckboxGrid.module.css"; 

const EquipementAgainFire = () => {
  const imageNames = ["ext-co2.jpg", "ext-abc.jpg"];

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

export default EquipementAgainFire;
