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
  Icon,
  Body,
  Right,
  Button,
} from "native-base";
import { StyleSheet, TouchableHighlight } from "react-native";
import _ from "lodash";
import { fetchProductos, setOrden } from "../redux/actions";

export const Orders = () => {
  const productos = useSelector((state) => state.productos);
  const [cartProducts, setCartProdcuts] = useState([]);
  const [costo, setCosto] = useState([]);
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
  useEffect(() => {
    setCosto(
      Object.values(cartProducts).reduce(
        (t, { precio, count }) => t + +precio * count,
        0
      )
    );
  }, [cartProducts]);

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
                <Thumbnail circular source={{ uri: producto.imagen }} />
              </Left>
              <Body>
                <Text style={styles.titleText}>{producto.nombre}</Text>
                <Text style={styles.listText} note numberOfLines={12}>
                  {"\n"}
                  {`Tenemos ${producto.cantidad - producto.count} piezas`}
                  {"\n"}
                  {`El precio es de ${producto.precio}`}
                  {"\n"}
                  {producto.count > 0 && (
                    <>{`En el carrito hay ${producto.count}`}</>
                  )}
                  {"\n"}
                </Text>
              </Body>
              <Right>
                {producto.cantidad - producto.count > 0 && (
                  <>
                    <TouchableHighlight
                      onPress={() => handleAddToCart(producto)}
                    >
                      <Icon
                        type="MaterialIcons"
                        name="add-shopping-cart"
                        style={{
                          fontSize: 40,
                          color: "#08a045",
                          marginBottom: 15,
                        }}
                      />
                    </TouchableHighlight>
                  </>
                )}
                {producto.count > 0 && (
                  <TouchableHighlight
                    onPress={() => handleDeleteCart(producto)}
                  >
                    <Icon
                      type="MaterialCommunityIcons"
                      name="cart-remove"
                      style={{ fontSize: 40, color: "#d9455f" }}
                    />
                  </TouchableHighlight>
                )}
              </Right>
            </ListItem>
          ))}
        </List>
      </Content>
      {cartProducts && costo > 0 ? (
        <Button onPress={() => dispatch(setOrden(cartProducts))} full success>
          <Text style={styles.listText}>{`Cobrar $ ${costo}`}</Text>
        </Button>
      ) : (
        <Button disabled full success>
          <Text style={styles.listText}>Aún no tienes nada que cobrar </Text>
        </Button>
      )}
    </Container>
  );
};
const styles = StyleSheet.create({
  listText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
export default Orders;
