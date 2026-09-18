import { useEffect, useState } from 'react';
import API_URL from '../services/api';

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
        <div>
            <h1>Dashboard</h1>

            <button onClick={handleLogout}>
                Cerrar sesión
            </button>

            <h2>Agregar nuevo producto</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Código</label>
                    <input
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Descripción</label>
                    <input
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Estado</label>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >
                        <option value="Disponible">Disponible</option>
                        <option value="Despachado">Despachado</option>
                    </select>
                </div>

                <button type="submit">
                    Guardar producto
                </button>
            </form>

            <hr />

            <h2>Productos registrados</h2>

            <table border="1">
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
                            <td>{product.codigo}</td>
                            <td>{product.descripcion}</td>
                            <td>{product.estado}</td>

                            <td>
                                <button onClick={() => abrirEditar(product)}>
                                    Editar
                                </button>

                                <button onClick={() => handleDelete(product.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de edición */}
            {editingProduct && (
                <div>
                    <div>
                        <h2>Editar producto</h2>

                        <form onSubmit={handleUpdate}>
                            <div>
                                <label>Código</label>
                                <input
                                    type="text"
                                    value={editCodigo}
                                    onChange={(e) => setEditCodigo(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label>Descripción</label>
                                <input
                                    type="text"
                                    value={editDescripcion}
                                    onChange={(e) => setEditDescripcion(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label>Estado</label>
                                <select
                                    value={editEstado}
                                    onChange={(e) => setEditEstado(e.target.value)}
                                >
                                    <option value="Disponible">Disponible</option>
                                    <option value="Despachado">Despachado</option>
                                </select>
                            </div>

                            <button type="submit">
                                Guardar cambios
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                            >
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;