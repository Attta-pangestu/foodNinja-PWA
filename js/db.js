import { citiesRef, recipeRef } from "./firebase-app.js";
import { renderDataRecipe, deleteEvent } from "./ui.js";
let DATA_RECIPE = [] ; 

const dbInit =  () =>  {
  _initialData() ;
  _updateDataEvent() ; 
} ;

const _initialData =  () =>  {
  _recipeDataRealtimeUpdate() ; 
  // DATA_RECIPE = await _recipeDataOnce() ;  
};

const _initialUI = () => {
  console.log('Memuat data dari initial UI | ini datanya ',DATA_RECIPE ) ; 
  renderDataRecipe(DATA_RECIPE) ; 
};

const _updateDataEvent = () => {
  deleteEvent() ; 
};

const _citiesData = () => {
  //get doc data from cities  collection 
  const docData = citiesRef.doc('SF') ;
  docData.get().then(doc => {
  console.log('Data doc firestore  : ', doc.data()) ; 
});
};

const _recipeDataReadOnce = async () => {
  let data = [] ; 
  // get collections of doc
  await recipeRef.get()
  .then(snapshot => {
    // return array data
    snapshot.forEach(doc => { 
      let docData = doc.data() ; 
      data.push({
        judul : docData.judul,
        bahan : docData.bahan,
        id : doc.id, 
      });
    }) ;
  }) ; 
  return data ; 
};

const _recipeDataRealtimeUpdate =  () => {
  // listen for change in database and update to DOM
  let data = [] ; 
  recipeRef.onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach( change => {
      if(change.type === 'added') {
        let docData = change.doc.data();
        data.push({
              judul : docData.judul,
              bahan : docData.bahan,
              id : change.doc.id,
        }); 
        console.log('Terjadi penambahan data', change.doc.data()); 
      }
      if(change.type === 'modified') {
        console.log('Terjadi modifikasi data', change.doc.data()); 
      }
      if(change.type === 'removed') {
        console.log('Terjadi penghapusan data', change.doc.data()); 
        
      }
    });
  
    /* 
    ================================
    SNAPSHOT ARE TRIGGER EACH CHANGES TO DATA
    ================================
    querySnapshot.forEach(snapshot => {
    let docData = snapshot.data();
    data.push({
      judul : docData.judul,
      bahan : docData.bahan,
      id : snapshot.id,
    }); 
  }); 
  */

  DATA_RECIPE = data;
  _initialUI() ; 
  });
};





document.addEventListener('DOMContentLoaded', dbInit) ; 
