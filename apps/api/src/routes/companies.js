import express from 'express';
import supabase from '../utils/supabase.js';
import { validateEmail, validateRequired } from '../utils/validators.js';

const router = express.Router();

const normalizeBooleanStatus = (value, fallback = true) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'active' || value === 'ativo' || value === 'true') return true;
    if (value === 'inactive' || value === 'inativo' || value === 'false') return false;
  }
  return fallback;
};

const statusFromBoolean = (isActive) => (isActive ? 'active' : 'inactive');

const mapCompany = (row) => {
  const isActive = normalizeBooleanStatus(row.status, true);
  return {
    ...row,
    isActive,
    status: statusFromBoolean(isActive),
  };
};

router.post('/', async (req, res, next) => {
  try {
    const { name, tradeName, cnpj, phone, email, address, city, state, status, isActive } = req.body;

    validateRequired(name, 'Nome');
    validateRequired(email, 'Email');
    if (!validateEmail(email)) throw new Error('Email inválido');

    const active = typeof isActive === 'boolean' ? isActive : normalizeBooleanStatus(status, true);

    const { data, error } = await supabase
      .from('companies')
      .insert([{
        name,
        trade_name: tradeName || '',
        cnpj: cnpj || '',
        phone: phone || '',
        email,
        address: address || '',
        city: city || '',
        state: state || '',
        status: statusFromBoolean(active),
      }])
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, message: 'Empresa criada com sucesso', data: mapCompany(data) });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data: (data || []).map(mapCompany) });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('companies').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json({ success: true, data: mapCompany(data) });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, tradeName, cnpj, phone, email, address, city, state, status, isActive } = req.body;
    validateRequired(name, 'Nome');
    if (email && !validateEmail(email)) throw new Error('Email inválido');

    const active = typeof isActive === 'boolean' ? isActive : normalizeBooleanStatus(status, true);

    const { data, error } = await supabase
      .from('companies')
      .update({
        name,
        trade_name: tradeName || '',
        cnpj: cnpj || '',
        phone: phone || '',
        email: email || '',
        address: address || '',
        city: city || '',
        state: state || '',
        status: statusFromBoolean(active),
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Empresa atualizada com sucesso', data: mapCompany(data) });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await supabase.from('companies').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Empresa deletada com sucesso' });
  } catch (error) {
    next(error);
  }
});

export default router;
