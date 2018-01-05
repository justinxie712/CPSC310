/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Course from "../src/controller/Course";
var facade: InsightFacade;
var anth512: Course = new Course();
var anth512alt: Course = new Course();
var econ101: Course = new Course();
var math200: Course = new Course();
var zool500: Course = new Course();
var courses: Array<Course>;
var coursestwo: Array<Course>;
var coursesfour: Array<Course>;
var coursesorder1: Array<Course>;
var coursesorder2: Array<Course>;
/*
anth512 = new TempCourse("anth", "512", 85.2, "rosenblum, daisy", "lang & culture", 5, 0, 0, "25235");
anth512alt = new TempCourse("anth", "512", 85.2, "rosenblum, daisy", "lang & culture", 111, 222, 333, "25236");
econ101 = new TempCourse("econ", "101", 80, "econ, econ", "econ 101", 1, 22, 333, "0");
math200 = new TempCourse("math", "200", 75, "math, math", "math 200", 11, 22, 33, "1");
zool500 = new TempCourse("zool", "304", 60, "zool, zool", "zool 500", 135, 2, 151, "2");
*/
zool500._courses_dept = "zool";
zool500._courses_id = "304";
zool500._courses_avg = 60;
zool500._courses_instructor = "zool, zool";
zool500._courses_title = "zool 500";
zool500._courses_pass = 135;
zool500._courses_fail = 2;
zool500._courses_audit = 151;
zool500._courses_uuid = "2";
math200._courses_dept = "math";
math200._courses_id = "200";
math200._courses_avg = 75;
math200._courses_instructor = "math, math";
math200._courses_title = "math 200";
math200._courses_pass = 11;
math200._courses_fail = 22;
math200._courses_audit = 33;
math200._courses_uuid = "1";
econ101._courses_dept = "econ";
econ101._courses_id = "101";
econ101._courses_avg = 80;
econ101._courses_instructor = "econ, econ";
econ101._courses_title = "econ 101";
econ101._courses_pass = 1;
econ101._courses_fail = 22;
econ101._courses_audit = 333;
econ101._courses_uuid = "0";
anth512alt._courses_dept = "anth";
anth512alt._courses_id = "512";
anth512alt._courses_avg = 85.2;
anth512alt._courses_instructor = "rosenblum, daisy";
anth512alt._courses_title = "lang & culture";
anth512alt._courses_pass = 111;
anth512alt._courses_fail = 222;
anth512alt._courses_audit = 333;
anth512alt._courses_uuid = "25236";
anth512._courses_dept = "anth";
anth512._courses_id = "512";
anth512._courses_avg = 85.2;
anth512._courses_instructor = "rosenblum, daisy";
anth512._courses_title = "lang & culture";
anth512._courses_pass = 5;
anth512._courses_fail = 0;
anth512._courses_audit = 0;
anth512._courses_uuid = "25235";
courses = [anth512];
coursestwo = [anth512, anth512alt];
coursesfour = [anth512, anth512alt, econ101, math200];
coursesorder1 = [econ101, math200, zool500, anth512];
coursesorder2 = [zool500, econ101, anth512, math200];

facade = new InsightFacade();


