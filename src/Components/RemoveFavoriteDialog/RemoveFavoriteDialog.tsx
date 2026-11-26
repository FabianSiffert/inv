import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { PokemonCard } from '../../util/api/pokemonTGC/model/PokemonCard'
import { useLocalizedName, useStrings } from '../../util/ui/language/LanguageProvider'
import { useModalBehaviour } from '../../util/ui/useModalBehaviour'
import { StarIcon } from '../FavoriteButton/FavoriteButton'
import styles from '../MergeFavoritesDialog/MergeFavoritesDialog.module.scss'

interface RemoveFavoriteDialogProps {
  card: PokemonCard
  print?: string
  onConfirm: () => void
  onDismiss: () => void
}

export default function RemoveFavoriteDialog(props: RemoveFavoriteDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useModalBehaviour(containerRef, props.onDismiss)
  const t = useStrings()
  const cardName = useLocalizedName(props.card)

  return createPortal(
    <div className={styles.wrapper} onClick={(event) => event.stopPropagation()}>
      <div className={styles.overlay} onClick={props.onDismiss} />
      <div className={styles.dialog} ref={containerRef} role='alertdialog' aria-modal='true' aria-labelledby='remove-favorite-title'>
        <div className={styles.titleRow}>
          <StarIcon />
          <h2 className={styles.headline} id='remove-favorite-title'>
            {t.removeFavoriteTitle}
          </h2>
        </div>
        <p className={styles.detail}>{t.removeFavoriteBody(cardName, props.print)}</p>
        <div className={styles.actions}>
          <button type='button' className={styles.secondaryButton} onClick={props.onDismiss}>
            {t.cancel}
          </button>
          <button type='button' className={styles.primaryButton} onClick={props.onConfirm}>
            {t.removeFavoriteConfirm}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
