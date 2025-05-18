import React, { useState } from "react";
import styles from "../style/WorkPermit.module.css";
import ImageCheckboxGrid from "../components/ImageCheckboxGrid";
import EquipementAgainFire from "../components/EquipementAgainFire";
import axios from "axios";

const WorkPermit = () => {
  const [formData, setFormData] = useState({
    coordinatorName: "",
    coordinatorPosition: "",
    speakerName: "",
    speakerPosition: "",
    speakerCIN: "",
    speakerSignature: "",
    accompanyingNumber: "",
    persons: [
      { name: "", position: "", cin: "", signature: "" },
      { name: "", position: "", cin: "", signature: "" },
    ],
    startDateTime: "",
    endDateTime: "",
    placeArea: "",
    natureOfWorks: "",
    toolsUsed: [],
    otherTool: "",
    otherRequirements: "",
    engineerManager: "",
    hseOfficer: "",
    guardJob: "",
    inspectionDate: "",
    inspectionPlace: "",
    coordinatorSignature: "",
    responsibleSignature: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonChange = (index, field, value) => {
    const updatedPersons = [...formData.persons];
    updatedPersons[index][field] = value;
    setFormData({ ...formData, persons: updatedPersons });
  };

  const handleCheckboxChange = (tool) => {
    setFormData((prev) => {
      const tools = prev.toolsUsed.includes(tool)
        ? prev.toolsUsed.filter((t) => t !== tool)
        : [...prev.toolsUsed, tool];
      return { ...prev, toolsUsed: tools };
    });
  };

  const handleAddPerson = () => {
    setFormData((prev) => ({
      ...prev,
      persons: [...prev.persons, { name: "", position: "", cin: "", signature: "" }],
    }));
  };

  const tools = [
    "Cutting tool",
    "Drilling tool",
    "Chemical substances",
    "hot working tools (cutting , welding ...)",
    "Live electrical equipment",
    "Working at height equipment",
    "Lifting equipment",
  ];

  function handleAddWorkPermit() {
    setIsSubmitting(true);
    axios
      .post("http://localhost:5000/api/work-permit", formData)
      .then((response) => {
        console.log("Work Permit added successfully:", response.data);
        alert("Work Permit submitted!");
      })
      .catch((error) => {
        console.error("Error adding Work Permit:", error);
        alert("An error occurred. Please try again.");
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <div className={styles.container}>
      {/* Work Coordinator */}
      <div className={styles.section}>
        <label>WORK COORDINATOR</label>
        <div className={styles.row}>
          <label>
            <input
              placeholder="Mr/Mrs"
              name="coordinatorName"
              value={formData.coordinatorName}
              onChange={handleChange}
            />
          </label>
          <label>
            Position:
            <input
              name="coordinatorPosition"
              value={formData.coordinatorPosition}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      {/* Company Speaker */}
      <div className={styles.section}>
        <label>COMPANY SPEAKER</label>
        <div className={styles.row}>
          <label>
            Represented by Mr/Mrs:
            <input
              name="speakerName"
              value={formData.speakerName}
              onChange={handleChange}
            />
          </label>
          <label>
            Position:
            <input
              name="speakerPosition"
              value={formData.speakerPosition}
              onChange={handleChange}
            />
          </label>
          <label>
            CIN:
            <input
              name="speakerCIN"
              value={formData.speakerCIN}
              onChange={handleChange}
            />
          </label>
          <label>
            Signature:
            <input
              name="speakerSignature"
              value={formData.speakerSignature}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className={styles.row}>
          <label>
            Accompanying persons (number):
            <input
              name="accompanyingNumber"
              value={formData.accompanyingNumber}
              onChange={handleChange}
            />
          </label>
        </div>

        {formData.persons.map((person, i) => (
          <div className={styles.row} key={i}>
            <input
              placeholder="Name"
              value={person.name}
              onChange={(e) => handlePersonChange(i, "name", e.target.value)}
            />
            <input
              placeholder="Position"
              value={person.position}
              onChange={(e) => handlePersonChange(i, "position", e.target.value)}
            />
            <input
              placeholder="CIN"
              value={person.cin}
              onChange={(e) => handlePersonChange(i, "cin", e.target.value)}
            />
            <input
              placeholder="Signature"
              value={person.signature}
              onChange={(e) => handlePersonChange(i, "signature", e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddPerson}>
          + Add Accompanying Person
        </button>
      </div>

      {/* Duration */}
      <div className={styles.section}>
        <label>DURATION OF THE INTERVENTION</label>
        <div className={styles.row}>
          <label>
            Start date and time:
            <input
              type="datetime-local"
              name="startDateTime"
              value={formData.startDateTime}
              onChange={handleChange}
            />
          </label>
          <label>
            End date and time:
            <input
              type="datetime-local"
              name="endDateTime"
              value={formData.endDateTime}
              onChange={handleChange}
            />
          </label>
        </div>
        <label>
          Place of intervention area:
          <input
            name="placeArea"
            value={formData.placeArea}
            onChange={handleChange}
          />
        </label>
      </div>

      {/* Nature of Works */}
      <div className={styles.section}>
        <label>Nature of the works</label>
        <input
          className={styles.fullWidthInput}
          name="natureOfWorks"
          value={formData.natureOfWorks}
          onChange={handleChange}
        />
      </div>

      {/* Tools Used */}
      <div className={styles.section}>
        <label>TOOLS USED</label>
        <div className={styles.grid}>
          {tools.map((tool, i) => (
            <label key={i} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.toolsUsed.includes(tool)}
                onChange={() => handleCheckboxChange(tool)}
              />
              {tool}
            </label>
          ))}
          <label className={styles.checkboxLabel}>
            OTHER:
            <input
              type="text"
              name="otherTool"
              value={formData.otherTool}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      {/* Equipment Sections */}
      <div className={styles.section}>
        <label>Personnel Protection Equipment</label>
        <ImageCheckboxGrid />
      </div>

      <div className={styles.section}>
        <label>EQUIPMENT OF STRUGGLE AGAINST THE FIRE</label>
        <EquipementAgainFire />
      </div>

      {/* Requirements */}
      <div className={styles.section}>
        <h2 className={styles.title}>
          REQUIREMENTS SECURITY AND ENVIRONMENT TO RESPECT
        </h2>
        <ul className={styles.list}>
          <li>Mark the work area clearly.</li>
          <li>Always work in pairs in isolated areas.</li>
          <li>Use guardrails, scaffolding, PPE for height work.</li>
          <li>Stop work if interrupted by others.</li>
          <li>Remove any obstacles before work.</li>
          <li>Respect pedestrian/vehicle pathways.</li>
          <li>Be physically and mentally fit for the task.</li>
          <li>Keep the area clean and organized.</li>
          <li>Protect the product and check tools.</li>
        </ul>
      </div>

      {/* Other Requirements */}
      <div className={styles.gridTwoCol}>
        <div className={styles.gridTwoCol_1}>
          <label>Other security requirements:</label>
          <textarea
            className={styles.textarea}
            rows="3"
            name="otherRequirements"
            value={formData.otherRequirements}
            onChange={handleChange}
          />
        </div>
        <div className={styles.gridTwoCol_2}>
          <label>
            Engineering Manager:
            <input
              name="engineerManager"
              value={formData.engineerManager}
              onChange={handleChange}
            />
          </label>
          <label>
            HSE Officer:
            <input
              name="hseOfficer"
              value={formData.hseOfficer}
              onChange={handleChange}
            />
          </label>
          <label>
            Job of Guard:
            <input
              name="guardJob"
              value={formData.guardJob}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      {/* Inspection */}
      <div className={styles.gridTwoCol}>
        <div className={styles.section}>
          <h3 className={styles.title}>INSPECTION OF THE WORK PLACES</h3>
          <p className={styles.inlineParagraph}>
            Joint inspection of the work took place on
            <input
              type="date"
              name="inspectionDate"
              value={formData.inspectionDate}
              onChange={handleChange}
              className={styles.inlineInput}
            />
            at
            <input
              type="text"
              name="inspectionPlace"
              value={formData.inspectionPlace}
              onChange={handleChange}
              className={styles.inlineInput}
              placeholder="Place (e.g. Park M)"
            />
            . The intervention area has been marked and access routes indicated.
          </p>
        </div>
        <div className={styles.gridTwoCol_2}>
          <div className={styles.signatureTitle}>COORDINATOR OF THE WORKS</div>
          <p>(Date and signature)</p>
          <input
            type="text"
            className={styles.input}
            name="coordinatorSignature"
            value={formData.coordinatorSignature}
            onChange={handleChange}
          />
        </div>
        <div className={styles.gridTwoCol_2}>
          <div className={styles.signatureTitle}>RESPONSIBLE HSE</div>
          <p>(Date and signature)</p>
          <input
            type="text"
            className={styles.input}
            name="responsibleSignature"
            value={formData.responsibleSignature}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        onClick={handleAddWorkPermit}
        className={styles.saveButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Work Permit"}
      </button>
    </div>
  );
};

export default WorkPermit;
