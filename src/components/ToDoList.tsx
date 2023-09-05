import { ChangeEvent, FormEvent, useState } from 'react';
import './ToDoList.css';

interface Item {
  id: any;
  name: string;
  cantidad: string;
}

const inicial: Item = {
  id: null,
  name: '',
  cantidad: '1',
};

const ToDoList = () => {
  const [form, setForm] = useState(inicial);
  const [list, setList] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);

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

  const handleDelete = (name: string) => {
    console.log(name);
    const newList = list.filter((item) => item.name !== name);
    setList(newList);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //con este line nos aseguramos que el primer caracter del item sea mayuscula
    form.name = form.name.charAt(0).toUpperCase() + form.name.slice(1);
    if (!form.name) {
      alert('El nombre no puede estar vacio');
      return;
    } else if (form.id === null) {
      form.id = Date.now();

      setList([...list, form]);
      setForm(inicial);
      return;
    } else {
      const newList = list.map((item) => {
        if (item.id === form.id) {
          item.name = form.name;
          item.cantidad = form.cantidad;
        }
        return item;
      });
      setList(newList);
      setForm(inicial);
      console.log(newList, 'new list');

      return;
    }
  };

  return (
    <div className="container">
      <h3 className="title">To Do List</h3>
      <form action="" onSubmit={handleSubmit}>
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

        <div className={showForm ? 'form-info' : 'form-info hidden'}>
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
            <label htmlFor="">Cantidad</label>
            <input
              type="number"
              placeholder="Ejemplo: 10"
              name="cantidad"
              onChange={handleChange}
              value={form.cantidad}
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
        <ul className={showList ? '' : 'hidden'}>
          {list.map((item) => (
            <li className="item" key={item.id}>
              <div className="item-info">
                <span className="item-cantidad-">{item.cantidad}</span>{' '}
                <span className="item-name">{item.name}</span>
              </div>
              <div className="item-botones" onClick={() => handleEdit(item)}>
                <button className="item-edit">
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="item-delete"
                  onClick={() => handleDelete(item.name)}
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
