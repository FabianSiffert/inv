import { useMemo } from 'react'
import { useEurPerUsd } from '../../util/api/pokemonTGC/hooks'
import { CardEntry } from '../../util/api/pokemonTGC/model/PokemonCard'
import { printDisplayPrice } from '../../util/cardPrice'
import { formatPrice, toEur } from '../../util/format/price'
import { useStrings } from '../../util/ui/language/LanguageProvider'
import styles from './CardsValue.module.scss'

interface CardsValueProps {
  entries: CardEntry[]
  label: string
  meta?: { label: string; value: string }
}

export default function CardsValue({ entries, label, meta }: CardsValueProps) {
  const t = useStrings()
  const eurPerUsd = useEurPerUsd()
  const { total, pricedCount, convertedCount } = useMemo(() => {
    const prices = entries.flatMap((entry) => {
      const price = printDisplayPrice(entry.card, entry.print)
      return price == undefined ? [] : [price]
    })
    return {
      total: prices.reduce((sum, price) => sum + toEur(price.amount, price.currency, eurPerUsd), 0),
      pricedCount: prices.length,
      convertedCount: prices.filter((price) => price.currency == 'USD').length
    }
  }, [entries, eurPerUsd])
  const rate = formatPrice(eurPerUsd)

  if (pricedCount == 0) {
    return null
  }

  return (
    <div className={styles.value}>
      {meta != undefined && (
        <span className={styles.meta}>
          <span className={styles.label}>{meta.label}</span>
          <span className={styles.pill}>{meta.value}</span>
        </span>
      )}
      <span className={styles.label}>{label}</span>
      <span className={styles.amount}>{formatPrice(total)}</span>
      {pricedCount < entries.length && <span className={styles.coverage}>{t.pricedOf(pricedCount, entries.length)}</span>}
      {convertedCount > 0 && (
        <span className={styles.coverage} title={rate && t.usdConversionRate(rate)}>
          {t.convertedFromUsd(convertedCount)}
        </span>
      )}
    </div>
  )
}
