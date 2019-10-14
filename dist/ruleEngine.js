"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ruleTree_1 = require("./ruleTree/ruleTree");
const ruleEngine = (rulesObject, options = {}) => {
    const ruleTree = new ruleTree_1.default(rulesObject, options);
    return ruleTree;
};
exports.default = ruleEngine;
