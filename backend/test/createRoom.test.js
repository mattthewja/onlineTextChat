// test/createRoom.test.js

const request = require('supertest');
const { expect } = require('chai');
const app = require('../index');
const { rooms } = require('../seed')