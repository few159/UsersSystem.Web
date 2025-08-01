import styles from './SimplePagination.module.scss'

interface IProps {
    currentPage: number
    prevBtnDisabled: boolean
    nextBtnDisabled: boolean
    handlePrevPage: () => void
    handleNextPage: () => void
}
export default function SimplePagination({ currentPage, prevBtnDisabled, nextBtnDisabled, handlePrevPage, handleNextPage }: IProps) {
    return (
        <div className={styles.pagination}>
            <button onClick={handlePrevPage} disabled={prevBtnDisabled}>
                Anterior
            </button>
            <span>Página {currentPage}</span>
            <button
                onClick={handleNextPage}
                disabled={nextBtnDisabled}
            >
                Próxima
            </button>
        </div>
    )
}