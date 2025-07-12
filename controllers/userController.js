import { Op } from 'sequelize';
import User from '../models/user.js';

export const getUsers = async (req, res, next) => {
  try {
    const { filter, sort, search } = req.query;
    let where = {};
    if (filter) {
      // Contoh: filter=fullname:John
      const [field, value] = filter.split(':');
      where[field] = value;
    }
    if (search) {
      // Contoh: search=John
      where[Op.or] = [
        { fullname: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    let order = [];
    if (sort) {
      // Contoh: sort=fullname:asc
      const [field, direction] = sort.split(':');
      order.push([field, direction]);
    }
    const users = await User.findAll({ where, order });
    res.json(users);
  } catch (err) {
    next(err);
  }
}; 