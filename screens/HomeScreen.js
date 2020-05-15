import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductos,
  setProducto,
  updateProducto,
  deleteProducto,
  fetchProductosMiguel,
  setProductoMiguel,
  updateProductoMiguel,
  deleteProductoMiguel,
  swithcAccount,
} from "../redux/actions";
import { Modal, StyleSheet, TouchableOpacity, Image, View } from "react-native";

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
  Spinner,
  Left,
  Body,
  Label,
  Right,
} from "native-base";
import _ from "lodash";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

const Home = () => {
  const productos = useSelector((state) => state.productos);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [account, setAccount] = useState(false);
  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  const _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setForm({ ...form, imagen: result.uri });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [form, setForm] = useState({
    nombre: "",
    costo: "",
    imagen: "",
    precio: "",
    cantidad: "",
  });

  const setProducto2 = (form) => {
    if (user === "mio") {
      dispatch(setProducto(form));
    } else {
      dispatch(setProductoMiguel(form));
    }
  };
  const updateProducto2 = (id, form) => {
    if (user === "mio") {
      dispatch(updateProducto(id, form));
    } else {
      dispatch(updateProductoMiguel(id, form));
    }
  };

  useEffect(() => {
    if (user === "mio") {
      dispatch(fetchProductos());
    } else {
      dispatch(fetchProductosMiguel());
    }
    getPermissionAsync();
  }, []);
  useEffect(() => {
    console.log(user);
    if (user === "mio") {
      dispatch(fetchProductos());
    } else {
      dispatch(fetchProductosMiguel());
    }
    getPermissionAsync();
  }, [user]);

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
              <Item floatingLabel>
                <Label>Cantidad</Label>
                <Input
                  name="cantidad"
                  value={form.cantidad}
                  onChangeText={(value) =>
                    setForm({ ...form, cantidad: value })
                  }
                />
              </Item>
              <Text>{"\n"}</Text>
              <Label>Imagen</Label>
              <Button onPress={_pickImage} style={{ marginBottom: 15 }}>
                <Text>Escoge Imagen</Text>
              </Button>

              {form.imagen !== "" && (
                <Image
                  source={{ uri: form.imagen }}
                  style={{
                    width: 100,
                    height: 100,
                    alignSelf: "center",
                    marginBottom: 10,
                  }}
                />
              )}
            </Form>

            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                form.id
                  ? dispatch(updateProducto2(form.id, form))
                  : dispatch(setProducto2(form));

                setModalVisible(!modalVisible);
                setForm({
                  nombre: "",
                  costo: "",
                  imagen: "",
                  precio: "",
                  cantidad: "",
                });
              }}
            >
              <Text style={styles.textStyle}>
                {form.id ? "Guardar" : "Crear"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#E50000" }}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={() => {
          dispatch(swithcAccount(account));
          setAccount(!account);
        }}
      >
        <Icon
          type="MaterialCommunityIcons"
          name="account-switch"
          style={{
            fontSize: 50,
            color: "#00a896",
            marginRight: 20,
          }}
        />
      </TouchableOpacity>

      <Button
        style={{
          backgroundColor: "#00a896",
          marginBottom: 10,
        }}
        onPress={() => {
          setModalVisible(true);
          setForm({
            nombre: "",
            costo: "",
            imagen: "",
            precio: "",
            cantidad: "",
          });
        }}
        block
      >
        <Text style={styles.buttonText}>Añadir Producto</Text>
      </Button>

      <Content>
        {productos.length > 0 ? (
          <>
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
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setForm(producto);
                          setModalVisible(true);
                        }}
                      >
                        <Icon
                          type="AntDesign"
                          name="edit"
                          style={{
                            fontSize: 35,
                            color: "#00a896",
                            marginRight: 20,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          user === "mio"
                            ? dispatch(deleteProducto(producto.id))
                            : dispatch(deleteProductoMiguel(producto.id));
                        }}
                      >
                        <Icon
                          type="Entypo"
                          name="cross"
                          style={{ fontSize: 35, color: "#d9455f" }}
                        />
                      </TouchableOpacity>
                    </View>
                  </Right>
                </CardItem>
                <CardItem>
                  <Body>
                    <Image
                      source={{ uri: producto.imagen }}
                      style={{
                        height: 300,
                        width: 300,
                        flex: 1,
                        alignSelf: "center",
                      }}
                    />
                  </Body>
                </CardItem>
                <CardItem>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <Left>
                      <Icon
                        type="MaterialIcons"
                        name="storage"
                        style={{ fontSize: 25, color: "#05668d" }}
                      />
                      <Text>{producto.cantidad}</Text>
                    </Left>
                    <Left>
                      <Icon
                        type="MaterialIcons"
                        name="attach-money"
                        style={{ fontSize: 25, color: "#00a896" }}
                      />
                      <Text>{producto.precio}</Text>
                    </Left>
                    <Left>
                      <Icon
                        type="FontAwesome"
                        name="money"
                        style={{ fontSize: 25, color: "#02c39a" }}
                      />
                      <Text>{producto.precio - producto.costo}</Text>
                    </Left>
                  </View>
                </CardItem>
              </Card>
            ))}
          </>
        ) : (
          <Spinner color="green" />
        )}
      </Content>
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
    marginBottom: 10,
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
  buttonText: {
    fontSize: 17,
  },
});

export default Home;
