import React, { useEffect, useState } from 'react';
import { productAPI } from '../../api/adminApi';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ titulo: '', salario: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }

  async function addProduct(payload) {
    try {
      const newProduct = await productAPI.create(payload);
      setProducts((p) => [newProduct, ...p]);
      setShowModal(false);
      setForm({ titulo: '', salario: '' });
      setError(null);
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Error al crear producto');
    }
  }

  async function updateProduct(id, payload) {
    try {
      const updated = await productAPI.update(id, payload);
      setProducts((p) => p.map((x) => (x.id === id ? updated : x)));
      setShowModal(false);
      setEditing(null);
      setError(null);
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Error al actualizar producto');
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await productAPI.delete(id);
      setProducts((p) => p.filter((x) => x.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Error al eliminar producto');
    }
  }

  function openAdd() {
    setEditing(null);
    setForm({ titulo: '', salario: '' });
    setShowModal(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({ titulo: p.titulo, salario: p.salario });
    setShowModal(true);
  }

  function submit(e) {
    e.preventDefault();
    const payload = { titulo: form.titulo, salario: Number(form.salario) };
    if (editing) updateProduct(editing.id, payload);
    else addProduct(payload);
  }

  if (loading) return <section><p>Cargando productos...</p></section>;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Gestión de Productos/Servicios (Ofertas)</h1>
        <button onClick={openAdd} style={primaryBtn}>+ Agregar Producto</button>
      </div>

      {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <table style={{ width: '100%', background: '#fff', borderRadius: 8 }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={th}>ID</th>
              <th style={th}>Título</th>
              <th style={th}>Salario</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid #eef2ff' }}>
                <td style={td}>{p.id}</td>
                <td style={td}>{p.titulo}</td>
                <td style={td}>${p.salario || 'N/A'}</td>
                <td style={td}>
                  <button onClick={() => openEdit(p)} style={actionBtn}>Editar</button>
                  <button onClick={() => deleteProduct(p.id)} style={{ ...actionBtn, marginLeft: 8, background: '#ef4444' }}>Eliminar</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 12, color: '#6b7280' }}>No hay productos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={modalOverlay}>
          <form onSubmit={submit} style={modalBox}>
            <h3>{editing ? 'Editar Producto' : 'Agregar Producto'}</h3>
            <label style={label}>Título</label>
            <input style={input} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
            <label style={label}>Salario</label>
            <input style={input} value={form.salario} onChange={(e) => setForm({ ...form, salario: e.target.value })} required type="number" step="0.01" />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} style={btnAlt}>Cancelar</button>
              <button type="submit" style={primaryBtn}>{editing ? 'Guardar' : 'Crear'}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

const th = { padding: 8 };
const td = { padding: 8 };
const primaryBtn = { background: '#2563eb', color: '#fff', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer' };
const actionBtn = { background: '#10b981', color: '#fff', padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer' };
const btnAlt = { background: '#f3f4f6', color: '#374151', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer' };
const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 };
const modalBox = { background: '#fff', padding: 20, borderRadius: 8, minWidth: 340, boxShadow: '0 12px 36px rgba(2,6,23,0.3)' };
const label = { display: 'block', marginTop: 12, marginBottom: 6, color: '#374151', fontWeight: 600 };
const input = { padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', width: '100%' };

export default ProductManagement;
