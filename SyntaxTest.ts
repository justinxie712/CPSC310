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
var anth512: Course;
var testQuery: any;
var testQueryOrder: any;
var testQueryInvalidBody: any;
var testQueryInvalidOptions: any;
var testQueryMissingBody: any;
var testQueryMissingOptions: any;
var testQueryInvalidMKey: any;
var testQueryInvalidOrderString: any;
var testQueryEmptyColumns: any;
var testQueryOrderExtraKey: any;
var testQueryNoOrder: any;
//anth512 = new Course("anth", "512", 85.2, "rosenblum, daisy", "lang & culture", 5, 0, 0, "25235");
anth512 = new Course;
anth512._courses_dept = "anth";
anth512._courses_id = "512";
anth512._courses_avg = 85.2;
anth512._courses_instructor = "rosenblum, daisy";
anth512._courses_title = "lang & culture";
anth512._courses_pass = 5;
anth512._courses_fail = 0;
anth512._courses_audit = 0;
anth512._courses_uuid = "25235";

facade = new InsightFacade();
testQuery = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}
testQueryOrder = {"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}, "WHERE":{"EQ":{"courses_avg":85.2}}}
testQueryInvalidBody = {"WHEREINVALID":{"EQ":{"courses_avg":85.2}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}
testQueryInvalidOptions = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONSINVALID":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}
testQueryInvalidOptions = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONSINVALID":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}
testQueryMissingBody = {"EQ":{"courses_avg":85.2},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}
testQueryMissingOptions = {"WHERE":{"EQ":{"courses_avg":85.2}},"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}
testQueryInvalidMKey = {"WHERE":{"EQ":{"courses_avginvalid":85.2}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}}
testQueryInvalidOrderString = {"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_depts"}, "WHERE":{"EQ":{"courses_avg":85.2}}}
testQueryEmptyColumns = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONS":{"COLUMNS":[],"ORDER":"courses_dept"}}
testQueryOrderExtraKey = {"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":{"Extra Key": "courses_depts"}}, "WHERE":{"EQ":{"courses_avg":85.2}}}
testQueryNoOrder = {"WHERE":{"EQ":{"courses_avg":85.2}},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"]}}

describe("SyntaxTest", function () {
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

    describe('Check if filter is a valid NEGATION', function() {
        it('Valid NEGATION', function() {


            let result = facade.checkCoursesBodySyntax({"NOT":{"EQ":{"courses_avg":85.2}}});
            expect(result).to.be.true;
            result = facade.checkCoursesBodySyntax({"NOT":{"GT":{"courses_avg":85.2}}});
            expect(result).to.be.true;
            result = facade.checkCoursesBodySyntax({"NOT": {"LT":{"courses_avg":85.2}}});
            expect(result).to.be.true;
            result = facade.checkCoursesBodySyntax({"NOT": {"LT":{"courses_avg":85.2}, "EQ":{"courses_avg":85.2}}});
            expect(result).to.be.false;
            result = facade.checkCoursesBodySyntax({"NOT": {"INVALID":{"courses_avg":85.2}}});
            expect(result).to.be.false;
            result = facade.checkCoursesBodySyntax({"NOT": {"IS":{"courses_dept":"anth"}}});
            expect(result).to.be.true;
            result = facade.checkCoursesBodySyntax({"INVALID": {"EQ":{"courses_avg":85.2}}});
            expect(result).to.be.false;
            result = facade.checkCoursesBodySyntax({"NOT":{"OR":[{"AND":[{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}]}});
            expect(result).to.be.true;
            result = facade.checkCoursesBodySyntax({"NOT":{"OR":[{"AND":[{"NOT": {"EQ":{"courses_avg":85.2}}}, {"IS":{"courses_dept":"anth"}}]}]}});
            expect(result).to.be.true;
            result = facade.checkCoursesBodySyntax([0, 1]);
            expect(result).to.be.false;

        });
    });

    describe('Check NEGATIONCOMPARATOR', function() {
        it('Valid NEGATION', function() {

            let result = facade.checkCoursesNegationSyntax({"EQ":{"courses_avg":85.2}});
            expect(result).to.be.true;
            result = facade.checkCoursesNegationSyntax({"NOT":{"GT":{"courses_avg":85.2}}});
            expect(result).to.be.true;
            result = facade.checkCoursesNegationSyntax({"NOT": {"LT":{"courses_avg":85.2}}});
            expect(result).to.be.true;
            result = facade.checkCoursesNegationSyntax({"NOT": {"LT":{"courses_avg":85.2}, "EQ":{"courses_avg":85.2}}});
            expect(result).to.be.false;
            result = facade.checkCoursesNegationSyntax({"NOT": {"INVALID":{"courses_avg":85.2}}});
            expect(result).to.be.false;
            result = facade.checkCoursesNegationSyntax({"NOT": {"IS":{"courses_dept":"anth"}}});
            expect(result).to.be.true;
            result = facade.checkCoursesNegationSyntax({"INVALID": {"EQ":{"courses_avg":85.2}}});
            expect(result).to.be.false;
            result = facade.checkCoursesNegationSyntax({"NOT":{"OR":[{"AND":[{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}]}});
            expect(result).to.be.true;
            result = facade.checkCoursesNegationSyntax({"NOT":{"NOT":{"EQ":{"courses_avg":85.2}}}});
            expect(result).to.be.true;
            result = facade.checkCoursesNegationSyntax({"NOT":{"OR":[{"NOT": {"AND":[{"NOT": {"EQ":{"courses_avg":85.2}}}, {"IS":{"courses_dept":"anth"}}]}}]}});
            expect(result).to.be.true;
            result = facade.checkCoursesNegationSyntax({"NOT":{"OR":[{"AND":[{"NOTA": {"EQ":{"courses_avg":85.2}}}, {"IS":{"courses_dept":"anth"}}]}]}});
            expect(result).to.be.false;
            result = facade.checkCoursesNegationSyntax([0, 1]);
            expect(result).to.be.false;

        });
    });

    describe('Check if query is valid', function() {
        it('Valid query', function() {
            let result = facade.checkQuerySyntax(testQuery);
            expect(result).to.be.true;
            result = facade.checkQuerySyntax(testQueryOrder);
            expect(result).to.be.true;
            result = facade.checkQuerySyntax(testQueryInvalidBody);
            expect(result).to.be.false;

            result = facade.checkQuerySyntax(testQueryInvalidOptions);
            expect(result).to.be.false;

            result = facade.checkQuerySyntax(testQueryMissingBody);
            expect(result).to.be.false;

            result = facade.checkQuerySyntax(testQueryMissingOptions);
            expect(result).to.be.false;

            result = facade.checkQuerySyntax(testQueryInvalidMKey);
            expect(result).to.be.false;

            result = facade.checkQuerySyntax(testQueryInvalidOrderString);
            expect(result).to.be.false;

            result = facade.checkQuerySyntax(testQueryEmptyColumns);
            expect(result).to.be.false;
            result = facade.checkQuerySyntax(testQueryOrderExtraKey);
            expect(result).to.be.false;
            result = facade.checkQuerySyntax(testQueryNoOrder);
            expect(result).to.be.true;
            result = facade.checkQuerySyntax([0, 1]);
            expect(result).to.be.false;

            result = facade.checkQuerySyntax({"WHERE":{"OR":[{"AND":[{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}});
            expect(result).to.be.true;
            result = facade.checkQuerySyntax({"WHERE":{"OR":[{"AND":[{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}]},"OPTIONS":{"ORDER":"courses_dept"}});
            expect(result).to.be.false;
            result = facade.checkQuerySyntax({"WHERE":{"OR":[{"AND":[{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"]}});
            expect(result).to.be.true;

        });
    });

    describe('Check if courses portion of query is valid', function() {
        it('Valid courses query', function() {

            let result = facade.checkCoursesQuerySyntax(testQuery);
            expect(result).to.be.true;
            result = facade.checkCoursesQuerySyntax(testQueryOrder);
            expect(result).to.be.true;
            result = facade.checkCoursesQuerySyntax(testQueryInvalidMKey);
            expect(result).to.be.false;
            result = facade.checkCoursesQuerySyntax(testQueryInvalidOrderString);
            expect(result).to.be.false;
            result = facade.checkCoursesQuerySyntax(testQueryEmptyColumns);
            expect(result).to.be.false;
            result = facade.checkCoursesQuerySyntax(testQueryOrderExtraKey);
            expect(result).to.be.false;
            result = facade.checkCoursesQuerySyntax(testQueryNoOrder);
            expect(result).to.be.true;
            result = facade.checkCoursesQuerySyntax({"WHERE":{"OR":[{"AND":[{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"}});
            expect(result).to.be.true;
            result = facade.checkCoursesQuerySyntax({"WHERE":{"OR":[{"AND":[{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}]},"OPTIONS":{"COLUMNS":["courses_dept","courses_id"]}});
            expect(result).to.be.true;

        });
    });


    describe('Check if query has a valid body/options', function() {
        it('Valid body/options', function() {
            let result = facade.checkValidBodyOptionsClauses(testQuery);
            expect(result).to.be.true;
            result = facade.checkValidBodyOptionsClauses(testQueryOrder);
            expect(result).to.be.true;
            result = facade.checkValidBodyOptionsClauses(testQueryInvalidBody);
            expect(result).to.be.false;
            result = facade.checkValidBodyOptionsClauses(testQueryInvalidOptions);
            expect(result).to.be.false;
            result = facade.checkValidBodyOptionsClauses(testQueryMissingBody);
            expect(result).to.be.false;
            result = facade.checkValidBodyOptionsClauses(testQueryMissingOptions);
            expect(result).to.be.false;
            result = facade.checkValidBodyOptionsClauses([0, 1]);
            expect(result).to.be.false;
        });
    });

    describe('Check if query has a valid initial filter (MCOMPARISON)', function() {
        it('Valid initial filter (MCOMPARISON)', function() {

            let result = facade.checkCoursesBodySyntax({"EQ":{"courses_avg":85.2}});
            expect(result).to.be.true;
            result = facade.checkCoursesBodySyntax({"GT":{"courses_avg":85.2}});
            expect(result).to.be.true;
            result = facade.checkCoursesBodySyntax({"LT":{"courses_avg":85.2}});
            expect(result).to.be.true;
            result = facade.checkCoursesBodySyntax({"LT":{"courses_avg":85.2}, "EQ":{"courses_avg":85.2}});
            expect(result).to.be.false;
            result = facade.checkCoursesBodySyntax({"INVALID":{"courses_avg":85.2}});
            expect(result).to.be.false;
            result = facade.checkCoursesBodySyntax({0:{"courses_avg":85.2}});
            expect(result).to.be.false;
            result = facade.checkCoursesBodySyntax({"E":{"courses_avg":85.2}});
            expect(result).to.be.false;
            result = facade.checkCoursesBodySyntax({"EQA":{"courses_avg":85.2}});
            expect(result).to.be.false;
            result = facade.checkCoursesBodySyntax({"EQ":{"courses_avg":"invalid - not a number"}});
            expect(result).to.be.false;
            result = facade.checkCoursesBodySyntax([0, 1]);
            expect(result).to.be.false;
            result = facade.checkCoursesBodySyntax({"OR":[{"AND":[{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}]});
            expect(result).to.be.true;
        });
    });

    describe('Check if query has a valid initial filter (SCOMPARISON)', function() {
        it('Valid initial filter (SCOMPARISON)', function() {
            let result = facade.checkCoursesBodySyntax({"IS":{"courses_dept":"anth"}});
            expect(result).to.be.true;
            result = facade.checkCoursesBodySyntax({"IS":{"INVALID":"anth"}});
            expect(result).to.be.false;
            result = facade.checkCoursesBodySyntax({"ISA": {"courses_dept":"1234"}});
            expect(result).to.be.false;
            result = facade.checkCoursesBodySyntax({" IS": {"courses_dept":"1234"}});
            expect(result).to.be.false;
        });
    });

    describe('Check if filter is a valid SCOMPARISON', function() {
        it('Valid SCOMPARISON', function() {
            let result = facade.checkCoursesSComparisonSyntax({"courses_dept":"anth"});
            expect(result).to.be.true;
            result = facade.checkCoursesSComparisonSyntax({"courses_dept":"1234"});
            expect(result).to.be.true;
            result = facade.checkCoursesSComparisonSyntax({"courses_uuid":"1234"});
            expect(result).to.be.true;
            result = facade.checkCoursesSComparisonSyntax({"courses_dept":null});
            expect(result).to.be.false;
            result = facade.checkCoursesSComparisonSyntax({"courses_depta":"anth"});
            expect(result).to.be.false;
            result = facade.checkCoursesSComparisonSyntax({" courses_dept":"anth"});
            expect(result).to.be.false;
        });
    });

    describe('Check if filter is a valid LOGICCOMPARISON', function() {
        it('Valid LOGICCOMPARISON', function() {

            let result = facade.checkCoursesLogicComparisonSyntax([{ "GT":{ "courses_avg":85.2}},{"IS":{"courses_dept":"anth"}}]);
            expect(result).to.be.true;
            result = facade.checkCoursesLogicComparisonSyntax([]);
            expect(result).to.be.false;
            result = facade.checkCoursesLogicComparisonSyntax([{"AND":[{"GT":{"courses_avg":90}}, {"IS":{"courses_dept":"adhe"}}]}]);
            expect(result).to.be.true;
            result = facade.checkCoursesLogicComparisonSyntax([{"AND":[{"GT":{"courses_avg":90}}, {"AND":[{"IS":{"courses_dept":"adhe"}}, {"OR": [{"GT":{"courses_avg":90}}]}]}]}]);
            expect(result).to.be.true;
            result = facade.checkCoursesLogicComparisonSyntax([{"AND":[{"GT":{"courses_avg":90}}, {"AND":{"courses_dept":"adhe"}}]}]);
            expect(result).to.be.false;
            result = facade.checkCoursesLogicComparisonSyntax([{"INVALID":[{"GT":{"courses_avg":90}}, {"IS":{"courses_dept":"adhe"}}]}]);
            expect(result).to.be.false;
            result = facade.checkCoursesLogicComparisonSyntax([{"OR":[{"GT":{"INVALID":90}}, {"IS":{"courses_dept":"adhe"}}]}]);
            expect(result).to.be.false;
            result = facade.checkCoursesLogicComparisonSyntax([{"AND":[{"IS":{"INVALID":90}}, {"IS":{"courses_dept":"adhe"}}]}]);
            expect(result).to.be.false;
            result = facade.checkCoursesLogicComparisonSyntax([{"AND":[{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}]);
            expect(result).to.be.true;
            result = facade.checkCoursesLogicComparisonSyntax([{"OR":[{"AND": [{"EQ":{"courses_avg":0}}, {"IS":{"courses_dept":"anth"}}]}, {"IS":{"courses_uuid": "25235"}}]}, {"EQ":{"courses_avg":97}}]);
            expect(result).to.be.true;

        });
    });

    describe('Invalid m_key', function() {
        it('Invalid m_key', function() {

            let result = facade.checkValidCoursesMKey('invalid');
            expect(result).to.be.false;
            result = facade.checkValidCoursesMKey('ourses_avg');
            expect(result).to.be.false;
            result = facade.checkValidCoursesMKey('courses_avga');
            expect(result).to.be.false;
            result = facade.checkValidCoursesMKey(0);
            expect(result).to.be.false;
        });
    });

    describe('Valid m_key', function() {
        it('Correct m_key', function() {

            let result = facade.checkValidCoursesMKey('courses_avg');
            expect(result).to.be.true;
            result = facade.checkValidCoursesMKey('courses_pass');
            expect(result).to.be.true;
            result = facade.checkValidCoursesMKey('courses_fail');
            expect(result).to.be.true;
            result = facade.checkValidCoursesMKey('courses_audit');
            expect(result).to.be.true;

            result = facade.checkValidCoursesMKey('courses_year');
            expect(result).to.be.true;
        });
    });

    describe('Invalid s_key', function() {
        it('Invalid s_key', function() {

            let result = facade.checkValidCoursesSKey('invalid');
            expect(result).to.be.false;
            result = facade.checkValidCoursesSKey('ourses_dept');
            expect(result).to.be.false;
            result = facade.checkValidCoursesSKey('courses_depta');
            expect(result).to.be.false;
            result = facade.checkValidCoursesSKey(0);
            expect(result).to.be.false;
        });
    });

    describe('Valid s_key', function() {
        it('Correct s_key', function() {

            let result = facade.checkValidCoursesSKey('courses_dept');
            expect(result).to.be.true;
            result = facade.checkValidCoursesSKey('courses_id');
            expect(result).to.be.true;
            result = facade.checkValidCoursesSKey('courses_instructor');
            expect(result).to.be.true;
            result = facade.checkValidCoursesSKey('courses_title');
            expect(result).to.be.true;
            result = facade.checkValidCoursesSKey('courses_uuid');
            expect(result).to.be.true;
        });
    });

    describe('Check validity of inputstring', function() {
        it('Check validity of inputstring', function() {
            let result = facade.valid_inputstringWithWildcard('*');
            expect(result).to.be.false;
            result = facade.valid_inputstringWithWildcard('**');
            expect(result).to.be.false;
            result = facade.valid_inputstringWithWildcard('');
            expect(result).to.be.false;
            result = facade.valid_inputstringWithWildcard('*courses_instructor');
            expect(result).to.be.true;
            result = facade.valid_inputstringWithWildcard('courses_title*');
            expect(result).to.be.true;
            result = facade.valid_inputstringWithWildcard('courses_*uuid');
            expect(result).to.be.false;
            result = facade.valid_inputstringWithWildcard('1');
            expect(result).to.be.true;
            result = facade.valid_inputstringWithWildcard('a');
            expect(result).to.be.true;
            result = facade.valid_inputstringWithWildcard('a1c!#^#asha');
            expect(result).to.be.true;
        });
    });

    describe('Test isFunctionWildcardHelper', function() {
        it('Test isFunctionWildcardHelper', function() {
            let result = facade.isFunctionWildcardHelper('*');
            expect(result).to.be.deep.equal('');
            result = facade.isFunctionWildcardHelper('**');
            expect(result).to.be.deep.equal('');
            result = facade.isFunctionWildcardHelper('');
            expect(result).to.be.deep.equal('');
            result = facade.isFunctionWildcardHelper('*courses_instructor');
            expect(result).to.be.deep.equal('courses_instructor');
            result = facade.isFunctionWildcardHelper('*courses_instructor*');
            expect(result).to.be.deep.equal('courses_instructor');
            result = facade.isFunctionWildcardHelper('*courses_instructor');
            expect(result).to.be.deep.equal('courses_instructor');
            result = facade.isFunctionWildcardHelper('courses_title*');
            expect(result).to.be.deep.equal('courses_title');
            result = facade.isFunctionWildcardHelper('courses_*uuid');
            expect(result).to.be.deep.equal('courses_*uuid');
            result = facade.isFunctionWildcardHelper('a1c!#^#asha');
            expect(result).to.be.deep.equal('a1c!#^#asha');
        });
    });

    describe('Test isFunctionMatchHelper', function() {
        it('Test isFunctionMatchHelper', function() {
            //begin with anything
            let result = facade.isFunctionMatchHelper('*asdf', "asdf");
            expect(result).to.be.true;
            result = facade.isFunctionMatchHelper('*asdf', "jkl;asdf");
            expect(result).to.be.true;
            result = facade.isFunctionMatchHelper('*asdf', "asdfjkl;");
            expect(result).to.be.false;
            result = facade.isFunctionMatchHelper('*asdf', "a");
            expect(result).to.be.false;
            result = facade.isFunctionMatchHelper('*asdf', "asef");
            expect(result).to.be.false;
            result = facade.isFunctionMatchHelper('*asdf', "asd");
            expect(result).to.be.false;
            result = facade.isFunctionMatchHelper('asdf*', "asdf");
            expect(result).to.be.true;
            result = facade.isFunctionMatchHelper('asdf*', "jkl;asdf");
            expect(result).to.be.false;
            result = facade.isFunctionMatchHelper('asdf*', "asdfjkl;");
            expect(result).to.be.true;
            result = facade.isFunctionMatchHelper('asdf*', "sd");
            expect(result).to.be.false;
            result = facade.isFunctionMatchHelper('asdf*', "asef");
            expect(result).to.be.false;
            result = facade.isFunctionMatchHelper('asdf*', "asd");
            expect(result).to.be.false;
            result = facade.isFunctionMatchHelper('*asdf*', "asdf");
            expect(result).to.be.true;
            result = facade.isFunctionMatchHelper('*asdf*', "jkl;asdf");
            expect(result).to.be.true;
            result = facade.isFunctionMatchHelper('*asdf*', "asdfjkl;");
            expect(result).to.be.true;
            result = facade.isFunctionMatchHelper('*asdf*', "jkl;asdfjkl;");
            expect(result).to.be.true;
            result = facade.isFunctionMatchHelper('*asdf*', "asef");
            expect(result).to.be.false;
            result = facade.isFunctionMatchHelper('*asdf*', "asd");
            expect(result).to.be.false;
            result = facade.isFunctionMatchHelper('asdf', "asdf");
            expect(result).to.be.true;
            result = facade.isFunctionMatchHelper('asdf', "asd");
            expect(result).to.be.false;
            result = facade.isFunctionMatchHelper('asdf', "asdfasdf");
            expect(result).to.be.false;
            result = facade.isFunctionMatchHelper('asdf', "asdfasdfasdf");
            expect(result).to.be.false;
        });
    });

    describe('Check if query has a valid options', function() {
        it('Valid options', function() {
            let result = facade.checkValidOptionsClauses({"COLUMNS":["courses_dept","courses_id"],"ORDER":"courses_dept"});
            expect(result).to.be.true;
            result = facade.checkValidOptionsClauses({"ORDER":"courses_dept", "COLUMNS":["courses_dept","courses_id"]});
            expect(result).to.be.true;
            result = facade.checkValidOptionsClauses({"COLUMNSINVALID":["courses_dept","courses_id"],"ORDER":"courses_dept"});
            expect(result).to.be.false;
            result = facade.checkValidOptionsClauses({"COLUMNS":["courses_dept","courses_id"],"ORDERINVALID":"courses_dept"});
            expect(result).to.be.false;
            result = facade.checkValidOptionsClauses({"ORDER":"courses_dept"});
            expect(result).to.be.false;
            result = facade.checkValidOptionsClauses({"COLUMNS":["courses_dept","courses_id"]});
            expect(result).to.be.true;
            result = facade.checkValidOptionsClauses([0, 1]);
            expect(result).to.be.false;
        });
    });

    describe('Check if columns has a valid keys', function() {
        it('Valid options', function() {
            let result = facade.checkCoursesColumnsSyntax(["courses_dept","courses_id", "courses_instructor", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail", "courses_audit" ]);
            expect(result).to.be.true;

            result = facade.checkCoursesColumnsSyntax([]);
            expect(result).to.be.false;

            // removed s after course(s) or added extra character at end of string
            result = facade.checkCoursesColumnsSyntax(["course_dept","courses_id", "courses_instructor", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail", "courses_audit" ]);
            expect(result).to.be.false;
            result = facade.checkCoursesColumnsSyntax(["courses_depts","courses_id", "courses_instructor", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail", "courses_audit" ]);
            expect(result).to.be.false;
            result = facade.checkCoursesColumnsSyntax(["courses_depts","courses_id", "courses_instructor", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail", "course_audit" ]);
            expect(result).to.be.false;
            result = facade.checkCoursesColumnsSyntax(["courses_depts","courses_id", "courses_instructor", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail", "courses_audits" ]);
            expect(result).to.be.false;
            result = facade.checkCoursesColumnsSyntax(["courses_depts","courses_id", "course_instructor", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail", "courses_audits" ]);
            expect(result).to.be.false;
            result = facade.checkCoursesColumnsSyntax(["courses_depts","courses_id", "courses_instructors", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail", "courses_audits" ]);
            expect(result).to.be.false;

            // m_keys, s_keys
            result = facade.checkCoursesColumnsSyntax(["courses_dept","courses_id", "courses_instructor", "courses_title", "courses_uuid"]);
            expect(result).to.be.true;
            result = facade.checkCoursesColumnsSyntax(["courses_avg", "courses_pass", "courses_fail", "courses_audit" ]);
            expect(result).to.be.true;

            // non-string
            result = facade.checkCoursesColumnsSyntax([0, 1, 2]);
            expect(result).to.be.false;

        });
    });

    describe('Check if order has a valid key', function() {
        it('Valid order', function() {
            let result = facade.checkOrderSyntax("courses_dept", ["courses_dept","courses_id", "courses_instructor", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail", "courses_audit" ]);
            expect(result).to.be.true;
            result = facade.checkOrderSyntax("courses_id", ["courses_id" ]);
            expect(result).to.be.true;
            result = facade.checkOrderSyntax("courses_audit", ["courses_dept","courses_id", "courses_instructor", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail", "courses_audit" ]);
            expect(result).to.be.true;
            result = facade.checkOrderSyntax("courses_title", ["courses_dept","courses_id", "courses_instructor", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail", "courses_audit" ]);
            expect(result).to.be.true;
            result = facade.checkOrderSyntax("courses_invalid", ["courses_dept","courses_id", "courses_instructor", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail", "courses_audit" ]);
            expect(result).to.be.false;
            result = facade.checkOrderSyntax("courses_dept", [,"courses_id", "courses_instructor", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail", "courses_audit" ]);
            expect(result).to.be.false;
            result = facade.checkOrderSyntax("courses_audit", [,"courses_id", "courses_instructor", "courses_title", "courses_uuid", "courses_avg", "courses_pass", "courses_fail" ]);
            expect(result).to.be.false;
            result = facade.checkOrderSyntax("courses_uuid", [,"courses_id", "courses_instructor", "courses_title", "courses_avg", "courses_pass", "courses_fail" ]);
            expect(result).to.be.false;
            result = facade.checkOrderSyntax(0, [,"courses_id", "courses_instructor", "courses_title", "courses_avg", "courses_pass", "courses_fail" ]);
            expect(result).to.be.false;

        });
    });

});
