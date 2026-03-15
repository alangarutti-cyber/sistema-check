import express from 'express';
import supabase from '../utils/supabase.js';
import { validateRequired } from '../utils/validators.js';

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

const mapSector = (row) => {
  const isActive = normalizeBooleanStatus(row.status, true);
  return {
    ...row,
    isActive,
    status: statusFromBoolean(isActive),
  };
};

router.post('/', async (req, res, next) => {
  try {
    const { name, company_id, unit_id, description, status, isActive } = req.body;
    validateRequired(name, 'Nome');
    validateRequired(unit_id, 'ID da unidade');
    validateRequired(company_id, 'ID da empresa');

    const active = typeof isActive === 'boolean' ? isActive : normalizeBooleanStatus(status, true);

    const { data, error } = await supabase
      .from('sectors')
      .insert([{
        name,
        company_id,
        unit_id,
        description: description || '',
        status: statusFromBoolean(active),
      }])
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Setor criado com sucesso', data: mapSector(data) });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('sectors').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data: (data || []).map(mapSector) });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('sectors').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json({ success: true, data: mapSector(data) });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, company_id, unit_id, description, status, isActive } = req.body;
    validateRequired(name, 'Nome');
    validateRequired(unit_id, 'ID da unidade');
    validateRequired(company_id, 'ID da empresa');

    const active = typeof isActive === 'boolean' ? isActive : normalizeBooleanStatus(status, true);

    const { data, error } = await supabase
      .from('sectors')
      .update({
        name,
        company_id,
        unit_id,
        description: description || '',
        status: statusFromBoolean(active),
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Setor atualizado com sucesso', data: mapSector(data) });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await supabase.from('sectors').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Setor deletado com sucesso' });
  } catch (error) {
    next(error);
  }
});

export default router;
