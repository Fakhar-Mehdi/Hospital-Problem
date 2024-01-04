"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRENCY = exports.NO_OF_LEGS = exports.ROUTES = void 0;
var ROUTES;
(function (ROUTES) {
    ROUTES["PATIENT_PATH"] = "/api/patient";
    ROUTES["APPOINTMENT_PATH"] = "/api/appointment";
    ROUTES["HOSPITAL_PATH"] = "/api/hospital";
    ROUTES["HOME_PATH"] = "/";
})(ROUTES || (exports.ROUTES = ROUTES = {}));
var NO_OF_LEGS;
(function (NO_OF_LEGS) {
    NO_OF_LEGS["FOUR"] = "4";
    NO_OF_LEGS["TWO"] = "2";
    NO_OF_LEGS["BIRD"] = "1";
    NO_OF_LEGS["REPTILE"] = "0";
})(NO_OF_LEGS || (exports.NO_OF_LEGS = NO_OF_LEGS = {}));
var CURRENCY;
(function (CURRENCY) {
    CURRENCY["USD"] = "USD";
    CURRENCY["EUR"] = "EUR";
    CURRENCY["BTC"] = "BTC";
})(CURRENCY || (exports.CURRENCY = CURRENCY = {}));
