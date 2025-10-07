import User from './userModel.js';
import Company from './company.js';
import Area from './areaModel.js';
import Task from './taskModel.js';

Company.hasMany(Area, { foreignKey: 'id_empresa', as: 'areas' });
Area.belongsTo(Company, { foreignKey: 'id_empresa', as: 'companyInfo' });

Task.belongsTo(User, { as: 'assignedUser', foreignKey: 'assigned_to' });
Task.belongsTo(Company, { as: 'company', foreignKey: 'company_id' });
Task.belongsTo(Area, { as: 'area', foreignKey: 'area_id' });

User.hasMany(Task, { foreignKey: 'assigned_to', as: 'userTasks' });
Company.hasMany(Task, { foreignKey: 'company_id', as: 'companyTasks' });
Area.hasMany(Task, { foreignKey: 'area_id', as: 'areaTasks' });

export { User, Company, Area, Task };