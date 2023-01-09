
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Modal,ModalHeader,ModalBody,ModalFooter } from 'reactstrap';
function App() {

  const[data, seData]=useState([]);
  const baseUrl = "https://localhost:44303/api/gestores"
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalBorrar, setModalBorrar] = useState(false);

  const [gestorSelected, setGestorSelected] = useState({
    id:'',
    name:'',
    releaseDate:'',
    developer:''
  });

  const handleChange=e=>{
    const {name,value}=e.target;
    setGestorSelected({
      ...gestorSelected,
      [name]: value
    });
  }

const seleccionarGestor=(gestor,caso)=>{
  setGestorSelected(gestor);
  (caso==="Edit")?
  OpenCloseModalEdit():OpenCloseModalDelete();
}
  // Metodos para abrir y cerrar los modales.
 const OpenCloseModalInsert=()=>{
  setModalInsertar(!modalInsertar);
 }

 const OpenCloseModalEdit=()=>{
  setModalEditar(!modalEditar);
 }
 const OpenCloseModalDelete=()=>{
  setModalBorrar(!modalBorrar);
 }

   //Endpoints
  // Get endpoint
  const Get = async() => {
    await axios.get(baseUrl)
    .then(response=>{
      seData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }
  //Post endpoint
  const Post = async() => {
    delete gestorSelected.id;
    gestorSelected.releaseDate = parseInt(gestorSelected.releaseDate);
    await axios.post(baseUrl, gestorSelected)
    .then(response=>{
      seData(data.concat(response.data));
      OpenCloseModalInsert();
    }).catch(error=>{
      console.log(error);
    })
  }
 //Put endpoint
  const Put = async() => {
    gestorSelected.releaseDate = parseInt(gestorSelected.releaseDate);
    await axios.put(baseUrl+"/"+gestorSelected.id, gestorSelected)
    .then(response=>{
      var respuesta = response.data;
      var dataAux = data;
      dataAux.map(gestor=>{
        if(gestor.id===gestorSelected.id)
        {
          gestor.id = respuesta.id;
          gestor.name = respuesta.name;
          gestor.releaseDate = respuesta.releaseDate;
          gestor.developer = respuesta.developer;
        }
      })
      OpenCloseModalEdit();
    }).catch(error=>{
      console.log(error);
    })
  }

   //Delete endpoint
  const Delete = async() => {
    await axios.delete(baseUrl+"/"+gestorSelected.id, gestorSelected)
    .then(response=>{
     seData(data.filter(gestor=>gestor.id!==response.data));
     OpenCloseModalDelete();
    }).catch(error=>{
      console.log(error);
    })
  }

 useEffect(()=>{
  Get();
 },[])

  return (
    <div className="App">
      <div>
        <h1>
          Gestores de bases de datos.
        </h1>
        <br/>
        <button className='btn btn-success' onClick={()=>OpenCloseModalInsert()}>Create new</button>
        <hr/>
      </div>
      <table className='table table-hover'>
        <thead>
          <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Release Date</th>
          <th>Developer</th>
          <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(gestor=>(
            <tr key={gestor.id}>
              <td>{gestor.id}</td>
              <td>{gestor.name}</td>
              <td>{gestor.releaseDate}</td>
              <td>{gestor.developer}</td>
              <td>
                <button  className='btn btn-primary' onClick={()=>seleccionarGestor(gestor,"Edit")}>Edit</button>{"|"}
                <button  className='btn btn-danger' onClick={()=>seleccionarGestor(gestor,"Delete")}>Delete</button>
              </td>
            </tr>
            ))}
        </tbody>
      </table>

      
      <Modal isOpen={modalInsertar}>
        <ModalHeader>
            Create new databases managers.
        </ModalHeader>
        <ModalBody>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Name" onChange={handleChange} name="name"></input>
                <br/>
                <input type="text" className="form-control" placeholder="Release Date" onChange={handleChange} name="releaseDate"></input>
                <br/>
                <input type="text" className="form-control" placeholder="Developer" onChange={handleChange} name="developer"></input>
                <br/>
            </div>
        </ModalBody>
        <ModalFooter>
            <button className="btn btn-primary" onClick={()=> Post()}>Save</button>
            <button className="btn btn-primary" onClick={()=> OpenCloseModalInsert()}>Cancel</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>
            Edit databases managers.
        </ModalHeader>
        <ModalBody>
            <div className="form-group">
                <input type="text" className="form-control" onChange={handleChange} name="name" value={gestorSelected && gestorSelected.name}></input>
                <br/>
                <input type="text" className="form-control" onChange={handleChange} name="releaseDate" value={gestorSelected && gestorSelected.releaseDate}></input>
                <br/>
                <input type="text" className="form-control" onChange={handleChange} name="developer" value={gestorSelected && gestorSelected.developer}></input>
                <br/>
            </div>
        </ModalBody>
        <ModalFooter>
            <button className="btn btn-primary" onClick={()=> Put()}>Save</button>
            <button className="btn btn-primary" onClick={()=> OpenCloseModalEdit()}>Cancel</button>
        </ModalFooter>
      </Modal>

     
      <Modal isOpen={modalBorrar}>
        <ModalBody>
        ¿Are you sure? Do you want to delete this {gestorSelected && gestorSelected.name}.
        </ModalBody>
        <ModalFooter>
            <button className="btn btn-danger" onClick={()=>Delete()}>Yes</button>
            <button className="btn btn-secondary" onClick={()=>OpenCloseModalDelete()}>No</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
