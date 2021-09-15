import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './HomeNav.module.css'
import { GlobalContext } from '../../../GlobalContext'
import { ReactComponent as PizzaIcon } from '../../../Assets/pizza-icon.svg'
import { ReactComponent as BurguersIcon } from '../../../Assets/burguers-icon.svg'
import { ReactComponent as CombosIcon } from '../../../Assets/combos-icon.svg'
import { ReactComponent as DessertsIcon } from '../../../Assets/desserts-icon.svg'
import { ReactComponent as DrinksIcon } from '../../../Assets/drinks-icon.svg'

const HomeNav = () => {
  const { categoria, empresa } = React.useContext(GlobalContext)

  return (
    <div>
      {empresa.map((item) => (
        <div className={styles.Header}>
          <img className={styles.logo} src={item.img} />
          <div className={styles.funcionamento}>
            <div>Funcionamento</div>
            <div
              className={item.status == false ? styles.statusf : styles.statusv}
            >
              {item.status == false ? 'Fechado' : 'Aberto'}
            </div>
          </div>
        </div>
      ))}
      <nav className={styles.nav}>
        {categoria.map((product) => (
          <NavLink to={product.name} key={product.id}>
            {product.name == 'Burguers' ? (
              <BurguersIcon />
            ) : product.name == 'Pizzas' ? (
              <PizzaIcon />
            ) : product.name == 'Bebidas' ? (
              <DrinksIcon />
            ) : (
              <CombosIcon />
            )}
            {product.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default HomeNav
