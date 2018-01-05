/**
 * Created by rtholmes on 2016-10-31.
 */

import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";

describe("DatasetSpec", function () {


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    it("Should return 400, without id of courses, WORKS", function () {
        let insight = new InsightFacade();
        let fs = require("fs");
        let file = fs.readFileSync("/Users/jxie/cpsc310_team168/test/Test Data/oneValidCourse.zip", "base64");
        //console.log(file);

        return insight.addDataset("feee", file).then(function (response: InsightResponse) {
            expect.fail()
        }).catch(function (response: InsightResponse) {

            console.log("Code: " + response.code);
            expect(response.code).to.deep.equal(response.code = 400);
        });
    });

    it("Should 204 or 201, with one valid class amongst three, WORKS", function () {
        let insight = new InsightFacade();
        let fs = require("fs");
        let file = fs.readFileSync("/Users/jxie/cpsc310_team168/test/Test Data/three_courses_with_one_valid.zip", "base64");
        //console.log(file);

        return insight.addDataset("courses", file).then(function (response: InsightResponse) {
            console.log("Code: " + response.code);
            console.log("Body: " + response.body);
            expect(response.code).to.deep.equal(response.code = 204);
        }).catch(function (response: InsightResponse) {
            expect.fail()

        });
    });

     it("Should return 204/201, with two valid courses, WORKS", function () {
         let insight = new InsightFacade();
         let fs = require("fs");
         let file = fs.readFileSync("/Users/jxie/cpsc310_team168/test/Test Data/two_valid_courses.zip", "base64");

         return insight.addDataset("courses", file).then(function (response: InsightResponse) {
             console.log("Code: " + response.code);
             (expect(response.code).to.deep.equal(response.code = 201));
         }).catch(function (response: InsightResponse) {
             expect.fail()
         });
     });


     it("Should return 400, with two invalid courses, WORKS", function () {
         let insight = new InsightFacade();
         let fs = require("fs");
         let file = fs.readFileSync("/Users/jxie/cpsc310_team168/test/Test Data/empty_courses.zip", "base64");

         return insight.addDataset("courses", file).then(function (response: InsightResponse) {
             expect.fail()
         }).catch(function (response: InsightResponse) {
             console.log("Code: " + response.code);
             expect(response.code).to.deep.equal(response.code = 400);
         });
     });
    //
     // TODO: Write a test for empty zip file
     it("Should return 400, with no valid JSONs, WORKS", function () {
         let insight = new InsightFacade();
         let fs = require("fs");
         let file = fs.readFileSync("/Users/jxie/cpsc310_team168/test/Test Data/no_json.zip", "base64");
         return insight.addDataset("courses", file).then(function (response: InsightResponse) {
             expect.fail()
         }).catch(function (response: InsightResponse) {
             console.log("Code: " + response.code);
             expect(response.code).to.deep.equal(response.code = 400);
         });
     });

     // TODO: Write a test for invalid zip
     it("Should return 400, with no zip file, WORKS", function () {
         let insight = new InsightFacade();
         let fs = require("fs");
         let file = fs.readFileSync("/Users/jxie/cpsc310_team168/test/Test Data/useless.txt", "base64");
         return insight.addDataset("courses", file).then(function (response: InsightResponse) {
             expect.fail()
         }).catch(function (response: InsightResponse) {
             console.log("Code: " + response.code);
             expect(response.code).to.deep.equal(response.code = 400);
         });
     });

    // // //----------------------------------------------------------------------------------------------------------------------

    it("Remove existing file", function () {
        let insight = new InsightFacade();
        let fs = require("fs");
        let file = fs.readFileSync("/Users/jxie/cpsc310_team168/test/Test Data/three_courses_with_one_valid.zip", "base64");

        return insight.removeDataset("courses").then(function (response: InsightResponse) {
            console.log("Code: " + response.code);
            expect(response.code).to.deep.equal(response.code = 204);
        }).catch(function (response: InsightResponse) {
            expect.fail()
        });
    });

     it("Remove non-existing file", function () {
         let insight = new InsightFacade();
         let fs = require("fs");
         let file = fs.readFileSync("/Users/jxie/cpsc310_team168/test/Test Data/three_courses_with_one_valid.zip", "base64");

         return insight.removeDataset("not_here").then(function (response: InsightResponse) {
             expect.fail()

         }).catch(function (response: InsightResponse) {
             console.log("Code: " + response.code);
             expect(response.code).to.deep.equal(response.code = 404);
         });
     });

});
