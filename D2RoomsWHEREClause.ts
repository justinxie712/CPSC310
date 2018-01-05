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
let HEBB_100: Room = new Room();
HEBB_100._rooms_fullname = "Hebb";
HEBB_100._rooms_shortname = "HEBB";
HEBB_100._rooms_number = "100";
HEBB_100._rooms_name = "HEBB_100";
HEBB_100._rooms_address = "2045 East Mall";
HEBB_100._rooms_lat = 49.2661;
HEBB_100._rooms_lon = -123.25165;
HEBB_100._rooms_seats = 375;
HEBB_100._rooms_type = "Tiered Large Group";
HEBB_100._rooms_furniture = "Classroom-Fixed Tables/Fixed Chairs";
HEBB_100._rooms_href = "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HEBB-100";
let ANGU_037: Room = new Room();
ANGU_037._rooms_fullname = "Henry Angus";
ANGU_037._rooms_shortname = "ANGU";
ANGU_037._rooms_number = "037";
ANGU_037._rooms_name = "ANGU_037";
ANGU_037._rooms_address = "2053 Main Mall";
ANGU_037._rooms_lat = 49.26486;
ANGU_037._rooms_lon = -123.25364;
ANGU_037._rooms_seats = 54;
ANGU_037._rooms_type = "Case Style";
ANGU_037._rooms_furniture = "Classroom-Fixed Tables/Movable Chairs";
ANGU_037._rooms_href = "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-037";
let fourRooms: Array<Room> = [ANGU_037, DMP_101, DMP_310, HEBB_100];
let oneRoom: Array<Room> = [ANGU_037];

