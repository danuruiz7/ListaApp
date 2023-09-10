import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './ToDoList.css';

interface Item {
  id: null;
  name: string;
  quantity: number;
}

const inicial: Item = {
  id: null,
  name: '',
  quantity: 1,
};

const ToDoList = () => {
  const [form, setForm] = useState(inicial);
  const [list, setList] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/items/');

        if (!response.ok) {
          throw new Error('La solicitud no fue exitosa');
        }

        const data = await response.json();
        setList(data);
      } catch (err) {
        console.error('Error al obtener los datos', err);
      }
    };

    fetchData();
  }, []);

  console.log(list);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (item: Item) => {
    console.log(item);
    setForm(item);
  };

  const handleDelete = (id: any) => {
    fetch(`http://127.0.0.1:8000/api/items/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error('La solicitud no fue exitosa');
      }
      return res.json();
    })
    .then((data) => {
      setList(data);
      setForm(inicial);
    })
    .catch((err) => {
      console.error('Error al obtener los datos', err);
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //con este line nos aseguramos que el primer caracter del item sea mayuscula
    form.name = form.name.charAt(0).toUpperCase() + form.name.slice(1);
    if (!form.name) {
      alert('El nombre no puede estar vacio');
      return;
    } else if (form.quantity < 1) {
      alert('La cantidad no puede ser menor a 1');
      return;
    }

    if (!form.id) {
    fetch('http://127.0.0.1:8000/api/items/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('La solicitud no fue exitosa');
        }
        return res.json();
      })
      .then((data) => {
        setList([...list, data]);
        setForm(inicial);
      })
      .catch((err) => {
        console.error('Error al obtener los datos', err);
      });
    }else{
      fetch(`http://127.0.0.1:8000/api/items/${form.id}/`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      }).then((res) => {
        if (!res.ok) {
          throw new Error('La solicitud no fue exitosa');
        }
        return res.json();
      })
      .then((data) => {
        const newList = list.filter((item)=> item.id !== data.id);
        setList([...newList,data])
        setForm(inicial);
      })
      .catch((err) => {
        console.error('Error al obtener los datos', err);
      });
    }
  };

  return (
    <div className="container">
      <h3 className="title">To Do List</h3>
      <form method="POST" onSubmit={handleSubmit}>
        <div className="title-container">
          <h3 className="title-form">Agrega un producto </h3>
          <button
            type="button"
            className="title-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <i className="bi bi-caret-up-fill"></i>
            ) : (
              <i className="bi bi-caret-down-fill"></i>
            )}
          </button>
        </div>

        <div className={showForm ? 'form-info' : 'form-info'}>
          <div className="form-group">
            <label htmlFor="">Nombre:</label>
            <input
              type="text"
              placeholder="Agrege el articulo"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="">quantity</label>
            <input
              type="number"
              placeholder="Ejemplo: 10"
              name="quantity"
              onChange={handleChange}
              value={form.quantity}
            />
          </div>
          <button className="btn-form">Agregar</button>
        </div>
      </form>
      <div className="list">
        <div className="title-container">
          <h3 className="title-list">Listado</h3>
          <button
            type="button"
            className="title-button"
            onClick={() => setShowList(!showList)}
          >
            {showList ? (
              <i className="bi bi-caret-up-fill"></i>
            ) : (
              <i className="bi bi-caret-down-fill"></i>
            )}
          </button>
        </div>
        <ul className={showList ? '' : ''}>
          {list.map((item) => (
            <li className="item" key={item.id}>
              <div className="item-info">
                <span className="item-quantity-">{item.quantity}</span>{' '}
                <span className="item-name">{item.name}</span>
              </div>
              <div className="item-botones" onClick={() => handleEdit(item)}>
                <button className="item-edit">
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="item-delete"
                  onClick={() => handleDelete(item.id)}
                >
                  <i className="bi bi-trash3-fill"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ToDoList;
