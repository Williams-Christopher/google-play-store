const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');

describe('GET /apps', () => {
    it('should return a JSON formatted array of at least 1 app when the endpoint is invoked', () => {
        return request(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array').with.lengthOf.at.least(1);
            });
    });

    it('should return a JSON formatted array of at least 1 app when invoked with an empty sort param', () => {
        return request(app)
            .get('/apps')
            .query({sort: null})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array').with.lengthOf.at.least(1);
            });
    });

    it('should should return a 400 if a value other than rating or app is provided for the sort param', () => {
        return request(app)
            .get('/apps')
            .query({sort: 'INVALID_SORT'})
            .expect(400, 'Use rating or app with the sort query parameter.');
    });

    it('should should return a 400 if the genre parameter is provided without a value', () => {
        return request(app)
            .get('/apps')
            .query({genre: null})
            .expect(400, 'Use a valid value for the genre query param.');
    });

    it('should properly sort the list of apps by app name', () => {
        return request(app)
            .get('/apps')
            .query({ sort: 'app' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                let sorted = true;
                while (sorted && i < res.body.length - 1) {
                    sorted = sorted && res.body[i].App < res.body[i + 1].App;
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should properly sort the list of apps by rating', () => {
        return request(app)
            .get('/apps')
            .query({ sort: 'rating' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                let sorted = true;
                while (sorted && i < res.body.length - 1) {
                    sorted = sorted && res.body[i].Rating <= res.body[i + 1].Rating;
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should properly return results that include the provided genre of action', () => {
        return request(app)
        .get('/apps')
        .query({ genre: 'action' })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            let i = 0;
            let correctGenre = true;
            while (correctGenre && i < res.body.length - 1) {
                correctGenre = correctGenre && res.body[i].Genres.toLowerCase().includes('action');
                i++;
            }
            expect(correctGenre).to.be.true;
        });
    });

    it('should properly sort the list of apps by app name for the provided genre of action', () => {
        return request(app)
        .get('/apps')
        .query({ sort: 'app', genre: 'action' })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            let i = 0;
            let sorted = true;
            let correctGenre = true;
            while (sorted && correctGenre && i < res.body.length - 1) {
                sorted = sorted && res.body[i].App <= res.body[i + 1].App;
                correctGenre = correctGenre && res.body[i].Genres.toLowerCase().includes('action');
                i++;
            }
            expect(sorted && correctGenre).to.be.true;
        });
    });
});