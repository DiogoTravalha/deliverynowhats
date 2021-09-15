import React from 'react';
import firebase from './Components/Firebase/firebase';
export const GlobalContext = React.createContext();

export const GlobalStorage = ({ children }) => {
    const [data, setData] = React.useState([]);
    const [listProducts, setListProducts] = React.useState([]);
    const [openCart, setOpenCart] = React.useState(false);
    const [openObs, setOpenObs] = React.useState(false);
    const [openAdicional, setOpenAdicional] = React.useState(false);
    const [obs, setObs] = React.useState(null);
    const [adicional, setAdicional] = React.useState([]);
    const [adicionalPrice, setAdicionalPrice] = React.useState([]);
    const [idObs, setIdObs] = React.useState(null);
    const [idAdicional, setIdAdicional] = React.useState(null);
    const [cart, setCart] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [user, setUser] = React.useState(null);
    const [typeBuy, setTypeBuy] = React.useState('');
    const [cep, setCep] = React.useState('');
    const [number, setNumber] = React.useState('');
    const [complement, setComplement] = React.useState('');
    const [typePayment, setTypePayment] = React.useState('');
    const [address, setAddress] = React.useState(null);
    const [order, setOrder] = React.useState('');
    const [categoria, setCategoria] = React.useState([]);
    const [idNum, setIdNum] = React.useState(0);
    const [empresa, setEmpresa] = React.useState([]);
    const [Loja, setLoja] = React.useState();

    function addCart(item) {
        item.id = idNum + 1;
        item.quantity = 1;
        item.currentPrice = item.price;
        item.isSelected = true;
        setCart((oldArray) => [...oldArray, item]);
    }

    // add note to cart item
    function addObs(id) {
        let indexItem = cart.map((e) => e.id).indexOf(id);
        let updatedCart = [...cart];
        updatedCart[indexItem].obs = obs;
        setCart(updatedCart);
    }

    function addAdicional(id) {
        let indexItem = cart.map((e) => e.id).indexOf(id);
        let updatedCart = [...cart];
        updatedCart[indexItem].adicional = adicional + ' ';
        updatedCart[indexItem].priceAdicional = adicionalPrice;

        setAdicional(updatedCart);

        console.log(cart);
    }

    function incrementItem(item) {
        let indexItem = cart.map((e) => e.id).indexOf(item.id);
        let updatedCart = [...cart];
        updatedCart[indexItem].quantity = updatedCart[indexItem].quantity + 1;
        updatedCart[indexItem].currentPrice =
            updatedCart[indexItem].currentPrice + updatedCart[indexItem].price;
        setCart(updatedCart);
    }

    function decrementItem(item) {
        let indexItem = cart.map((e) => e.id).indexOf(item.id);
        let updatedCart = [...cart];
        updatedCart[indexItem].quantity = updatedCart[indexItem].quantity - 1;
        updatedCart[indexItem].currentPrice =
            updatedCart[indexItem].currentPrice - updatedCart[indexItem].price;
        if (updatedCart[indexItem].quantity === 0) {
            updatedCart[indexItem].isSelected = false;
            updatedCart.splice(indexItem, 1);
            setCart(updatedCart);
        }
        setCart(updatedCart);
    }

    const getProducts = async (category) => {
        const firestoreRef = firebase
            .firestore()
            .collection('Loja')
            .doc(Loja)
            .collection('Produtos')
            .doc(category)
            .collection('Itens');
        const unsub = firestoreRef.onSnapshot(getCollection);
        return () => {
            unsub();
        };
    };

    const getEmpresas = (loja) => {
        firebase
            .firestore()
            .collection('Loja')
            .doc(loja)
            .collection('Empresa')
            .get()
            .then((querySnapshot) => {
                const array = [];
                querySnapshot.forEach((doc) => {
                    const { name, cel, img, status } = doc.data();
                    array.push({
                        id: doc.id,
                        name,
                        cel,
                        img,
                        status,
                    });
                    const novo = array.map((item) => ({
                        name: item.name,
                        cel: item.cel,
                        img: item.img,
                        status: item.status,
                    }));
                    setEmpresa(novo);
                });
            });

        firebase
            .firestore()
            .collection('Loja')
            .doc(loja)
            .collection('Produtos')
            .get()
            .then((querySnapshot) => {
                const array = [];
                querySnapshot.forEach((doc) => {
                    array.push({
                        name: doc.id,
                    });
                    const novo = array.map((item) => ({
                        name: item.name,
                    }));
                    setCategoria(novo);
                });
            });
        setLoja(loja);
        getProducts();
    };

    function getCollection(querySnapshot) {
        const array = [];
        querySnapshot.forEach((res) => {
            const { title, price, img, offer, description, id } = res.data();
            array.push({
                doc: res.id,
                id,
                title,
                price,
                description,
                img,
                offer,
            });
            const novo = array.map((item) => ({
                id: item.id,
                title: item.title,
                img: item.img,
                price: item.price,
                description: item.description,
                offer: item.offer,
            }));
            setData(novo);
        });
    }

    async function getCep(cep) {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const json = await response.json();
        setAddress({
            rua: json.logradouro,
            cidade: json.localidade,
            bairro: json.bairro,
            uf: json.uf,
            cep: json.cep,
        });
    }

    // wait for the CEP to be filled in with 8 digits to make the request
    React.useEffect(() => {
        if (cep.length >= 8) {
            getCep(cep);
        }
    }, [cep]);

    // watch the cart changes to calculate the total price.
    React.useEffect(() => {
        if (cart.length > 0) {
            const prices = cart.map((item) => item.currentPrice);
            setTotal(prices.reduce((a, b) => a + b));
            const numero = cart.length;
            setIdNum(numero + 1);
        }
    }, [cart]);

    // save the address in localStorage after finalizing the order
    React.useEffect(() => {
        if (typeBuy === 'delivery') {
            window.localStorage.setItem(
                'address',
                JSON.stringify(order.address)
            );
        }
    }, [order]);

    React.useEffect(() => {
        setListProducts(data);
    }, [data]);

    // loads product list and default localStorage address
    React.useEffect(() => {
        async function loadData() {
            // const response = await fetch(
            //   'https://my-json-server.typicode.com/danielmafra/api/Bebidas'
            // )
            // const json = await response.json()
            // setData(json)
            // getEmpresas()
        }
        loadData();
        const addressDefault = window.localStorage.getItem('address');
        if (
            addressDefault !== '' &&
            addressDefault !== null &&
            addressDefault !== undefined
        ) {
            setUser(JSON.parse(addressDefault));
        } else {
            setUser(null);
        }
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                getProducts,
                listProducts,
                categoria,
                addCart,
                cart,
                total,
                incrementItem,
                decrementItem,
                user,
                setUser,
                typeBuy,
                setTypeBuy,
                cep,
                setCep,
                number,
                setNumber,
                complement,
                setComplement,
                typePayment,
                setTypePayment,
                address,
                setAddress,
                order,
                setOrder,
                openCart,
                setOpenCart,
                openAdicional,
                setOpenAdicional,
                openObs,
                setOpenObs,
                idObs,
                setIdObs,
                adicional,
                idAdicional,
                setIdAdicional,
                obs,
                setObs,
                setAdicional,
                addAdicional,
                addObs,
                empresa,
                getEmpresas,
                setAdicionalPrice,
                adicionalPrice,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
