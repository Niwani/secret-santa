export default function PrivacyPolicyContent() {
    return (
      <div>
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
  
        <h2>1. Introduction</h2>
        <p>
          Secret Santa is a gift-exchange platform designed to help individuals,
          families, and organizations organize random gift exchanges easily.
          Your privacy is important to us.
        </p>
  
        <h2>2. Information We Collect</h2>
        <ul>
          <li>Account details (name, email)</li>
          <li>Event information you create</li>
          <li>Participant names (entered by you)</li>
        </ul>
  
        <h2>3. How We Use Your Information</h2>
        <p>
          We use your information solely to provide and improve the service,
          generate random assignments, and manage events.
        </p>
  
        <h2>4. Demo Mode</h2>
        <p>
          Events created in demo mode are not saved permanently and are deleted
          automatically.
        </p>
  
        <h2>5. Data Security</h2>
        <p>
          We implement industry-standard security practices to protect your data.
        </p>
  
        <h2>6. Third-Party Services</h2>
        <p>
          Authentication and data storage are handled via trusted third-party
          providers such as Firebase.
        </p>
  
        <h2>7. Your Rights</h2>
        <p>
          You may request deletion of your data by contacting us.
        </p>
  
        <h2>8. Updates</h2>
        <p>
          This policy may be updated periodically. Continued use of the platform
          indicates acceptance.
        </p>
  
        <h2>9. Contact</h2>
        <p>
          For questions, contact us at <strong>support@secretsanta.app</strong>
        </p>
      </div>
    );
  }
  