//https://retoolapi.dev/5kIrTo/data
import { useState, useEffect  } from 'react'

import './App.css'
import { IshopList } from './assets/interface/IshopList';

function App() {
 
  const [data, setData] = useState<IshopList[]>([]);
  const [error, setError]= useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState<Partial<IshopList> | null>(null);
  const [datas, setDatas] = useState<Partial<IshopList>>({product: "", unit: "", random: 0});

  useEffect(() => {
    fetchData();
  }, []);


  function fetchData() {
    fetch('https://retoolapi.dev/5kIrTo/data')
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => setError(error.message))
    .finally(() => setLoading(false));
  }

  const updateData = async (id: number, updatedItem: Partial<IshopList>) => {
    try {
      const response = await
      fetch(`https://retoolapi.dev/5kIrTo/data/${id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        ...updatedItem,
        product: updatedItem.product ?
        String(updatedItem.product) : undefined,
        unit: updatedItem.unit ?
        String(updatedItem.unit) : undefined,
        random: updatedItem.random ?
        Number(updatedItem.random) : undefined
        }),
      });
      if (!response.ok) {
        throw new Error("Nem sikerült frissíteni az adatot.");
      }
      const result = await response.json();
      console.log("Sikeres PUT:", result);
      setEditData(null);
      fetchData();

    }catch (error) {
      console.error("Hiba a PUT kérés során:", error);
    }
  }
  const deleteData = async (id: number) => {
    try {
    const response = await
    fetch(`https://retoolapi.dev/5kIrTo/data/${id}`, {
    method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Nem sikerült törölni az adatot.");
    };
   
    console.log(`Sikeres törlés: ${id}`);
    fetchData();
    } catch (error) {
      console.error("Hiba a törlés során:", error);
    }

  };


  const addData = async (newItem: Partial<IshopList>) => {
    try{
      if(newItem.product != null || newItem.unit  != null|| newItem.random != null){
    const response = await fetch("https://retoolapi.dev/5kIrTo/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newItem,
        product: newItem.product ? String(newItem.product) : undefined,
        unit: newItem.unit ? String(newItem.unit) : undefined,
        random: newItem.random ? Number(newItem.random) : undefined,
      })
    });
    if(!response.ok){
      throw new Error("Nem sikerült hozzáadni az adatot.");
    }
    console.log("Sikeres POST:", response); 
    fetchData();
  }else{
    alert("Nem lehet üres mező!")
  }
  }catch (error){
    console.error("Hiba a POST kérés során:", error);
  }

  }


  if(loading){
    return <p>Loading...</p>
  }
  if(error){

    return <p>Error: {error}</p>
  }





  return (
  <>
  { datas && (
    <div>
      <h1>Add new list element:</h1>
      <form  onSubmit={(e) =>{
        e.preventDefault();
        const newItem: Partial<IshopList> = {product: datas.product, unit: datas.unit, random: datas.random};
        
        addData(newItem);
      }}>


        <label>
          Product: 
          <input 
          type='text' 
          
          onChange={(e) =>{
            setDatas((prevData) => ({
              ...prevData,
              product: e.target.value,
            }))
          }}
          ></input>
        </label>
        
        <br />

        <label>
        Unit:
          <input  
          type="text"
          onChange={(e) =>{
            setDatas((prevData) => ({
              ...prevData,
              unit: e.target.value,
            }))
          }}
          >

          </input>
        </label>

        <br />

        <label>
        Random number:
          <input  
          type="number"
          onChange={(e) =>{
            setDatas((prevData) => ({
              ...prevData,
              random: parseInt( e.target.value),
            }))
          }}
          >
          </input>
        </label>
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  )}
  <br />
  <table>
      {data.map((item) => (
      <tr key={item.id}>
        <td>{item.product}</td>
        <td>{item.unit}</td>
        <td>{item.random}</td>
   
        <td><button onClick={() => setEditData(item)}>Edit</button></td>
        <td><button onClick={() => deleteData(item.id)}>Delete</button></td>
      </tr>
      ))}
  </table>

      {editData && (
        <div>
          <h2>Data editing</h2>
          <form onSubmit={(event) => {
            event.preventDefault();
            if(editData.id){
              updateData(editData.id, {product: editData.product, unit: editData.unit, random: editData.random });
            }
          }}>

            <label>
              Product:
              <input  
              type="text"
              value={editData.product|| ""}
              onChange={(e) =>{
                setEditData((prevData) => ({
                  ...prevData,
                  product: e.target.value,
                }))
              }}
              >
              
              </input>
            </label>

              <br />

              <label>
              Unit:
              <input  
              type="text"
              value={editData.unit|| ""}
              onChange={(e) =>{
                setEditData((prevData) => ({
                  ...prevData,
                  unit: e.target.value,
                }))
              }}
              >
              
              </input>
            </label>

            <br />

            <label>
              Random number:
              <input  
              type="number"
              value={editData.random|| ""}
              onChange={(e) =>{
                setEditData((prevData) => ({
                  ...prevData,
                  random: parseInt( e.target.value),
                }))
              }}
              >
              
              </input>
            </label>
            <br />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditData(null)}>Undo</button>


          </form>
        </div>
      )}
  </>

 
  );
}

export default App
