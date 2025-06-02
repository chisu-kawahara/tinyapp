const { assert } = require('chai');
const { getUserByEmail } = require('../helpers');

const testUsers = {
  "user1RandomID": {
    id: "user1RandomID", 
    email: "user1@test.com", 
    password: "blue"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@test.com", 
    password: "pink"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user1@test.com", testUsers);
    const expectedUserID = "user1RandomID";
    assert.equal(user.id, expectedUserID);
  });
});
