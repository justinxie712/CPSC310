/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Course from "../src/controller/Course";

let facade: InsightFacade = new InsightFacade();

let d1ComplexQuery = {"WHERE":{"OR":[{"AND":[{"GT":{"courses_avg":90}},{"IS":{"courses_dept":"adhe"}}]},{"EQ":{"courses_avg":95}}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id","courses_avg"],"ORDER":"courses_avg"}}
let d2QueryA:any = {"WHERE": { "IS": {"rooms_name": "DMP_*"}}, "OPTIONS": { "COLUMNS" : ["rooms_name"], "ORDER": "rooms_name"}}
let d2QueryB:any = {"WHERE": { "IS": {"rooms_address": "*Agrono*"}}, "OPTIONS": { "COLUMNS" : ["rooms_address", "rooms_name"]}}
let simpleRoomsCoursesMismatch:any = {"WHERE": { "IS": {"rooms_name": "DMP_*"}}, "OPTIONS": { "COLUMNS" : ["courses_dept"]}}
let simpleCoursesRoomsMismatch:any = {"WHERE": { "IS": {"courses_id": "DMP_*"}}, "OPTIONS": { "COLUMNS" : ["rooms_name"]}}
let WHERERoomsCoursesMismatch1 = {"WHERE":{"OR":[{"AND":[{"GT":{"courses_avg":90}},{"IS":{"rooms_address":"adhe"}}]},{"EQ":{"courses_avg":95}}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id","courses_avg"]}}
let WHERERoomsCoursesMismatch2 = {"WHERE":{"OR":[{"AND":[{"GT":{"courses_avg":90}},{"IS":{"rooms_address":"adhe"}}]},{"EQ":{"courses_avg":95}}]},"OPTIONS":{"COLUMNS":["rooms_address","rooms_name","rooms_type"]}}
let OPTIONSRoomsCoursesMismatch1 = {"WHERE":{"OR":[{"AND":[{"GT":{"courses_avg":90}},{"IS":{"courses_dept":"adhe"}}]},{"EQ":{"courses_avg":95}}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id","rooms_type"]}}
let OPTIONSRoomsCoursesMismatch2 = {"WHERE":{"OR":[{"AND":[{"GT":{"courses_avg":90}},{"IS":{"courses_dept":"adhe"}}]},{"EQ":{"courses_avg":95}}]},"OPTIONS":{"COLUMNS":["rooms_address","rooms_name","courses_avg"]}}
let OPTIONSRoomsCoursesMismatch3 = {"WHERE":{"OR":[{"AND":[{"IS":{"rooms_fullname":"abc"}},{"IS":{"rooms_number":"adhe"}}]},{"EQ":{"rooms_seats":95}}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id","rooms_type"]}}
let OPTIONSRoomsCoursesMismatch4 = {"WHERE":{"OR":[{"AND":[{"IS":{"rooms_fullname":"abc"}},{"IS":{"rooms_number":"adhe"}}]},{"EQ":{"rooms_seats":95}}]},"OPTIONS":{"COLUMNS":["rooms_address","rooms_name","courses_avg"]}}
let WHEREOPTIONSRoomsCoursesMismatch = {"WHERE":{"OR":[{"AND":[{"IS":{"rooms_fullname":"abc"}},{"IS":{"courses_dept":"adhe"}}]},{"EQ":{"rooms_seats":95}}]},"OPTIONS":{"COLUMNS":["rooms_address","courses_id","courses_avg"]}}
let testQuery:any = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}
let testQueryOrder:any = {"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}, "WHERE":{"EQ":{"courses_avg":85.2}}}
let testQueryInvalidBody:any = {"WHEREINVALID":{"EQ":{"courses_avg":85.2}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}
let testQueryInvalidOptions:any = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONSINVALID":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}
let testQueryMissingBody:any = {"EQ":{"courses_avg":85.2},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}
let testQueryMissingOptions:any = {"WHERE":{"EQ":{"courses_avg":85.2}},"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}
let testQueryInvalidMKey:any = {"WHERE":{"EQ":{"courses_avginvalid":85.2}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}
let testQueryInvalidOrderString:any = {"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_depts"}, "WHERE":{"EQ":{"courses_avg":85.2}}}
let testQueryEmptyColumns:any = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONS":{"COLUMNS":[],"ORDER":"courses_dept"}}
let testQueryOrderExtraKey:any = {"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":{"Extra Key": "courses_depts"}}, "WHERE":{"EQ":{"courses_avg":85.2}}}
let testQueryNoOrder:any = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"]}}


describe("D2QuerySyntaxTests", function () {

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

    describe('Valid initial courses key', function() {
        it('Invalid ["rooms_address", "rooms_name"]', function() {
            let result = facade.checkValidInitialCoursesKey(["rooms_address", "rooms_name"]);
            expect(result).to.be.false;
        });
        it('Invalid ["rooms_address", "courses_avg"]', function() {
            let result = facade.checkValidInitialCoursesKey(["rooms_address", "courses_avg"]);
            expect(result).to.be.false;
        });
        it('Valid ["courses_instructor", "courses_avg"]', function() {
            let result = facade.checkValidInitialCoursesKey(["courses_instructor", "courses_avg"]);
            expect(result).to.be.true;
        });
        it('Valid ["courses_instructor", "invalid"]', function() {
            let result = facade.checkValidInitialCoursesKey(["courses_avg", "invalid"]);
            expect(result).to.be.true;
        });
        it('Invalid ["invalid", "courses_avg"]', function() {
            let result = facade.checkValidInitialCoursesKey(["invalid", "courses_avg"]);
            expect(result).to.be.false;
        });
        it('Invalid ["invalid", "rooms_lat"]', function() {
            let result = facade.checkValidInitialCoursesKey(["invalid", "rooms_lat"]);
            expect(result).to.be.false;
        });
        it('Invalid ["rooms_lon", "invalid"]', function() {
            let result = facade.checkValidInitialCoursesKey(["rooms_lon", "invalid"]);
            expect(result).to.be.false;
        });
        it('Invalid []', function() {
            let result = facade.checkValidInitialCoursesKey([]);
            expect(result).to.be.false;
        });
    });

    describe('Valid initial rooms key', function() {
        it('Valid ["rooms_address", "rooms_name"]', function() {
            let result = facade.checkValidInitialRoomsKey(["rooms_address", "rooms_name"]);
            expect(result).to.be.true;
        });
        it('Valid ["rooms_address", "courses_avg"]', function() {
            let result = facade.checkValidInitialRoomsKey(["rooms_address", "courses_avg"]);
            expect(result).to.be.true;
        });
        it('Invalid ["courses_instructor", "courses_avg"]', function() {
            let result = facade.checkValidInitialRoomsKey(["courses_instructor", "courses_avg"]);
            expect(result).to.be.false;
        });
        it('Invalid ["courses_instructor", "invalid"]', function() {
            let result = facade.checkValidInitialRoomsKey(["courses_instructor", "invalid"]);
            expect(result).to.be.false;
        });
        it('Invalid ["invalid", "courses_avg"]', function() {
            let result = facade.checkValidInitialRoomsKey(["invalid", "courses_avg"]);
            expect(result).to.be.false;
        });
        it('Invalid ["invalid", "rooms_lat"]', function() {
            let result = facade.checkValidInitialRoomsKey(["invalid", "rooms_lat"]);
            expect(result).to.be.false;
        });
        it('Valid ["rooms_lon", "invalid"]', function() {
            let result = facade.checkValidInitialRoomsKey(["rooms_lon", "invalid"]);
            expect(result).to.be.true;
        });
        it('Invalid []', function() {
            let result = facade.checkValidInitialCoursesKey([]);
            expect(result).to.be.false;
        });
    });

    describe('Valid rooms queries', function() {
        it('Valid d2QueryA', function() {

            let result = facade.checkQuerySyntax(d2QueryA);
            expect(result).to.be.true;
        });
        it('Valid d2QueryB', function() {
            let result = facade.checkQuerySyntax(d2QueryB);

            expect(result).to.be.true;
        });
    });

    describe('Invalid queries due to rooms and classes', function() {
        it('Invalid simpleCoursesRoomsMismatch', function() {
            let result = facade.checkQuerySyntax(simpleCoursesRoomsMismatch);
            expect(result).to.be.false;
        });
        it('Invalid simpleRoomsCoursesMismatch', function() {
            let result = facade.checkQuerySyntax(simpleRoomsCoursesMismatch);
            expect(result).to.be.false;
        });
        it('Invalid WHERERoomsCoursesMismatch1', function() {
            let result = facade.checkQuerySyntax(WHERERoomsCoursesMismatch1);
            expect(result).to.be.false;
        });
        it('Invalid WHERERoomsCoursesMismatch2', function() {
            let result = facade.checkQuerySyntax(WHERERoomsCoursesMismatch2);
            expect(result).to.be.false;
        });
        it('Invalid OPTIONSRoomsCoursesMismatch1', function() {
            let result = facade.checkQuerySyntax(OPTIONSRoomsCoursesMismatch1);
            expect(result).to.be.false;
        });
        it('Invalid OPTIONSRoomsCoursesMismatch2', function() {
            let result = facade.checkQuerySyntax(OPTIONSRoomsCoursesMismatch2);
            expect(result).to.be.false;
        });
        it('Invalid OPTIONSRoomsCoursesMismatch3', function() {
            let result = facade.checkQuerySyntax(OPTIONSRoomsCoursesMismatch3);
            expect(result).to.be.false;
        });
        it('Invalid OPTIONSRoomsCoursesMismatch4', function() {
            let result = facade.checkQuerySyntax(OPTIONSRoomsCoursesMismatch4);
            expect(result).to.be.false;
        });
        it('Invalid WHEREOPTIONSRoomsCoursesMismatch', function() {
            let result = facade.checkQuerySyntax(WHEREOPTIONSRoomsCoursesMismatch);

            expect(result).to.be.false;
        });
    });


    describe('Invalid rooms m_key', function() {
        it('Invalid rooms m_key', function() {

            let result = facade.checkValidRoomsMKey('invalid');
            expect(result).to.be.false;
            result = facade.checkValidRoomsMKey('ooms_lat');
            expect(result).to.be.false;
            result = facade.checkValidRoomsMKey('courses_lo');
            expect(result).to.be.false;
            result = facade.checkValidRoomsMKey(0);
            expect(result).to.be.false;
            result = facade.checkValidRoomsMKey('courses_avg');
            expect(result).to.be.false;
        });
    });

    describe('Valid rooms m_key', function() {
        it('Correct rooms m_key', function() {

            let result = facade.checkValidRoomsMKey('rooms_lat');
            expect(result).to.be.true;
            result = facade.checkValidRoomsMKey('rooms_lon');
            expect(result).to.be.true;
            result = facade.checkValidRoomsMKey('rooms_seats');
            expect(result).to.be.true;
        });
    });

    describe('Valid rooms s_key', function() {
        it('Correct rooms s_key', function() {

            let result = facade.checkValidRoomsSKey('rooms_fullname');
            expect(result).to.be.true;
            result = facade.checkValidRoomsSKey('rooms_shortname');
            expect(result).to.be.true;
            result = facade.checkValidRoomsSKey('rooms_number');
            expect(result).to.be.true;

            result = facade.checkValidRoomsSKey('rooms_name');
            expect(result).to.be.true;

            result = facade.checkValidRoomsSKey('rooms_address');
            expect(result).to.be.true;
            result = facade.checkValidRoomsSKey('rooms_type');
            expect(result).to.be.true;
            result = facade.checkValidRoomsSKey('rooms_furniture');
            expect(result).to.be.true;
            result = facade.checkValidRoomsSKey('rooms_href');
            expect(result).to.be.true;
        });
    });

    describe('Invalid rooms s_key', function() {
        it('Invalid rooms s_key', function() {

            let result = facade.checkValidRoomsSKey('rooms_seats');
            expect(result).to.be.false;
            result = facade.checkValidRoomsSKey('rooms_lon');
            expect(result).to.be.false;
            result = facade.checkValidRoomsSKey('rooms_lat');
            expect(result).to.be.false;
            result = facade.checkValidRoomsSKey('courses_dept');
            expect(result).to.be.false;
            result = facade.checkValidRoomsSKey(0);
            expect(result).to.be.false;
        });
    });

});
