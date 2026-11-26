import { useContext, useEffect } from 'react'
import { CardEntry, cardEntryKey } from '../api/pokemonTGC/model/PokemonCard'
import { LanguageContext, localizedName } from './language/LanguageProvider'

const siteTitle = 'pokeINV'

export const useDocumentTitle = (...parts: (string | undefined)[]) => {
  const title = [...parts.filter((part): part is string => part != undefined && part != ''), siteTitle].join(' · ')

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(
    () => () => {
      document.title = siteTitle
    },
    []
  )
}

export const useOpenCardName = (entries: CardEntry[] | undefined, openCardId: string | undefined): string | undefined => {
  const { germanNames } = useContext(LanguageContext)
  const openEntry = openCardId == undefined ? undefined : entries?.find((entry) => cardEntryKey(entry) == openCardId)
  return openEntry == undefined ? undefined : localizedName(openEntry.card, germanNames)
}
