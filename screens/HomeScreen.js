import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductos } from "../redux/actions";

import { Image } from "react-native";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from "native-base";
import _ from "lodash";

const Home = () => {
  const productos = useSelector((state) => state.productos);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductos());
  }, []);

  return (
    <Container>
      <Button block>
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

export default Home;
