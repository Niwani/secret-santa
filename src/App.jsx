import { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, get, set } from "firebase/database";

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
  "Itunu"
];

export default function App() {
  const [nameInput, setNameInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!nameInput.trim()) {
      alert("Please enter your name.");
      return;
    }

    const userName = nameInput.trim();

    if (!FAMILY_MEMBERS.includes(userName)) {
      alert("This name is not on the family list!");
      return;
    }

    setLoading(true);

    const assignedRef = ref(database, "secretSanta/assignedNames/" + userName);
    const takenRef = ref(database, "secretSanta/takenRecipients");

    const assignedSnap = await get(assignedRef);

    // 1️⃣ If the user already has an assigned name
    if (assignedSnap.exists()) {
      setResult(`You already picked: ${assignedSnap.val()}`);
      setLoading(false);
      return;
    }

    // 2️⃣ Get all taken recipients
    const takenSnap = await get(takenRef);
    const taken = takenSnap.exists() ? Object.keys(takenSnap.val()) : [];

    // 3️⃣ Build available pool
    const available = FAMILY_MEMBERS.filter(
      (p) => p !== userName && !taken.includes(p)
    );

    if (available.length === 0) {
      setResult("No more names available!");
      setLoading(false);
      return;
    }

    // 4️⃣ Pick a random recipient
    const randomRecipient =
      available[Math.floor(Math.random() * available.length)];

    // 5️⃣ Save to Firebase
    await set(ref(database, `secretSanta/assignedNames/${userName}`), randomRecipient);
    await set(ref(database, `secretSanta/takenRecipients/${randomRecipient}`), true);

    setResult(`Your Secret Santa is: ${randomRecipient}`);
    setLoading(false);
  };

  return (
    <div
    style={{
      backgroundImage: "url('/boxes.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center", // horizontal center
      alignItems: "flex-start", // keep near top
      paddingTop: "40px",
      paddingLeft: "10px",
      paddingRight: "10px"
    }}
  >
    <div
      style={{
        background: "rgba(0,0,0,0.5)",
        padding: "25px",
        borderRadius: "15px",
        width: "100%",
        maxWidth: "400px", 
        textAlign: "center",
        color: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        marginTop: "15px"
      }}
    >
      <h1
        style={{
          marginTop: 0,
          marginBottom: 20,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        🎅 Secret Santa Draw
      </h1>

      <input
        type="text"
        placeholder="Enter your name..."
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        style={{
          padding: "12px",
          width: "100%", // full width for mobile
          borderRadius: "8px",
          fontSize: "16px",
          boxSizing: "border-box",
          marginBottom: "20px",
          marginTop: "5px"
        }}
      />

      <button
        onClick={handleAssign}
        disabled={loading}
        style={{
          padding: "12px 0",
          width: "45%", // full width for mobile
          borderRadius: "8px",
          background: "#d32f2f",
          color: "white",
          border: "none",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "15px"
        }}
      >
        {loading ? "Assigning..." : "Get Secret Santa"}
      </button>

      <h2
        style={{
          marginTop: "10px",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold",
          wordBreak: "break-word"
        }}
      >
        {result}
      </h2>

      </div>
    </div>
  );
}
// export default function App() {
//   const [members, setMembers] = useState(
//     FAMILY_MEMBERS.map((name) => ({
//       name,
//       hasDrawn: false,
//     }))
//   );

//   const [availableRecipients, setAvailableRecipients] = useState([...FAMILY_MEMBERS]);

//   const [enteredName, setEnteredName] = useState("");
//   const [assignedName, setAssignedName] = useState("");

//   const handleDraw = () => {
//     const user = members.find(
//       (m) => m.name.toLowerCase() === enteredName.toLowerCase()
//     );

//     if (!user) {
//       setAssignedName("Name not found. Please enter a valid family member.");
//       setEnteredName('')
//       return;
//     }

//     if (user.hasDrawn) {
//       setAssignedName(`${user.name}, you have already drawn your Secret Santa!`);
//       return;
//     }

//     const possibleRecipients = availableRecipients.filter(
//       (r) => r.toLowerCase() !== user.name.toLowerCase()
//     );

//     if (possibleRecipients.length === 0) {
//       setAssignedName("No recipients available.");
//       return;
//     }

//     const randomRecipient =
//       possibleRecipients[Math.floor(Math.random() * possibleRecipients.length)];

//     // Remove assigned person only (NOT the drawer)
//     const newAvailable = availableRecipients.filter((r) => r !== randomRecipient);
//     setAvailableRecipients(newAvailable);

//     // Mark this user as having drawn
//     const updatedMembers = members.map((m) =>
//       m.name.toLowerCase() === user.name.toLowerCase()
//         ? { ...m, hasDrawn: true }
//         : m
//     );

//     setMembers(updatedMembers);
//     setAssignedName(`${user.name}, you picked → ${randomRecipient}!`);
//   };

//   return (
//     <div style={styles.container}>
//       <h1>🎅 Secret Santa Draw</h1>

//       <input
//         type="text"
//         placeholder="Enter your name"
//         value={enteredName}
//         onChange={(e) => setEnteredName(e.target.value)}
//         style={styles.input}
//       />

//       <button onClick={handleDraw} style={styles.button}>
//         Draw
//       </button>

//       {assignedName && <p style={styles.result}>{assignedName}</p>}
//     </div>
//   );
// }

// const styles = {
//   container: {
//     maxWidth: "400px",
//     margin: "50px auto",
//     padding: "20px",
//     borderRadius: "10px",
//     background: "#F8F8FF",
//     textAlign: "center",
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//   },
//   input: {
//     width: "90%",
//     padding: "10px",
//     fontSize: "16px",
//     marginBottom: "10px",
//     justifycontent:"cente"
//   },
//   button: {
//     background: "#d62929",
//     color: "white",
//     padding: "10px 20px",
//     fontSize: "18px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   result: {
//     marginTop: "20px",
//     fontWeight: "bold",
//     fontSize: "18px",
//   },
// };
