const { expect } = require('chai');
const { syncAndSeed } = require('../db');

describe('Models', () => {
  let seed;
  beforeEach(async () => {
    seed = await syncAndSeed();
  });

  describe('seeded data', () => {
    it('there are 3 employees', () => {
      expect(Object.keys(seed.employees).length).to.equal(3);
    });
    it('lucy is an employee', () => {
      expect(seed.employees.lucy.name).to.equal('lucy');
      expect(seed.employees.lucy.bio).to.be.ok;
    });
    it('there are 2 departments', async () => {
      expect(Object.keys(seed.departments).length).to.equal(2);
    });
    it('lucy is in engineering', () => {
      const lucy = seed.employees.lucy;
      const engineering = seed.departments.engineering;
      expect(lucy.departmentId).to.equal(engineering.id);
    });
    it('moe is in hr', () => {
      const moe = seed.employees.moe;
      const hr = seed.departments.hr;
      expect(moe.departmentId).to.equal(hr.id);
    });
  });
});
