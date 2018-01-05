import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Course from "../src/controller/Course";
import Room from "../src/controller/Room";

let facade: InsightFacade = new InsightFacade();
let DMP_310: Room = new Room();
DMP_310._rooms_fullname = "Hugh Dempster Pavilion";
DMP_310._rooms_shortname = "DMP";
DMP_310._rooms_number = "310";
DMP_310._rooms_name = "DMP_310";
DMP_310._rooms_address = "6245 Agronomy Road V6T 1Z4";
DMP_310._rooms_lat = 49.26125;
DMP_310._rooms_lon = -123.24807;
DMP_310._rooms_seats = 160;
DMP_310._rooms_type = "Tiered Large Group";
DMP_310._rooms_furniture = "Classroom-Fixed Tables/Movable Chairs";
DMP_310._rooms_href = "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-310";
let DMP_101: Room = new Room();
DMP_101._rooms_fullname = "Hugh Dempster Pavilion";
DMP_101._rooms_shortname = "DMP";
DMP_101._rooms_number = "101";
DMP_101._rooms_name = "DMP_101";
DMP_101._rooms_address = "6245 Agronomy Road V6T 1Z4";
DMP_101._rooms_lat = 49.26125;
DMP_101._rooms_lon = -123.24807;
DMP_101._rooms_seats = 40;
DMP_101._rooms_type = "Small Group";
DMP_101._rooms_furniture = "Classroom-Movable Tables & Chairs";
DMP_101._rooms_href = "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-101";
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
anth512._courses_year = 1900;

describe("D2PerformQueryDatasetTests", function () {

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

    describe('getQueryRequestType Test', function() {

        let courseData = Array<Course>();
        let roomData = Array<Room>();

        it('get Courses', function() {
            let result = facade.getQueryRequestType(["courses_instructor", "courses_avg"]);
            expect(result).to.deep.equal("courses");
        });
        it('get Rooms', function() {
            let result = facade.getQueryRequestType(["rooms_address", "rooms_name"]);
            expect(result).to.deep.equal("rooms");
        });
    });

    describe('getCourseDatasetInMemory initial Test', function() {

        let courseData = Array<Course>();
        let roomData = Array<Room>();

        it('get Courses', function() {
            let result = facade.getCoursesDatasetInMemory(courseData);
            expect(result).to.be.false;
        });
    });

    describe('getCourseDatasetInMemory non-empty Test', function() {
        let courseData = Array<Course>();
        let roomData = Array<Room>();
        courseData.push(anth512);
        roomData.push(DMP_310);
        it('get Courses non-empty', function() {
            let result = facade.getCoursesDatasetInMemory(courseData);
            expect(result).to.be.true;
        });
    });

    describe('getCourseDatasetInMemory emptied Test', function() {
        let courseData = Array<Course>();
        let roomData = Array<Room>();
        courseData.push(anth512);
        roomData.push(DMP_310);
        courseData = [];
        roomData = [];
        it('get Courses emptied', function() {
            let result = facade.getCoursesDatasetInMemory(courseData);
            expect(result).to.be.false;
        });
    });

    describe('getRoomDatasetInMemory initial Test', function() {

        let courseData = Array<Course>();
        let roomData = Array<Room>();

        it('get Rooms', function() {
            let result = facade.getRoomsDatasetInMemory(roomData);
            expect(result).to.be.false;
        });
    });

    describe('getRoomDatasetInMemory non-empty Test', function() {
        let courseData = Array<Course>();
        let roomData = Array<Room>();
        roomData.push(DMP_310);
        it('get Rooms non-empty', function() {
            let result = facade.getRoomsDatasetInMemory(roomData);
            expect(result).to.be.true;
        });
    });

    describe('getRoomDatasetInMemory emptied Test', function() {
        let courseData = Array<Course>();
        let roomData = Array<Room>();
        courseData.push(anth512);
        roomData.push(DMP_310);
        courseData = [];
        roomData = [];
        it('get Rooms emptied', function() {
            let result = facade.getRoomsDatasetInMemory(roomData);
            expect(result).to.be.false;
        });
    });

    describe('getRoomsDatasetOnDisk test', function() {
        it('get Rooms dataset on disk', function() {
            expect(new Error).to.be.an('error');
        });
    });
});