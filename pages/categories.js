import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";


export default function Categories(){
    const [name,setName] = useState('');
    const [parentCategory,setParentCategory] = useState('');
    const [categories,setCategories] = useState([]);
    useEffect(() => {
        fetchCategories();
    }, []);
    function fetchCategories(){
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }
   async function saveCategory(ev) {
  ev.preventDefault();
  try {
    await axios.post("/api/categories", { name, parentCategory });
    setName("");
    fetchCategories();
  } catch (error) {
    console.error("Error al guardar la categoría:", error);
    // Aquí puedes mostrar una notificación o realizar alguna otra acción de manejo de errores
  }
}

    return(
    <Layout>
        <h1>Categorias</h1>
        <label>Nuevo Nombre de Categoría</label>
        <form onSubmit={saveCategory} className="flex gap-1">
            <input 
            className="mb-0" 
            type="text" 
            placeholder={'Nombre de Categoria'}
            onChange={ev => setName(ev.target.value)} 
            value={name}
            ></input>
            <select className="mb-0"
                    onChange={ev => setParentCategory(ev.target.value)}
                    value={parentCategory}
            >
                <option value=''>Sin categoría principal</option>
                {categories.length > 0 && categories.map( Category => (
                    <option value={Category._id}>{Category.name}</option>
                ))}
            </select>
            <button type='submit' className="btn-primary py-1" >Guardar</button>
        </form>
        <table className="basic mt-4">
            <thead>
                <tr>
                    <td>Nombres de las Categoria</td>
                    <td>Categoría Principal</td>
                </tr>
            </thead>
            <tbody>
                {categories.length > 0 && categories.map( Category => (
                    <tr>
                        <td>{Category.name}</td>
                        <td>{Category?.parent?.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Layout>
)
}