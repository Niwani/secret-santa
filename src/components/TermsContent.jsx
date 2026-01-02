import React from "react";
import styles from "./Legal.module.css";

export default function TermsContent() {
  return (
    <div className={styles.content}>
      <h1>Terms and Conditions</h1>
      <p className={styles.updated}>Last updated: June 10, 2025</p>

      <section>
        <p>
          Welcome to <strong>Secret Santa</strong>. By accessing or using this
          application, you agree to be bound by these Terms and Conditions.
        </p>
      </section>

      <section>
        <h2>1. Eligibility</h2>
        <p>You must be at least 13 years old to use this application.</p>
      </section>

      <section>
        <h2>2. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your
          account and all activities under it.
        </p>
      </section>

      <section>
        <h2>3. Use of the Service</h2>
        <p>
          You agree not to misuse the platform or attempt unauthorized access.
        </p>
      </section>

      <section>
        <h2>4. Events and Gift Exchanges</h2>
        <p>
          We only facilitate gift exchanges and are not responsible for gift
          quality, delivery, or participant behavior.
        </p>
      </section>

      <section>
        <h2>5. Limitation of Liability</h2>
        <p>
          Secret Santa shall not be liable for any damages arising from your use
          of the service.
        </p>
      </section>

      <section>
        <h2>6. Contact</h2>
        <p>
          Contact us at{" "}
          <a href="mailto:eniolaadio60@gmail.com">
            eniolaadio60@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
