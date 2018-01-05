export default class Course{

    private courses_dept : string;
    private courses_id : string;
    private courses_avg : number;
    private courses_instructor : string;
    private courses_title : string;
    private courses_pass : number;
    private courses_fail : number;
    private courses_audit : number;
    private courses_uuid: string;
    private courses_year: number;



    get _courses_dept(): string {
        return this.courses_dept;
    }

    set _courses_dept(value: string) {
        this.courses_dept = value;
    }

    get _courses_id(): string {
        return this.courses_id;
    }

    set _courses_id(value: string) {
        this.courses_id = value;
    }

    get _courses_avg(): number {
        return this.courses_avg;
    }

    set _courses_avg(value: number) {
        this.courses_avg = value;
    }

    get _courses_instructor(): string {
        return this.courses_instructor;
    }

    set _courses_instructor(value: string) {
        this.courses_instructor = value;
    }

    get _courses_title(): string {
        return this.courses_title;
    }

    set _courses_title(value: string) {
        this.courses_title = value;
    }

    get _courses_pass(): number {
        return this.courses_pass;
    }

    set _courses_pass(value: number) {
        this.courses_pass = value;
    }

    get _courses_fail(): number {
        return this.courses_fail;
    }

    set _courses_fail(value: number) {
        this.courses_fail = value;
    }

    get _courses_audit(): number {
        return this.courses_audit;
    }

    set _courses_audit(value: number) {
        this.courses_audit = value;
    }

    get _courses_uuid(): string {
        return this.courses_uuid;
    }

    set _courses_uuid(value: string) {
        this.courses_uuid = value;
    }

    get _courses_year(): number {
        return this.courses_year;
    }

    set _courses_year(value: number) {
        this.courses_year = value;
    }

}