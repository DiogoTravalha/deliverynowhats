import React from 'react';
import { GlobalContext } from '../../../GlobalContext';
import styles from './AdicionalItem.module.css';

const AdicionalItem = () => {
    const {
        openAdicional,
        setOpenAdicional,
        idAdicional,
        setAdicional,
        addAdicional,
        adicional,
        setAdicionalPrice,
        priceAdicional,
    } = React.useContext(GlobalContext);
    const [checked, setChecked] = React.useState(false);

    function closeAdicionalBox() {
        setOpenAdicional(!openAdicional);
    }

    function saveAdicional() {
        addAdicional(idAdicional);
        closeAdicionalBox();
    }

    function myFunction(item) {
        // Get the checkbox
        var checkBox = document.getElementById(item.name);
        // Get the output text
        var text = document.getElementById('text');

        if (checkBox.checked == true) {
            const array = adicional;
            array.push(item.name);
            setAdicional(array);

            const arrayprice = priceAdicional;
            arrayprice.push(item.price);
            setAdicionalPrice(arrayprice);
        } else {
            console.log('false', item.name);
        }

        // addAdicional(idAdicional);
        // closeAdicionalBox();
    }

    const checkList = [
        { name: 'Banana', price: 10 },
        { name: 'Melancia', price: 15 },
    ];

    return (
        <div className={styles.bgObs}>
            <div className={styles.areaObs}>
                <button className={styles.btnClose} onClick={closeAdicionalBox}>
                    x
                </button>
                <h3>Adicionar Adicionais</h3>
                <div>
                    {checkList.map((item, index) => (
                        <div key={index}>
                            <input
                                type="checkbox"
                                id={item.name}
                                onChange={() => myFunction(item)}
                            />
                            <p>
                                {item.name} - R${item.price}
                            </p>
                        </div>
                    ))}
                </div>

                <div className={styles.btnsObs}>
                    <button onClick={closeAdicionalBox}>Cancelar</button>
                    <button onClick={saveAdicional}>Salvar</button>
                </div>
            </div>
        </div>
    );
};

export default AdicionalItem;
