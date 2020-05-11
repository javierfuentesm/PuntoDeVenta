import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductos,
  setProducto,
  updateProducto,
  deleteProducto,
} from "../redux/actions";
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableHighlight,
  Image,
  View,
} from "react-native";

import {
  Container,
  Form,
  Item,
  Input,
  Content,
  Card,
  CardItem,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Label,
  Right,
} from "native-base";
import _ from "lodash";

const Home = () => {
  const productos = useSelector((state) => state.productos);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    nombre: "",
    costo: "",
    imagen: "",
    precio: "",
  });

  useEffect(() => {
    dispatch(fetchProductos());
  }, []);

  return (
    <Container>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Form>
              <Item floatingLabel>
                <Label>Nombre del producto</Label>
                <Input
                  name="nombre"
                  value={form.nombre}
                  onChangeText={(value) => setForm({ ...form, nombre: value })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Costo</Label>
                <Input
                  name="costo"
                  value={form.costo}
                  onChangeText={(value) => setForm({ ...form, costo: value })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Precio</Label>
                <Input
                  name="precio"
                  value={form.precio}
                  onChangeText={(value) => setForm({ ...form, precio: value })}
                />
              </Item>
              <Item floatingLabel last>
                <Label>Imagen</Label>
                <Input
                  name="imagen"
                  value={form.imagen}
                  onChangeText={(value) => setForm({ ...form, imagen: value })}
                />
              </Item>
              <Text>
                {"\n"}
                {"\n"}
                {"\n"}
              </Text>
            </Form>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                form.id
                  ? dispatch(updateProducto(form.id, form))
                  : dispatch(setProducto(form));

                setModalVisible(!modalVisible);
                setForm({
                  nombre: "",
                  costo: "",
                  imagen: "",
                  precio: "",
                });
              }}
            >
              <Text style={styles.textStyle}>
                {form.id ? "Guardar" : "Crear"}
              </Text>
            </TouchableHighlight>
            <Text>{"\n"}</Text>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#E50000" }}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Cerrar</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <Button
        onPress={() => {
          setModalVisible(true);
        }}
        block
      >
        <Text>Añadir Producto</Text>
      </Button>

      <Content>
        {_.map(productos, (producto, key) => (
          <Card style={{ flex: 0 }} key={key}>
            <CardItem>
              <Left>
                <Body>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {producto.nombre}
                  </Text>
                </Body>
              </Left>
              <Right>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    setForm(producto);
                    setModalVisible(true);
                  }}
                >
                  <Icon
                    type="AntDesign"
                    name="edit"
                    style={{ fontSize: 25, color: "black" }}
                  />
                </TouchableHighlight>
                <Text>{"\n"}</Text>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#E50000" }}
                  onPress={() => {
                    dispatch(deleteProducto(producto.id));
                  }}
                >
                  <Icon
                    type="Entypo"
                    name="cross"
                    style={{ fontSize: 25, color: "black" }}
                  />
                </TouchableHighlight>
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Image
                  source={{ uri: producto.imagen }}
                  style={{ height: 200, width: 200, flex: 1 }}
                />
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Icon
                  type="MaterialIcons"
                  name="storage"
                  style={{ fontSize: 25, color: "blue" }}
                />
                <Text>Cantidad :{producto.cantidad}</Text>
              </Left>
              <Left>
                <Icon
                  type="FontAwesome"
                  name="money"
                  style={{ fontSize: 25, color: "green" }}
                />
                <Text>Precio: {producto.precio}</Text>
              </Left>
              <Left>
                <Icon
                  type="MaterialIcons"
                  name="attach-money"
                  style={{ fontSize: 25, color: "green" }}
                />
                <Text>Ganancia: {producto.precio - producto.costo}</Text>
              </Left>
            </CardItem>
          </Card>
        ))}
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    /*     justifyContent: "center",
    alignItems: "center", */
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
  openButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Home;
