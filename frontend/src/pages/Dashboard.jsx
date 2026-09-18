import { useEffect, useState } from 'react';
import API_URL from '../services/api';
import '../App.css';

function Dashboard() {
    const [products, setProducts] = useState([]);

    const [codigo, setCodigo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('Disponible');

    const [editingProduct, setEditingProduct] = useState(null);
    const [editCodigo, setEditCodigo] = useState('');
    const [editDescripcion, setEditDescripcion] = useState('');
    const [editEstado, setEditEstado] = useState('Disponible');

    const cargarProductos = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_URL}/products`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProducts(data);
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    codigo,
                    descripcion,
                    estado,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data);
                return;
            }

            setCodigo('');
            setDescripcion('');
            setEstado('Disponible');

            cargarProductos();
        } catch (error) {
            console.error('Error al guardar producto:', error);
        }
    };

    // Abrir modal de edición
    const abrirEditar = (product) => {
        setEditingProduct(product);
        setEditCodigo(product.codigo);
        setEditDescripcion(product.descripcion);
        setEditEstado(product.estado);
    };

    // Actualizar producto
    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(
                `${API_URL}/products/${editingProduct.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        codigo: editCodigo,
                        descripcion: editDescripcion,
                        estado: editEstado,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data);
                return;
            }

            setEditingProduct(null);
            cargarProductos();
        } catch (error) {
            console.error('Error al actualizar producto:', error);
        }
    };

    // Eliminar producto
    const handleDelete = async (id) => {
        const confirmar = window.confirm(
            '¿Está seguro de que desea eliminar este producto?'
        );

        if (!confirmar) {
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                console.error(data);
                return;
            }

            cargarProductos();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    // Cerrar sesión
    const handleLogout = async () => {
        const token = localStorage.getItem('token');

        try {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        window.location.href = '/login';
    };

    return (
        <div className="dashboard">

            {/* Barra superior */}
            <header className="dashboard-header">

                <h1>Sistema de Inventario</h1>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>

            </header>


            {/* Contenido principal */}
            <main className="dashboard-content">

                <div className="dashboard-title">
                    <h2>Panel de Inventario</h2>
                    <p>
                        Administración y control de productos registrados
                    </p>
                </div>


                {/* Agregar producto */}
                <div className="card">

                    <h2>Agregar nuevo producto</h2>

                    <form
                        className="product-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label htmlFor="codigo">
                                Código
                            </label>

                            <input
                                id="codigo"
                                type="text"
                                placeholder="Ej. PROD-001"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="descripcion">
                                Descripción
                            </label>

                            <input
                                id="descripcion"
                                type="text"
                                placeholder="Descripción del producto"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="estado">
                                Estado
                            </label>

                            <select
                                id="estado"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value="Disponible">
                                    Disponible
                                </option>

                                <option value="Despachado">
                                    Despachado
                                </option>
                            </select>

                        </div>


                        <button
                            className="save-button"
                            type="submit"
                        >
                            Guardar producto
                        </button>

                    </form>

                </div>


                {/* Lista de productos */}
                <div className="card">

                    <h2>Productos registrados</h2>

                    <div className="table-container">

                        <table className="products-table">

                            <thead>

                                <tr>
                                    <th>Código</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>

                            </thead>


                            <tbody>

                                {products.map((product) => (

                                    <tr key={product.id}>

                                        <td>
                                            {product.codigo}
                                        </td>

                                        <td>
                                            {product.descripcion}
                                        </td>

                                        <td>

                                            <span
                                                className={`status ${product.estado === 'Disponible'
                                                        ? 'status-disponible'
                                                        : 'status-despachado'
                                                    }`}
                                            >
                                                {product.estado}
                                            </span>

                                        </td>

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        abrirEditar(product)
                                                    }
                                                >
                                                    Editar
                                                </button>


                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(product.id)
                                                    }
                                                >
                                                    Eliminar
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* Modal de edición */}
                {editingProduct && (

                    <div className="modal-overlay">

                        <div className="modal">

                            <div className="modal-header">

                                <h2>Editar producto</h2>

                                <button
                                    className="close-modal"
                                    type="button"
                                    onClick={() =>
                                        setEditingProduct(null)
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            <form
                                className="modal-form"
                                onSubmit={handleUpdate}
                            >

                                <div className="form-group">

                                    <label htmlFor="editCodigo">
                                        Código
                                    </label>

                                    <input
                                        id="editCodigo"
                                        type="text"
                                        value={editCodigo}
                                        onChange={(e) =>
                                            setEditCodigo(e.target.value)
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label htmlFor="editDescripcion">
                                        Descripción
                                    </label>

                                    <input
                                        id="editDescripcion"
                                        type="text"
                                        value={editDescripcion}
                                        onChange={(e) =>
                                            setEditDescripcion(e.target.value)
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label htmlFor="editEstado">
                                        Estado
                                    </label>

                                    <select
                                        id="editEstado"
                                        value={editEstado}
                                        onChange={(e) =>
                                            setEditEstado(e.target.value)
                                        }
                                    >

                                        <option value="Disponible">
                                            Disponible
                                        </option>

                                        <option value="Despachado">
                                            Despachado
                                        </option>

                                    </select>

                                </div>


                                <div className="modal-actions">

                                    <button
                                        className="cancel-button"
                                        type="button"
                                        onClick={() =>
                                            setEditingProduct(null)
                                        }
                                    >
                                        Cancelar
                                    </button>


                                    <button
                                        className="update-button"
                                        type="submit"
                                    >
                                        Guardar cambios
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

export default Dashboard;