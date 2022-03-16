import styles from "./dashboard.module.css"; 

export default function projectViewItem(link, key) {

    return (
        <a className={styles.projectViewItem} href={link} key={key}>
            <p className={styles.testPic}>Picture</p>
            <p href="#">{link}</p>
        </a>
    )
}