import {
  productosRef,
  ordenesRef,
  ordenesMiguelRef,
  productosMiguelRef,
  storageService,
} from "../../utils/firebase";
import _ from "lodash";

const FETCH_PRODUCTOS = "FETCH_PRODUCTOS";
const FETCH_ORDENES = "FETCH_ORDENES";
const SET_USER = "SET_USER";

export const fetchProductos = () => async (dispatch) => {
  productosRef.orderBy("nombre", "asc").onSnapshot(
    (docSnapshot) => {
      const productos = [];
      docSnapshot.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;
        productos.push(producto);
      });
      dispatch({
        type: FETCH_PRODUCTOS,
        payload: productos,
      });
    },
    (err) => {
      console.log(`Encountered error: ${err}`);
    }
  );
};
export const fetchProductosMiguel = () => async (dispatch) => {
  productosMiguelRef.orderBy("nombre", "asc").onSnapshot(
    (docSnapshot) => {
      const productos = [];
      docSnapshot.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;
        productos.push(producto);
      });
      dispatch({
        type: FETCH_PRODUCTOS,
        payload: productos,
      });
    },
    (err) => {
      console.log(`Encountered error: ${err}`);
    }
  );
};
export const fetchOrdenes = () => async (dispatch) => {
  ordenesRef.orderBy("fecha", "desc").onSnapshot(
    (docSnapshot) => {
      const ordenes = [];
      docSnapshot.forEach((doc) => {
        const orden = doc.data();
        orden.id = doc.id;
        ordenes.push(orden);
      });
      dispatch({
        type: FETCH_ORDENES,
        payload: ordenes,
      });
    },
    (err) => {
      console.log(`Encountered error: ${err}`);
    }
  );
};
export const fetchOrdenesMiguel = () => async (dispatch) => {
  ordenesMiguelRef.orderBy("fecha", "desc").onSnapshot(
    (docSnapshot) => {
      const ordenes = [];
      docSnapshot.forEach((doc) => {
        const orden = doc.data();
        orden.id = doc.id;
        ordenes.push(orden);
      });
      dispatch({
        type: FETCH_ORDENES,
        payload: ordenes,
      });
    },
    (err) => {
      console.log(`Encountered error: ${err}`);
    }
  );
};
export const swithcAccount = (myAccount) => async (dispatch) => {
  if (myAccount) {
    dispatch({
      type: SET_USER,
      payload: 'mio',
    });

  }else {
    dispatch({
      type: SET_USER,
      payload: 'miguel',
    });
  }

};

export const fetchOrdenesRange = (start, end) => async (dispatch) => {
  ordenesRef
    .where(
      "fecha",
      ">=",
      +start.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    )
    .where("fecha", "<=", +end)
    .orderBy("fecha", "desc")
    .onSnapshot(
      (docSnapshot) => {
        const ordenes = [];
        docSnapshot.forEach((doc) => {
          const orden = doc.data();
          orden.id = doc.id;
          ordenes.push(orden);
        });
        dispatch({
          type: FETCH_ORDENES,
          payload: ordenes,
        });
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
};
export const fetchOrdenesRangeMiguel = (start, end) => async (dispatch) => {
  ordenesMiguelRef
    .where(
      "fecha",
      ">=",
      +start.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    )
    .where("fecha", "<=", +end)
    .orderBy("fecha", "desc")
    .onSnapshot(
      (docSnapshot) => {
        const ordenes = [];
        docSnapshot.forEach((doc) => {
          const orden = doc.data();
          orden.id = doc.id;
          ordenes.push(orden);
        });
        dispatch({
          type: FETCH_ORDENES,
          payload: ordenes,
        });
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
};

export const setProducto = (data) => async (dispatch) => {
  productosRef.add(data).then((createdRecord) => {
    dispatch(updatePhoto(createdRecord.id, data));
  });
};
export const setProductoMiguel = (data) => async (dispatch) => {
  productosMiguelRef.add(data).then((createdRecord) => {
    dispatch(updatePhoto(createdRecord.id, data));
  });
};
export const deleteProducto = (id) => () => {
  productosRef.doc(id).delete();
};
export const deleteProductoMiguel = (id) => () => {
  productosMiguelRef.doc(id).delete();
};

export const updateProducto = (id, data) => async (dispatch) => {
  const finalProduct = JSON.parse(JSON.stringify(data));
  delete finalProduct.id;
  productosRef
    .doc(id)
    .set(finalProduct)
    .then(dispatch(updatePhoto(id, finalProduct)));
};
export const updateProductoMiguel = (id, data) => async (dispatch) => {
  const finalProduct = JSON.parse(JSON.stringify(data));
  delete finalProduct.id;
  productosMiguelRef
    .doc(id)
    .set(finalProduct)
    .then(dispatch(updatePhoto(id, finalProduct)));
};

export const updateProductoStorage = (id, numero) => async () => {
  productosRef.doc(id).update({ cantidad: numero });
};
export const updateProductoStorageMiguel = (id, numero) => async () => {
  productosMiguelRef.doc(id).update({ cantidad: numero });
};

export const updatePhoto = (id, producto) => async () => {
  const response = await fetch(producto.imagen);
  const blob = await response.blob();
  const refStorage = storageService.ref().child(`productos/${id}.jpg`);
  const uploadTask = refStorage.put(blob);
  uploadTask.on("state_changed", (snapshot) => {
    console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
  });
  uploadTask.then(() => {
    storageService
      .ref()
      .child(`productos/${id}.jpg`)
      .getDownloadURL()
      .then((downloadURL) => {
        productosRef.doc(id).set({ ...producto, imagen: downloadURL });
      });
  });
};

export const setOrden = (data) => async (dispatch) => {
  //Se limpian productos que no se compraron
  const orden = _.reject(data, (o) => o.count === 0);
  orden.forEach((producto) => {
    dispatch(
      updateProductoStorage(producto.id, +producto.cantidad - +producto.count)
    );
    producto.precioTotalProducto = +producto.precio * +producto.count;
    producto.costoTotalProducto = +producto.count * +producto.costo;
    producto.gananciaTotalProducto =
      producto.precioTotalProducto - producto.costoTotalProducto;
  });
  const ganaciaTotalOrden = Object.values(orden).reduce(
    (t, { gananciaTotalProducto }) => t + +gananciaTotalProducto,
    0
  );
  const inversionTotal = Object.values(orden).reduce(
    (t, { costoTotalProducto }) => t + +costoTotalProducto,
    0
  );
  ordenesRef.add({
    orden,
    fecha: Date.now(),
    ganaciaTotalOrden,
    inversionTotal,
  });
};
export const setOrdenMiguel = (data) => async (dispatch) => {
  //Se limpian productos que no se compraron
  const orden = _.reject(data, (o) => o.count === 0);
  orden.forEach((producto) => {
    dispatch(
      updateProductoStorageMiguel(producto.id, +producto.cantidad - +producto.count)
    );
    producto.precioTotalProducto = +producto.precio * +producto.count;
    producto.costoTotalProducto = +producto.count * +producto.costo;
    producto.gananciaTotalProducto =
      producto.precioTotalProducto - producto.costoTotalProducto;
  });
  const ganaciaTotalOrden = Object.values(orden).reduce(
    (t, { gananciaTotalProducto }) => t + +gananciaTotalProducto,
    0
  );
  const inversionTotal = Object.values(orden).reduce(
    (t, { costoTotalProducto }) => t + +costoTotalProducto,
    0
  );
  ordenesMiguelRef.add({
    orden,
    fecha: Date.now(),
    ganaciaTotalOrden,
    inversionTotal,
  });
};
