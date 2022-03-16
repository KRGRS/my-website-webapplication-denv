import React, { useEffect, useState } from "react";
import styles from './dashboard.module.css';
import projectViewItem from "./projectViewItem";
import { postAPIProjectsCall } from "../../services/api";

export default function Dashboard() {

    const [projects, setProjects] = useState();

    const getProjects = async () => {
        setProjects([await postAPIProjectsCall("http://localhost:5000/getUserFiles", JSON.stringify({
            token: localStorage.getItem('token')
        })
        )
        ].map((item) => {
            return item.replace(/\["(.*).txt"]/i, '$1'); 
        }) )
    }

    useEffect(() => {
        getProjects(); 
    }, [])

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
                    {projects !== undefined ? projects.map((item, ind) => {
                        return projectViewItem(item, ind);
                    }) : <p>There are no projects to show</p>}


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