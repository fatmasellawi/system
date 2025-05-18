import React, { useState } from "react";
import styles from "../style/HotWorkPermitForm.module.css";

const HotWorkPermitForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    jobDetails: "",
    tools: "",
    location: "",
    interaction: "",
    approvalBy: "",
    approvalDate: "",
    approvalTime: "",
    hours: "",
    shiftDay: "",
    questions: Array(10).fill(""),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = value;
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  const questions = [
    "Are you qualified/trained to undertake this work?",
    "Has a sprinkler system/fixed fire installation been left in service?",
    "Are extinguishers or a hose pipe to hand?",
    "Are there means of sounding to fire alarms to hand?",
    "Is the area cleared of combustible material and/or protected?",
    "Have the flammable liquid contains been removed and/or protected?",
    "Is intrinsically safe equipment to be used?",
    "Is the area safe and no one is close to the operational area?",
    "Smoke alarms covered?",
    "Adjoining equipment and operations considered?",
  ];

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.title}>HOT WORK</div>

      <div className={styles.section}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />

        <label>JOB DETAILS</label>
        <textarea
          name="jobDetails"
          value={formData.jobDetails}
          onChange={handleInputChange}
        />

        <label>SPECIAL TOOLS TO BE USED</label>
        <input
          type="text"
          name="tools"
          value={formData.tools}
          onChange={handleInputChange}
        />

        <label>JOB LOCATION / PLANT IDENTIFICATION</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />

        <label>
          IS ANY OTHER WORK CURRENTLY BEING UNDERTAKEN THAT MAY INTERACT OR
          AFFECT THIS PERMIT?
        </label>
        <input
          type="text"
          name="interaction"
          value={formData.interaction}
          onChange={handleInputChange}
        />

        <p className={styles.notice}>
          This permit is valid only when all sections are completed...
        </p>
      </div>

      <div className={styles.hazards}>
        HAZARDS AND PRECAUTION TO BE TAKEN
        <div className={styles.primaryHazards}>
          PRIMARY HAZARDS - fumes, electrics, gases, liquids, radiation, fire,
          soldering
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>PLEASE ANSWER THE FOLLOWING QUESTIONS TRUTHFULLY</th>
            <th>YES</th>
            <th>NO</th>
            <th>N/A</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, idx) => (
            <tr key={idx}>
              <td>{q}</td>
              <td>
                <input
                  type="radio"
                  name={`q${idx}`}
                  value="YES"
                  onChange={() => handleQuestionChange(idx, "YES")}
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`q${idx}`}
                  value="NO"
                  onChange={() => handleQuestionChange(idx, "NO")}
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`q${idx}`}
                  value="N/A"
                  onChange={() => handleQuestionChange(idx, "N/A")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.authorization}>
        <p>
          I confirm that I have verified the above information and ensured the
          necessary precautions have been taken...
        </p>

        <div className={styles.approval}>
          <label>APPROVED BY</label>
          <input
            type="text"
            name="approvalBy"
            value={formData.approvalBy}
            onChange={handleInputChange}
          />

          <label>DATE</label>
          <input
            type="text"
            name="approvalDate"
            value={formData.approvalDate}
            onChange={handleInputChange}
          />

          <label>TIME</label>
          <input
            type="text"
            name="approvalTime"
            value={formData.approvalTime}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.permitInfo}>
          HOT PERMIT WORK IS GOOD FOR
          <input
            type="text"
            name="hours"
            className={styles.inlineInput}
            value={formData.hours}
            onChange={handleInputChange}
          />
          HOURS ONLY.
          <br />
          THIS PERMIT CAN BE USED FOR ONLY ONE SHIFT. IT BECOMES VOID AT THE END
          OF WORK SHIFT
          <input
            type="text"
            name="shiftDay"
            className={styles.inlineInput}
            value={formData.shiftDay}
            onChange={handleInputChange}
          />
          .
        </div>
      </div>
      <div className={styles.signatureSection}>
        <table className={styles.signatureTable}>
          <thead>
            <tr>
              <th></th>
              <th>HSE Member</th>
              <th>Worker</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Signature Before Operation</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Signature After Operation</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        type="submit"
        style={{ marginTop: "20px", padding: "10px 20px", fontWeight: "bold" }}
      >
        Submit
      </button>
    </form>
  );
};

export default HotWorkPermitForm;
