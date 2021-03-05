const { Connection } = require('pg');
const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
const faker = require('faker');

const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/acme_db'
);

const Employee = db.define('employee', {
  name: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
});

Employee.addHook('beforeSave', (employee) => {
  if (!employee.bio) {
    employee.bio = `Bio for: ${employee.name}: ${faker.lorem.paragraphs(3)}`;
  }
});

const Department = db.define('department', {
  name: {
    type: DataTypes.STRING,
  },
});

Employee.belongsTo(Department);
Department.hasMany(Employee);

const syncAndSeed = async () => {
  await db.sync({ force: true });
  const [curly, moe, lucy, hr, engineering] = await Promise.all([
    Employee.create({ name: 'curly' }),
    Employee.create({ name: 'moe' }),
    Employee.create({ name: 'lucy' }),
    Department.create({ name: 'hr' }),
    Department.create({ name: 'engineering' }),
  ]);

  lucy.departmentId = engineering.id;
  moe.departmentId = hr.id;
  await lucy.save();
  await moe.save();
  return { employees: { curly, moe, lucy }, departments: { hr, engineering } };
};

module.exports = {
  db,
  syncAndSeed,
};
