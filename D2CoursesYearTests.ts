/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Course from "../src/controller/Course";
import Room from "../src/controller/Room";

let facade: InsightFacade;
facade = new InsightFacade();

let anth512: Course = new Course();
anth512._courses_dept = "anth";
anth512._courses_id = "512";
anth512._courses_avg = 85.2;
anth512._courses_instructor = "rosenblum, daisy";
anth512._courses_title = "lang & culture";
anth512._courses_pass = 5;
anth512._courses_fail = 0;
anth512._courses_audit = 0;
anth512._courses_uuid = "25235";
//TODO: anth512._courses_year = 1900;

describe("D2 courses_year tests", function () {

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

    describe('Courses_year equalsFunction Tests', function() {
        it('courses_year - match', function() {
            let result = facade.equalsFunction("courses_year", 49.26125, anth512);
            expect(result).to.be.true;
        });
        it('courses_year - not a match', function() {
            let result = facade.equalsFunction("courses_year", 49.26125, anth512);
            expect(result).to.be.false;
        });
    });

    describe('courses_year greaterThanFunction Tests', function() {
        it('courses_year - lt', function() {
            let result = facade.greaterThanFunction("courses_year", 49.26125 + 1, anth512);
            expect(result).to.be.false;
        });
        it('courses_year - eq', function() {
            let result = facade.greaterThanFunction("courses_year", 49.26125, anth512);
            expect(result).to.be.false;
        });
        it('courses_year - gt', function() {
            let result = facade.greaterThanFunction("courses_year", 49.26125 - 1, anth512);
            expect(result).to.be.true;
        });
    });

    describe('courses_year lessThanFunction Tests', function() {
        it('courses_year - lt', function() {
            let result = facade.lessThanFunction("courses_year", 49.26125 + 1, anth512);
            expect(result).to.be.true;
        });
        it('courses_year - eq', function() {
            let result = facade.lessThanFunction("courses_year", 49.26125, anth512);
            expect(result).to.be.false;
        });
        it('courses_year - gt', function() {
            let result = facade.lessThanFunction("courses_year", 160 - 1, anth512);
            expect(result).to.be.false;
        });
    });

});