import React, { useState } from 'react';
import { Shuffle, Users, Gift, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import styles from "./DemoPage.module.css";
import NavBar from '../components/homepage/NavBar';
import Footer from '../components/homepage/Footer';


export default function Demo() {
  const [participants, setParticipants] = useState([]);
  const [newName, setNewName] = useState('');
  const [isDrawn, setIsDrawn] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const MAX_DEMO_PARTICIPANTS = 10;

  const addParticipant = () => {
    if (!newName.trim()) return;
    if (participants.length >= MAX_DEMO_PARTICIPANTS) {
      alert(`Demo is limited to ${MAX_DEMO_PARTICIPANTS} participants`);
      return;
    }
    setParticipants([...participants, { id: Date.now(), name: newName.trim() }]);
    setNewName('');
    setIsDrawn(false);
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
    setIsDrawn(false);
  };

  const drawNames = () => {
    if (participants.length < 3) {
      alert('You need at least 3 participants for Secret Santa!');
      return;
    }

    // Create a shuffled copy for assignments
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Create circular assignments (each person gives to the next)
    // Create circular assignments (each person gives to the next)
    const newAssignments = shuffled.map((person, index) => ({
      giver: person,
      receiver: shuffled[(index + 1) % shuffled.length]
    }));

    setAssignments(newAssignments);
    setIsDrawn(true);
    setSelectedPerson(null);
  };

  const viewAssignment = (person) => {
    setSelectedPerson(person);
  };

  const reset = () => {
    setParticipants([]);
    setIsDrawn(false);
    setAssignments([]);
    setSelectedPerson(null);
  };

  return (
    <div>
        <NavBar />
        <div className={styles.pageWrapper}>
        <div className={styles.container}>
            
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#dcfce7', color: '#15803d', padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: '500', marginBottom: '16px' }}>
                <Sparkles size={16} />
                Demo Mode - Nothing is saved
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                Try Secret Santa Demo
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#4b5563' }}>
                Test the magic with up to {MAX_DEMO_PARTICIPANTS} participants
            </p>
            </div>

            {/* Custom Alert */}
            <div className={styles.alert}>
            <AlertCircle size={20} color="#d97706" />
            <p style={{ color: '#92400e', margin: 0, fontSize: '14px' }}>
                This is a demo. For real events with unlimited participants, create a free account.
            </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* Add Participants Card */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                    <Users color="#dc2626" size={20} />
                    Add Participants ({participants.length}/{MAX_DEMO_PARTICIPANTS})
                </h3>
                </div>
                <div className={styles.cardContent}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <input
                    className={styles.input}
                    placeholder="Enter name..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                    disabled={participants.length >= MAX_DEMO_PARTICIPANTS}
                    />
                    <button className="btn-red" onClick={addParticipant} disabled={participants.length >= MAX_DEMO_PARTICIPANTS}>
                    Add
                    </button>
                </div>

                <div style={{ overflowY: 'auto', maxHeight: '256px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {participants.map((person) => (
                    <div key={person.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                        <span style={{ fontWeight: '500' }}>{person.name}</span>
                        <button onClick={() => removeParticipant(person.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                        <Trash2 size={16} color="#ef4444" />
                        </button>
                    </div>
                    ))}
                </div>

                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button className="btn-red-full" onClick={drawNames} disabled={participants.length < 3}>
                    <Shuffle size={16} style={{ marginRight: '8px' }} /> Draw Names
                    </button>
                    <button className="btn-outline-full" onClick={reset}>Reset Demo</button>
                </div>
                </div>
            </div>

            {/* View Assignments Card */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                    <Gift color="#16a34a" size={20} />
                    Secret Assignments
                </h3>
                </div>
                <div className={styles.cardContent}>
                {!isDrawn ? (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <Shuffle size={64} color="#e5e7eb" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: '#6b7280' }}>Add at least 3 people to see assignments</p>
                    </div>
                ) : (
                    <>
                    <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
                        Click a name to reveal their match:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {participants.map((person) => (
                        <button key={person.id} className="btn-outline-full" onClick={() => viewAssignment(person)} style={{ textAlign: 'left' }}>
                            {person.name}
                        </button>
                        ))}
                    </div>

                    {selectedPerson && (
                        <div className={styles.assignmentResult}>
                        <p style={{ margin: 0, color: '#374151' }}><strong>{selectedPerson.name}</strong> is giving to:</p>
                        <p className={styles.resultName}>
                            {assignments.find(a => a.giver.id === selectedPerson.id)?.receiver.name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>🤫 Keep it secret!</p>
                        </div>
                    )}
                    </>
                )}
                </div>
            </div>
            </div>
        </div>
        </div>
        <Footer />
    </div>
  );
}