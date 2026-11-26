import { useContext, useState } from 'react'
import { PokemonCard } from '../../util/api/pokemonTGC/model/PokemonCard'
import { FavoritesContext } from '../../util/ui/favorites/FavoritesProvider'
import { useStrings } from '../../util/ui/language/LanguageProvider'
import RemoveFavoriteDialog from '../RemoveFavoriteDialog/RemoveFavoriteDialog'
import styles from './FavoriteButton.module.scss'

interface FavoriteButtonProps {
  card: PokemonCard
  print?: string
  small?: boolean
  showPrint?: boolean
}

export function FavoriteButton({ card, print, small = false, showPrint = false }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext)
  const isFavorited = isFavorite(card.id, print)
  const [isConfirmingRemoval, setConfirmingRemoval] = useState(false)
  const t = useStrings()
  const label = isFavorited ? t.removeFromFavorites(print) : t.addToFavorites(print)
  const classNames = [
    styles.favoriteButton,
    isFavorited ? styles.favorited : '',
    small ? styles.small : '',
    showPrint ? styles.labeled : ''
  ]

  return (
    <>
      <button
        type='button'
        className={classNames.join(' ')}
        aria-label={label}
        aria-pressed={isFavorited}
        title={label}
        onClick={(event) => {
          event.stopPropagation()
          if (isFavorited) {
            setConfirmingRemoval(true)
            return
          }
          toggleFavorite(card, print)
        }}
      >
        <StarIcon filled={isFavorited} />
        {showPrint && print != undefined && <span className={styles.printLabel}>{print}</span>}
      </button>
      {isConfirmingRemoval && (
        <RemoveFavoriteDialog
          card={card}
          print={print}
          onDismiss={() => setConfirmingRemoval(false)}
          onConfirm={() => {
            setConfirmingRemoval(false)
            if (isFavorite(card.id, print)) {
              toggleFavorite(card, print)
            }
          }}
        />
      )}
    </>
  )
}

const starRows: [y: number, x: number, width: number][] = [
  [1, 7, 2],
  [2, 7, 2],
  [3, 6, 4],
  [4, 6, 4],
  [5, 1, 14],
  [6, 2, 12],
  [7, 3, 10],
  [8, 4, 8],
  [9, 4, 8],
  [10, 3, 10],
  [11, 3, 4],
  [11, 9, 4],
  [12, 2, 4],
  [12, 10, 4],
  [13, 2, 3],
  [13, 11, 3]
]

export function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg viewBox='0 0 16 16' shapeRendering='crispEdges' aria-hidden='true' focusable='false'>
      {starRows.map(([y, x, width]) => (
        <rect key={`${y}-${x}`} x={x} y={y} width={width} height='1' fill={filled ? '#F5C518' : 'currentColor'} />
      ))}
    </svg>
  )
}
