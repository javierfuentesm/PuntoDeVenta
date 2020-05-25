import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
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
import {Modal, StyleSheet, TouchableOpacity, View} from "react-native";
import {
    fetchOrdenes,
    fetchOrdenesRange,
    fetchOrdenesMiguel,
    fetchOrdenesRangeMiguel,
} from "../redux/actions";
import "moment/locale/es"; // without this line it didn't work
import DateRangePicker from "react-native-daterange-picker";
import moment from "moment/min/moment-with-locales";

moment.locale("en");

export const Historial = () => {
    const user = useSelector((state) => state.user);
    const ordenes = useSelector((state) => state.ordenes);
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [detail, setDetail] = useState();
    const [datePicker, setDatePicker] = useState({
        startDate: null,
        endDate: null,
        displayedDate: moment(),
    });
    const [totales, setTotales] = useState({
        ganancia: "",
        inversion: "",
    });

    const setDates = (dates) => {
        setDatePicker((prevState) => ({
            ...prevState,
            ...dates,
        }));
    };

    useEffect(() => {
        if (user === "mio") {
            dispatch(fetchOrdenes());
        } else {
            dispatch(fetchOrdenesMiguel());
        }
    }, [user]);

    useEffect(() => {
        if (ordenes.length > 0) {
            let ganancia = 0,
                inversion = 0;
            ordenes.forEach((orden) => {
                ganancia = ganancia + +orden.ganaciaTotalOrden;
                inversion = inversion + +orden.inversionTotal;
            });
            setTotales({ganancia, inversion});
        } else {
            setTotales({ganancia: 0, inversion: 0});
        }
    }, [ordenes]);

    useEffect(() => {
        if (datePicker.startDate && datePicker.endDate) {
            if (datePicker.startDate.isValid() && datePicker.endDate.isValid()) {
                if (user === "mio") {
                    dispatch(fetchOrdenesRange(datePicker.startDate, datePicker.endDate));
                } else {
                    dispatch(
                        fetchOrdenesRangeMiguel(datePicker.startDate, datePicker.endDate)
                    );
                }
            }
        }
    }, [datePicker]);

    const viewDetail = (product) => {
        setDetail(product);
        setModalVisible(true);
    };

    return (
        <Container>
            <DateRangePicker
                onChange={setDates}
                endDate={datePicker.endDate}
                startDate={datePicker.startDate}
                displayedDate={datePicker.displayedDate}
                range
            >
                <Text style={styles.buttonText}>Escoge el rango de fechas</Text>
            </DateRangePicker>
            <Button bordered primary>
                <Text>
                    {`${moment(datePicker.startDate)
                        .locale("es")
                        .format("LL")}  y ${moment(datePicker.endDate)
                        .locale("es")
                        .format("LL")}
            `}
                </Text>
            </Button>

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
                        <List>
                            {_.map(detail, (producto, key) => (
                                <ListItem thumbnail key={key}>
                                    <Left>
                                        <Thumbnail square source={{uri: producto.imagen}}/>
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
                        <TouchableOpacity
                            style={{...styles.openButton, backgroundColor: "rgba(229,0,0,0)"}}
                            onPress={() => {
                                setModalVisible(false);
                            }}
                        >
                            <Text style={styles.textStyle}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Content>
                <List>
                    {_.map(ordenes, (orden, key) => (
                        <ListItem thumbnail key={key}>
                            <Body>
                                <Text style={styles.titleText}>
                                    {moment(new Date(orden.fecha)).locale("es").format("LLLL")}
                                </Text>
                                <Text style={styles.listText} note numberOfLines={3}>
                                    {`Ganancia: $ ${orden.ganaciaTotalOrden} `}
                                    {"\n"}
                                    {`Inversión: $ ${orden.inversionTotal}`}
                                    {orden.descuento && (
                                        <>
                                            {"\n"}
                                            {`Descuento: $${orden.descuento}`}
                                        </>
                                    )}
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
            {user === "mio" ? (
                <Button disabled full success>
                    <Text style={styles.buttonText}>
                        {`Ganacia total : $${totales.ganancia}  Inversión total: $${totales.inversion}`}
                    </Text>
                </Button>
            ) : (
                <>
                    <Button disabled full primary>
                        <Text style={styles.buttonText}>
                            {`Ganacia Total : $${totales.ganancia}  `}
                            {`Inversión total: $${totales.inversion} `}
                        </Text>
                    </Button>
                    <Button disabled full warning>
                        <Text style={styles.buttonText}>
                            {`Ganacia Mia $${(totales.ganancia * 0.2).toFixed(2)} `}
                            {`Ganacia Miguel : $${(
                                totales.ganancia -
                                totales.ganancia * 0.2
                            ).toFixed(2)}`}
                        </Text>
                    </Button>
                    <Button disabled full success>
                        <Text style={styles.buttonText}>
                            {`Total de venta $${totales.ganancia + totales.inversion} `}
                            {`Total a recibir $${
                                (totales.ganancia * 0.2).toFixed(2) + totales.inversion
                            } `}
                        </Text>
                    </Button>
                </>
            )}
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
    subtitleText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    listText: {
        fontWeight: "bold",
        fontSize: 13,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 17,
    },
});
export default Historial;
