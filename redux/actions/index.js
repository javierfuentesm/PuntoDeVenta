import { productosRef } from "../../utils/firebase";

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



export const updatePhoto = (file, idProducto, result) => async (dispatch) => {
  const refStorage = storageService.ref('producto').child(`${idProducto}.jpg`);
  const uploadTask = refStorage.put(file);
  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      result(progress);
    });
  uploadTask.then(() => {
    storageService.ref('producto').child(`${idProducto}.jpg`).getDownloadURL()
      .then((downloadURL) => {
        const fileURL = downloadURL;
        usersRef.child(idProducto).update({
          foto: fileURL,
        }).then(() => {
          usersRef
            .orderByKey()
            .equalTo(idProducto)
            .on('child_added', (snapshot) => {
              const user = snapshot.val();
              user.id = snapshot.key;
              dispatch({
                type: SET_USER,
                payload: user,
              });
            });
        });
      });
  });
};
