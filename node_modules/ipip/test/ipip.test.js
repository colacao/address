'use strict';

var expect = require('chai').expect,
  rewire = require('rewire'),
  ipip = rewire('../lib/ipip.js'),
  IPIP = ipip.IPIP;

describe('IPIP', function() {
  var ip = new ipip.IPIP();

  it('should handle malformed input', function(done) {
    expect(function() {
      ip.ip('202.x.x.x');
    }).to.throw(Error);

    expect(function() {
      ip.ip('256.1.1.1');
    }).to.throw(Error);

    expect(function() {
      ip.ip('8.8.4.4', 'invalid-format');
    }).to.throw(Error);

    done();
  });

  it('shoudl accept numeric input', function() {
    expect(ip.ip(0x040404)).to.have.a.property('city');
  });

  it('should return a dictionary', function() {
    expect(ip.ip('202.195.161.30', 'dict')).to.have.a.property('city');
  });

  it('should return an array', function() {
    expect(ip.ip('8.8.8.8', 'array')).to.be.an.aray;
  });

});

describe('Custom options', function() {
  it('should be able to load data from custom location', function(done) {
    expect(function() {
      new IPIP('/tmp/non-exist-file.dat');
    }).to.throw(Error);
    
    expect(function() {
      new IPIP('package.json');
    }).to.throw(Error);

    var path = require('path').join(__dirname, '..', '17monipdb.dat');
    var ip = new IPIP();
    expect(ip.ip('8.8.8.8', 'dict')).to.have.a.property('city');

    done();
  });
});
