import { useState } from "react";

const FAMILY_MEMBERS = [
  "Tomiwa",
  "Eniola",
  "Ayooluwatomiwa",
  "Ireoluwatomiwa",
  "Nifemi",
  "Oluwatomisin",
  "Jesutofunmi",
  "Inioluwa",
  "Olumide",
  "Maooghene",
  "Mayowa",
  "The House"
];

export default function App() {
  const [members, setMembers] = useState(
    FAMILY_MEMBERS.map((name) => ({
      name,
      hasDrawn: false,
    }))
  );

  const [availableRecipients, setAvailableRecipients] = useState([...FAMILY_MEMBERS]);

  const [enteredName, setEnteredName] = useState("");
  const [assignedName, setAssignedName] = useState("");

  const handleDraw = () => {
    const user = members.find(
      (m) => m.name.toLowerCase() === enteredName.toLowerCase()
    );

    if (!user) {
      setAssignedName("Name not found. Please enter a valid family member.");
      setEnteredName('')
      return;
    }

    if (user.hasDrawn) {
      setAssignedName(`${user.name}, you have already drawn your Secret Santa!`);
      return;
    }

    const possibleRecipients = availableRecipients.filter(
      (r) => r.toLowerCase() !== user.name.toLowerCase()
    );

    if (possibleRecipients.length === 0) {
      setAssignedName("No recipients available.");
      return;
    }

    const randomRecipient =
      possibleRecipients[Math.floor(Math.random() * possibleRecipients.length)];

    // Remove assigned person only (NOT the drawer)
    const newAvailable = availableRecipients.filter((r) => r !== randomRecipient);
    setAvailableRecipients(newAvailable);

    // Mark this user as having drawn
    const updatedMembers = members.map((m) =>
      m.name.toLowerCase() === user.name.toLowerCase()
        ? { ...m, hasDrawn: true }
        : m
    );

    setMembers(updatedMembers);
    setAssignedName(`${user.name}, you picked → ${randomRecipient}!`);
  };

  return (
    <div style={styles.container}>
      <h1>🎅 Secret Santa Draw</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={enteredName}
        onChange={(e) => setEnteredName(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleDraw} style={styles.button}>
        Draw
      </button>

      {assignedName && <p style={styles.result}>{assignedName}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "10px",
    background: "#F8F8FF",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "90%",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
    justifycontent:"cente"
  },
  button: {
    background: "#d62929",
    color: "white",
    padding: "10px 20px",
    fontSize: "18px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
    fontWeight: "bold",
    fontSize: "18px",
  },
};
