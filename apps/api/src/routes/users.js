import express from 'express';
import supabase from '../utils/supabase.js';
import { validateRequired, validateEmail } from '../utils/validators.js';

const router = express.Router();

const mapUser = (row) => ({
  ...row,
  hire_date: row.hire_date || null,
  status: row.status || 'active',
});

router.post('/', async (req, res, next) => {
  let authUserId = null;

  try {
    const { name, email, password, company_id, unit_id, sector_id, phone, role, position, hire_date, status } = req.body;

    validateRequired(name, 'Nome');
    validateRequired(email, 'Email');
    if (!validateEmail(email)) throw new Error('Email inválido');
    validateRequired(password, 'Senha');
    if (password.length < 8) throw new Error('A senha deve ter no mínimo 8 caracteres');
    validateRequired(company_id, 'ID da empresa');
    validateRequired(unit_id, 'ID da unidade');
    validateRequired(sector_id, 'ID do setor');

    const authPayload = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: role || 'operator',
      },
    });

    if (authPayload.error) throw authPayload.error;

    authUserId = authPayload.data.user.id;

    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: authUserId,
        name,
        email,
        company_id,
        unit_id,
        sector_id,
        phone: phone || '',
        role: role || 'operator',
        position: position || '',
        hire_date: hire_date || null,
        status: status || 'active',
      }])
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: mapUser(data),
    });
  } catch (error) {
    if (authUserId) {
      await supabase.auth.admin.deleteUser(authUserId);
    }
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    res.json({
      success: true,
      data: (data || []).map(mapUser),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', req.params.id).single();
    if (error) throw error;

    res.json({
      success: true,
      data: mapUser(data),
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, password, company_id, unit_id, sector_id, phone, role, position, hire_date, status } = req.body;

    validateRequired(name, 'Nome');
    if (email && !validateEmail(email)) throw new Error('Email inválido');

    const updateData = {
      name,
      email,
      company_id,
      unit_id,
      sector_id,
      phone: phone || '',
      role: role || 'operator',
      position: position || '',
      hire_date: hire_date || null,
      status: status || 'active',
      updated_at: new Date().toISOString(),
    };

    const authUpdate = {
      email,
      user_metadata: {
        name,
        role: role || 'operator',
      },
    };

    if (password) {
      if (password.length < 8) return res.status(400).json({ error: 'A senha deve ter no mínimo 8 caracteres' });
      authUpdate.password = password;
    }

    const authResult = await supabase.auth.admin.updateUserById(req.params.id, authUpdate);
    if (authResult.error) throw authResult.error;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: mapUser(data),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/reset-password', async (req, res, next) => {
  try {
    const { password } = req.body;
    validateRequired(password, 'Senha');
    if (password.length < 8) throw new Error('A senha deve ter no mínimo 8 caracteres');

    const { error } = await supabase.auth.admin.updateUserById(req.params.id, { password });
    if (error) throw error;

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { error: dbError } = await supabase.from('users').delete().eq('id', req.params.id);
    if (dbError) throw dbError;

    const { error: authError } = await supabase.auth.admin.deleteUser(req.params.id);
    if (authError) throw authError;

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
