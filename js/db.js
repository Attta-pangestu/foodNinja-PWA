let DATA_RECIPE = [] ; 

const dbInit =  () =>  {
  _enablePersistance() ; 
  _initialData() ;
  _updateDataEvent() ; 
} ;

const _initialData =  () =>  {
  _recipeDataRealtimeUpdate() ; 
  // DATA_RECIPE = await _recipeDataOnce() ;
  // _enablePersistance() ;   
};

const _enablePersistance = () => {
  db.enablePersistence().catch(err => {
    if (err.code == 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enable') ;
  } else if (err.code == 'unimplemented') {
      console.log('The current browser does not support all of the features required to enable persistence'); 
  }
  });
};

const _initialUI = () => {
  console.log('Memuat data dari initial UI | ini datanya ',DATA_RECIPE ) ; 
  renderDataRecipe(DATA_RECIPE) ; 
};

const _updateDataEvent = () => {
  addDataEvent() ; 
  deleteEventId() ; 
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
  recipeRef.onSnapshot( {includeMetadataChanges:true}, (querySnapshot) => {
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
        console.log('Terjadi penghapusan data id', change.doc.data()); 
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

const addDataEvent = () => {
  const formContainer = document.querySelector('.add-recipe');
  formContainer.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation(); 
    const recipeObject = {
      judul : formContainer.title.value,
      bahan : formContainer.ingredients.value,
    };
    // console.log('Menambahkan data : ', recipeObject) ; 
    recipeRef.doc().set(recipeObject).then( () => {
      console.log('Berhasil menambahkan data')
    }) ; 
  });
};

const deleteEventId = () =>{
  const recipeContainer = document.querySelector('.recipes') ;
  recipeContainer.addEventListener('click', event => {
      if(event.target.nodeName === 'I') {
          const recipeId = event.target.getAttribute('data-id') ; 
          recipeRef.doc(recipeId).delete()
          .then( () => {
            console.log("berhasil menghapus data");
            removeRecipeUI(recipeId); 
          }) ; 
        } 
  })
  
};




document.addEventListener('DOMContentLoaded', dbInit) ; 