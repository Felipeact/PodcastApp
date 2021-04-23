import format from 'date-fns/format'
import enCA from 'date-fns/locale/en-CA'


import styles from './styles.module.scss'

export function Header(){
  const currentDate = format(new Date(), 'EEEEEEE, d MMMM',{
    locale: enCA,
  })

  return (
    <header className={styles.headerContainer}>
      <a href='/' style={{ cursor: 'pointer' }}>
        <img src="/logo.svg" alt="Podcastr"/>
      </a>

      <p>The best songs, you hear here! </p>

      <span>{currentDate}</span>
    </header>
  )
}