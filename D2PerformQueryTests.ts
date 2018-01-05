import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Course from "../src/controller/Course";
import Room from "../src/controller/Room";

let facade: InsightFacade = new InsightFacade();

describe("D2PerformQueryTests", function () {

    var assert = require('assert');

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);

    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        facade = null;
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });


    describe('D2 Query A', function() {

        it("D2 Query A", function () {

            var nestedQuery = {
                "WHERE": {
                    "IS": {
                        "rooms_name": "DMP_*"
                    }
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_name"
                    ],
                    "ORDER": "rooms_name"
                }
            };

            return facade.performQuery(nestedQuery).then(function (response: InsightResponse) {
                Log.test('Code: ' + response.code);
                Log.test('Body: ' + response.body);
                console.log(response.body)
                expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
            }).catch(function (response: InsightResponse) {
                Log.test('Error Code: ' + response.code);
                console.log(response.body)
                expect.fail(); // .fail() if it should fulfill, check response otherwise
            });
        });
    });

});