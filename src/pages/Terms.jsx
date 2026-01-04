import React from "react";
import { Link } from "react-router-dom";
import styles from "./Legal.module.css";

export default function Terms() {
  return (
    <div className={styles.container}>
      {/* Top Left Back Button */}
      <div className={styles.topBack}>
        <Link to="/" className={styles.backLink}>← Back to Home</Link>
      </div>

      <h1>Terms and Conditions</h1>
      <p className={styles.updated}>Last updated: June 10, 2025</p>

      <section>
        <p>
          Welcome to <strong>Gifterly</strong>. By accessing or using this
          application, you agree to be bound by these Terms and Conditions. If
          you do not agree to these terms, please do not use the service.
        </p>
      </section>

      <section>
        <h2>1. Eligibility</h2>
        <p>
          You must be at least 13 years old to use this application. By using
          the service, you confirm that you meet this age requirement.
        </p>
      </section>

      <section>
        <h2>2. User Accounts</h2>
        <p>
          When you create an account, you agree to provide accurate and
          up-to-date information. You are responsible for maintaining the
          confidentiality of your login credentials and for all activities
          that occur under your account.
        </p>
      </section>

      <section>
        <h2>3. Use of the Service</h2>
        <p>
          You agree to use the application only for lawful purposes. You must
          not misuse the platform, attempt unauthorized access, disrupt
          services, or use the app in a way that could harm other users.
        </p>
      </section>

      <section>
        <h2>4. Events and Gift Exchanges</h2>
        <p>
          Gifterly provides tools to help users organize and manage gift
          exchange events. We do not guarantee gift quality, gift delivery, or
          participant behavior. All exchanges are conducted at users’ own
          discretion and risk.
        </p>
      </section>

      <section>
        <h2>5. Payments</h2>
        <p>
          If paid features are offered, all pricing will be clearly displayed
          before purchase. Payments are non-refundable unless otherwise
          stated. We reserve the right to change pricing at any time.
        </p>
      </section>

      <section>
        <h2>6. Intellectual Property</h2>
        <p>
          All content, features, branding, and functionality within the
          application are the exclusive property of Gifterly. You may not
          copy, modify, distribute, or resell any part of the service without
          written permission.
        </p>
      </section>

      <section>
        <h2>7. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account if you
          violate these Terms or misuse the service. Termination may occur
          without prior notice.
        </p>
      </section>

      <section>
        <h2>8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Gifterly shall not be
          liable for any indirect, incidental, or consequential damages
          resulting from your use of the service, including disputes between
          users.
        </p>
      </section>

      <section>
        <h2>9. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the
          application after changes are posted means you accept the updated
          Terms.
        </p>
      </section>

      <section>
        <h2>10. Contact Information</h2>
        <p>
          If you have questions about these Terms, please contact us at{" "}
          <a href="mailto:support@giftex.com">
            support@giftex.com
          </a>.
        </p>
      </section>

      {/* Bottom Right Back Button */}
      <div className={styles.bottomBack}>
        <Link to="/" className={styles.backLink}>Back to Home →</Link>
      </div>
    </div>
  );
}
