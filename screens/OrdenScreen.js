import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
} from "native-base";
import _ from "lodash";
import { fetchProductos,setOrden } from "../redux/actions";

export const Orders = () => {
  const productos = useSelector((state) => state.productos);
  const [cartProducts, setCartProdcuts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProductos());
  }, []);
  useEffect(() => {
    if (productos.length) {
      const newProductos = [...productos];
      newProductos.forEach((producto) => {
        producto.count = 0;
      });
      setCartProdcuts(newProductos);
    }
  }, [productos]);

  const handleAddToCart = (product) => {
    const newProductos = [...cartProducts];
    newProductos.forEach((objeto) => {
      if (objeto.id === product.id) {
        objeto.count++;
      }
    });

    setCartProdcuts(newProductos);
  };
  const handleDeleteCart = (product) => {
    const newProductos = [...cartProducts];
    newProductos.forEach((objeto) => {
      if (objeto.id === product.id) {
        objeto.count > 0 ? objeto.count-- : 0;
      }
    });

    setCartProdcuts(newProductos);
  };

  return (
    <Container>
      <Content>
        <List>
          {_.map(cartProducts, (producto, key) => (
            <ListItem thumbnail key={key}>
              <Left>
                <Thumbnail square source={{ uri: producto.imagen }} />
              </Left>
              <Body>
                <Text>{producto.nombre}</Text>
                <Text note numberOfLines={3}>
                  {`Tenemos ${producto.cantidad - producto.count} piezas`}
                  {"\n"}
                  {`El precio es de ${producto.precio}`}
                  {"\n"}
                  {producto.count > 0 && (
                    <>{`En el carrito hay ${producto.count}`}</>
                  )}
                </Text>
              </Body>
              <Right>
                {producto.cantidad - producto.count > 0 && (
                  <>
                    <Button
                      onPress={() => handleAddToCart(producto)}
                      transparent
                    >
                      <Text>Añadir</Text>
                    </Button>
                  </>
                )}
                <Button onPress={() => handleDeleteCart(producto)} transparent>
                  <Text>Eliminar</Text>
                </Button>
              </Right>
            </ListItem>
          ))}
        </List>

      </Content>
        <Button onPress={() => dispatch(setOrden(cartProducts))} full success>
          <Text>
            Cobrar{" "}
            {cartProducts &&
              Object.values(cartProducts).reduce(
                (t, { precio, count }) => t + +precio * count,
                0
              )}
          </Text>
        </Button>
    </Container>
  );
};
export default Orders;
