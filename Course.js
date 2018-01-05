"use strict";
var Course = (function () {
    function Course() {
    }
    Object.defineProperty(Course.prototype, "_courses_dept", {
        get: function () {
            return this.courses_dept;
        },
        set: function (value) {
            this.courses_dept = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "_courses_id", {
        get: function () {
            return this.courses_id;
        },
        set: function (value) {
            this.courses_id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "_courses_avg", {
        get: function () {
            return this.courses_avg;
        },
        set: function (value) {
            this.courses_avg = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "_courses_instructor", {
        get: function () {
            return this.courses_instructor;
        },
        set: function (value) {
            this.courses_instructor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "_courses_title", {
        get: function () {
            return this.courses_title;
        },
        set: function (value) {
            this.courses_title = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "_courses_pass", {
        get: function () {
            return this.courses_pass;
        },
        set: function (value) {
            this.courses_pass = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "_courses_fail", {
        get: function () {
            return this.courses_fail;
        },
        set: function (value) {
            this.courses_fail = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "_courses_audit", {
        get: function () {
            return this.courses_audit;
        },
        set: function (value) {
            this.courses_audit = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "_courses_uuid", {
        get: function () {
            return this.courses_uuid;
        },
        set: function (value) {
            this.courses_uuid = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Course.prototype, "_courses_year", {
        get: function () {
            return this.courses_year;
        },
        set: function (value) {
            this.courses_year = value;
        },
        enumerable: true,
        configurable: true
    });
    return Course;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Course;
//# sourceMappingURL=Course.js.map