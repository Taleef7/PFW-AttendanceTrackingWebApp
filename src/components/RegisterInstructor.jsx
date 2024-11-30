// src/components/RegisterInstructor.jsx
import React, { useState } from 'react';
import { registerInstructor } from '../services/authService';
import { addInstructor } from '../services/instructorService';

const RegisterInstructor = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async () => {
    try {
      // Register the instructor in Firebase Authentication
      const user = await registerInstructor(email, password);

      // Add instructor details to Firestore
      await addInstructor({ email, name, uid: user.uid });

      alert('Instructor registered successfully');
    } catch (error) {
      console.error('Error registering instructor:', error);
    }
  };

  return (
    <div>
      <h2>Register Instructor</h2>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterInstructor;
