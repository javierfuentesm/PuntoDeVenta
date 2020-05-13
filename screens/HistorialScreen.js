import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
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
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { fetchOrdenes } from "../redux/actions";
import 'moment/locale/es'  // without this line it didn't work


export const Historial = () => {
  const ordenes = useSelector((state) => state.ordenes);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(() => {
    dispatch(fetchOrdenes());
  }, []);

  const viewDetail = (product) => {
    setDetail(product);
    setModalVisible(true);
  };

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
            <List>
              {_.map(detail, (producto, key) => (
                <ListItem thumbnail key={key}>
                  <Left>
                    <Thumbnail square source={{ uri: producto.imagen }} />
                  </Left>
                  <Body>
                    <Text style={styles.titleText}>{producto.nombre}</Text>
                    <Text note numberOfLines={5}>
                      {`Vendiste ${producto.count} piezas a un precio de ${producto.precio}`}
                      {"\n"}
                      {`Tuviste una ganacia en total de ${producto.gananciaTotalProducto}`}
                    </Text>
                  </Body>
                </ListItem>
              ))}
            </List>
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

      <Content>
        <List>
          {_.map(ordenes, (orden, key) => (
            <ListItem thumbnail key={key}>
              <Body>
                <Text style={styles.titleText}>{(moment(new Date(orden.fecha)).locale('es').format('LLLL'))}</Text>
                <Text style={styles.listText}  note numberOfLines={2}>
                  {`Tuviste una ganacia total de  ${orden.ganaciaTotalOrden} `}
                  {"\n"}
                  {`Invertiste ${orden.inversionTotal}`}
                </Text>
              </Body>
              <Right>
                <Button onPress={() => viewDetail(orden.orden)} transparent>
                  <Text>Ver Detalles</Text>
                </Button>
              </Right>
            </ListItem>
          ))}
        </List>
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
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listText: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
export default Historial;
