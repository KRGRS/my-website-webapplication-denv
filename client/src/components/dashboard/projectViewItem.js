import styles from "./dashboard.module.css"; 

export default function projectViewItem(link) {

    return (
        <a className={styles.projectViewItem} href={link}>
            <p className={styles.testPic}>Picture</p>
            <p href="#">Link</p>
        </a>
    )
}