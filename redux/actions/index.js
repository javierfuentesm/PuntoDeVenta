import { productosRef, storageService } from "../../utils/firebase";

const FETCH_PRODUCTOS = "FETCH_PRODUCTOS";

export const fetchProductos = () => async (dispatch) => {
  productosRef.onSnapshot(
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

export const setProducto = (data) => async (dispatch) => {
  productosRef.add(data).then((createdRecord) => {
    dispatch(updatePhoto(createdRecord.id, data));
  });
};
export const deleteProducto = (id) => () => {
  productosRef.doc(id).delete();
};

export const updateProducto = (id, data) => async (dispatch) => {
  const finalProduct = JSON.parse(JSON.stringify(data));
  delete finalProduct.id;
  productosRef
    .doc(id)
    .set(finalProduct)
    .then(dispatch(updatePhoto(id, finalProduct)));
};

export const updatePhoto = (id, producto) => async () => {
  const response = await fetch(producto.imagen);
  const blob = await response.blob();
  const refStorage = storageService.ref().child(`productos/${id}.jpg`);
  const uploadTask = refStorage.put(blob);
  uploadTask.on("state_changed", (snapshot) => {
    console.log(snapshot);
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
