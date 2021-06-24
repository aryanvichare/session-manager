import React, { useState, useEffect } from "react";
import styles from "@/styles/Join.module.scss";

import Router, { useRouter } from "next/router";

const LOCALSTORAGE_NAME_KEY = "session-name-autofill";

const Join = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [autofillSuccess, setAutofillSuccess] = useState(false);

  const { sessionId } = router.query;

  useEffect(() => {
    const nameAutofill = localStorage.getItem(LOCALSTORAGE_NAME_KEY);

    if (nameAutofill) {
      setName(nameAutofill);
      setAutofillSuccess(true);
    }
  }, []);

  const createSession = (e) => {
    e.preventDefault();
    localStorage.setItem(LOCALSTORAGE_NAME_KEY, name);

    Router.push(`/session/${sessionId}`);
  };

  return (
    <div className={styles.screenLayout}>
      <div className={styles.container}>
        <div className={styles.card}>
          <form onSubmit={createSession} className={styles.form} action='#'>
            <h1 className={styles.header}>Join a Session</h1>
            <input
              required
              className={styles.input}
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter your name'
            />
            {autofillSuccess && (
              <p className={styles.autofillSuccess}>Suggested by auto-fill</p>
            )}
            <button type='submit' className={styles.joinButton}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;
