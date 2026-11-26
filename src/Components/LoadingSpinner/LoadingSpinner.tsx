import { useStrings } from '../../util/ui/language/LanguageProvider'
import styles from './LoadingSpinner.module.scss'

interface LoadingSpinnerProps {
  isActive: boolean
}

export function LoadingSpinner(props: LoadingSpinnerProps) {
  const t = useStrings()

  return (
    <div
      className={props.isActive ? `${styles.spinner} ${styles.active}` : styles.spinner}
      role='status'
      aria-label={props.isActive ? t.loading : undefined}
      aria-hidden={!props.isActive}
    >
      <div className={styles.ball}></div>
    </div>
  )
}
