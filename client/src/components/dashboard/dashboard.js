import React from "react";
import styles from './dashboard.module.css';
import projectViewItem from "./projectViewItem";

export default function Dashboard() {

    let arr = [0, 0, 0, 0, 0, 0, 0]

    return (<div className={styles.fillout}>
        <div className={"row " + styles.projectsdiv}>
            <div className="col-2"><h1 className={styles.header}> Dashboard</h1></div>
            <div className="col-8">

            </div>
            <div className="col-2"></div>
        </div>
        <div className={styles.wrapper}>
            <div className={styles.recDiv}>
                <h1 className={styles.projectViewHeader}>Recently Used Project:</h1>
                <div className={styles.projectView}>
                    {arr.map((item) => projectViewItem())}
                </div>
            </div>
            <div className={styles.projects}>
                <h1 className={styles.projectViewHeader}>Your Projects: </h1>
                <button className={styles.newProjectButton}>
                    <span>+</span><b>Create New Project</b>
                </button>
                <div className={styles.projectView}></div>
            </div>
        </div>
    </div>
    );
}