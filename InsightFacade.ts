/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util";
import Course from "./Course";
import Room from "./Room";

let courseData = Array<Course>();
let roomData = Array<Room>();

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        let fs = require("fs");
        let JSZip = require("jszip");
        let zipFile = new JSZip();
        let parse5 = require("parse5");
        let self = this;

        //if folder does not exist, create it

        return new Promise(function (fulfill, reject) {
            // Return response code based on success or not
            // Check to see if cache exists, if so read courses.txt, parse it, and add all courses to courses<Array>
            // Path does not matter, as long as we can access it, should be a json file
            // Should check ID, maybe save filename/foldername under ID
            // Should check ID, overwrite the file with the new stuff, and then return 201

            if (!fs.existsSync(__dirname + "/tmp/")) {
                fs.mkdirSync(__dirname + "/tmp/");
            }

            if (!(id == "courses" || id == "rooms")) {
                reject({code: 400, body: {error: "Operation failed, input was invalid."}});
            }

            // if (id != "rooms"){
            //     reject({code: 400, body: {error : "Operation failed, input was invalid."}});
            // }

            // Cache does not exist, loading and parsing data
            // Create a file, and write to it.
            if (id == "courses") {
                zipFile.loadAsync(content, {base64: true}).then(function (zip: any) {
                    let validPromises: Promise<any>[] = [];

                    Object.keys(zip.files).forEach(function (fileName: any) {
                        // Type check zip.files.dir = false
                        if (zip.files[fileName].dir === false) {

                            let filePromise = new Promise(function (fulfill, reject) {

                                zip.files[fileName].async('string').then(function (fileData: string) {


                                    try {
                                        let jsonData = JSON.parse(fileData);
                                        // Check to see if JSON object exists and is not empty
                                        if ((jsonData.result) && (jsonData.result.length > 0)) {
                                            let courses = new Array<Object>();
                                            jsonData.result.forEach(function (value: any) {
                                                let course = new Course();
                                                // Set all the keys
                                                // TODO add years
                                                course._courses_id = value.Course;
                                                course._courses_dept = value.Subject;
                                                course._courses_audit = value.Audit;
                                                course._courses_avg = value.Avg;
                                                course._courses_fail = value.Fail;
                                                course._courses_instructor = value.Professor;
                                                course._courses_uuid = value.id;
                                                course._courses_title = value.Title;
                                                course._courses_pass = value.Pass;
                                                courses.push(course);
                                            });
                                            fulfill(courses);
                                        }
                                        else {
                                            fulfill();
                                        }
                                    }
                                    catch (error) {
                                        reject(error);
                                    }
                                    // For non-zip files
                                }).catch(function (err: any) {
                                    //Just skip it
                                    //console.log("Invalid Input")
                                    //reject(err);
                                    reject({code: 400, body: {error: "Operation failed, input was invalid."}});
                                });
                            });
                            validPromises.push(filePromise);
                        }

                    });

                    Promise.all(validPromises).then(function (result) {
                        let all = new Array<Course>();
                        result.forEach(function (courseInfo: any) {
                            if (courseInfo !== undefined) {
                                all = all.concat(courseInfo);
                                courseData = courseData.concat(courseInfo);
                            }
                        });

                        // Case 400 where there is valid data.
                        if (all.length === 0) {
                            reject({code: 400, body: {error: "Operation failed, input was invalid."}});
                        }

                        // Case 201 where file write (id) previously exists
                        if (fs.existsSync(__dirname + "/tmp/" + id)) {
                            //Cache data here before fulfilling
                            fs.writeFile(__dirname + "/tmp/" + id, JSON.stringify(all), function (error: Error) {
                                if (error) {
                                    return console.log("Error: " + error);
                                }
                            });

                            fulfill({code: 201, body: {success: "Operation was successful."}});
                        }

                        // Case 204 where file write (id) is not previously existing
                        else {
                            //Cache data here before fulfilling
                            fs.writeFile(__dirname + "/tmp/" + id, JSON.stringify(all), function (error: Error) {
                                if (error) {
                                    return console.log("Error: " + error);
                                }
                            });

                            fulfill({code: 204, body: {success: "Operation was successful."}});
                        }

                    }).catch(function (err) {
                        reject({code: 400, body: {error: "Operation failed, input was invalid."}});
                    });
                }).catch(function (err: any) {
                    reject({code: 400, body: {error: "Operation failed, input was invalid."}});
                });
            }
            else if (id == "rooms") {
                zipFile.loadAsync(content, {base64: true}).then(function (zip: any) {
                    zip.files['index.htm'].async('string').then(function (fileData: string) {
                        try {
                            let parsedData = parse5.parse(fileData, {
                                treeAdapter: parse5.treeAdapters.htmlparser2
                            });
                            let result = new Array<string>();
                            self.traverseIndex(parsedData, result);
                            return result;
                        }
                        catch (error) {
                            reject(error);
                        }
                    }).then(function (fileNames: Array<string>) {
                        let validPromises: Promise<any>[] = [];

                        fileNames.forEach(function (fileName: any) {
                            let code = fileName;
                            fileName = "campus/discover/buildings-and-classrooms/" + fileName;
                            // Type check zip.files.dir = false
                            if (zip.files[fileName].dir === false) {

                                let filePromise = new Promise(function (fulfill, reject) {

                                    zip.files[fileName].async('string').then(function (fileData: string) {
                                        try {
                                            let parsedData = parse5.parse(fileData, {
                                                treeAdapter: parse5.treeAdapters.htmlparser2
                                            });
                                            // Check to see if JSON object exists and is not empty
                                            let result = new Array<Room>();
                                            let address = self.getAddress(parsedData);
                                            let fullName = self.getFullName(parsedData);

                                            let latlon = self.getBuildingLocation(address);
                                            latlon.then(geoLocation => {
                                                self.traverseDOM(parsedData, result, code, fullName, address);
                                                if (result.length > 0) {
                                                    let rooms = new Array<Object>();
                                                    result.forEach(function (room: Room) {
                                                        room._rooms_lat = geoLocation.lat;
                                                        room._rooms_lon = geoLocation.lon;
                                                        rooms.push(room);

                                                    });
                                                    fulfill(rooms);
                                                }
                                                else {
                                                    fulfill();
                                                }

                                            }).catch(err => {
                                                reject(err);

                                            })
                                        }
                                        catch (error) {
                                            reject(error);
                                        }
                                        // For non-zip files
                                    }).catch(function (err: any) {
                                        //Just skip it
                                        reject({code: 400, body: {error: "Operation failed, input was invalid."}});
                                    });
                                });
                                validPromises.push(filePromise);
                            }
                        });

                        Promise.all(validPromises).then(function (result) {
                            let all = new Array<Room>();
                            result.forEach(function (roomInfo: any) {
                                if (roomInfo !== undefined) {
                                    all = all.concat(roomInfo);
                                    roomData = roomData.concat(roomInfo);
                                }
                            });
                            // Case 400 where there is valid data.
                            if (all.length === 0) {
                                reject({code: 400, body: {error: "Operation failed, input was invalid."}});
                            }

                            // Case 201 where file write (id) previously exists
                            if (fs.existsSync(__dirname + "/tmp/" + id)) {
                                //Cache data here before fulfilling
                                fs.writeFile(__dirname + "/tmp/" + id, JSON.stringify(all), function (error: Error) {
                                    if (error) {
                                        return console.log("Error: " + error);
                                    }
                                });

                                fulfill({code: 201, body: {error: "Operation was successful."}});
                            }

                            // Case 204 where file write (id) is not previously existing
                            else {
                                //Cache data here before fulfilling
                                fs.writeFile(__dirname + "/tmp/" + id, JSON.stringify(all), function (error: Error) {
                                    if (error) {
                                        return console.log("Error: " + error);
                                    }
                                });

                                fulfill({code: 204, body: {success: "Operation was successful."}});
                            }
                        });
                    }).catch(function (err: any) {
                        reject({code: 400, body: {error: "Operation failed, input was invalid."}});
                    });
                })
            }
        })
    }

    traverseIndex(node : any, result: Array<string>) {
        if (node.type == 'tag' && node.name == "td" && node.attribs['class'] == 'views-field views-field-field-building-code'){
            let code = node.children[0].data;
            code = code.trim();
            result.push(code);
        }
        node = node.firstChild;
        while (node) {
            this.traverseIndex(node, result);
            node = node.nextSibling;
        }
    }

    traverseDOM(node : any, result: Array<Room>, code : string, fullName : string, address : string) {
        // All other info
        if (node.type == 'tag' && node.name == "tr" && node.parentNode.name != 'thead'){
            let room = new Room();
            // Full Name
            room._rooms_fullname = fullName;

            // Address
            room._rooms_address = address;

            // Short name
            room._rooms_shortname = code;

            // Room Number
            let roomNum = node.children[1].children[1].children[0].data.trim();
            room._rooms_number = roomNum;

            // Room Name
            let name = code + "_" + roomNum;
            room._rooms_name = name;

            // Room Capacity
            let capacity = node.children[3].children[0].data.trim();
            room._rooms_seats = parseInt(capacity);

            // Room Furniture
            let furniture = node.children[5].children[0].data.trim();
            room._rooms_furniture = furniture;

            // Room Type
            let type = node.children[7].children[0].data.trim();
            room._rooms_type = type;

            // Room href
            let href = node.children[9].children[1].attribs['href'];
            room._rooms_href = href;

            result.push(room);
        }
        node = node.firstChild;
        while (node) {
            this.traverseDOM(node, result, code, fullName, address);
            node = node.nextSibling;
        }
    }

    getFullName(node : any) {
        // Building Full Name
        let fullName = "";
        if (node.type == 'tag' && node.name == "span" && node.attribs['class'] == 'field-content'){
            fullName = node.children[0].data;
            return fullName;
        }
        node = node.firstChild;
        while (node && fullName == "") {
            fullName = this.getFullName(node);
            node = node.nextSibling;
        }
        return fullName;
    }

    getAddress(node : any) {
        // Building Address
        let address = "";
        if (node.type == 'tag' && node.name == "div" && node.attribs['class'] == 'field-content'){
            address = node.children[0].data;
            return address;
        }
        node = node.firstChild;
        while (node && address == "") {
            address = this.getAddress(node);
            node = node.nextSibling;
        }
        return address;
    }

    getBuildingLocation(address : string): Promise<any>{
        let http = require('http');

        return new Promise((fulfill, reject) => {
            let encodedAddress = encodeURI(address);
            let addressURL = "http://skaha.cs.ubc.ca:11316/api/v1/team168/" + encodedAddress;
            try{
                http.get(addressURL, (res : any) => {

                    const { statusCode } = res;
                    const contentType = res.headers['content-type'];

                    let error;
                    if (statusCode !== 200) {
                        error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
                    } else if (!/^application\/json/.test(contentType)) {
                        error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
                    }
                    if (error) {
                        reject({lat : null, lon : null, error : error});
                        console.error(error.message);
                        // consume response data to free up memory
                        res.resume();
                        return;
                    }

                    res.setEncoding('utf8');
                    let rawData = '';
                    res.on('data', (chunk : any) => { rawData += chunk; });
                    res.on('end', () => {
                        try {
                            const parsedData = JSON.parse(rawData);
                            let data = {};
                            //data[address] = parsedData;
                            fulfill(parsedData);
                        } catch (e) {
                            let data = {};
                            //data[address] = {error: e.error};
                            //fulfill(error)
                            reject(e);
                        }
                    });
                }).on('error', (e : Error) => {
                    console.error(`Got error: ${e.message}`);
                });
            }
            catch(err) {
                reject(err);
            }
        })
    }

    removeDataset(id: string): Promise<InsightResponse> {
        let fs = require("fs");
        return new Promise(function (fulfill, reject) {
            if (id == "courses") {
                if(fs.existsSync(__dirname +"/tmp/" + id)){
                    // Delete existing file
                    fs.unlinkSync(__dirname +"/tmp/" + id);
                    // Clear data in global data array
                    courseData = [];
                    fulfill({code: 204, body: {success : "Operation was successful."}});
                }
                else{
                    // File does not exist
                    reject({code: 404, body: {error : "Operation was unsuccessful, file does not exist."}});
                }
            }
            if (id == "rooms") {
                if(fs.existsSync(__dirname +"/tmp/" + id)){
                    // Delete existing file
                    fs.unlinkSync(__dirname +"/tmp/" + id);
                    // Clear data in global data array
                    roomData = [];
                    fulfill({code: 204, body: {success : "Operation was successful."}});
                }
                else{
                    // File does not exist
                    reject({code: 404, body: {error : "Operation was unsuccessful, file does not exist."}});
                }
            }
            else{
                // File does not exist
                reject({code: 404, body: {error : "Operation was unsuccessful, file does not exist."}});
            }
        });
    }

    /**
     * Perform a query on UBCInsight.
     *
     * @param query  The query to be performed. This is the same as the body of the POST message.
     *
     * @return Promise <InsightResponse>
     *
     * The promise should return an InsightResponse for both fulfill and reject.
     *
     * Fulfill should be for 2XX codes and reject for everything else.
     *
     * Return codes:
     *
     * 200: the query was successfully answered. The result should be sent in JSON according in the response body.
     * 400: the query failed; body should contain {"error": "my text"} providing extra detail.
     * 424: the query failed because of a missing dataset; body should contain {"error": "my text"} providing extra detail.
     *
     */

    performQuery(query: any): Promise <InsightResponse> {

        let that = this;
        let valid_query_keys: Array<string> = ["WHERE", "OPTIONS"];
        let filteredCourses: Array<any> = [];
        let filteredColumns: Array<any> = [];

        return new Promise(function (fulfill, reject) {
            try {
                if (!(that.checkQuerySyntax(query))) {
                    reject({code: 400, body: {error: "query syntax error"}});
                }
                //TODO: 424, the query failed because of a missing dataset
                else {
                    let columns = query["OPTIONS"]["COLUMNS"];
                    let queryType: string = that.getQueryRequestType(columns);
                    // TODO: set dataset variable to courses/rooms dataset as appropriate
                    let dataset: any;
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
                                    reject({code: 424, body: {error: "missing dataset"}});
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
                                    reject({code: 424, body: {error: "missing dataset"}});
                                    break;
                                }
                            }
                        default: break;
                    }
                    //let dataset = courseData;
                    // if (dataset === null) {
                    //     reject({code: 424, body: {error: "missing dataset"}})
                    // }
                    let initFilter = Object.keys(query["WHERE"])[0];
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
                    let uniqueColumns: Array<string> = that.columnSelectHelper(query["OPTIONS"]["COLUMNS"]);
                    filteredColumns = that.columnSelect(uniqueColumns, filteredCourses);
                    let result: any = that.resultToObj(uniqueColumns, filteredColumns)
                    fulfill({code: 200, body: result});
                }
            }
            catch(err) {
                reject({code:400, body:{error : "the operation failed."}});
            }
        })
    }

    // Purpose: Returns true if full query has valid syntax, false otherwise
    checkQuerySyntax(query: any): boolean {
        let that = this;
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
    }


    // Purpose: Returns true if WHERE/COLUMNS/ORDER clauses are valid courses query syntax, false otherwise
    checkCoursesQuerySyntax(query: any): boolean {
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
    }

    // Purpose: Returns true if WHERE/COLUMNS/ORDER clauses are valid rooms query syntax, false otherwise
    checkRoomsQuerySyntax(query: any): boolean {
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
    }


    // Purpose: Returns true if query has exactly one WHERE clause and exactly one OPTIONS clause
    checkValidBodyOptionsClauses(query: any): boolean {
        let validQueryKeys: Array<string> = ['WHERE', 'OPTIONS'];
        let actualQueryKeys: Array<string> = [];
        for (let key in query) {
            //Log.test(key);
            if (validQueryKeys.includes(key)) {actualQueryKeys.push(key);}
            else {return false;}
        }
        if (actualQueryKeys.length !== validQueryKeys.length) {
            return false
        }
        return true;
    }


    // Purpose: Returns true if courses query has a valid WHERE clause by checking WHERE key's FILTER value
    // Ex. Takes {"EQ":{"courses_avg":85.2}} from {WHERE: {"EQ":{"courses_avg":85.2}}}
    checkCoursesBodySyntax(query: any): boolean {

        let actualBodyKeys: Array<string> = [];
        for (let key in query) {
            actualBodyKeys.push(key);
        }
        if (actualBodyKeys.length === 1) {
            let filter = actualBodyKeys[0];
            //Log.test("Filter is: " + filter);
            if (filter === "LT" || filter === "GT" || filter === "EQ") {
                if (this.checkCoursesMComparisonSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {return false;}
            }
            else if (filter === "IS") {
                if (this.checkCoursesSComparisonSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {return false;}
            }
            else if (filter === "AND" || filter === "OR") {
                if (this.checkCoursesLogicComparisonSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {return false;}
            }
            else if (filter === "NOT") {
                if (this.checkCoursesNegationSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {return false;}
            }
            else { return false; }
        }
        else {
            return false;
        }
    }

    // Purpose: Returns true if rooms query has a valid WHERE clause by checking WHERE key's FILTER value
    // Ex. Takes {"EQ":{"courses_avg":85.2}} from {WHERE: {"EQ":{"courses_avg":85.2}}}
    checkRoomsBodySyntax(query: any): boolean {
        let actualBodyKeys: Array<string> = [];
        for (let key in query) {
            actualBodyKeys.push(key);
        }
        if (actualBodyKeys.length === 1) {
            let filter = actualBodyKeys[0];
            if (filter === "LT" || filter === "GT" || filter === "EQ") {
                if (this.checkRoomsMComparisonSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {return false;}
            }
            else if (filter === "IS") {
                if (this.checkRoomsSComparisonSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {return false;}
            }
            else if (filter === "AND" || filter === "OR") {
                if (this.checkRoomsLogicComparisonSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {return false;}
            }
            else if (filter === "NOT") {
                if (this.checkRoomsNegationSyntax(query[actualBodyKeys[0]])) {
                    return true;
                }
                else {return false;}
            }
            else { return false; }
        }
        else {
            return false;
        }
    }

    // Purpose: Returns true if value associated with OPTIONS key has exactly one COLUMNS clause and zero or one ORDER clause
    checkValidOptionsClauses(options: any): boolean {

        let validOptionKeys: Array<string> = ['COLUMNS', 'ORDER'];
        let actualOptionKeys: Array<string> = [];
        if (Object.keys(options).length === 2) {
            for (let key in options) {
                if (validOptionKeys.includes(key)) {actualOptionKeys.push(key);}
                else {return false;}
            }
        }
        else if (Object.keys(options).length === 1) {
            for (let key in options) {
                if (key === 'COLUMNS') {actualOptionKeys.push(key);}
                else {return false;}
            }
        }
        else  {
            return false
        }
        return true;
    }

    // Purpose: to get first column requested by query, return true if valid courses key, false otherwise
    checkValidInitialCoursesKey(columns: any): boolean {
        let initialIndex = 0;
        if (!(columns.length > 0)) {
            return false;
        }
        if (this.checkValidCoursesMKey(columns[initialIndex]) || this.checkValidCoursesSKey(columns[initialIndex])) {
            return true;
        }
        else {
            return false;
        }
    }

    // Purpose: to get first column requested by query, return true if valid rooms key, false otherwise
    checkValidInitialRoomsKey(columns: any): boolean {
        let initialIndex = 0;
        if (!(columns.length > 0)) {
            return false;
        }
        if (this.checkValidRoomsMKey(columns[initialIndex]) || this.checkValidRoomsSKey(columns[initialIndex])) {
            return true;
        }
        else {
            return false;
        }
    }

    // Purpose: Returns true if value associated with COLUMNS key has valid syntax for a courses query, false otherwise
    checkCoursesColumnsSyntax(columns: any): boolean {

        if (!(columns.length > 0)) {
            return false;
        }
        for (let x of columns) {

            if (this.checkValidCoursesMKey(x) || this.checkValidCoursesSKey(x)) {}

            else {return false;}
        }
        return true;
    }


    // Purpose: Returns true if value associated with COLUMNS key has valid syntax for a rooms query, false otherwise
    checkRoomsColumnsSyntax(columns: any): boolean {
        if (!(columns.length > 0)) {
            return false;
        }
        for (let x of columns) {
            if (this.checkValidRoomsMKey(x) || this.checkValidRoomsSKey(x)) {}
            else {return false;}
        }
        return true;
    }

    // Purpose: Returns true value associated with ORDER key matches a column requested in COLUMNS clause, false otherwise
    checkOrderSyntax(order: any, columns: Array<string>): boolean {
        if (typeof(order) === "string") {
            if (columns.includes(order)) {return true;}
        }
        return false;
    }

    // Purpose: Returns true if the values provided to NOT filter key have valid courses query syntax, false if else
    //{"NOT":{"EQ":{"courses_avg":85.2}}}
    checkCoursesNegationSyntax(query: any):boolean {
        if (!(Object.keys(query).length === 1)) {
            return false;
        }

        let filterName: string = Object.keys(query)[0];
        //Log.test("Key name:" + filterName);
        if (filterName === "AND" || filterName == "OR") {
            if (this.checkCoursesLogicComparisonSyntax(query[filterName])) {}
            else {return false;}
        }
        else if (filterName === "LT" || filterName === "GT" || filterName === "EQ") {
            //Log.test("Entered MCOMPARISON");
            if (this.checkCoursesMComparisonSyntax(query[filterName])) {}
            else {return false;}
        }
        else if (filterName === "IS") {
            //Log.test("Entered SCOMPARISON");
            if (this.checkCoursesSComparisonSyntax(query[filterName])) {}
            else {return false;}
        }
        else if (filterName === "NOT")  {
            //Log.test("Entered NEGATION");
            if (this.checkCoursesNegationSyntax(query[filterName])) {}
            else { return false; }
        }
        else {
            return false;
        }
        return true;
    }

    // Purpose: Returns true if the values provided to NOT filter key have valid courses query syntax, false if else
    //{"NOT":{"EQ":{"courses_avg":85.2}}}
    checkRoomsNegationSyntax(query: any):boolean {
        if (!(Object.keys(query).length === 1)) {
            return false;
        }

        let filterName: string = Object.keys(query)[0];
        //Log.test("Key name:" + filterName);
        if (filterName === "AND" || filterName == "OR") {
            if (this.checkRoomsLogicComparisonSyntax(query[filterName])) {}
            else {return false;}
        }
        else if (filterName === "LT" || filterName === "GT" || filterName === "EQ") {
            //Log.test("Entered MCOMPARISON");
            if (this.checkRoomsMComparisonSyntax(query[filterName])) {}
            else {return false;}
        }
        else if (filterName === "IS") {
            //Log.test("Entered SCOMPARISON");
            if (this.checkRoomsSComparisonSyntax(query[filterName])) {}
            else {return false;}
        }
        else if (filterName === "NOT")  {
            //Log.test("Entered NEGATION");
            if (this.checkRoomsNegationSyntax(query[filterName])) {}
            else { return false; }
        }
        else {
            return false;
        }
        return true;
    }

    // Purpose: Returns true if the values provided to MCOMPARATOR (GT, LT, EQ) filter key have valid courses query syntax, false if else
    checkCoursesMComparisonSyntax(query: any):boolean {

        let actualMCOMPAROTORkeys: Array<string> = [];
        let actualM_keyvals: Array<number> = [];
        for (let key in query) {
            //Log.test(key);
            actualMCOMPAROTORkeys.push(key)
        }
        if (actualMCOMPAROTORkeys.length === 1) {

            if (this.checkValidCoursesMKey(actualMCOMPAROTORkeys[0])) {

                if (typeof(query[actualMCOMPAROTORkeys[0]]) === "number") {
                    return true;
                }
                else {return false;}
            }
            else {return false;}
        }
        else {return false;}
    }


    // Purpose: Returns true if the values provided to MCOMPARATOR (GT, LT, EQ) filter key have valid rooms query syntax, false if else
    checkRoomsMComparisonSyntax(query: any):boolean {
        let actualMCOMPAROTORkeys: Array<string> = [];
        let actualM_keyvals: Array<number> = [];
        for (let key in query) {
            //Log.test(key);
            actualMCOMPAROTORkeys.push(key)
        }
        if (actualMCOMPAROTORkeys.length === 1) {
            if (this.checkValidRoomsMKey(actualMCOMPAROTORkeys[0])) {
                if (typeof(query[actualMCOMPAROTORkeys[0]]) === "number") {
                    return true;
                }
                else {return false;}
            }
            else {return false;}
        }
        else {return false;}
    }

    // Purpose: Returns true if the values provided to SCOMPARATOR (IS) filter key have valid courses query syntax, false if else
    checkCoursesSComparisonSyntax(query: any):boolean {

        let actualSCOMPAROTORkeys: Array<string> = [];
        let actualS_keyvals: Array<number> = [];
        for (let key in query) {
            actualSCOMPAROTORkeys.push(key)
        }
        if (actualSCOMPAROTORkeys.length === 1) {
            //Log.test(actualSCOMPAROTORkeys[0]);
            if (this.checkValidCoursesSKey(actualSCOMPAROTORkeys[0])) {
                if (this.valid_inputstringWithWildcard(query[actualSCOMPAROTORkeys[0]]) && typeof(query[actualSCOMPAROTORkeys[0]]) === "string") {
                    return true;
                }
                else {return false;}
            }
            else {return false;}
        }
        else {return false;}
    }


    // Purpose: Returns true if the values provided to SCOMPARATOR (IS) filter key have valid courses query syntax, false if else
    checkRoomsSComparisonSyntax(query: any):boolean {
        let actualSCOMPAROTORkeys: Array<string> = [];
        let actualS_keyvals: Array<number> = [];
        for (let key in query) {
            actualSCOMPAROTORkeys.push(key)
        }
        if (actualSCOMPAROTORkeys.length === 1) {
            //Log.test(actualSCOMPAROTORkeys[0]);
            if (this.checkValidRoomsSKey(actualSCOMPAROTORkeys[0])) {
                if (this.valid_inputstringWithWildcard(query[actualSCOMPAROTORkeys[0]]) && typeof(query[actualSCOMPAROTORkeys[0]]) === "string") {
                    return true;
                }
                else {return false;}
            }
            else {return false;}
        }
        else {return false;}
    }


    // Purpose: Returns true if the values provided to LOGICCOMPARISON (AND, OR) filter key have valid courses query syntax, false if else

    //[{ "GT":{ "courses_avg":85.2}},{"IS":{"courses_dept":"anth"}}]
    checkCoursesLogicComparisonSyntax(query: any):boolean {
        if (!(Array.isArray(query))) {
            return false;
        }
        if (query.length === 0) {
            return false;
        }
        for (let filter of query) {

            let filterName: string = Object.keys(filter)[0];
            if (filterName === "AND" || filterName == "OR") {
                if (this.checkCoursesLogicComparisonSyntax(filter[filterName])) {}
                else {return false;}
            }
            else if (filterName === "LT" || filterName === "GT" || filterName === "EQ") {
                if (this.checkCoursesMComparisonSyntax(filter[filterName])) {}
                else {return false;}
            }
            else if (filterName === "IS") {
                if (this.checkCoursesSComparisonSyntax(filter[filterName])) {}
                else {return false;}
            }
            else if (filterName === "NOT") {
                if (this.checkCoursesNegationSyntax(filter[filterName])) {}
            }
            else { return false; }
        }
        return true;
    }

    // Purpose: Returns true if the values provided to LOGICCOMPARISON (AND, OR) filter key have valid rooms query syntax, false if else
    //[{ "GT":{ "courses_avg":85.2}},{"IS":{"courses_dept":"anth"}}]
    checkRoomsLogicComparisonSyntax(query: any):boolean {
        if (!(Array.isArray(query))) {
            return false;
        }
        if (query.length === 0) {
            return false;
        }
        for (let filter of query) {

            let filterName: string = Object.keys(filter)[0];
            if (filterName === "AND" || filterName == "OR") {
                if (this.checkRoomsLogicComparisonSyntax(filter[filterName])) {}
                else {return false;}
            }
            else if (filterName === "LT" || filterName === "GT" || filterName === "EQ") {
                if (this.checkRoomsMComparisonSyntax(filter[filterName])) {}
                else {return false;}
            }
            else if (filterName === "IS") {
                if (this.checkRoomsSComparisonSyntax(filter[filterName])) {}
                else {return false;}
            }
            else if (filterName === "NOT") {
                if (this.checkRoomsNegationSyntax(filter[filterName])) {}
            }
            else { return false; }
        }
        return true;
    }


    // Purpose: Check for a valid courses m_key
    checkValidCoursesMKey(input: any): boolean {
        let regexp = new RegExp(/^courses_(avg|pass|fail|audit|year)\b/);
        if (regexp.test(input)){ return true; }
        else { return false; }
    }

    // Purpose: Check for a valid courses m_key
    checkValidRoomsMKey(input: any): boolean {
        let regexp = new RegExp(/^rooms_(lat|lon|seats)\b/);
        if (regexp.test(input)){ return true; }
        else { return false; }
    }

    // Purpose: Check for a valid courses s_key
    checkValidCoursesSKey(input: any): boolean {
        let regexp = new RegExp(/^courses_(dept|id|instructor|title|uuid)\b/);
        if (regexp.test(input)){ return true; }
        else { return false; }
    }

    // Purpose: Check for a valid rooms s_key
    checkValidRoomsSKey(input: any): boolean {

        let regexp = new RegExp(/^rooms_(fullname|shortname|number|name|address|type|furniture|href)\b/);

        if (regexp.test(input)){ return true; }
        else { return false; }
    }

    valid_inputstringWithWildcard(input: string): boolean {
        let regexp = new RegExp(/^[*]?[^\*]+[*]?$/);
        if (regexp.test(input)){ return true; }
        else { return false; }
    }

    isFunctionWildcardHelper (input: string) {
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
    }

    // Purpose: helper for comparing strings based on four possible wildcard cases
    isFunctionMatchHelper (input: string, compareTo: string) {
        let inputstring: string;
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
    }

    // Purpose: returns object if its key-value is equal to given key-value
    equalsFunction(m_key: string, val: number, datum: any): boolean { // consider updating to Array<any>
        if (m_key === "courses_avg") {return datum._courses_avg === val}
        else if (m_key === "courses_pass") {return datum._courses_pass === val}
        else if (m_key === "courses_fail") {return datum._courses_fail === val}
        else if (m_key === "courses_audit") {return datum._courses_audit === val}
        else if (m_key === "courses_year") {return datum._courses_year === val}
        else if (m_key === "rooms_lat") {return datum._rooms_lat === val}
        else if (m_key === "rooms_lon") {return datum._rooms_lon === val}
        else if (m_key === "rooms_seats") {return datum._rooms_seats === val}
        else {return false;}
    }

    // Purpose: returns object if its key-value is less than given key-value
    lessThanFunction(m_key: string, val: number, datum: any): boolean { // consider updating to Array<any>
        if (m_key === "courses_avg") {return datum._courses_avg < val}
        else if (m_key === "courses_pass") {return datum._courses_pass < val}
        else if (m_key === "courses_fail") {return datum._courses_fail < val}
        else if (m_key === "courses_audit") {return datum._courses_audit < val}
        else if (m_key === "courses_year") {return datum._courses_year < val}
        else if (m_key === "rooms_lat") {return datum._rooms_lat < val}
        else if (m_key === "rooms_lon") {return datum._rooms_lon < val}
        else if (m_key === "rooms_seats") {return datum._rooms_seats < val}
        else {return false;}
    }

    // Purpose: returns object if its key-value is greater than given key-value
    greaterThanFunction(m_key: string, val: number, datum: any): boolean { // consider updating to Array<any>
        if (m_key === "courses_avg") {return datum._courses_avg > val}
        else if (m_key === "courses_pass") {return datum._courses_pass > val}
        else if (m_key === "courses_fail") {return datum._courses_fail > val}
        else if (m_key === "courses_audit") {return datum._courses_audit > val}
        else if (m_key === "courses_year") {return datum._courses_year > val}
        else if (m_key === "rooms_lat") {return datum._rooms_lat > val}
        else if (m_key === "rooms_lon") {return datum._rooms_lon > val}
        else if (m_key === "rooms_seats") {return datum._rooms_seats > val}
        else {return false;}
    }

    // Purpose: returns object if its key-value matches given key-value
    isFunction(s_key: string, val: string, datum: any): boolean {
        let that = this;
        if (s_key === "courses_dept") {return that.isFunctionMatchHelper(val, datum._courses_dept)}
        else if (s_key === "courses_id") {return that.isFunctionMatchHelper(val, datum._courses_id);}
        else if (s_key === "courses_instructor") {return that.isFunctionMatchHelper(val, datum._courses_instructor);}
        else if (s_key === "courses_title") {return that.isFunctionMatchHelper(val, datum._courses_title);}
        else if (s_key === "courses_uuid") {return that.isFunctionMatchHelper(val, datum._courses_uuid);}
        else if (s_key === "rooms_fullname") {return that.isFunctionMatchHelper(val, datum._rooms_fullname);}
        else if (s_key === "rooms_shortname") {return that.isFunctionMatchHelper(val, datum._rooms_shortname);}
        else if (s_key === "rooms_number") {return that.isFunctionMatchHelper(val, datum._rooms_number);}
        else if (s_key === "rooms_name") {return that.isFunctionMatchHelper(val, datum._rooms_name);}
        else if (s_key === "rooms_address") {return that.isFunctionMatchHelper(val, datum._rooms_address);}
        else if (s_key === "rooms_type") {return that.isFunctionMatchHelper(val, datum._rooms_type);}
        else if (s_key === "rooms_furniture") {return that.isFunctionMatchHelper(val, datum._rooms_furniture);}
        else if (s_key === "rooms_href") {return that.isFunctionMatchHelper(val, datum._rooms_href);}
        else {return false;}
    }

    // Purpose: returns set defference of pending and rsf arrays (pending - rsf)
    orFunctionHelper(rsf: Array<any>, pending: Array<any>): any {
        let that = this;
        let pendingRsfSetDifference: Array<any> = [];

        pendingRsfSetDifference = pending.filter(function (datum) {
            return !(rsf.includes(datum));
        })
        return pendingRsfSetDifference;
    }

    // Purpose: returns filtered dataset based on or query provided
    orFunction(query:any, dataset: Array<any>): any {
        let that = this;
        let result:Array<any> = [];
        for (let filter of query["OR"]) {
            let filterName: string = Object.keys(filter)[0];
            Log.test("FilterName= " + filterName);
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
    }

    // Purpose: returns intersection of pending and rsf arrays (pending & rsf)
    andFunctionHelper(rsf: Array<Course>, pending: Array<any>): any {
        let that = this;
        let pendingRsfIntersection: Array<any> = [];

        pendingRsfIntersection = pending.filter(function (datum) {
            return (rsf.includes(datum));
        })
        return pendingRsfIntersection;
    }

    // Purpose: returns filtered dataset based on and query provided
    andFunction(query:any, dataset: Array<any>): any {
        let that = this;
        let result:Array<any> = dataset;
        for (let filter of query["AND"]) {
            let filterName: string = Object.keys(filter)[0];
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
    }

    // Purpose: returns filtered dataset after applying mcomparison filter
    mcomparisonFunction(mcomparison: string, m_key: string, val: number, dataset: Array<any>): Array<any> { // consider updating to Array<any>
        let that = this;
        let result: Array<any>;

        if (mcomparison === "EQ") {
            result = dataset.filter(function (datum) {
                return that.equalsFunction(m_key, val, datum);
            })
        }
        else if (mcomparison=== "LT") {
            result = dataset.filter(function (datum) {
                return that.lessThanFunction(m_key, val, datum);
            })
        }
        else {
            result = dataset.filter(function (datum) {
                return that.greaterThanFunction(m_key, val, datum);
            })
        }
        return result;
    }

    // Purpose: returns filtered dataset after applying scomparison filter
    scomparisonFunction(s_key: string, val: string, dataset: Array<any>): Array<any> {
        let that = this;
        let result: Array<any>;

        result = dataset.filter(function (datum) {
            return that.isFunction(s_key, val, datum);
        })
        return result;
    }

    // Purpose: filters a dataset based on NOT query
    //{"NOT": {"AND": [{"NOT": {"EQ":{"courses_avg":85.2}}}, {"IS":{"courses_dept":"anth"}}]}}
    negationFunction(query: any, dataset: Array<any>,): Array<any> { // consider updating to Array<any>
        let that = this;
        let complement: Array<Course> = [];
        let result: Array<Course> = [];

        let filterName: string = Object.keys(query["NOT"])[0];

        if (filterName === "AND" || filterName == "OR") {
            complement = that.logiccomparisonFunction(filterName, query["NOT"],dataset);
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
    }

    negationFunctionHelper(complement: Array<Course>, dataset: Array<Course>): Array<any> {
        let that = this;
        let result: Array<Course> = [];

        result = dataset.filter(function (course) {
            return (!(complement.includes(course)));
        })
        return result;
    }

    // Purpose: filters a dataset based on logic comparison query
    //{"OR": [{"AND": [{"EQ":{"courses_avg":85.2}}, {"IS":{"courses_dept":"anth"}}]}]}
    logiccomparisonFunction(lcomparison: string, query: any, dataset: Array<any>,): Array<any> { // consider updating to Array<any>
        let that = this;
        let result: Array<Course> = [];
        if (lcomparison === "OR") {
            result = that.orFunction(query, dataset);
        }
        else {
            result = that.andFunction(query, dataset);
        }
        return result;
    }

    // Purpose: helper function that parses mcomparison clause for mcomparisonFunction
    mcomparisonDetails(mcomparison: any, dataset: any) {
        let that = this;

        let mcomparator: string = Object.keys(mcomparison)[0];
        let m_key: string = Object.keys(mcomparison[mcomparator])[0];
        let val: number = mcomparison[mcomparator][m_key];
        return that.mcomparisonFunction(mcomparator, m_key, val, dataset);
    }

    // Purpose: helper function that parses scomparison clause for scomparisonFunction
    scomparisonDetails(scomparison: any, dataset: any) {
        let that = this;

        let scomparator: string = Object.keys(scomparison)[0];
        let s_key: string = Object.keys(scomparison[scomparator])[0];
        let val: string = scomparison[scomparator][s_key];
        return that.scomparisonFunction(s_key, val, dataset);
    }


    columnSelect(columns: Array<string>, fDataset: Array<any> ):any { // check return type
        let that = this;
        let result: Array<any> = [];

        for (let course of fDataset) {
            let courseDetails: Array<string> = [];
            for (let column of columns) {
                let details: string = that.columnGetter(column, course);
                courseDetails.push(details);
            }
            result.push(courseDetails);
        }
        return result;
    }

    // Purpose: to ensure no duplicate columns
    columnSelectHelper(columns: Array<string>):Array<string> { // check return type
        let that = this;
        let courseColumns: Array<string> = [];

        for (let column of columns) {
            if (!(courseColumns.includes(column))) {
                courseColumns.push(column);
            }
        }
        return courseColumns;
    }

    // TODO: add courses_year
    columnGetter(column: string, datum: any): any {
        switch(column) {
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
    }

    orderFunction(unsortedResults: Array<any>, order:any): Array<any> {
        let that = this;
        let sortedResults: Array<any> = [];

        sortedResults = unsortedResults.sort(function (a: any, b: any) {
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
        })
        return sortedResults;
    }

    // [ [ 'anth', '512' ], [ 'anth', '512' ], [ 'econ', '101' ] ]
    resultToObj(columns: Array<string>, resultArray: Array<any>) {
        let innerResult : Array<any> = [];
        let result : any;

        for (let x of resultArray) {
            innerResult.push(columns.reduce(function(obj:any, val:string, i) {
                    obj[val] = x[i];
                    return obj;
                }, {})
            )}
        result = JSON.parse(JSON.stringify({result: innerResult}));
        return result;
    }

    // Purpose: to check if the requested dataset is in memory
    getQueryRequestType(columns: any): string {
        if (this.checkValidInitialCoursesKey(columns)) {
            return "courses";
        }
        else {
            return "rooms";}
    }

    // Purpose: to check if the requested dataset is in memory
    getCoursesDatasetInMemory(temp: Array<any>): boolean {
        if (temp.length > 0) {return true;}
        else {return false;}
    }

    // Purpose: to check if the requested dataset is in memory
    getRoomsDatasetInMemory(temp: Array<any>): boolean {
        if (temp.length > 0) {return true;}
        else {return false;}
    }

    // Purpose: to retrieve dataset from memory or return false
    getCoursesDatasetOnDisk() {
        let fs = require("fs");
        let buffer = fs.readFileSync(__dirname + "/tmp/" + "courses");
        let result: Array<Course> = JSON.parse(buffer);
        return result;
    }

    // Purpose: to retrieve dataset from memory or return false
    getRoomsDatasetOnDisk() {
        let fs = require("fs");
        let buffer = fs.readFileSync(__dirname + "/tmp/" + "rooms");
        let result: Array<Room> = JSON.parse(buffer);
        return result;
    }



    // Purpose: to retrieve appropriate dataset to perform query
    getDataset(columns: any) {
        let requestType: string;
        requestType = this.getQueryRequestType(columns);
        switch (requestType) {
            case "courses":
                if (this.getCoursesDatasetInMemory(courseData)) {
                    return courseData;
                }
                else {
                    return this.getCoursesDatasetOnDisk()
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
    }

}