describe("D2 Rooms Query WHERE Tests", function () {

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

    // it("ANTH 512 AVG DUPLICATE ORDER KEY", function () {
    //
    //     var simpleQuery: JSON = JSON.parse("{\"WHERE\":{\"EQ\":{\"courses_avg\":85.2}},\"OPTIONS\":{\"COLUMNS\":[\"courses_dept\",\"courses_id\"],\"ORDER\":\"courses_dept\", \"DULPLICATEORDER\":\"courses_dept\"}}")
    //
    //     Log.test(JSON.stringify(simpleQuery));
    //     return facade.performQuery(simpleQuery).then(function (response: InsightResponse) {
    //         Log.test('Code: ' + response.code);
    //         Log.test('Body: ' + response.body);
    //         expect.fail() // .fail() if it should reject, check response otherwise
    //     }).catch(function (response: InsightResponse) {
    //         Log.test('Error Code: ' + response.code);
    //         Log.test('Error Body: ' + response.body);
    //         expect(response.code).to.deep.equal(400);
    //     });
    // });

    describe('Rooms equalsFunction Tests', function() {
        it('rooms_lat - match', function() {
            let result = facade.equalsFunction("rooms_lat", 49.26125, DMP_310);
            expect(result).to.be.true;
        });
        it('rooms_lon - match', function() {
            let result = facade.equalsFunction("rooms_lon", -123.24807, DMP_310);
            expect(result).to.be.true;
        });
        it('rooms_seats - match', function() {
            let result = facade.equalsFunction("rooms_seats", 160, DMP_310);
            expect(result).to.be.true;
        });
        it('rooms_lat - not a match', function() {
            let result = facade.equalsFunction("rooms_lat", 49.26125, HEBB_100);
            expect(result).to.be.false;
        });
        it('rooms_lon - not a match', function() {
            let result = facade.equalsFunction("rooms_lon", -123.24807, HEBB_100);
            expect(result).to.be.false;
        });
        it('rooms_seats - not a match', function() {
            let result = facade.equalsFunction("rooms_seats", 160, HEBB_100);
            expect(result).to.be.false;
        });
    });

    describe('Rooms greaterThanFunction Tests', function() {
        it('rooms_lat - lt', function() {
            let result = facade.greaterThanFunction("rooms_lat", 49.26125 + 1, DMP_310);
            expect(result).to.be.false;
        });
        it('rooms_lon - lt', function() {
            let result = facade.greaterThanFunction("rooms_lon", -123.24807 + 1, DMP_310);
            expect(result).to.be.false;
        });
        it('rooms_seats - lt', function() {
            let result = facade.greaterThanFunction("rooms_seats", 160 + 1, DMP_310);
            expect(result).to.be.false;
        });
        it('rooms_lat - eq', function() {
            let result = facade.greaterThanFunction("rooms_lat", 49.26125, DMP_310);
            expect(result).to.be.false;
        });
        it('rooms_lon - eq', function() {
            let result = facade.greaterThanFunction("rooms_lon", -123.24807, DMP_310);
            expect(result).to.be.false;
        });
        it('rooms_seats - eq', function() {
            let result = facade.greaterThanFunction("rooms_seats", 160, DMP_310);
            expect(result).to.be.false;
        });
        it('rooms_lat - gt', function() {
            let result = facade.greaterThanFunction("rooms_lat", 49.26125 - 1, DMP_310);
            expect(result).to.be.true;
        });
        it('rooms_lon - gt', function() {
            let result = facade.greaterThanFunction("rooms_lon", -123.24807 - 1, DMP_310);
            expect(result).to.be.true;
        });
        it('rooms_seats - gt', function() {
            let result = facade.greaterThanFunction("rooms_seats", 160 - 1, DMP_310);
            expect(result).to.be.true;
        });
    });

    describe('Rooms lessThanFunction Tests', function() {
        it('rooms_lat - lt', function() {
            let result = facade.lessThanFunction("rooms_lat", 49.26125 + 1, DMP_310);
            expect(result).to.be.true;
        });
        it('rooms_lon - lt', function() {
            let result = facade.lessThanFunction("rooms_lon", -123.24807 + 1, DMP_310);
            expect(result).to.be.true;
        });
        it('rooms_seats - lt', function() {
            let result = facade.lessThanFunction("rooms_seats", 160 + 1, DMP_310);
            expect(result).to.be.true;
        });
        it('rooms_lat - eq', function() {
            let result = facade.lessThanFunction("rooms_lat", 49.26125, DMP_310);
            expect(result).to.be.false;
        });
        it('rooms_lon - eq', function() {
            let result = facade.lessThanFunction("rooms_lon", -123.24807, DMP_310);
            expect(result).to.be.false;
        });
        it('rooms_seats - eq', function() {
            let result = facade.lessThanFunction("rooms_seats", 160, DMP_310);
            expect(result).to.be.false;
        });
        it('rooms_lat - gt', function() {
            let result = facade.lessThanFunction("rooms_lat", 49.26125 - 1, DMP_310);
            expect(result).to.be.false;
        });
        it('rooms_lon - gt', function() {
            let result = facade.lessThanFunction("rooms_lon", -123.24807 - 1, DMP_310);
            expect(result).to.be.false;
        });
        it('rooms_seats - gt', function() {
            let result = facade.lessThanFunction("rooms_seats", 160 - 1, DMP_310);
            expect(result).to.be.false;
        });
    });

    describe('Rooms mcomparisonFunction test', function() {
        it('Check EQ - Match DMP rooms', function() {
            let result = facade.mcomparisonFunction("EQ", "rooms_lat",49.26125, fourRooms);
            expect(result).to.deep.include.members([DMP_310, DMP_101]);
        });
        it('Check EQ - Match HA', function() {
            let result = facade.mcomparisonFunction("EQ", "rooms_lat",49.26486, fourRooms);
            expect(result).to.deep.include.members([ANGU_037]);
        });
        it('Check EQ - No matches', function() {
            let result = facade.mcomparisonFunction("EQ", "rooms_lat",153, fourRooms);
            expect(result).to.deep.include.members([]);
        });
        it('Check GT - 5 seats', function() {
            let result = facade.mcomparisonFunction("GT", "rooms_seats",5, fourRooms);
            expect(result).to.deep.include.members([DMP_310, DMP_101, HEBB_100, ANGU_037]);
        });
        it('Check GT - 100 seats', function() {
            let result = facade.mcomparisonFunction("GT", "rooms_seats",100, fourRooms);
            expect(result).to.deep.include.members([DMP_310, HEBB_100]);
        });
        it('Check GT - 200 seats', function() {
            let result = facade.mcomparisonFunction("GT", "rooms_seats",200, fourRooms);
            expect(result).to.deep.include.members([HEBB_100]);
        });
        it('Check LT - 200 seats', function() {
            let result = facade.mcomparisonFunction("LT", "rooms_seats",200, fourRooms);
            expect(result).to.deep.include.members([DMP_310, DMP_101, ANGU_037]);
        });
        it('Check LT - 100 seats', function() {
            let result = facade.mcomparisonFunction("LT", "rooms_seats",100, fourRooms);
            expect(result).to.deep.include.members([ANGU_037, DMP_101]);
        });
        it('Check LT - 5 seats', function() {
            let result = facade.mcomparisonFunction("LT", "rooms_seats",10, fourRooms);
            expect(result).to.deep.include.members([]);
        });
    });


    describe('Rooms isFunction test', function() {
        it('Fullname test', function() {
            let result = facade.isFunction("rooms_fullname", "Hebb", HEBB_100);
            expect(result).to.be.true;
        });
        it('Shortname test', function() {
            let result = facade.isFunction("rooms_shortname", "HEBB", HEBB_100);
            expect(result).to.be.true;
        });
        it('Number test', function() {
            let result = facade.isFunction("rooms_number", "100", HEBB_100);
            expect(result).to.be.true;
        });
        it('Name test', function() {
            let result = facade.isFunction("rooms_name", "HEBB_100", HEBB_100);
            expect(result).to.be.true;
        });
        it('Address test', function() {
            let result = facade.isFunction("rooms_address", "2045 East Mall", HEBB_100);
            expect(result).to.be.true;
        });
        it('Type test', function() {
            let result = facade.isFunction("rooms_type", "Tiered Large Group", HEBB_100);
            expect(result).to.be.true;
        });
        it('Furniture test', function() {
            let result = facade.isFunction("rooms_furniture", "Classroom-Fixed Tables/Fixed Chairs", HEBB_100);
            expect(result).to.be.true;
        });
        it('href test', function() {
            let result = facade.isFunction("rooms_href", "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HEBB-100", HEBB_100);
            expect(result).to.be.true;
        });
        it('Fullname false test', function() {
            let result = facade.isFunction("rooms_fullname", "Hebb", DMP_310);
            expect(result).to.be.false;
        });
        it('Shortname false test', function() {
            let result = facade.isFunction("rooms_shortname", "HEBB", DMP_310);
            expect(result).to.be.false;
        });
        it('Number false test', function() {
            let result = facade.isFunction("rooms_number", "100", DMP_310);
            expect(result).to.be.false;
        });
        it('Name false test', function() {
            let result = facade.isFunction("rooms_name", "HEBB_100", DMP_310);
            expect(result).to.be.false;
        });
        it('Address false test', function() {
            let result = facade.isFunction("rooms_address", "2045 East Mall", DMP_310);
            expect(result).to.be.false;
        });
        it('Type false test', function() {
            let result = facade.isFunction("rooms_type", "Tiered Large Group", DMP_101);
            expect(result).to.be.false;
        });
        it('Furniture false test', function() {
            let result = facade.isFunction("rooms_furniture", "Classroom-Fixed Tables/Fixed Chairs", ANGU_037);
            expect(result).to.be.false;
        });
        it('href false test', function() {
            let result = facade.isFunction("rooms_href", "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HEBB-100", DMP_310);
            expect(result).to.be.false;
        });
    });



    describe('Rooms scomparisonFunction test', function() {
        it('*Dempster', function() {
            let result = facade.scomparisonFunction("rooms_fullname", "*Dempster Pavilion", fourRooms);
            expect(result).to.deep.include.members([DMP_310, DMP_101]);
        });
        it('Classroom-Fixed Tables/Movable Chairs', function() {
            let result = facade.scomparisonFunction("rooms_furniture", "Classroom-Fixed Tables/Movable Chairs", fourRooms);
            expect(result).to.deep.include.members([ANGU_037, DMP_310]);
        });
        it('Case*', function() {
            let result = facade.scomparisonFunction("rooms_type", "Case*", fourRooms);
            expect(result).to.deep.include.members([ANGU_037]);
        });
        it('Check EQ - No matches', function() {
            let result = facade.scomparisonFunction("rooms_type", "*No Match*", fourRooms);
            expect(result).to.deep.include.members([]);
        });
    });

    describe('Rooms orFunction test', function() {
        it('{OR: [ {IS: {rooms_number: "101"}}]}', function() {
            let result = facade.orFunction({OR: [ {IS: {rooms_number: "101"}}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_101]);
        });
        it('{OR: [ {IS: {rooms_number: "101"}}, {IS: {rooms_name: "DMP_310"}}]}', function() {
            let result = facade.orFunction({OR: [ {IS: {rooms_number: "101"}}, {IS: {rooms_name: "DMP_310"}}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_310, DMP_101]);
        });
        it('{OR: [ {IS: {rooms_seats: 375}}, {IS: {rooms_number: "101"}}]}', function() {
            let result = facade.orFunction({OR: [ {EQ: {rooms_seats: 375}}, {IS: {rooms_number: "101"}}]}, fourRooms);
            expect(result).to.deep.include.members([HEBB_100, DMP_101]);
        });
        it('{OR: [{OR: [ {IS: {rooms_name: "DMP_310"}}, {IS: {rooms_number: "101"}}]}, {OR: [ {EQ: {rooms_seats: 375}}, {IS: {rooms_number: "101"}}]}]}', function() {
            let result = facade.orFunction({OR: [{OR: [ {IS: {rooms_name: "DMP_310"}}, {IS: {rooms_number: "101"}}]}, {OR: [ {EQ: {rooms_seats: 375}}, {IS: {rooms_number: "101"}}]}]}, fourRooms);
            expect(result).to.deep.include.members([HEBB_100, DMP_101, DMP_310]);
        });
    });

    describe('Rooms andFunction test', function() {
        it('{AND: [ {IS: {rooms_number: "101"}}]}', function() {
            let result = facade.andFunction({AND: [ {IS: {rooms_number: "101"}}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_101]);
        });
        it('{AND: [ {IS: {rooms_number: "101"}}, {IS: {rooms_name: "DMP_310"}}]}', function() {
            let result = facade.andFunction({AND: [ {IS: {rooms_number: "101"}}, {IS: {rooms_name: "DMP_310"}}]}, fourRooms);
            expect(result).to.deep.include.members([]);
        });
        it('{AND: [ {IS: {rooms_shortname: "DM*"}}, {IS: {rooms_fullname: "*Pavilion"}}]}', function() {
            let result = facade.andFunction({AND: [ {IS: {rooms_shortname: "DM*"}}, {IS: {rooms_fullname: "*Pavilion"}}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_310, DMP_101]);
        });
        it('{AND: [ {IS: {rooms_furniture: "*Movable Chairs*"}}, {GT: {rooms_seats: 50}}]}', function() {
            let result = facade.andFunction({AND: [ {IS: {rooms_furniture: "*Movable Chairs*"}}, {GT: {rooms_seats: 50}}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_310, ANGU_037]);
        });
        it('{AND:[{AND: [ {IS: {rooms_furniture: "*Movable Chairs*"}}, {GT: {rooms_seats: 50}}]}]}', function() {
            let result = facade.andFunction({AND:[{AND: [ {IS: {rooms_furniture: "*Movable Chairs*"}}, {GT: {rooms_seats: 50}}]}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_310, ANGU_037]);
        });
        it('{AND:[{AND: [ {IS: {rooms_furniture: "*Movable Chairs*"}}, {GT: {rooms_seats: 50}}]}, {AND: [ {IS: {rooms_shortname: "DM*"}}, {IS: {rooms_fullname: "*Pavilion"}}]}]}', function() {
            let result = facade.andFunction({AND:[{AND: [ {IS: {rooms_furniture: "*Movable Chairs*"}}, {GT: {rooms_seats: 50}}]}, {AND: [ {IS: {rooms_shortname: "DM*"}}, {IS: {rooms_fullname: "*Pavilion"}}]}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_310]);
        });
    });
    describe('Rooms nested and/or', function() {
        it('{AND:[{AND: [ {IS: {rooms_furniture: "*Movable Chairs*"}}, {GT: {rooms_seats: 50}}]}, {AND: [ {IS: {rooms_shortname: "DM*"}}, {IS: {rooms_fullname: "*Pavilion"}}]}]}', function() {
            let result = facade.orFunction({OR: [{OR: [{OR: [ {IS: {rooms_name: "DMP_310"}}, {IS: {rooms_number: "101"}}]}, {OR: [ {EQ: {rooms_seats: 375}}, {IS: {rooms_number: "101"}}]}]}, {AND:[{AND: [ {IS: {rooms_furniture: "*Movable Chairs*"}}, {GT: {rooms_seats: 50}}]}, {AND: [ {IS: {rooms_shortname: "DM*"}}, {IS: {rooms_fullname: "*Pavilion"}}]}]}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_310, HEBB_100, DMP_101]);
        });
    });

    describe('Rooms OR test with nested ORS/ANDS', function() {
        it('Rooms OR test with nested ORS/ANDS', function() {
            let result = facade.orFunction({OR: [{OR: [{OR: [ {IS: {rooms_name: "DMP_310"}}, {IS: {rooms_number: "101"}}]}, {OR: [ {EQ: {rooms_seats: 375}}, {IS: {rooms_number: "101"}}]}]}, {AND:[{AND: [ {IS: {rooms_furniture: "*Movable Chairs*"}}, {GT: {rooms_seats: 50}}]}, {AND: [ {IS: {rooms_shortname: "DM*"}}, {IS: {rooms_fullname: "*Pavilion"}}]}]}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_310, HEBB_100, DMP_101]);
        });
    });

    describe('Rooms AND test with nested ORS/ANDS', function() {
        it('Rooms AND test with nested ORS/ANDS', function() {
            let result = facade.andFunction({AND: [{OR: [{OR: [ {IS: {rooms_name: "DMP_310"}}, {IS: {rooms_number: "101"}}]}, {OR: [ {EQ: {rooms_seats: 375}}, {IS: {rooms_number: "101"}}]}]}, {AND:[{AND: [ {IS: {rooms_furniture: "*Movable Chairs*"}}, {GT: {rooms_seats: 50}}]}, {AND: [ {IS: {rooms_shortname: "DM*"}}, {IS: {rooms_fullname: "*Pavilion"}}]}]}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_310]);
        });
    });

    describe('Rooms negationFunction tests', function() {
        it('{NOT: {IS: {rooms_number: "101"}}}', function() {
            let result = facade.negationFunction({NOT: {IS: {rooms_number: "101"}}}, fourRooms);
            expect(result).to.deep.include.members([DMP_310, ANGU_037, HEBB_100]);
        });
        it('{NOT: {OR: [ {IS: {rooms_number: "101"}}, {IS: {rooms_name: "DMP_310"}}]}}', function() {
            let result = facade.negationFunction({NOT: {OR: [ {IS: {rooms_number: "101"}}, {IS: {rooms_name: "DMP_310"}}]}}, fourRooms);
            expect(result).to.deep.include.members([ANGU_037, HEBB_100]);
        });
        it('{OR: [ {IS: {rooms_number: "101"}}, {NOT: {IS: {rooms_name: "DMP_310"}}}]}', function() {
            let result = facade.orFunction({OR: [ {IS: {rooms_number: "101"}}, {NOT: {IS: {rooms_name: "DMP_310"}}}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_101, HEBB_100, ANGU_037]);
        });
        it('{AND: [ {IS: {rooms_number: "101"}}, {NOT: {IS: {rooms_name: "DMP_310"}}}]}', function() {
            let result = facade.andFunction({AND: [ {IS: {rooms_number: "101"}}, {NOT: {IS: {rooms_name: "DMP_310"}}}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_101]);
        });
        it('{NOT: {OR: [ {IS: {rooms_number: "101"}}}, {NOT: {IS: {rooms_name: "DMP_310"}}}]}}', function() {
            let result = facade.negationFunction({NOT: {OR: [{IS: {rooms_number: "101"}}, {NOT: {IS: {rooms_name: "DMP_310"}}}]}}, fourRooms);
            expect(result).to.deep.include.members([DMP_310]);
        });
        it('{NOT: {AND: [ {NOT: {IS: {rooms_number: "101"}}}, {NOT: {IS: {rooms_name: "DMP_310"}}}]}}', function() {
            let result = facade.negationFunction({NOT: {AND: [{NOT: {IS: {rooms_number: "101"}}}, {NOT: {IS: {rooms_name: "DMP_310"}}}]}}, fourRooms);
            expect(result).to.deep.include.members([DMP_310, DMP_101]);
        });
    });

    describe('Rooms logicComparison test', function() {
        it('{AND: [ {IS: {rooms_number: "101"}}]}', function() {
            let result = facade.logiccomparisonFunction("AND", {AND: [ {IS: {rooms_number: "101"}}]}, fourRooms);
            expect(result).to.deep.include.members([DMP_101]);
        });
        it('{OR: [{OR: [ {IS: {rooms_name: "DMP_310"}}, {IS: {rooms_number: "101"}}]}, {OR: [ {EQ: {rooms_seats: 375}}, {IS: {rooms_number: "101"}}]}]}', function() {
            let result = facade.logiccomparisonFunction("OR", {OR: [{OR: [ {IS: {rooms_name: "DMP_310"}}, {IS: {rooms_number: "101"}}]}, {OR: [ {EQ: {rooms_seats: 375}}, {IS: {rooms_number: "101"}}]}]}, fourRooms);
            expect(result).to.deep.include.members([HEBB_100, DMP_101, DMP_310]);
        });
    });

    // TODO: discuss how to deal with ties
    describe('Rooms order tests', function() {
        it('rooms_fullname', function() {
            let result = facade.orderFunction(fourRooms, "rooms_fullname");
            expect(result[0]).to.deep.equals(HEBB_100);
            expect(result[1]).to.deep.equals(ANGU_037);
            expect(result[2]).to.deep.equals(DMP_101);
            expect(result[3]).to.deep.equals(DMP_310);
        });
        it('rooms_shortname', function() {
            let result = facade.orderFunction(fourRooms, "rooms_shortname");
            expect(result[0]).to.deep.equals(ANGU_037);
            expect(result[1]).to.deep.equals(DMP_101);
            expect(result[2]).to.deep.equals(DMP_310);
            expect(result[3]).to.deep.equals(HEBB_100);
        });
        it('rooms_number', function() {
            let result = facade.orderFunction(fourRooms, "rooms_number");
            expect(result[0]).to.deep.equals(ANGU_037);
            expect(result[1]).to.deep.equals(HEBB_100);
            expect(result[2]).to.deep.equals(DMP_101);
            expect(result[3]).to.deep.equals(DMP_310);
        });
        it('rooms_address', function() {
            let result = facade.orderFunction(fourRooms, "rooms_address");
            expect(result[0]).to.deep.equals(HEBB_100);
            expect(result[1]).to.deep.equals(ANGU_037);
            expect(result[2]).to.deep.equals(DMP_101);
            expect(result[3]).to.deep.equals(DMP_310);
        });
        it('rooms_lat', function() {
            let result = facade.orderFunction(fourRooms, "rooms_lat");
            expect(result[0]).to.deep.equals(HEBB_100);
            expect(result[1]).to.deep.equals(ANGU_037);
            expect(result[2]).to.deep.equals(DMP_101);
            expect(result[3]).to.deep.equals(DMP_310);
        });
        it('rooms_lon', function() {
            let result = facade.orderFunction(fourRooms, "rooms_lon");
            expect(result[0]).to.deep.equals(DMP_101);
            expect(result[1]).to.deep.equals(DMP_310);
            expect(result[2]).to.deep.equals(HEBB_100);
            expect(result[3]).to.deep.equals(ANGU_037);
        });
        it('rooms_seats', function() {
            let result = facade.orderFunction(fourRooms, "rooms_seats");
            expect(result[0]).to.deep.equals(HEBB_100);
            expect(result[1]).to.deep.equals(DMP_310);
            expect(result[2]).to.deep.equals(ANGU_037);
            expect(result[3]).to.deep.equals(DMP_101);
        });
        it('rooms_type', function() {
            let result = facade.orderFunction(fourRooms, "rooms_type");
            expect(result[0]).to.deep.equals(ANGU_037);
            expect(result[1]).to.deep.equals(DMP_101);
            //expect(result[2]).to.deep.equals(DMP_310);
            //expect(result[3]).to.deep.equals(HEBB_100);
        });
        it('rooms_furniture', function() {
            let result = facade.orderFunction(fourRooms, "rooms_furniture");
            expect(result[0]).to.deep.equals(HEBB_100);
            expect(result[1]).to.deep.equals(ANGU_037);
            expect(result[2]).to.deep.equals(DMP_310);
            expect(result[3]).to.deep.equals(DMP_101);
        });
        it('rooms_href', function() {
            let result = facade.orderFunction(fourRooms, "rooms_href");
            expect(result[0]).to.deep.equals(ANGU_037);
            expect(result[1]).to.deep.equals(DMP_101);
            expect(result[2]).to.deep.equals(DMP_310);
            expect(result[3]).to.deep.equals(HEBB_100);
        });
    });

    describe('Select all - match', function() {
        it('Select dept and avg', function() {
            let result = facade.columnSelect(["rooms_fullname", "rooms_shortname", "rooms_number", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_seats", "rooms_type", "rooms_furniture", "rooms_href"], oneRoom);
            expect(result).to.deep.include.members([["Henry Angus", "ANGU", "037", "ANGU_037", "2053 Main Mall", 49.26486, -123.25364, 54, "Case Style", "Classroom-Fixed Tables/Movable Chairs", "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-037"]]);
        });
    });

    describe('Getter', function() {
        it('Getter', function() {
            console.log(DMP_310._rooms_name)
        });
    });
});
