process.env.NODE_ENV = 'test';
let chai = require('chai');
chai.use(require('chai-fuzzy'));
const request = require("supertest");
let chaiHttp = require('chai-http');
let server = require('../server');
let mongoose = require("mongoose");
let User = require("../models/User");
const expect = require('chai').expect;
const validateLoginInput = require("../validation/login");

let should = chai.should();

let users = require("../routes/api/users");


chai.use(chaiHttp);



describe('User', function() {
    before(function(done) {
      User.sync({ force : true }) // drops table and re-creates it
        .success(function() {
          done(null);
        })
        .error(function(error) {
          done(error);
        });
    });
});

describe('/POST register', () => {

    const db = require("../config/keys").mongoURI;
    before('connect', function(){
        return mongoose.createConnection(db, { useNewUrlParser: true })
    })
    beforeEach(function(){
        return User.deleteMany({})
    })

    it('it should create user from the register', (done) => {
        let user = {
            name: "Greg jamie",
            email: "testing312345@test.com",
            password: "testing123",
            password2: "testing123"
        }
        chai.request('http://localhost:5000/api/users')
        .post('/register')
        .send(user)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
             done();
        });
    });

});

describe('/POST login', () => {


    it('successfully login user', (done) => {
        let user = {
            email: "testing312345@test.com",
            password: "testing123"
        }
        chai.request('http://localhost:5000/api/users')
        .post('/login')
        .send(user)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
             done();
        });
    });

});

describe('/POST login, incorrect password', () => {


    it('unsuccessfully login user', (done) => {
        let user = {
            email: "testing312345@test.com",
            password: "testing"
        }
        chai.request('http://localhost:5000/api/users')
        .post('/login')
        .send(user)
        .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
             done();
        });
    });

});

describe(' Validation tests', function(){
    it('returns a valid email, name, password and password2', function(done){
        let data = {
            email: "testing312345@test.com",
            password: "testing123"
        }
        var errors= {};
        var isValid = true;
        expect(validateLoginInput(data)).to.be.a('object');
        expect(validateLoginInput(data)).to.containOneLike(isValid);
        expect(validateLoginInput(data)).to.containOneLike(errors);

        done();

    });
});

describe(' Validation tests', function(){
    it('returns a invalid results from invalid email', function(done){
        let data = {
            email: "testing312345com",
            password: "testing123"
        }
        var errors= {"email": "Email is invalid"};
        var isValid = false;
        expect(validateLoginInput(data)).to.be.a('object');
        expect(validateLoginInput(data)).to.containOneLike(isValid);
        expect(validateLoginInput(data)).to.containOneLike(errors);

        done();

    });
});