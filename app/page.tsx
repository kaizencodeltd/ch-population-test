import styles from "./page.module.css";
import PopulationChart2 from "@/components/PopulationChart2/PopulationChart2";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* See notes in readme.md */}
        {/* <PopulationChart /> */}
        
        <PopulationChart2 />
      </main>
    </div>
  );
}