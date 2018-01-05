"use strict";
var Util_1 = require("../Util");
var Course_1 = require("./Course");
var Room_1 = require("./Room");
var courseData = Array();
var roomData = Array();
var InsightFacade = (function () {
    function InsightFacade() {
        Util_1.default.trace('InsightFacadeImpl::init()');
    }
    InsightFacade.prototype.addDataset = function (id, content) {
        var fs = require("fs");
        var JSZip = require("jszip");
        var zipFile = new JSZip();
        var parse5 = require("parse5");
        var self = this;
        return new Promise(function (fulfill, reject) {
            if (!fs.existsSync(__dirname + "/tmp/")) {
                fs.mkdirSync(__dirname + "/tmp/");
            }
            if (!(id == "courses" || id == "rooms")) {
                reject({ code: 400, body: { error: "Operation failed, input was invalid." } });
            }
            if (id == "courses") {
                zipFile.loadAsync(content, { base64: true }).then(function (zip) {
                    var validPromises = [];
                    Object.keys(zip.files).forEach(function (fileName) {
                        if (zip.files[fileName].dir === false) {
                            var filePromise = new Promise(function (fulfill, reject) {
                                zip.files[fileName].async('string').then(function (fileData) {
                                    try {
                                        var jsonData = JSON.parse(fileData);
                                        if ((jsonData.result) && (jsonData.result.length > 0)) {
                                            var courses_1 = new Array();
                                            jsonData.result.forEach(function (value) {
                                                var course = new Course_1.default();
                                                course._courses_id = value.Course;
                                                course._courses_dept = value.Subject;
                                                course._courses_audit = value.Audit;
                                                course._courses_avg = value.Avg;
                                                course._courses_fail = value.Fail;
                                                course._courses_instructor = value.Professor;
                                                course._courses_uuid = value.id;
                                                course._courses_title = value.Title;
                                                course._courses_pass = value.Pass;
                                                courses_1.push(course);
                                            });
                                            fulfill(courses_1);
                                        }
                                        else {
                                            fulfill();
                                        }
                                    }
                                    catch (error) {
                                        reject(error);
                                    }
                                }).catch(function (err) {
                                    reject({ code: 400, body: { error: "Operation failed, input was invalid." } });
                                });
                            });
                            validPromises.push(filePromise);
                        }
                    });
                    Promise.all(validPromises).then(function (result) {
                        var all = new Array();
                        result.forEach(function (courseInfo) {
                            if (courseInfo !== undefined) {
                                all = all.concat(courseInfo);
                                courseData = courseData.concat(courseInfo);
                            }
                        });
                        if (all.length === 0) {
                            reject({ code: 400, body: { error: "Operation failed, input was invalid." } });
                        }
                        if (fs.existsSync(__dirname + "/tmp/" + id)) {
                            fs.writeFile(__dirname + "/tmp/" + id, JSON.stringify(all), function (error) {
                                if (error) {
                                    return console.log("Error: " + error);
                                }
                            });
                            fulfill({ code: 201, body: { success: "Operation was successful." } });
                        }
                        else {
                            fs.writeFile(__dirname + "/tmp/" + id, JSON.stringify(all), function (error) {
                                if (error) {
                                    return console.log("Error: " + error);
                                }
                            });
                            fulfill({ code: 204, body: { success: "Operation was successful." } });
                        }
                    }).catch(function (err) {
                        reject({ code: 400, body: { error: "Operation failed, input was invalid." } });
                    });
                }).catch(function (err) {
                    reject({ code: 400, body: { error: "Operation failed, input was invalid." } });
                });
            }
            else if (id == "rooms") {
                zipFile.loadAsync(content, { base64: true }).then(function (zip) {
                    zip.files['index.htm'].async('string').then(function (fileData) {
                        try {
                            var parsedData = parse5.parse(fileData, {
                                treeAdapter: parse5.treeAdapters.htmlparser2
                            });
                            var result = new Array();
                            self.traverseIndex(parsedData, result);
                            return result;
                        }
                        catch (error) {
                            reject(error);
                        }
                    }).then(function (fileNames) {
                        var validPromises = [];
                        fileNames.forEach(function (fileName) {
                            var code = fileName;
                            fileName = "campus/discover/buildings-and-classrooms/" + fileName;
                            if (zip.files[fileName].dir === false) {
                                var filePromise = new Promise(function (fulfill, reject) {
                                    zip.files[fileName].async('string').then(function (fileData) {
                                        try {
                                            var parsedData_1 = parse5.parse(fileData, {
                                                treeAdapter: parse5.treeAdapters.htmlparser2
                                            });
                                            var result_1 = new Array();
                                            var address_1 = self.getAddress(parsedData_1);
                                            var fullName_1 = self.getFullName(parsedData_1);
                                            var latlon = self.getBuildingLocation(address_1);
                                            latlon.then(function (geoLocation) {
                                                self.traverseDOM(parsedData_1, result_1, code, fullName_1, address_1);
                                                if (result_1.length > 0) {
                                                    var rooms_1 = new Array();
                                                    result_1.forEach(function (room) {
                                                        room._rooms_lat = geoLocation.lat;
                                                        room._rooms_lon = geoLocation.lon;
                                                        rooms_1.push(room);
                                                    });
                                                    fulfill(rooms_1);
                                                }
                                                else {
                                                    fulfill();
                                                }
                                            }).catch(function (err) {
                                                reject(err);
                                            });
                                        }
                                        catch (error) {
                                            reject(error);
                                        }
                                    }).catch(function (err) {
                                        reject({ code: 400, body: { error: "Operation failed, input was invalid." } });
                                    });
                                });
                                validPromises.push(filePromise);
                            }
                        });
                        Promise.all(validPromises).then(function (result) {
                            var all = new Array();
                            result.forEach(function (roomInfo) {
                                if (roomInfo !== undefined) {
                                    all = all.concat(roomInfo);
                                    roomData = roomData.concat(roomInfo);
                                }
                            });
                            if (all.length === 0) {
                                reject({ code: 400, body: { error: "Operation failed, input was invalid." } });
                            }
                            if (fs.existsSync(__dirname + "/tmp/" + id)) {
                                fs.writeFile(__dirname + "/tmp/" + id, JSON.stringify(all), function (error) {
                                    if (error) {
                                        return console.log("Error: " + error);
                                    }
                                });
                                fulfill({ code: 201, body: { error: "Operation was successful." } });
                            }
                            else {
                                fs.writeFile(__dirname + "/tmp/" + id, JSON.stringify(all), function (error) {
                                    if (error) {
                                        return console.log("Error: " + error);
                                    }
                                });
                                fulfill({ code: 204, body: { success: "Operation was successful." } });
                            }
                        });
                    }).catch(function (err) {
                        reject({ code: 400, body: { error: "Operation failed, input was invalid." } });
                    });
                });
            }
        });
    };
    InsightFacade.prototype.traverseIndex = function (node, result) {
        if (node.type == 'tag' && node.name == "td" && node.attribs['class'] == 'views-field views-field-field-building-code') {
            var code = node.children[0].data;
            code = code.trim();
            result.push(code);
        }
        node = node.firstChild;
        while (node) {
            this.traverseIndex(node, result);
            node = node.nextSibling;
        }
    };
    InsightFacade.prototype.traverseDOM = function (node, result, code, fullName, address) {
        if (node.type == 'tag' && node.name == "tr" && node.parentNode.name != 'thead') {
            var room = new Room_1.default();
            room._rooms_fullname = fullName;
            room._rooms_address = address;
            room._rooms_shortname = code;
            var roomNum = node.children[1].children[1].children[0].data.trim();
            room._rooms_number = roomNum;
            var name_1 = code + "_" + roomNum;
            room._rooms_name = name_1;
            var capacity = node.children[3].children[0].data.trim();
            room._rooms_seats = parseInt(capacity);
            var furniture = node.children[5].children[0].data.trim();
            room._rooms_furniture = furniture;
            var type = node.children[7].children[0].data.trim();
            room._rooms_type = type;
            var href = node.children[9].children[1].attribs['href'];
            room._rooms_href = href;
            result.push(room);
        }
        node = node.firstChild;
        while (node) {
            this.traverseDOM(node, result, code, fullName, address);
            node = node.nextSibling;
        }
    };
    InsightFacade.prototype.getFullName = function (node) {
        var fullName = "";
        if (node.type == 'tag' && node.name == "span" && node.attribs['class'] == 'field-content') {
            fullName = node.children[0].data;
            return fullName;
        }
        node = node.firstChild;
        while (node && fullName == "") {
            fullName = this.getFullName(node);
            node = node.nextSibling;
        }
        return fullName;
    };
    InsightFacade.prototype.getAddress = function (node) {
        var address = "";
        if (node.type == 'tag' && node.name == "div" && node.attribs['class'] == 'field-content') {
            address = node.children[0].data;
            return address;
        }
        node = node.firstChild;
        while (node && address == "") {
            address = this.getAddress(node);
            node = node.nextSibling;
        }
        return address;
    };
    InsightFacade.prototype.getBuildingLocation = function (address) {
        var http = require('http');
        return new Promise(function (fulfill, reject) {
            var encodedAddress = encodeURI(address);
            var addressURL = "http://skaha.cs.ubc.ca:11316/api/v1/team168/" + encodedAddress;
            try {
                http.get(addressURL, function (res) {
                    var statusCode = res.statusCode;
                    var contentType = res.headers['content-type'];
                    var error;
                    if (statusCode !== 200) {
                        error = new Error('Request Failed.\n' +
                            ("Status Code: " + statusCode));
                    }
                    else if (!/^application\/json/.test(contentType)) {
                        error = new Error('Invalid content-type.\n' +
                            ("Expected application/json but received " + contentType));
                    }
                    if (error) {
                        reject({ lat: null, lon: null, error: error });
                        console.error(error.message);
                        res.resume();
                        return;
                    }
                    res.setEncoding('utf8');
                    var rawData = '';
                    res.on('data', function (chunk) { rawData += chunk; });
                    res.on('end', function () {
                        try {
                            var parsedData = JSON.parse(rawData);
                            var data = {};
                            fulfill(parsedData);
                        }
                        catch (e) {
                            var data = {};
                            reject(e);
                        }
                    });
                }).on('error', function (e) {
                    console.error("Got error: " + e.message);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    };
    InsightFacade.prototype.removeDataset = function (id) {
        var fs = require("fs");
        return new Promise(function (fulfill, reject) {
            if (id == "courses") {
                if (fs.existsSync(__dirname + "/tmp/" + id)) {
                    fs.unlinkSync(__dirname + "/tmp/" + id);
                    courseData = [];
                    fulfill({ code: 204, body: { success: "Operation was successful." } });
                }
                else {
                    reject({ code: 404, body: { error: "Operation was unsuccessful, file does not exist." } });
                }
            }
            if (id == "rooms") {
                if (fs.existsSync(__dirname + "/tmp/" + id)) {
                    fs.unlinkSync(__dirname + "/tmp/" + id);
                    roomData = [];
                    fulfill({ code: 204, body: { success: "Operation was successful." } });
                }
                else {
                    reject({ code: 404, body: { error: "Operation was unsuccessful, file does not exist." } });
                }
            }
            else {
                reject({ code: 404, body: { error: "Operation was unsuccessful, file does not exist." } });
            }
        });
    };
    InsightFacade.prototype.performQuery = function (query) {
        var that = this;
        var valid_query_keys = ["WHERE", "OPTIONS"];
        var filteredCourses = [];
        var filteredColumns = [];
        return new Promise(function (fulfill, reject) {
            try {
                if (!(that.checkQuerySyntax(query))) {
                    reject({ code: 400, body: { error: "query syntax error" } });
                }
                else {
                    var columns = query["OPTIONS"]["COLUMNS"];
                    var queryType = that.getQueryRequestType(columns);
                    var dataset = void 0;
                    switch (queryType) {
                        case "courses":
                            if (that.getCoursesDatasetInMemory(courseData)) {
                                dataset = courseData;
                                break;
                            }
                            else {
                                try {
                                    dataset = that.getCoursesDatasetOnDisk();
                                    break;
                                }
                                catch (e) {
                                    reject({ code: 424, body: { error: "missing dataset" } });
                                    break;
                                }
                            }
                        case "rooms":
                            if (that.getRoomsDatasetInMemory(roomData)) {
                                dataset = roomData;
                                break;
                            }
                            else {
                                try {
                                    dataset = that.getRoomsDatasetOnDisk();
                                    break;
                                }
                                catch (e) {
                                    reject({ code: 424, body: { error: "missing dataset" } });
                                    break;
                                }
                            }
                        default: break;
                    }
                    var initFilter = Object.keys(query["WHERE"])[0];
                    switch (initFilter) {
                        case "EQ":
                            filteredCourses = that.mcomparisonFunction(initFilter, Object.keys(query["WHERE"][initFilter])[0], query["WHERE"][initFilter][Object.keys(query["WHERE"][initFilter])[0]], dataset);
                            break;
                        case "LT":
                            filteredCourses = that.mcomparisonFunction(initFilter, Object.keys(query["WHERE"][initFilter])[0], query["WHERE"][initFilter][Object.keys(query["WHERE"][initFilter])[0]], dataset);
                            break;
                        case "GT":
                            filteredCourses = that.mcomparisonFunction(initFilter, Object.keys(query["WHERE"][initFilter])[0], query["WHERE"][initFilter][Object.keys(query["WHERE"][initFilter])[0]], dataset);
                            break;
                        case "IS":
                            filteredCourses = that.scomparisonFunction(Object.keys(query["WHERE"][initFilter])[0], query["WHERE"][initFilter][Object.keys(query["WHERE"][initFilter])[0]], dataset);
                            break;
                        case "NOT":
                            filteredCourses = that.negationFunction(query["WHERE"], dataset);
                            break;
                        case "AND":
                            filteredCourses = that.logiccomparisonFunction(initFilter, query["WHERE"], dataset);
                            break;
                        case "OR":
                            filteredCourses = that.logiccomparisonFunction(initFilter, query["WHERE"], dataset);
                            break;
                        default:
                            break;
                    }
                    if (Object.keys(query["OPTIONS"]).length === 2) {
                        filteredCourses = that.orderFunction(filteredCourses, query["OPTIONS"]["COLUMNS"]);
                    }
                    var uniqueColumns = that.columnSelectHelper(query["OPTIONS"]["COLUMNS"]);
                    filteredColumns = that.columnSelect(uniqueColumns, filteredCourses);
                    var result = that.resultToObj(uniqueColumns, filteredColumns);
                    fulfill({ code: 200, body: result });
                }
            }
            catch (err) {
                reject({ code: 400, body: { error: "the operation failed." } });
            }
        });
    };
    InsightFacade.prototype.checkQuerySyntax = function (query) {
        var that = this;
        if (that.checkValidBodyOptionsClauses(query)) {
            if (that.checkValidOptionsClauses(query["OPTIONS"])) {
                if (this.checkValidInitialCoursesKey(query["OPTIONS"]["COLUMNS"])) {
                    return this.checkCoursesQuerySyntax(query);
                }
                else if (this.checkValidInitialRoomsKey(query["OPTIONS"]["COLUMNS"])) {
                    return this.checkRoomsQuerySyntax(query);
                }
                else {
                    return false;
                }
            }
        }
        return false;
    };
    InsightFacade.prototype.checkCoursesQuerySyntax = function (query) {
        if (this.checkCoursesBodySyntax(query["WHERE"])) {
            if (this.checkCoursesColumnsSyntax(query["OPTIONS"]["COLUMNS"])) {
                if (Object.keys(query["OPTIONS"]).length === 2) {
                    if (this.checkOrderSyntax(query["OPTIONS"]["ORDER"], query["OPTIONS"]["COLUMNS"])) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
        }
        return false;
    };
    InsightFacade.prototype.checkRoomsQuerySyntax = function (query) {
        if (this.checkRoomsBodySyntax(query["WHERE"])) {
            if (this.checkRoomsColumnsSyntax(query["OPTIONS"]["COLUMNS"])) {
                if (Object.keys(query["OPTIONS"]).length === 2) {
                    if (this.checkOrderSyntax(query["OPTIONS"]["ORDER"], query["OPTIONS"]["COLUMNS"])) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
        }
        return false;
    };
    InsightFacade.prototype.checkValidBodyOptionsClauses = function (query) {
        var validQueryKeys = ['WHERE', 'OPTIONS'];
        var actualQueryKeys = [];
        for (var key in query) {
            if (validQueryKeys.includes(key)) {
                actualQueryKeys.push(key);
            }
            else {
                return false;
            }
        }
        if (actualQueryKeys.length !== validQueryKeys.length) {
            return false;
        }
        return true;
    };
    InsightFacade.prototype.checkCoursesBodySyntax = function (query) {
        var actualBodyKeys = [];
        for (var key in query) {
            actualBodyKeys.push(key);
        }
        if (actualBodyKeys.length === 1) {
            var filter = actualBodyKeys[0];
            if (filter === "LT" || filter === "GT" || filter === "EQ") {
                if (this.checkCoursesMComparisonSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (filter === "IS") {
                if (this.checkCoursesSComparisonSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (filter === "AND" || filter === "OR") {
                if (this.checkCoursesLogicComparisonSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (filter === "NOT") {
                if (this.checkCoursesNegationSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.checkRoomsBodySyntax = function (query) {
        var actualBodyKeys = [];
        for (var key in query) {
            actualBodyKeys.push(key);
        }
        if (actualBodyKeys.length === 1) {
            var filter = actualBodyKeys[0];
            if (filter === "LT" || filter === "GT" || filter === "EQ") {
                if (this.checkRoomsMComparisonSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (filter === "IS") {
                if (this.checkRoomsSComparisonSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (filter === "AND" || filter === "OR") {
                if (this.checkRoomsLogicComparisonSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (filter === "NOT") {
                if (this.checkRoomsNegationSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.checkValidOptionsClauses = function (options) {
        var validOptionKeys = ['COLUMNS', 'ORDER'];
        var actualOptionKeys = [];
        if (Object.keys(options).length === 2) {
            for (var key in options) {
                if (validOptionKeys.includes(key)) {
                    actualOptionKeys.push(key);
                }
                else {
                    return false;
                }
            }
        }
        else if (Object.keys(options).length === 1) {
            for (var key in options) {
                if (key === 'COLUMNS') {
                    actualOptionKeys.push(key);
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
        return true;
    };
    InsightFacade.prototype.checkValidInitialCoursesKey = function (columns) {
        var initialIndex = 0;
        if (!(columns.length > 0)) {
            return false;
        }
        if (this.checkValidCoursesMKey(columns[initialIndex]) || this.checkValidCoursesSKey(columns[initialIndex])) {
            return true;
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.checkValidInitialRoomsKey = function (columns) {
        var initialIndex = 0;
        if (!(columns.length > 0)) {
            return false;
        }
        if (this.checkValidRoomsMKey(columns[initialIndex]) || this.checkValidRoomsSKey(columns[initialIndex])) {
            return true;
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.checkCoursesColumnsSyntax = function (columns) {
        if (!(columns.length > 0)) {
            return false;
        }
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var x = columns_1[_i];
            if (this.checkValidCoursesMKey(x) || this.checkValidCoursesSKey(x)) { }
            else {
                return false;
            }
        }
        return true;
    };
    InsightFacade.prototype.checkRoomsColumnsSyntax = function (columns) {
        if (!(columns.length > 0)) {
            return false;
        }
        for (var _i = 0, columns_2 = columns; _i < columns_2.length; _i++) {
            var x = columns_2[_i];
            if (this.checkValidRoomsMKey(x) || this.checkValidRoomsSKey(x)) { }
            else {
                return false;
            }
        }
        return true;
    };
    InsightFacade.prototype.checkOrderSyntax = function (order, columns) {
        if (typeof (order) === "string") {
            if (columns.includes(order)) {
                return true;
            }
        }
        return false;
    };
    InsightFacade.prototype.checkCoursesNegationSyntax = function (query) {
        if (!(Object.keys(query).length === 1)) {
            return false;
        }
        var filterName = Object.keys(query)[0];
        if (filterName === "AND" || filterName == "OR") {
            if (this.checkCoursesLogicComparisonSyntax(query[filterName])) { }
            else {
                return false;
            }
        }
        else if (filterName === "LT" || filterName === "GT" || filterName === "EQ") {
            if (this.checkCoursesMComparisonSyntax(query[filterName])) { }
            else {
                return false;
            }
        }
        else if (filterName === "IS") {
            if (this.checkCoursesSComparisonSyntax(query[filterName])) { }
            else {
                return false;
            }
        }
        else if (filterName === "NOT") {
            if (this.checkCoursesNegationSyntax(query[filterName])) { }
            else {
                return false;
            }
        }
        else {
            return false;
        }
        return true;
    };
    InsightFacade.prototype.checkRoomsNegationSyntax = function (query) {
        if (!(Object.keys(query).length === 1)) {
            return false;
        }
        var filterName = Object.keys(query)[0];
        if (filterName === "AND" || filterName == "OR") {
            if (this.checkRoomsLogicComparisonSyntax(query[filterName])) { }
            else {
                return false;
            }
        }
        else if (filterName === "LT" || filterName === "GT" || filterName === "EQ") {
            if (this.checkRoomsMComparisonSyntax(query[filterName])) { }
            else {
                return false;
            }
        }
        else if (filterName === "IS") {
            if (this.checkRoomsSComparisonSyntax(query[filterName])) { }
            else {
                return false;
            }
        }
        else if (filterName === "NOT") {
            if (this.checkRoomsNegationSyntax(query[filterName])) { }
            else {
                return false;
            }
        }
        else {
            return false;
        }
        return true;
    };
    InsightFacade.prototype.checkCoursesMComparisonSyntax = function (query) {
        var actualMCOMPAROTORkeys = [];
        var actualM_keyvals = [];
        for (var key in query) {
            actualMCOMPAROTORkeys.push(key);
        }
        if (actualMCOMPAROTORkeys.length === 1) {
            if (this.checkValidCoursesMKey(actualMCOMPAROTORkeys[0])) {
                if (typeof (query[actualMCOMPAROTORkeys[0]]) === "number") {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.checkRoomsMComparisonSyntax = function (query) {
        var actualMCOMPAROTORkeys = [];
        var actualM_keyvals = [];
        for (var key in query) {
            actualMCOMPAROTORkeys.push(key);
        }
        if (actualMCOMPAROTORkeys.length === 1) {
            if (this.checkValidRoomsMKey(actualMCOMPAROTORkeys[0])) {
                if (typeof (query[actualMCOMPAROTORkeys[0]]) === "number") {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.checkCoursesSComparisonSyntax = function (query) {
        var actualSCOMPAROTORkeys = [];
        var actualS_keyvals = [];
        for (var key in query) {
            actualSCOMPAROTORkeys.push(key);
        }
        if (actualSCOMPAROTORkeys.length === 1) {
            if (this.checkValidCoursesSKey(actualSCOMPAROTORkeys[0])) {
                if (this.valid_inputstringWithWildcard(query[actualSCOMPAROTORkeys[0]]) && typeof (query[actualSCOMPAROTORkeys[0]]) === "string") {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.checkRoomsSComparisonSyntax = function (query) {
        var actualSCOMPAROTORkeys = [];
        var actualS_keyvals = [];
        for (var key in query) {
            actualSCOMPAROTORkeys.push(key);
        }
        if (actualSCOMPAROTORkeys.length === 1) {
            if (this.checkValidRoomsSKey(actualSCOMPAROTORkeys[0])) {
                if (this.valid_inputstringWithWildcard(query[actualSCOMPAROTORkeys[0]]) && typeof (query[actualSCOMPAROTORkeys[0]]) === "string") {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.checkCoursesLogicComparisonSyntax = function (query) {
        if (!(Array.isArray(query))) {
            return false;
        }
        if (query.length === 0) {
            return false;
        }
        for (var _i = 0, query_1 = query; _i < query_1.length; _i++) {
            var filter = query_1[_i];
            var filterName = Object.keys(filter)[0];
            if (filterName === "AND" || filterName == "OR") {
                if (this.checkCoursesLogicComparisonSyntax(filter[filterName])) { }
                else {
                    return false;
                }
            }
            else if (filterName === "LT" || filterName === "GT" || filterName === "EQ") {
                if (this.checkCoursesMComparisonSyntax(filter[filterName])) { }
                else {
                    return false;
                }
            }
            else if (filterName === "IS") {
                if (this.checkCoursesSComparisonSyntax(filter[filterName])) { }
                else {
                    return false;
                }
            }
            else if (filterName === "NOT") {
                if (this.checkCoursesNegationSyntax(filter[filterName])) { }
            }
            else {
                return false;
            }
        }
        return true;
    };
    InsightFacade.prototype.checkRoomsLogicComparisonSyntax = function (query) {
        if (!(Array.isArray(query))) {
            return false;
        }
        if (query.length === 0) {
            return false;
        }
        for (var _i = 0, query_2 = query; _i < query_2.length; _i++) {
            var filter = query_2[_i];
            var filterName = Object.keys(filter)[0];
            if (filterName === "AND" || filterName == "OR") {
                if (this.checkRoomsLogicComparisonSyntax(filter[filterName])) { }
                else {
                    return false;
                }
            }
            else if (filterName === "LT" || filterName === "GT" || filterName === "EQ") {
                if (this.checkRoomsMComparisonSyntax(filter[filterName])) { }
                else {
                    return false;
                }
            }
            else if (filterName === "IS") {
                if (this.checkRoomsSComparisonSyntax(filter[filterName])) { }
                else {
                    return false;
                }
            }
            else if (filterName === "NOT") {
                if (this.checkRoomsNegationSyntax(filter[filterName])) { }
            }
            else {
                return false;
            }
        }
        return true;
    };
    InsightFacade.prototype.checkValidCoursesMKey = function (input) {
        var regexp = new RegExp(/^courses_(avg|pass|fail|audit|year)\b/);
        if (regexp.test(input)) {
            return true;
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.checkValidRoomsMKey = function (input) {
        var regexp = new RegExp(/^rooms_(lat|lon|seats)\b/);
        if (regexp.test(input)) {
            return true;
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.checkValidCoursesSKey = function (input) {
        var regexp = new RegExp(/^courses_(dept|id|instructor|title|uuid)\b/);
        if (regexp.test(input)) {
            return true;
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.checkValidRoomsSKey = function (input) {
        var regexp = new RegExp(/^rooms_(fullname|shortname|number|name|address|type|furniture|href)\b/);
        if (regexp.test(input)) {
            return true;
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.valid_inputstringWithWildcard = function (input) {
        var regexp = new RegExp(/^[*]?[^\*]+[*]?$/);
        if (regexp.test(input)) {
            return true;
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.isFunctionWildcardHelper = function (input) {
        if (input.charAt(0) === "*" && input.charAt(input.length - 1) === "*") {
            return input.substr(1, input.length - 2);
        }
        else if (input.charAt(0) === "*") {
            return input.substr(1);
        }
        else if (input.charAt(input.length - 1) === "*") {
            return input.substr(0, input.length - 1);
        }
        else {
            return input;
        }
    };
    InsightFacade.prototype.isFunctionMatchHelper = function (input, compareTo) {
        var inputstring;
        if (input.charAt(0) === "*" && input.charAt(input.length - 1) === "*") {
            inputstring = input.substr(1, input.length - 2);
            return compareTo.includes(inputstring);
        }
        else if (input.charAt(0) === "*") {
            inputstring = input.substr(1);
            return compareTo.endsWith(inputstring);
        }
        else if (input.charAt(input.length - 1) === "*") {
            inputstring = input.substr(0, input.length - 1);
            return compareTo.startsWith(inputstring);
        }
        else {
            inputstring = input;
            return compareTo === inputstring;
        }
    };
    InsightFacade.prototype.equalsFunction = function (m_key, val, datum) {
        if (m_key === "courses_avg") {
            return datum._courses_avg === val;
        }
        else if (m_key === "courses_pass") {
            return datum._courses_pass === val;
        }
        else if (m_key === "courses_fail") {
            return datum._courses_fail === val;
        }
        else if (m_key === "courses_audit") {
            return datum._courses_audit === val;
        }
        else if (m_key === "courses_year") {
            return datum._courses_year === val;
        }
        else if (m_key === "rooms_lat") {
            return datum._rooms_lat === val;
        }
        else if (m_key === "rooms_lon") {
            return datum._rooms_lon === val;
        }
        else if (m_key === "rooms_seats") {
            return datum._rooms_seats === val;
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.lessThanFunction = function (m_key, val, datum) {
        if (m_key === "courses_avg") {
            return datum._courses_avg < val;
        }
        else if (m_key === "courses_pass") {
            return datum._courses_pass < val;
        }
        else if (m_key === "courses_fail") {
            return datum._courses_fail < val;
        }
        else if (m_key === "courses_audit") {
            return datum._courses_audit < val;
        }
        else if (m_key === "courses_year") {
            return datum._courses_year < val;
        }
        else if (m_key === "rooms_lat") {
            return datum._rooms_lat < val;
        }
        else if (m_key === "rooms_lon") {
            return datum._rooms_lon < val;
        }
        else if (m_key === "rooms_seats") {
            return datum._rooms_seats < val;
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.greaterThanFunction = function (m_key, val, datum) {
        if (m_key === "courses_avg") {
            return datum._courses_avg > val;
        }
        else if (m_key === "courses_pass") {
            return datum._courses_pass > val;
        }
        else if (m_key === "courses_fail") {
            return datum._courses_fail > val;
        }
        else if (m_key === "courses_audit") {
            return datum._courses_audit > val;
        }
        else if (m_key === "courses_year") {
            return datum._courses_year > val;
        }
        else if (m_key === "rooms_lat") {
            return datum._rooms_lat > val;
        }
        else if (m_key === "rooms_lon") {
            return datum._rooms_lon > val;
        }
        else if (m_key === "rooms_seats") {
            return datum._rooms_seats > val;
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.isFunction = function (s_key, val, datum) {
        var that = this;
        if (s_key === "courses_dept") {
            return that.isFunctionMatchHelper(val, datum._courses_dept);
        }
        else if (s_key === "courses_id") {
            return that.isFunctionMatchHelper(val, datum._courses_id);
        }
        else if (s_key === "courses_instructor") {
            return that.isFunctionMatchHelper(val, datum._courses_instructor);
        }
        else if (s_key === "courses_title") {
            return that.isFunctionMatchHelper(val, datum._courses_title);
        }
        else if (s_key === "courses_uuid") {
            return that.isFunctionMatchHelper(val, datum._courses_uuid);
        }
        else if (s_key === "rooms_fullname") {
            return that.isFunctionMatchHelper(val, datum._rooms_fullname);
        }
        else if (s_key === "rooms_shortname") {
            return that.isFunctionMatchHelper(val, datum._rooms_shortname);
        }
        else if (s_key === "rooms_number") {
            return that.isFunctionMatchHelper(val, datum._rooms_number);
        }
        else if (s_key === "rooms_name") {
            return that.isFunctionMatchHelper(val, datum._rooms_name);
        }
        else if (s_key === "rooms_address") {
            return that.isFunctionMatchHelper(val, datum._rooms_address);
        }
        else if (s_key === "rooms_type") {
            return that.isFunctionMatchHelper(val, datum._rooms_type);
        }
        else if (s_key === "rooms_furniture") {
            return that.isFunctionMatchHelper(val, datum._rooms_furniture);
        }
        else if (s_key === "rooms_href") {
            return that.isFunctionMatchHelper(val, datum._rooms_href);
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.orFunctionHelper = function (rsf, pending) {
        var that = this;
        var pendingRsfSetDifference = [];
        pendingRsfSetDifference = pending.filter(function (datum) {
            return !(rsf.includes(datum));
        });
        return pendingRsfSetDifference;
    };
    InsightFacade.prototype.orFunction = function (query, dataset) {
        var that = this;
        var result = [];
        for (var _i = 0, _a = query["OR"]; _i < _a.length; _i++) {
            var filter = _a[_i];
            var filterName = Object.keys(filter)[0];
            Util_1.default.test("FilterName= " + filterName);
            if (filterName === "LT" || filterName === "GT" || filterName === "EQ") {
                result = result.concat(that.orFunctionHelper(result, that.mcomparisonDetails(filter, dataset)));
            }
            else if (filterName === "IS") {
                result = result.concat(that.orFunctionHelper(result, that.scomparisonDetails(filter, dataset)));
            }
            else if (filterName === "AND") {
                result = result.concat(that.orFunctionHelper(result, that.andFunction(filter, dataset)));
            }
            else if (filterName === "OR") {
                result = result.concat(that.orFunctionHelper(result, that.orFunction(filter, dataset)));
            }
            else {
                result = result.concat(that.orFunctionHelper(result, that.negationFunction(filter, dataset)));
            }
        }
        return result;
    };
    InsightFacade.prototype.andFunctionHelper = function (rsf, pending) {
        var that = this;
        var pendingRsfIntersection = [];
        pendingRsfIntersection = pending.filter(function (datum) {
            return (rsf.includes(datum));
        });
        return pendingRsfIntersection;
    };
    InsightFacade.prototype.andFunction = function (query, dataset) {
        var that = this;
        var result = dataset;
        for (var _i = 0, _a = query["AND"]; _i < _a.length; _i++) {
            var filter = _a[_i];
            var filterName = Object.keys(filter)[0];
            if (filterName === "LT" || filterName === "GT" || filterName === "EQ") {
                result = that.andFunctionHelper(result, that.mcomparisonDetails(filter, result));
            }
            else if (filterName === "IS") {
                result = that.andFunctionHelper(result, that.scomparisonDetails(filter, result));
            }
            else if (filterName === "AND") {
                result = that.andFunctionHelper(result, that.andFunction(filter, result));
            }
            else if (filterName === "OR") {
                result = that.andFunctionHelper(result, that.orFunction(filter, result));
            }
            else {
                result = that.andFunctionHelper(result, that.negationFunction(filter, result));
            }
        }
        return result;
    };
    InsightFacade.prototype.mcomparisonFunction = function (mcomparison, m_key, val, dataset) {
        var that = this;
        var result;
        if (mcomparison === "EQ") {
            result = dataset.filter(function (datum) {
                return that.equalsFunction(m_key, val, datum);
            });
        }
        else if (mcomparison === "LT") {
            result = dataset.filter(function (datum) {
                return that.lessThanFunction(m_key, val, datum);
            });
        }
        else {
            result = dataset.filter(function (datum) {
                return that.greaterThanFunction(m_key, val, datum);
            });
        }
        return result;
    };
    InsightFacade.prototype.scomparisonFunction = function (s_key, val, dataset) {
        var that = this;
        var result;
        result = dataset.filter(function (datum) {
            return that.isFunction(s_key, val, datum);
        });
        return result;
    };
    InsightFacade.prototype.negationFunction = function (query, dataset) {
        var that = this;
        var complement = [];
        var result = [];
        var filterName = Object.keys(query["NOT"])[0];
        if (filterName === "AND" || filterName == "OR") {
            complement = that.logiccomparisonFunction(filterName, query["NOT"], dataset);
        }
        else if (filterName === "LT" || filterName === "GT" || filterName === "EQ") {
            complement = that.mcomparisonDetails(query["NOT"], dataset);
        }
        else if (filterName === "IS") {
            complement = that.scomparisonDetails(query["NOT"], dataset);
        }
        else {
            complement = this.negationFunction(query[filterName], dataset);
        }
        result = this.negationFunctionHelper(complement, dataset);
        return result;
    };
    InsightFacade.prototype.negationFunctionHelper = function (complement, dataset) {
        var that = this;
        var result = [];
        result = dataset.filter(function (course) {
            return (!(complement.includes(course)));
        });
        return result;
    };
    InsightFacade.prototype.logiccomparisonFunction = function (lcomparison, query, dataset) {
        var that = this;
        var result = [];
        if (lcomparison === "OR") {
            result = that.orFunction(query, dataset);
        }
        else {
            result = that.andFunction(query, dataset);
        }
        return result;
    };
    InsightFacade.prototype.mcomparisonDetails = function (mcomparison, dataset) {
        var that = this;
        var mcomparator = Object.keys(mcomparison)[0];
        var m_key = Object.keys(mcomparison[mcomparator])[0];
        var val = mcomparison[mcomparator][m_key];
        return that.mcomparisonFunction(mcomparator, m_key, val, dataset);
    };
    InsightFacade.prototype.scomparisonDetails = function (scomparison, dataset) {
        var that = this;
        var scomparator = Object.keys(scomparison)[0];
        var s_key = Object.keys(scomparison[scomparator])[0];
        var val = scomparison[scomparator][s_key];
        return that.scomparisonFunction(s_key, val, dataset);
    };
    InsightFacade.prototype.columnSelect = function (columns, fDataset) {
        var that = this;
        var result = [];
        for (var _i = 0, fDataset_1 = fDataset; _i < fDataset_1.length; _i++) {
            var course = fDataset_1[_i];
            var courseDetails = [];
            for (var _a = 0, columns_3 = columns; _a < columns_3.length; _a++) {
                var column = columns_3[_a];
                var details = that.columnGetter(column, course);
                courseDetails.push(details);
            }
            result.push(courseDetails);
        }
        return result;
    };
    InsightFacade.prototype.columnSelectHelper = function (columns) {
        var that = this;
        var courseColumns = [];
        for (var _i = 0, columns_4 = columns; _i < columns_4.length; _i++) {
            var column = columns_4[_i];
            if (!(courseColumns.includes(column))) {
                courseColumns.push(column);
            }
        }
        return courseColumns;
    };
    InsightFacade.prototype.columnGetter = function (column, datum) {
        switch (column) {
            case "courses_dept":
                return datum._courses_dept;
            case "courses_id":
                return datum._courses_id;
            case "courses_avg":
                return datum._courses_avg;
            case "courses_instructor":
                return datum._courses_instructor;
            case "courses_title":
                return datum._courses_title;
            case "courses_pass":
                return datum._courses_pass;
            case "courses_fail":
                return datum._courses_fail;
            case "courses_audit":
                return datum._courses_audit;
            case "courses_uuid":
                return datum._courses_uuid;
            case "courses_year":
                return datum._courses_year;
            case "rooms_fullname":
                return datum._rooms_fullname;
            case "rooms_shortname":
                return datum._rooms_shortname;
            case "rooms_number":
                return datum._rooms_number;
            case "rooms_name":
                return datum._rooms_name;
            case "rooms_address":
                return datum._rooms_address;
            case "rooms_lat":
                return datum._rooms_lat;
            case "rooms_lon":
                return datum._rooms_lon;
            case "rooms_seats":
                return datum._rooms_seats;
            case "rooms_type":
                return datum._rooms_type;
            case "rooms_furniture":
                return datum._rooms_furniture;
            case "rooms_href":
                return datum._rooms_href;
            default:
                break;
        }
    };
    InsightFacade.prototype.orderFunction = function (unsortedResults, order) {
        var that = this;
        var sortedResults = [];
        sortedResults = unsortedResults.sort(function (a, b) {
            switch (order) {
                case "courses_dept":
                    return a._courses_dept.localeCompare(b._courses_dept);
                case "courses_id":
                    return a._courses_id.localeCompare(b._courses_id);
                case "courses_avg":
                    return b._courses_avg - a._courses_avg;
                case "courses_instructor":
                    return a._courses_instructor.localeCompare(b._courses_instructor);
                case "courses_title":
                    return a._courses_title.localeCompare(b._courses_title);
                case "courses_pass":
                    return b._courses_pass - a._courses_pass;
                case "courses_fail":
                    return b._courses_fail - a._courses_fail;
                case "courses_audit":
                    return b._courses_audit - a._courses_audit;
                case "courses_uuid":
                    return a._courses_uuid.localeCompare(b._courses_uuid);
                case "courses_year":
                    return b._courses_year - a._courses_year;
                case "rooms_fullname":
                    return a._rooms_fullname.localeCompare(b._rooms_fullname);
                case "rooms_shortname":
                    return a._rooms_shortname.localeCompare(b._rooms_shortname);
                case "rooms_number":
                    return a._rooms_number.localeCompare(b._rooms_number);
                case "rooms_address":
                    return a._rooms_address.localeCompare(b._rooms_address);
                case "rooms_lat":
                    return b._rooms_lat - a._rooms_lat;
                case "rooms_lon":
                    return b._rooms_lon - a._rooms_lon;
                case "rooms_seats":
                    return b._rooms_seats - a._rooms_seats;
                case "rooms_type":
                    return a._rooms_type.localeCompare(b._rooms_type);
                case "rooms_furniture":
                    return a._rooms_furniture.localeCompare(b._rooms_furniture);
                case "rooms_href":
                    return a._rooms_href.localeCompare(b._rooms_href);
                default:
                    break;
            }
        });
        return sortedResults;
    };
    InsightFacade.prototype.resultToObj = function (columns, resultArray) {
        var innerResult = [];
        var result;
        var _loop_1 = function (x) {
            innerResult.push(columns.reduce(function (obj, val, i) {
                obj[val] = x[i];
                return obj;
            }, {}));
        };
        for (var _i = 0, resultArray_1 = resultArray; _i < resultArray_1.length; _i++) {
            var x = resultArray_1[_i];
            _loop_1(x);
        }
        result = JSON.parse(JSON.stringify({ result: innerResult }));
        return result;
    };
    InsightFacade.prototype.getQueryRequestType = function (columns) {
        if (this.checkValidInitialCoursesKey(columns)) {
            return "courses";
        }
        else {
            return "rooms";
        }
    };
    InsightFacade.prototype.getCoursesDatasetInMemory = function (temp) {
        if (temp.length > 0) {
            return true;
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.getRoomsDatasetInMemory = function (temp) {
        if (temp.length > 0) {
            return true;
        }
        else {
            return false;
        }
    };
    InsightFacade.prototype.getCoursesDatasetOnDisk = function () {
        var fs = require("fs");
        var buffer = fs.readFileSync(__dirname + "/tmp/" + "courses");
        var result = JSON.parse(buffer);
        return result;
    };
    InsightFacade.prototype.getRoomsDatasetOnDisk = function () {
        var fs = require("fs");
        var buffer = fs.readFileSync(__dirname + "/tmp/" + "rooms");
        var result = JSON.parse(buffer);
        return result;
    };
    InsightFacade.prototype.getDataset = function (columns) {
        var requestType;
        requestType = this.getQueryRequestType(columns);
        switch (requestType) {
            case "courses":
                if (this.getCoursesDatasetInMemory(courseData)) {
                    return courseData;
                }
                else {
                    return this.getCoursesDatasetOnDisk();
                }
            case "rooms":
                if (this.getRoomsDatasetInMemory(courseData)) {
                    return roomData;
                }
                else {
                    return this.getRoomsDatasetOnDisk();
                }
            default:
                break;
        }
    };
    return InsightFacade;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map