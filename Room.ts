export default class Room{

    private rooms_fullname: string;
    private rooms_shortname: string;
    private rooms_number: string;
    private rooms_name: string;
    private rooms_address: string;
    private rooms_lat: number;
    private rooms_lon: number;
    private rooms_seats: number;
    private rooms_type: string;
    private rooms_furniture: string;
    private rooms_href: string;


    get _rooms_fullname(): string {
        return this.rooms_fullname;
    }

    set _rooms_fullname(value: string) {
        this.rooms_fullname = value;
    }

    get _rooms_shortname(): string {
        return this.rooms_shortname;
    }

    set _rooms_shortname(value: string) {
        this.rooms_shortname = value;
    }

    get _rooms_number(): string {
        return this.rooms_number;
    }

    set _rooms_number(value: string) {
        this.rooms_number = value;
    }

    get _rooms_name(): string {
        return this.rooms_name;
    }

    set _rooms_name(value: string) {
        this.rooms_name = value;
    }

    get _rooms_address(): string {
        return this.rooms_address;
    }

    set _rooms_address(value: string) {
        this.rooms_address = value;
    }

    get _rooms_lat(): number {
        return this.rooms_lat;
    }

    set _rooms_lat(value: number) {
        this.rooms_lat = value;
    }

    get _rooms_lon(): number {
        return this.rooms_lon;
    }

    set _rooms_lon(value: number) {
        this.rooms_lon = value;
    }

    get _rooms_seats(): number {
        return this.rooms_seats;
    }

    set _rooms_seats(value: number) {
        this.rooms_seats = value;
    }

    get _rooms_type(): string {
        return this.rooms_type;
    }

    set _rooms_type(value: string) {
        this.rooms_type = value;
    }

    get _rooms_furniture(): string {
        return this.rooms_furniture;
    }

    set _rooms_furniture(value: string) {
        this.rooms_furniture = value;
    }

    get _rooms_href(): string {
        return this.rooms_href;
    }

    set _rooms_href(value: string) {
        this.rooms_href = value;
    }
}