import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [properties,setProperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = { 
      name,
      parentCategory,
      properties:properties.map(p => ({
        name:p.name,
        value:p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", { ...data });
    }
    setName("");
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }



  function editCategory(Category) {
    setEditedCategory(Category);
    setName(Category.name);
    setParentCategory(Category.parent?._id);
    setProperties(Category.properties);
  }

  function deleteCategory(Category) {
    swal.fire({
      title: 'Estas seguro?',
      text: `Quieres borrar ${Category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Eliminar',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
        if (result.isConfirmed){
            const {_id} = Category;
            await axios.delete('/api/categories?_id='+_id);  
            fetchCategories();
        }
    });
  }

  function addProperty(){
    setProperties(prev => {
      return [...prev, {name:'',values:''}];
    });
  } 

  function handlePropertyNameChange(index,property,newName){
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  } 

  function handlePropertyValueChange(index,property,newValues){
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  } 


  function removeProperty (indexToRemove){
    setProperties(prev =>{
      return [...prev].filter((p,pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>Categorias</h1>
      <label>
        {editedCategory
          ? `Editar la Categoria ${editedCategory.name}`
          : 'Crea una nueva Categoria'
        }
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
        <input
          type="text"
          placeholder={'Nombre de Categoria'}
          onChange={ev => setName(ev.target.value)}
          value={name}
        ></input>
        <select
          onChange={ev => setParentCategory(ev.target.value)}
          value={parentCategory}
        >
          <option value=''>Elige una categoria</option>
          {categories.length > 0 && categories.map(Category => (
            <option key={Category._id} value={Category._id}>{Category.name}</option>
          ))}
        </select>
        </div>
        <div className="mb-2">
          <label className="block">Propiedades</label>
          <button onClick={addProperty}
            type="button" 
            className="btn-default text-sm mb-2">
            Agregar Nueva Propiedad
          </button>
          {properties.length > 0 && properties.map((property,index) =>(
            <div className="flex gap-1 mb-2"> 
               <input type="text" 
                      className="mb-0"
                      value={property.name} 
                      onChange={ev=> handlePropertyNameChange(index,property,ev.target.value)}
                      placeholder="property name (example: color)"/>
               <input type="text" 
                      className="mb-0"
                      onChange={ev => handlePropertyValueChange(index,property,ev.target.value)}
                      value={property.values} 
                      placeholder="values, comma separated"/>
                      
                      <button 
                      onClick={()=>removeProperty(index)}
                      type="button"
                      className="btn-default">
                        Eliminar
                      </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
        {editedCategory && (
        <button 
           type="button"
           className="btn-default"
           onClick={() => {
            setEditedCategory(null);
            setName('');
            setParentCategory('');
           }} 
           >
            Cancelar
        </button>
        )}
        <button 
            type='submit' 
            className="btn-primary py-1">
            Guardar
        </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
        <thead>
          <tr>
            <td>Nombres de las Categoria</td>
            <td>Categoría Principal</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 && categories.map(Category => (
            <tr key={Category._id}>
              <td>{Category.name}</td>
              <td>{Category?.parent?.name}</td>
              <td className="flex">
                <button
                  onClick={() => editCategory(Category)}
                  className="btn-primary mr-1"
                >Edit</button>
                <button
                  onClick={() => deleteCategory(Category)}
                  className="btn-primary"
                >Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
));