describe("QuerySyntax", function () {


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

/*
    it("Empty Query", function () {
        var emptyQuery: JSON = JSON.parse('{}');
        // Log.test(JSON.stringify(emptyQuery));
        return facade.performQuery(emptyQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            expect(response.code).to.deep.equal(400) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("Simple Query", function () {

        var simpleQuery: JSON = JSON.parse("{\"WHERE\":{\"GT\":{\"courses_avg\":97}},\"OPTIONS\":{\"COLUMNS\":[\"courses_dept\",\"courses_avg\"],\"ORDER\":\"courses_avg\"}}")

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("Simple Query INVALID WHERE", function () {

        var simpleQuery: JSON = JSON.parse("{\"INVALID WHERE\":{\"GT\":{\"courses_avg\":97}},\"OPTIONS\":{\"COLUMNS\":[\"courses_dept\",\"courses_avg\"],\"ORDER\":\"courses_avg\"}}")

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            expect(response.code).to.deep.equal(400) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });


    it("Simple Query INVALID OPTIONS", function () {

        var simpleQuery: JSON = JSON.parse("{\"WHERE\":{\"GT\":{\"courses_avg\":97}},\"INVALID OPTIONS\":{\"COLUMNS\":[\"courses_dept\",\"courses_avg\"],\"ORDER\":\"courses_avg\"}}")

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            expect(response).to.deep.equal(null) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("Simple Query - EPSE 596 ONLY", function () {

        var simpleQuery: JSON = JSON.parse("{\"WHERE\":{\"GT\":{\"courses_avg\":97}},\"OPTIONS\":{\"COLUMNS\":[\"courses_dept\"],\"ORDER\":\"courses_avg\"}}")

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            expect(response.body).to.deep.equal({
                result:
                    [ { courses_dept: 'epse', courses_avg: 97.09 }]}) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

*/

    describe('Select all - match', function() {
        it('Select dept and avg', function() {
            let result = facade.columnSelect(["courses_dept", "courses_id", "courses_avg", "courses_instructor", "courses_title", "courses_pass", "courses_fail", "courses_audit", "courses_uuid" ], courses);
            //console.log(result);
            expect(result).to.deep.include.members([["anth", "512", 85.2, "rosenblum, daisy", "lang & culture", 5, 0, 0, "25235"]]);
        });
    });

    describe('Select all - incorrect matches', function() {
        it('Select dept and avg', function() {
            let result = facade.columnSelect(["courses_dept", "courses_id", "courses_avg", "courses_instructor", "courses_title", "courses_pass", "courses_fail", "courses_audit", "courses_uuid" ], courses);
            //console.log(result)
            expect(result).not.to.deep.include.members([["anth", "512", null, "invalid", "lang & culture", 5, 0, 0, "25235"]]);
        });
    });

    describe('Select dept and avg - match', function() {
        it('Select dept and avg', function() {
            let result = facade.columnSelect(["courses_dept", "courses_avg"], courses);
            expect(result).to.deep.include.members([["anth", 85.2]]);
        });
    });

    describe('Select dept and avg - incorrect match', function() {
        it('Select dept and avg - incorrect match', function() {
            let result = facade.columnSelect(["courses_dept", "courses_avg"], courses);
            expect(result).not.to.deep.include.members([["anthem", 85.2]]);
        });
    });

    describe('columnSelectHelper Duplicate - match', function() {
        it('columnSelectHelper Duplicate - match', function() {
            let result = facade.columnSelectHelper(["courses_title", "courses_title", "courses_title",]);
            expect(result).to.deep.include.members(["courses_title"]);
            expect(result.length).to.deep.equals(1);
        });
    });

    describe('columnSelectHelper Duplicate - match 1', function() {
        it('columnSelectHelper Duplicate - match 1', function() {
            let result = facade.columnSelectHelper(["courses_title", "courses_instructor", "courses_title",]);
            expect(result).to.deep.include.members(["courses_title", "courses_instructor"]);
            expect(result.length).to.deep.equals(2);
        });
    });

    describe('columnSelectHelper - unique', function() {
        it('columnSelectHelper - unique', function() {
            let result = facade.columnSelectHelper(["courses_title", "courses_instructor", "courses_avg",]);
            expect(result).to.deep.include.members(["courses_title", "courses_instructor", "courses_avg"]);
            expect(result.length).to.deep.equals(3);
        });
    });

    describe('Check EQ - match', function() {
        it('Check EQ - match', function() {
            let result = facade.mcomparisonFunction("EQ", "courses_avg",85.2, courses);
            expect(result).to.deep.include.members([anth512]);
        });
    });

    describe('Check EQ - No match', function() {
        it('Check EQ - No match', function() {
            let result = facade.mcomparisonFunction("EQ", "courses_avg",85.1, courses);
            expect(result).to.deep.include.members([]);
            result = facade.mcomparisonFunction("EQ", "courses_avg",85.3, courses);
            expect(result).to.deep.include.members([]);
        });
    });

    describe('Check LT - match', function() {
        it('Check LT - match', function() {
            let result = facade.mcomparisonFunction("LT", "courses_avg",90, courses);
            expect(result).to.deep.include.members([anth512]);
        });
    });


    describe('Check LT - No match', function() {
        it('Check LT - No match', function() {
            let result = facade.mcomparisonFunction("LT", "courses_avg",85.1, courses);
            expect(result).to.deep.include.members([]);
            result = facade.mcomparisonFunction("LT", "courses_avg",85.2, courses);
            expect(result).to.deep.include.members([]);
        });
    });

    describe('Check GT - match', function() {
        it('Check GT - match', function() {
            let result = facade.mcomparisonFunction("GT", "courses_avg",80, courses);
            expect(result).to.deep.include.members([anth512]);
        });
    });

    describe('Check GT - No match', function() {
        it('Check EQ - No match', function() {
            let result = facade.mcomparisonFunction("GT", "courses_avg",85.3, courses);
            expect(result).to.deep.include.members([]);
            result = facade.mcomparisonFunction("GT", "courses_avg",85.2, courses);
            expect(result).to.deep.include.members([]);
        });
    });

    describe('Check SComparison - match', function() {
        it('Check SComparison - match', function() {
            let result = facade.scomparisonFunction( "courses_dept","anth", courses);
            expect(result).to.deep.include.members([anth512]);
            result = facade.scomparisonFunction( "courses_id","512", courses);
            expect(result).to.deep.include.members([anth512]);
            result = facade.scomparisonFunction( "courses_instructor","rosenblum, daisy", courses);
            expect(result).to.deep.include.members([anth512]);
            result = facade.scomparisonFunction( "courses_title","lang & culture", courses);
            expect(result).to.deep.include.members([anth512]);
            result = facade.scomparisonFunction( "courses_uuid","25235", courses);
            expect(result).to.deep.include.members([anth512]);
        });
    });

    //[{ "EQ":{ "courses_avg":85.2}},{"IS":{"courses_dept":"anth"}}]
    describe('Check Negation', function() {
        it('Check Negation - and match', function() {
            let result = facade.negationFunction(  {"NOT": {"AND": [{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}}, coursesfour);
            expect(result).to.deep.include.members([math200, econ101]);
        });
        it('Check Negation - EQ', function() {
            let result = facade.negationFunction(  {"NOT": {"EQ":{"courses_avg":85.2}}}, coursesfour);
            expect(result).to.deep.include.members([math200, econ101]);
        });
        it('Check Negation - LT', function() {
            let result = facade.negationFunction(  {"NOT": {"LT":{"courses_avg":85.2}}}, coursesfour);
            expect(result).to.deep.include.members([anth512, anth512alt]);
        });
        it('Check Negation - GT', function() {
            let result = facade.negationFunction(  {"NOT": {"GT":{"courses_avg":85.2}}}, coursesfour);
            expect(result).to.deep.include.members([math200, econ101, anth512, anth512alt]);
        });
        it('Check Double Negation - and match', function() {
            let result = facade.negationFunction(  {"NOT":{"NOT": {"AND": [{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}}}, coursesfour);
            expect(result).to.deep.include.members([anth512, anth512alt]);
        });

        it('Check Negation - OR nested', function() {
            let result = facade.negationFunction( {"NOT": {"OR": [{"AND": [{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}, {"EQ":{"courses_avg":97}}]}}, coursesfour);
            expect(result).to.deep.include.members([math200, econ101]);
        });

        it('Check Negation - OR nested AND is empty', function() {
            let result = facade.negationFunction( {"NOT": {"OR": [{"AND": [{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"EQ":{"courses_avg":97}}]}}, coursesfour);
            //console.log(result)
            expect(result).to.deep.include.members([anth512, anth512alt, econ101, math200]);
        });
        it('Check Double Negation - OR nested AND is empty', function() {
            let result = facade.negationFunction( {"NOT": {"NOT": {"OR": [{"AND": [{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"EQ":{"courses_avg":97}}]}}}, coursesfour);
            //console.log(result)
            expect(result).not.to.deep.include.members([anth512, anth512alt, econ101, math200]);
        });
        it('Check Nested Double Negation - OR nested AND is empty', function() {
            let result = facade.negationFunction( {"NOT": {"NOT": {"OR": [{"AND": [{"NOT": {"EQ":{"courses_avg":0}}}, {"IS":{"courses_dept":"anth"}}]}, {"EQ":{"courses_avg":97}}]}}}, coursesfour);
            //console.log(result)
            expect(result).not.to.deep.include.members([econ101, math200]);
        });
        it('Check performQuery Negation', function() {
            let result = facade.negationFunction( {"NOT":{"OR":[{"AND":[{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"IS":{"courses_dept":"math"}}, {"IS":{"courses_dept":"math"}}]}}, coursesfour);
            //console.log(result)
            expect(result).to.deep.include.members([econ101, anth512alt, anth512]);
        });
    });

    //[{ "EQ":{ "courses_avg":85.2}},{"IS":{"courses_dept":"anth"}}]
    describe('Check Logiccomparison - OR', function() {
        it('Check Logiccomparison - OR match', function() {
            let result = facade.logiccomparisonFunction( "OR", {"OR": [{"AND": [{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}]}, courses);
            expect(result).to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - OR nested', function() {
            let result = facade.logiccomparisonFunction( "OR", {"OR": [{"AND": [{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}, {"EQ":{"courses_avg":97}}]}, courses);
            expect(result).to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - OR nested AND is empty', function() {
            let result = facade.logiccomparisonFunction( "OR", {"OR": [{"AND": [{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"EQ":{"courses_avg":97}}]}, courses);
            expect(result).not.to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - OR 1 match first', function() {
            let result = facade.logiccomparisonFunction( "OR", {"OR": [{ "EQ":{ "courses_avg":0}},{"IS":{"courses_dept":"anth"}}]}, courses);
            expect(result).to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - OR 1 match last', function() {
            let result = facade.logiccomparisonFunction( "OR", {"OR": [{ "EQ":{ "courses_avg":85.2}},{"IS":{"courses_dept":"no match"}}]}, courses);
            expect(result).to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - OR no match', function() {
            let result = facade.logiccomparisonFunction( "OR", {"OR": [{ "EQ":{ "courses_avg":0}},{"IS":{"courses_dept":"no match"}}]}, courses);
            expect(result).not.to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - OR nested OR/AND is empty', function() {
            let result = facade.logiccomparisonFunction( "OR", {"OR": [{"OR":[{"AND": [{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"IS":{"courses_uuid": "25235"}}]}, {"EQ":{"courses_avg":97}}]}, courses);
            expect(result).to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - OR nested NOT OR/AND is empty', function() {
            let result = facade.logiccomparisonFunction( "OR", {"OR": [{"NOT": {"OR":[{"AND": [{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"IS":{"courses_uuid": "25235"}}]}}, {"EQ":{"courses_avg":97}}]}, courses);
            //console.log(result);
            expect(result).not.to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - OR nested NOT NOT OR/AND is empty', function() {
            let result = facade.logiccomparisonFunction( "OR", {"OR": [{"NOT": {"NOT": {"OR":[{"AND": [{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"IS":{"courses_uuid": "25235"}}]}}}, {"EQ":{"courses_avg":97}}]}, courses);
            //console.log(result);
            expect(result).to.deep.include.members([anth512]);
        });
    });

    //[{"AND": [{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}, {"EQ":{"courses_avg":97}}]
    //[{ "EQ":{ "courses_avg":85.2}},{"IS":{"courses_dept":"anth"}}]
    describe('Check Logiccomparison - AND match', function() {
        it('Check Logiccomparison - AND match', function() {
            let result = facade.logiccomparisonFunction( "AND", {"AND":[{ "EQ":{ "courses_avg":85.2}},{"IS":{"courses_dept":"anth"}}]}, courses);
            expect(result).to.deep.include.members([anth512]);
            result = facade.logiccomparisonFunction( "AND", {"AND":[{"AND": [{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}, {"EQ":{"courses_avg":85.2}}]}, courses);
            expect(result).to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - AND between 70 and 90', function() {
            let result = facade.logiccomparisonFunction( "AND", {"AND":[{ "LT":{ "courses_avg":90}},{"GT":{"courses_avg":70}}]}, coursesfour);
            expect(result).to.deep.include.members([anth512, anth512alt, math200, econ101]);
            console.log(result);
        });
        it('Check Logiccomparison - AND between 50 and 65', function() {
            let result = facade.logiccomparisonFunction( "AND", {"AND":[{ "LT":{ "courses_avg":65}},{"GT":{"courses_avg":50}}]}, coursesfour);
            console.log(result);
        });
        it('Check Logiccomparison - AND match one only', function() {
            let result = facade.logiccomparisonFunction( "AND", {"AND":[{ "EQ":{ "courses_avg":85.2}},{"IS":{"courses_dept":"anth"}}, {"IS":{"courses_uuid":"25235"}}]}, coursestwo);
            expect(result).to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - AND match one only alt', function() {
            let result = facade.logiccomparisonFunction( "AND", {"AND":[{ "EQ":{ "courses_avg":85.2}},{"IS":{"courses_dept":"anth"}}, {"IS":{"courses_uuid":"25236"}}]}, coursestwo);
            expect(result).to.deep.include.members([anth512alt]);
        });
        it('Check Logiccomparison - AND first no match', function() {
            let result = facade.logiccomparisonFunction( "AND", {"AND":[{ "EQ":{ "courses_avg":0}},{"IS":{"courses_dept":"anth"}}]}, courses);
            expect(result).not.to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - AND last no match', function() {
            let result = facade.logiccomparisonFunction( "AND", {"AND":[{ "EQ":{ "courses_avg":85.2}},{"IS":{"courses_dept":"no match"}}]}, courses);
            expect(result).not.to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - AND both no match', function() {
            let result = facade.logiccomparisonFunction( "AND", {"AND":[{ "EQ":{ "courses_avg":0}},{"IS":{"courses_dept":"no match"}}]}, courses);
            expect(result).not.to.deep.include.members([anth512]);
        });
        it('Check Logiccomparison - NOT AND match', function() {
            let result = facade.logiccomparisonFunction("AND", {"AND": [{"NOT": {"EQ": {"courses_avg": 85.2}}}, {"IS": {"courses_dept": "anth"}}]}, courses);
            expect(result).not.to.deep.include.members([anth512]);
            result = facade.logiccomparisonFunction("AND", {"AND": [{"EQ": {"courses_avg": 85.2}}, {"NOT": {"IS": {"courses_dept": "anth"}}}]}, courses);
            expect(result).not.to.deep.include.members([anth512]);
            result = facade.logiccomparisonFunction("AND", {"AND": [{"AND": [{"EQ": {"courses_avg": 85.2}}, {"IS": {"courses_dept": "anth"}}]}, {"NOT": {"NOT": {"EQ": {"courses_avg": 85.2}}}}]}, courses);
            expect(result).to.deep.include.members([anth512]);
        })
    });

    describe('Test mcomparisonDetails', function() {
        it('Test mcomparisonDetails', function() {
            let result = facade.mcomparisonDetails({ "EQ":{ "courses_avg":85.2}}, courses);
            expect(result).to.deep.include.members([anth512]);
        });
        it('Test mcomparisonDetails', function() {
            let result = facade.mcomparisonDetails({ "GT":{ "courses_avg":85.2}}, courses);
            expect(result).not.to.deep.include.members([anth512]);
        });
    });

    describe('Test scomparisonDetails', function() {
        it('Test scomparisonDetails', function() {
            let result = facade.scomparisonDetails({ "IS":{ "courses_dept":"anth"}}, courses);
            expect(result).to.deep.include.members([anth512]);
        });
        it('Test scomparisonDetails', function() {
            let result = facade.scomparisonDetails({ "IS":{ "courses_dept":"INVALID"}}, courses);
            expect(result).not.to.deep.include.members([anth512]);
        });
    });

    describe('Check sComparison - no match', function() {
        it('Check EQ - match', function() {
            let result = facade.scomparisonFunction( "courses_avg","no match", courses);
            expect(result).to.deep.include.members([]);
            result = facade.scomparisonFunction( "courses_id","no match", courses);
            expect(result).to.deep.include.members([]);
            result = facade.scomparisonFunction( "courses_instructor","no match", courses);
            expect(result).to.deep.include.members([]);
            result = facade.scomparisonFunction( "courses_title","no match", courses);
            expect(result).to.deep.include.members([]);
            result = facade.scomparisonFunction( "courses_uuid","no match", courses);
            expect(result).to.deep.include.members([]);
        });
    });

    describe('test isFunction', function() {
        it('test isFunction', function() {
            let result = facade.isFunction("courses_dept", "anth", anth512);
            expect(result).to.be.true;
            result = facade.isFunction("courses_id", "512", anth512);
            expect(result).to.be.true;
            result = facade.isFunction("courses_instructor", "rosenblum, daisy", anth512);
            expect(result).to.be.true;
            result = facade.isFunction("courses_title", "lang & culture", anth512);
            expect(result).to.be.true;
            result = facade.isFunction("courses_uuid", "25235", anth512);
            expect(result).to.be.true;
            result = facade.isFunction("courses_dept", "no match", anth512);
            expect(result).to.be.false;
            result = facade.isFunction("courses_id", "no match", anth512);
            expect(result).to.be.false;
            result = facade.isFunction("courses_instructor", "no match", anth512);
            expect(result).to.be.false;
            result = facade.isFunction("courses_title", "no match", anth512);
            expect(result).to.be.false;
            result = facade.isFunction("courses_uuid", "no match", anth512);
            expect(result).to.be.false;
        });
    });

    it("ANTH 512 AVG Present - nested - not a match", function () {

        var nestedQuery = {"WHERE":{"OR":[{"AND":[{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}

        return facade.performQuery(nestedQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            Log.test("result");
            //console.log(response.body)
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            console.log(response.body)
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 AVG Present - nested - not a match - no order", function () {

        var nestedQuery = {"WHERE":{"OR":[{"AND":[{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"]}}

        return facade.performQuery(nestedQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            Log.test("result");
            //console.log(response.body)
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 AVG Present - nested - find math", function () {

        var nestedQuery = {"WHERE":{"OR":[{"AND":[{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"IS":{"courses_dept":"math"}}, {"IS":{"courses_dept":"math"}}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}

        return facade.performQuery(nestedQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            Log.test("result");
            console.log(response.body)
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 AVG Present - nested - find math - no order", function () {

        var nestedQuery = {"WHERE":{"OR":[{"AND":[{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"IS":{"courses_dept":"math"}}, {"IS":{"courses_dept":"math"}}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"]}}

        return facade.performQuery(nestedQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            Log.test("result");
            console.log(response.body)
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 AVG Present - nested - find complement of math", function () {

        var nestedQuery = {"WHERE":{"NOT":{"OR":[{"AND":[{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"IS":{"courses_dept":"math"}}, {"IS":{"courses_dept":"math"}}]}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}

        return facade.performQuery(nestedQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            Log.test("result");
            console.log(response.body)
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            Log.test('Error Code: ' + response.body);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 AVG Present - nested - find complement of complement of math", function () {

        var nestedQuery = {"WHERE":{"NOT": {"NOT":{"OR":[{"AND":[{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"IS":{"courses_dept":"math"}}, {"IS":{"courses_dept":"math"}}]}}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id", "courses_audit"],"ORDER":"courses_dept"}}

        return facade.performQuery(nestedQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            Log.test("result");
            console.log(response.body)
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            Log.test('Error Code: ' + response.body);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 AVG Present - nested - match", function () {

        var nestedQuery = {"WHERE":{"OR":[{"AND":[{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}

        return facade.performQuery(nestedQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            Log.test("result");
            //console.log(response.body)
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 AVG Present - double or - match", function () {

        var nestedQuery = {"WHERE":{"OR": [{"OR":[{"AND": [{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"IS":{"courses_uuid": "25235"}}]}, {"EQ":{"courses_avg":97}}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}

        return facade.performQuery(nestedQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            Log.test("result");
            //console.log(response.body);
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            Log.test('Error Code: ' + response.body);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 AVG Present - double and - match", function () {

        var nestedQuery = {"WHERE":{"AND": [{"AND":[{"OR": [{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"IS":{"courses_uuid": "25235"}}]}, {"EQ":{"courses_avg":85.2}}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}

        return facade.performQuery(nestedQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            Log.test("result");
            //console.log(response.body);
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            Log.test('Error Code: ' + response.body);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("Or performQuery on different keys", function () {

        var nestedQuery = {"WHERE":{"OR": [{"IS":{"courses_dept": "*ath"}},{"EQ": {"courses_avg": 85.2}}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id", "courses_avg"],"ORDER":"courses_dept"}}

        return facade.performQuery(nestedQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            Log.test("result");
            console.log(response.body);
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            Log.test('Error Code: ' + response.body);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 AVG Present - double and - not match", function () {

        var nestedQuery = {"WHERE":{"AND": [{"AND":[{"OR": [{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"IS":{"courses_uuid": "25235"}}]}, {"EQ":{"courses_avg":0}}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}

        return facade.performQuery(nestedQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            Log.test("result");
            //console.log(response.body)
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            Log.test('Error Code: ' + response.body);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 AVG Present", function () {

        var simpleQuery = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            //console.log(response.body)
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 DEPT Present", function () {

        var simpleQuery = {"WHERE":{"IS":{"courses_dept":"anth"}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 DEPT Not Present", function () {

        var simpleQuery = {"WHERE":{"IS":{"courses_dept":"no match"}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 AVG Not Present", function () {

        var simpleQuery = {"WHERE":{"EQ":{"courses_avg":70}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            expect(response.code).to.deep.equal(200) // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect.fail(); // .fail() if it should fulfill, check response otherwise
        });
    });

    it("ANTH 512 AVG DUPLICATE WHERE KEY", function () {

        var simpleQuery: JSON = JSON.parse("{\"WHERE\":{\"EQ\":{\"courses_avg\":85.2}},\"DUPLICATEWHERE\":{\"EQ\":{\"courses_avg\":85.2}}, \"OPTIONS\":{\"COLUMNS\":[\"courses_dept\",\"courses_id\"],\"ORDER\":\"courses_dept\"}}")

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            expect.fail() // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            Log.test('Error Body: ' + response.body);
            expect(response.code).to.deep.equal(400);
        });
    });

    it("ANTH 512 AVG DUPLICATE FILTER KEY", function () {

        var equals = {"EQ" : {"courses_avg" : 85.2}}

        var simpleQuery: JSON = JSON.parse("{\"WHERE\":{\"EQ\":{\"courses_avg\":85.2}, \"DUPLICATEGT\":{\"courses_uuid\":25235}},\"OPTIONS\":{\"COLUMNS\":[\"courses_dept\",\"courses_id\"],\"ORDER\":\"courses_dept\"}}")

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            expect.fail() // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            Log.test('Error Body: ' + response.body);
            expect(response.code).to.deep.equal(400);
        });
    });

    it("ANTH 512 AVG DUPLICATE ORDER KEY", function () {

        var simpleQuery: JSON = JSON.parse("{\"WHERE\":{\"EQ\":{\"courses_avg\":85.2}},\"OPTIONS\":{\"COLUMNS\":[\"courses_dept\",\"courses_id\"],\"ORDER\":\"courses_dept\", \"DULPLICATEORDER\":\"courses_dept\"}}")

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            expect.fail() // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            Log.test('Error Body: ' + response.body);
            expect(response.code).to.deep.equal(400);
        });
    });

    it("ANTH 512 AVG Columns String Case", function () {

        var simpleQuery = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONS":{"COLUMNS":"courses_dept","ORDER":"courses_dept"}}

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            expect.fail() // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            expect(response.code).to.deep.equal(400);
        });
    });

    it("ANTH 512 AVG Columns Invalid Case", function () {

        var simpleQuery = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONS":{"COLUMNS":0,"ORDER":"courses_dept"}}

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            expect.fail() // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            Log.test('Error Body: ' + response.body);
            expect(response.code).to.deep.equal(400);
        });
    });

    it("ANTH 512 AVG Order Invalid Case", function () {

        var simpleQuery = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":0}}

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            expect.fail() // .fail() if it should reject, check response otherwise
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            Log.test('Error Body: ' + response.body);
            expect(response.code).to.deep.equal(400);
        });
    });

    it("Average between 70 and 90 ", function () {

        var simpleQuery = {"WHERE":{"AND":[{ "OR": [{"EQ":{ "courses_avg":80}}, { "LT":{ "courses_avg":80}}]},{ "OR": [{"EQ":{ "courses_avg":70}}, { "GT":{ "courses_avg":70}}]}]}, "OPTIONS":{"COLUMNS":["courses_dept","courses_id", "courses_instructor", "courses_avg"]}}

        Log.test(JSON.stringify(simpleQuery));
        return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
            Log.test('Code: ' + response.code);
            Log.test('Body: ' + response.body);
            console.log(response.body)
            expect(response.code).to.deep.equal(200);
        }).catch(function (response: InsightResponse) {
            Log.test('Error Code: ' + response.code);
            Log.test('Error Body: ' + response.body);
            expect.fail();
        });
    });


    /*
    coursesorder1 = [econ101, math200, zool500, anth512];
    coursesorder2 = [zool500, econ101, anth512, math200];
    anth512 = new TempCourse("anth", "512", 85.2, "rosenblum, daisy", "lang & culture", 5, 0, 0, "25235");
    econ101 = new TempCourse("econ", "101", 80, "econ, econ", "econ 101", 1, 22, 333, "0");
    math200 = new TempCourse("math", "200", 75, "math, math", "math 200", 11, 22, 33, "1");
    zool500 = new TempCourse("zool", "304", 60, "zool, zool", "zool 500", 135, 2, 151, "2");
    */
    // TODO: discuss how to deal with ties
    describe('Order tests', function() {
        it('Order test: dept1', function() {
            let result = facade.orderFunction(coursesorder1, "courses_dept");
            expect(result[0]).to.deep.equals(anth512);
            expect(result[1]).to.deep.equals(econ101);
            expect(result[2]).to.deep.equals(math200);
            expect(result[3]).to.deep.equals(zool500);
        });
        it('Order test: dept2', function() {
            let result = facade.orderFunction(coursesorder2, "courses_dept");
            expect(result[0]).to.deep.equals(anth512);
            expect(result[1]).to.deep.equals(econ101);
            expect(result[2]).to.deep.equals(math200);
            expect(result[3]).to.deep.equals(zool500);
        });
        it('Order test: id1', function() {
            let result = facade.orderFunction(coursesorder1, "courses_id");
            expect(result[3]).to.deep.equals(anth512);
            expect(result[0]).to.deep.equals(econ101);
            expect(result[1]).to.deep.equals(math200);
            expect(result[2]).to.deep.equals(zool500);
        });
        it('Order test: id2', function() {
            let result = facade.orderFunction(coursesorder2, "courses_id");
            expect(result[3]).to.deep.equals(anth512);
            expect(result[0]).to.deep.equals(econ101);
            expect(result[1]).to.deep.equals(math200);
            expect(result[2]).to.deep.equals(zool500);
        });
        it('Order test: avg1', function() {
            let result = facade.orderFunction(coursesorder1, "courses_avg");
            expect(result[0]._courses_dept).to.deep.equals("anth");
            expect(result[1]._courses_dept).to.deep.equals("econ");
            expect(result[2]._courses_dept).to.deep.equals("math");
            expect(result[3]._courses_dept).to.deep.equals("zool");
        });
        it('Order test: avg2', function() {
            let result = facade.orderFunction(coursesorder2, "courses_avg");
            expect(result[0]._courses_dept).to.deep.equals("anth");
            expect(result[1]._courses_dept).to.deep.equals("econ");
            expect(result[2]._courses_dept).to.deep.equals("math");
            expect(result[3]._courses_dept).to.deep.equals("zool");
        });
        it('Order test: instructor1', function() {
            let result = facade.orderFunction(coursesorder1, "courses_instructor");
            expect(result[2]._courses_dept).to.deep.equals("anth");
            expect(result[0]._courses_dept).to.deep.equals("econ");
            expect(result[1]._courses_dept).to.deep.equals("math");
            expect(result[3]._courses_dept).to.deep.equals("zool");
        });
        it('Order test: instructor2', function() {
            let result = facade.orderFunction(coursesorder2, "courses_instructor");
            expect(result[2]._courses_dept).to.deep.equals("anth");
            expect(result[0]._courses_dept).to.deep.equals("econ");
            expect(result[1]._courses_dept).to.deep.equals("math");
            expect(result[3]._courses_dept).to.deep.equals("zool");
        });
        it('Order test: title1', function() {
            let result = facade.orderFunction(coursesorder1, "courses_title");
            expect(result[1]._courses_dept).to.deep.equals("anth");
            expect(result[0]._courses_dept).to.deep.equals("econ");
            expect(result[2]._courses_dept).to.deep.equals("math");
            expect(result[3]._courses_dept).to.deep.equals("zool");
        });
        it('Order test: title2', function() {
            let result = facade.orderFunction(coursesorder2, "courses_title");
            expect(result[1]._courses_dept).to.deep.equals("anth");
            expect(result[0]._courses_dept).to.deep.equals("econ");
            expect(result[2]._courses_dept).to.deep.equals("math");
            expect(result[3]._courses_dept).to.deep.equals("zool");
        });
        it('Order test: pass1', function() {
            let result = facade.orderFunction(coursesorder1, "courses_pass");
            expect(result[0]._courses_dept).to.deep.equals("zool");
            expect(result[1]._courses_dept).to.deep.equals("math");
            expect(result[2]._courses_dept).to.deep.equals("anth");
            expect(result[3]._courses_dept).to.deep.equals("econ");

        });
        it('Order test: pass2', function() {
            let result = facade.orderFunction(coursesorder2, "courses_pass");
            expect(result[0]._courses_dept).to.deep.equals("zool");
            expect(result[1]._courses_dept).to.deep.equals("math");
            expect(result[2]._courses_dept).to.deep.equals("anth");
            expect(result[3]._courses_dept).to.deep.equals("econ");

        });

        it('Order test: audit1', function() {
            let result = facade.orderFunction(coursesorder1, "courses_audit");
            expect(result[0]._courses_dept).to.deep.equals("econ");
            expect(result[1]._courses_dept).to.deep.equals("zool");
            expect(result[2]._courses_dept).to.deep.equals("math");
            expect(result[3]._courses_dept).to.deep.equals("anth");
        });
        it('Order test: audit2', function() {
            let result = facade.orderFunction(coursesorder1, "courses_audit");
            expect(result[0]._courses_dept).to.deep.equals("econ");
            expect(result[1]._courses_dept).to.deep.equals("zool");
            expect(result[2]._courses_dept).to.deep.equals("math");
            expect(result[3]._courses_dept).to.deep.equals("anth");
        });
        it('Order test: uuid1', function() {
            let result = facade.orderFunction(coursesorder1, "courses_uuid");
            expect(result[0]._courses_dept).to.deep.equals("econ");
            expect(result[2]._courses_dept).to.deep.equals("zool");
            expect(result[1]._courses_dept).to.deep.equals("math");
            expect(result[3]._courses_dept).to.deep.equals("anth");
        });
        it('Order test: uuid2', function() {
            let result = facade.orderFunction(coursesorder1, "courses_uuid");
            expect(result[0]._courses_dept).to.deep.equals("econ");
            expect(result[2]._courses_dept).to.deep.equals("zool");
            expect(result[1]._courses_dept).to.deep.equals("math");
            expect(result[3]._courses_dept).to.deep.equals("anth");
        });

        it('Order test: fail1', function() {
            let result = facade.orderFunction(coursesorder1, "courses_fail");
            expect(result[0]).to.deep.equals(econ101);
            expect(result[1]).to.deep.equals(math200);
            expect(result[2]).to.deep.equals(zool500);
            expect(result[3]).to.deep.equals(anth512);
        });
        /*
        it('Order test: fail3', function() {
            let result = facade.orderFunction(coursesorder2, "courses_fail");
            console.log(result);
            expect(result[0]).to.deep.equals(econ101);
            expect(result[1]).to.deep.equals(math200);
            expect(result[2]).to.deep.equals(zool500);
            expect(result[3]).to.deep.equals(anth512);
        });
        */

    });

    describe('Test resultsToObj', function() {
        it('Test resultsToObj', function() {
            let result = facade.resultToObj(['courses_dept', 'courses_id', 'courses_avg'],  [ [ 'anth', '512', 100 ], [ 'anth', '512', 3 ], [ 'econ', '101', 35 ] ]);
        });
    });

});
