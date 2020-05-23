import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Content,
  List,
  ListItem,
  Thumbnail,
  Label,
  Input,
  Text,
  Left,
  Icon,
  Body,
  Item,
  Right,
  Form,
  Button,
} from "native-base";
import { StyleSheet, View, Modal, TouchableOpacity } from "react-native";
import _ from "lodash";
import {
  fetchProductos,
  setOrden,
  fetchProductosMiguel,
  setOrdenMiguel,
} from "../redux/actions";

export const Orders = () => {
  const productos = useSelector((state) => state.productos);
  const [cartProducts, setCartProdcuts] = useState([]);
  const [costo, setCosto] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user === "mio") {
      dispatch(fetchProductos());
    } else {
      dispatch(fetchProductosMiguel());
    }
  }, [user]);
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Form>
              <Item floatingLabel>
                <Label>Ingresa el Monto del descuento</Label>
                <Input
                  name="precio"
                  value={descuento.toString()}
                  style={{marginBottom:30,...styles.price,fontSize:27 }}

                  onChangeText={(value) => setDescuento(value)}
                />
              </Item>
            </Form>

            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#E50000" }}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.textStyle2}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        <Text style={styles.price}>
          <Text style={styles.signo}>{`$`}</Text>
          {`${costo}`}
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.textStyle}>Haz un descuento</Text>
        </TouchableOpacity>
      </View>
      <Content>
        <List>
          {_.map(cartProducts, (producto, key) => (
            <ListItem thumbnail key={key}>
              <Left>
                {producto.imagen !== "" ? (
                  <Thumbnail circular source={{ uri: producto.imagen }} />
                ) : (
                  <Thumbnail
                    circular
                    source={{
                      uri:
                        "https://www.cyberscriptsolutions.com/wp-content/uploads/2017/10/default_product_icon.png",
                    }}
                  />
                )}
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
                    <TouchableOpacity onPress={() => handleAddToCart(producto)}>
                      <Icon
                        type="MaterialIcons"
                        name="add-shopping-cart"
                        style={{
                          fontSize: 40,
                          color: "#08a045",
                          marginBottom: 15,
                        }}
                      />
                    </TouchableOpacity>
                  </>
                )}
                {producto.count > 0 && (
                  <TouchableOpacity onPress={() => handleDeleteCart(producto)}>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="cart-remove"
                      style={{ fontSize: 40, color: "#d9455f" }}
                    />
                  </TouchableOpacity>
                )}
              </Right>
            </ListItem>
          ))}
        </List>
      </Content>
      {cartProducts && costo > 0 ? (
        <Button
          onPress={() =>
            user === "mio"
              ? dispatch(setOrden(cartProducts))
              : dispatch(setOrdenMiguel(cartProducts))
          }
          full
          success
        >
          <Text style={styles.listText}>{`Cobrar $ ${costo}`}</Text>
        </Button>
      ) : (
        <Button disabled full success>
          <Text style={styles.buttonText}>Aún no tienes nada que cobrar </Text>
        </Button>
      )}
    </Container>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    /*   alignItems: "center", 
  

  */
    shadowOffset: {
      width: 1000,
      height: 100,
    },
    shadowColor: "#000",

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textStyle2: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  textStyle: {
    fontSize: 15,
    textAlign: "center",
    color: "#1787e1",
    marginBottom: 20,
  },
  price: {
    fontSize: 60,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  container: {
    backgroundColor: "#FAFAFA",
  },
  signo: {
    fontSize: 30,
    textAlignVertical: "top",
  },
  buttonText: {
    fontSize: 17,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  openButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
});
export default Orders;
