import styles from './loader.module.scss';

export default function Loader() {
    return (
        <div className={styles.loader}>
            <div className={styles.overlay}></div>
            <div className={styles.ldsellipsis}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}