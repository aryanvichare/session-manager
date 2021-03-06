import Head from "next/head";
import Router from "next/Router";
import styles from "../styles/Home.module.scss";

import { v4 as uuidv4 } from "uuid";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.header}>Session Manager</h1>
        <button
          onClick={() => Router.push(`/join/${uuidv4()}`)}
          className={styles.startButton}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
