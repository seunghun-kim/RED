// test for red.ctrl
const request = require('supertest');
const should = require('should');
const app = require('../');
const models = require('../data/models');
const contents = [
  {
    category: 'algorithm',
    title: 'merge sort',
    contents: 'This is merge sort',
    code: 'function merge() { return merge++;}'
  },
  {
    category: 'programing language',
    title: 'call by value',
    contents: 'He called me as value!'
  },
  {
    category: 'network',
    title: 'IPv4',
    contents: 'What is IPv4?'
  }
];

describe('GET /red', () => {
  before(() => models.sequelize.sync({force: true}));
  before(() => models.Red.bulkCreate(contents));

  describe('success', () => {
    it('should returns status code as 200 and length is 3', (done) => {
      request(app)
        .get('/red')
        .expect(200)
        .end((err, res) => {
          res.body.should.have.lengthOf(3);
          done();
        });
    });

    it('should returns contents as array', (done) => {
      request(app)
        .get('/red')
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          done();
        });
    });

    it('it should returns datas from 1 to 2', (done) => {
      request(app)
          .get('/red?offset=1&limit=2')
          .end((err, res) => {
            res.body.should.have.lengthOf(2);
            done();
          });
    });

    it('it should returns only algorithms', (done) => {
      request(app)
          .get('/red?category=' + encodeURIComponent('algorithm'))
          .end((err, res) => {
            res.body.should.have.lengthOf(1);
            done();
          });
    });
  });

  describe('fail', () => {
    it('should returns 400 when limit and offset are not numbers', (done) => {
      request(app)
          .get('/red?offset=a&limit=b')
          .expect(400)
          .end(done);
    });
  });
});

describe('GET /red:id', () => {
  before(() => models.sequelize.sync({force: true}));
  before(() => models.Red.bulkCreate(contents));

  describe('success', () => {
    it('should have property of id', (done) => {
      request(app)
          .get('/red/1')
          .end((err, res) => {
            res.body.should.have.property('id', 1);
            done();
          });

    });
  });

  describe('fail', () => {
    it('should returns 404 when id is not exists', (done) => {
      request(app)
          .get('/red/10000')
          .expect(404)
          .end(done);
    });

    it('should returns 400 when id is Not a Number', (done) => {
      request(app)
          .get('/red/aa')
          .expect(400)
          .end(done);
    });
  });
});

describe('POST /red', () => {
  before(() => models.sequelize.sync({force: true}));
  before(() => models.Red.bulkCreate(contents));
    
  describe('success', () => {
    let body, title = 'QA';
    const data = {
      category: 'testing',
      title,
      contents: 'Quality Assurance',
      code: ''
    };

    before(done => {
      request(app)
          .post('/red')
          .send(data)
          .expect(201)
          .end((err, res) => {
            body = res.body;
            done();
          });
    });

    it ('should have a id', () => {
      body.should.have.property('id');
    });

    it('should have title and same as inputed title', () => {
      body.should.have.property('title', title);
    });
  });

  describe('fail', () => {

    it('should returns 400 when category is omitted', (done) => {
      const data = {
        title: 'Test',
        contents: 'Quality Assurance',
        code: ''
      };

      request(app)
          .post('/red')
          .send(data)
          .expect(400)
          .end(done);
    });

    it('should returns 400 when title is omitted', (done) => {
      const data = {
        category: 'testing',
        contents: 'Quality Assurance',
        code: ''
      };

      request(app)
          .post('/red')
          .send(data)
          .expect(400)
          .end(done);
    });

    it('should returns 400 when content is omitted', (done) => {
      const data = {
        category: 'testing',
        title: 'Test',
        code: ''
      };

      request(app)
          .post('/red')
          .send(data)
          .expect(400)
          .end(done);
    });

    it('should returns 409 when title is duplicated', (done) => {
      const data = {
        category: 'testing',
        title: 'QA',
        contents: 'Quality Assurance',
        code: ''
      };

      request(app)
          .post('/red')
          .send(data)
          .expect(409)
          .end(done);
    });
  });
});