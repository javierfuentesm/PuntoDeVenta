import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Header,
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
import { fetchProductos } from "../redux/actions";
import moment from "moment";

export const Orders = () => {
  const productos = useSelector((state) => state.productos);
  const [orden, setOrden] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProductos());
  }, []);
  const handleAddToCart = (product) => {
    const idunico = Date.now();
    const newproduct = { ...product, idunico };
    setOrden([...orden, newproduct]);
    console.log(orden);
  };

const result = [...orden.reduce( (mp, o) => {
  if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
  mp.get(o.id).count++;
  return mp;
}, new Map).values()];

  return (
    <Container>
      <Content>
        <List>
          {_.map(productos, (producto, key) => (
            <ListItem thumbnail key={key}>
              <Left>
                <Thumbnail square source={{ uri: producto.imagen }} />
              </Left>
              <Body>
                <Text>{producto.nombre}</Text>
                <Text note numberOfLines={3}>
                  {`Tenemos ${producto.cantidad} piezas`}
                  {"\n"}
                  {`El precio es de ${producto.precio}`}
                  {"\n"}
                  {`El el carrito hay  ${  _.map(result, (o) =>{ 
                  if(o.id===producto.id)
                  return o.count; 
                  })}`}
               
                </Text>
              </Body>
              <Right>
                <Button onPress={() => handleAddToCart(producto)} transparent>
                  <Text>Añadir</Text>
                </Button>
              </Right>
            </ListItem>
          ))}
        </List>

        <Button full success>
          <Text>
            Cobrar {orden &&
              Object.values(orden).reduce((t, { precio }) => t + +precio, 0)}
          </Text>
        </Button>
      </Content>
    </Container>
  );
};
export default Orders;
